import { randomUUID } from "node:crypto";
import { test, expect, armGate } from "./support/fixtures";
import { withSqlSession } from "./support/sql";
import { planPayload } from "./support/payload";

for (const rollback of [false, true]) {
  test(`saving intake ${rollback ? "rolls back together with deletion failure" : "removes old plan and feedback before AI"}`, async ({
    user,
    local,
  }) => {
    await withSqlSession(local.DB_URL, "admin", async (sql) => {
      const [intake] = await sql.query<{ id: string }>(
        "insert into public.training_intakes(user_id,goal,experience_level,health_constraints) values($1,'Old','beginner','Test') returning id",
        [user.id],
      );
      const [plan] = await sql.query<{ id: string }>(
        "insert into public.training_plans(user_id,intake_id,status,accepted_at,plan_content,explanation) values($1,$2,'accepted',now(),$3,$4) returning id",
        [user.id, intake.id, planPayload.planContent, planPayload.explanation],
      );
      await sql.query(
        "insert into public.workout_feedback(user_id,plan_id,workout_key,difficulty_rating,submission_token) values($1,$2,'workout-1',5,$3)",
        [user.id, plan.id, randomUUID()],
      );
      await sql.query("commit");
      const name = `intake_${randomUUID().replaceAll("-", "")}`;
      try {
        if (rollback) {
          await sql.query(
            `create function public.${name}() returns trigger language plpgsql as $$ begin if old.user_id='${user.id}'::uuid then raise exception 'Deliberate rollback'; end if; return old; end $$`,
          );
          await sql.query(
            `create trigger ${name} before delete on public.training_plans for each row execute function public.${name}()`,
          );
        }
        const response = await user.api.post("/api/training-intakes", {
          form: { goal: "New", experienceLevel: "beginner", healthConstraints: "Test", notes: "" },
          maxRedirects: 0,
        });
        expect(response.headers().location).toContain(
          rollback ? "/dashboard/intake?error=" : "/dashboard?saved=intake",
        );
        expect(await sql.query("select id from public.training_plans where user_id=$1", [user.id])).toHaveLength(
          rollback ? 1 : 0,
        );
        expect(await sql.query("select id from public.workout_feedback where user_id=$1", [user.id])).toHaveLength(
          rollback ? 1 : 0,
        );
        const intakes = await sql.query<{ id: string }>(
          "select id from public.training_intakes where user_id=$1 order by created_at desc",
          [user.id],
        );
        expect(intakes).toHaveLength(rollback ? 1 : 2);
        expect(intakes.some((row) => row.id === intake.id)).toBe(true);
        if (!rollback) {
          const gate = await armGate(user.id, { kind: "ai", mode: "error" });
          const pending = user.api.post("/api/training-plans/generate", {
            form: { intakeId: intakes[0].id },
            headers: { Accept: "application/json" },
          });
          try {
            await gate.waitUntilReached();
          } finally {
            await gate.release();
          }
          expect((await pending).status()).toBe(503);
          expect(await sql.query("select id from public.training_plans where user_id=$1", [user.id])).toHaveLength(0);
        }
      } finally {
        if (rollback) {
          await sql.query(`drop trigger if exists ${name} on public.training_plans`);
          await sql.query(`drop function if exists public.${name}()`);
        }
      }
    });
  });
}
