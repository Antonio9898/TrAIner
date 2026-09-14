import { randomUUID } from "node:crypto";
import { test, expect, armGate, aiCallCount, type TestUser } from "./support/fixtures";
import { withSqlSession, type SqlSession } from "./support/sql";
import { planPayload } from "./support/payload";

async function seed(sql: SqlSession, userId: string) {
  const ids = [randomUUID(), randomUUID()];
  for (const [index, id] of ids.entries()) {
    await sql.query(
      "insert into public.training_intakes(id,user_id,goal,experience_level,health_constraints,created_at,updated_at) values($1,$2,'Test','beginner','Test',now()-($3::int*interval '1 day'),now()-($3::int*interval '1 day'))",
      [id, userId, 2 - index],
    );
  }
  const [plan] = await sql.query<{ id: string }>(
    "insert into public.training_plans(user_id,intake_id,plan_content,explanation) values($1,$2,$3,$4) returning id",
    [userId, ids[0], planPayload.planContent, planPayload.explanation],
  );
  await sql.query("commit");
  return { old: ids[0], current: ids[1], planId: plan.id };
}

async function current(user: TestUser, intakeId: string): Promise<unknown> {
  const response = await user.api.get(`/api/training-plans/current?intakeId=${intakeId}`);
  expect(response.status()).toBe(200);
  return response.json();
}

test("recovery distinguishes stale, ready, missing and ambiguous intake targets", async ({ user, local }) => {
  await withSqlSession(local.DB_URL, "admin", async (sql) => {
    const ids = await seed(sql, user.id);
    expect(await current(user, ids.old)).toMatchObject({
      generationState: "stale",
      plan: { id: ids.planId, intakeId: ids.old },
    });
    expect(await current(user, ids.current)).toMatchObject({ generationState: "ready", plan: null });
    expect(await current(user, randomUUID())).toMatchObject({ generationState: "missing", plan: null });
    const retry = await user.api.post("/api/training-plans/generate", {
      form: { intakeId: ids.old },
      headers: { Accept: "application/json" },
    });
    expect(retry.status()).toBe(409);
    expect(await retry.json()).toMatchObject({ outcome: "not-saved", code: "stale-intake" });
    expect(await aiCallCount(user.id)).toBe(0);
    await sql.query(
      "insert into public.training_intakes(user_id,goal,experience_level,health_constraints,created_at,updated_at) select user_id,goal,experience_level,health_constraints,created_at,updated_at from public.training_intakes where id=$1",
      [ids.current],
    );
    expect(await current(user, ids.current)).toMatchObject({ generationState: "stale", plan: null });
  });
});

for (const rollback of [false, true]) {
  test(`lost replacement response remains unknown after ${rollback ? "rollback" : "commit"} and recovery checks the target`, async ({
    user,
    local,
  }) => {
    await withSqlSession(local.DB_URL, "admin", async (sql) => {
      const ids = await seed(sql, user.id);
      const name = `retention_${randomUUID().replaceAll("-", "")}`;
      try {
        if (rollback) {
          // Unique trigger affects only this fixture's owner and is removed even on assertion failure.
          await sql.query(
            `create function public.${name}() returns trigger language plpgsql as $$ begin if old.user_id='${user.id}'::uuid then raise exception 'Deliberate retention rollback'; end if; return old; end $$`,
          );
          await sql.query(
            `create trigger ${name} before delete on public.training_plans for each row execute function public.${name}()`,
          );
        }
        const ai = await armGate(user.id, { kind: "ai", mode: "success" });
        const rpc = await armGate(user.id, { kind: "rpc", mode: "drop", path: "/rest/v1/rpc/replace_training_plan" });
        const pending = user.api.post("/api/training-plans/generate", {
          form: { intakeId: ids.current },
          headers: { Accept: "application/json" },
        });
        try {
          await ai.waitUntilReached();
        } finally {
          await ai.release();
        }
        try {
          await rpc.waitUntilReached();
          expect((await rpc.state()).upstreamStatus).toBe(rollback ? 400 : 200);
        } finally {
          await rpc.release();
        }
        const response = await pending;
        expect(response.status()).toBe(503);
        expect(await response.json()).toMatchObject({ outcome: "unknown" });
        expect(await current(user, ids.current)).toMatchObject({
          generationState: rollback ? "ready" : "planned",
          plan: rollback ? null : { intakeId: ids.current },
        });
        expect(await current(user, ids.old)).toMatchObject({
          generationState: "stale",
          plan: rollback ? { id: ids.planId } : null,
        });
        expect(await sql.query("select intake_id from public.training_plans where user_id=$1", [user.id])).toEqual([
          { intake_id: rollback ? ids.old : ids.current },
        ]);
        const byPlan = await user.api.get(`/api/training-plans/current?planId=${ids.planId}`);
        const body: unknown = await byPlan.json();
        expect(body).not.toHaveProperty("generationState");
        expect(await aiCallCount(user.id)).toBe(1);
      } finally {
        if (rollback) {
          await sql.query(`drop trigger if exists ${name} on public.training_plans`);
          await sql.query(`drop function if exists public.${name}()`);
        }
      }
    });
  });
}
