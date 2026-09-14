import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { test, expect, armGate, aiCallCount, withTestUser, type TestUser } from "./support/fixtures";
import { withSqlSession, type SqlSession } from "./support/sql";
import { planPayload } from "./support/payload";

async function snapshot(sql: SqlSession, userId: string) {
  return [
    await sql.query("select to_jsonb(p) as row from public.training_plans p where user_id=$1 order by id", [userId]),
    await sql.query("select to_jsonb(f) as row from public.workout_feedback f where user_id=$1 order by id", [userId]),
    await sql.query("select to_jsonb(i) as row from public.training_intakes i where user_id=$1 order by id", [userId]),
  ];
}

test("applying both retention migrations preserves every historical row", async ({ user, local }) => {
  await withSqlSession(local.DB_URL, "admin", async (sql) => {
    await seedHistory(sql, user.id);
    const before = await snapshot(sql, user.id);
    await sql.query("begin");
    try {
      await sql.query(readFileSync("supabase/migrations/20260914150000_enforce_plan_retention.sql", "utf8"));
      expect(await snapshot(sql, user.id)).toEqual(before);
      await sql.query(readFileSync("supabase/migrations/20260914170000_retire_plans_on_intake_save.sql", "utf8"));
      expect(await snapshot(sql, user.id)).toEqual(before);
    } finally {
      await sql.query("rollback");
    }
  });
});

for (const mode of ["error", "invalid"] as const) {
  test(`AI ${mode} preserves complete historical rows`, async ({ user, local }) => {
    await withSqlSession(local.DB_URL, "admin", async (sql) => {
      const intakes = await seedHistory(sql, user.id);
      const before = await snapshot(sql, user.id);
      const gate = await armGate(user.id, { kind: "ai", mode });
      const pending = generate(user, intakes[2]);
      try {
        await gate.waitUntilReached();
      } finally {
        await gate.release();
      }
      expect((await pending).status()).toBe(mode === "error" ? 503 : 502);
      expect(await snapshot(sql, user.id)).toEqual(before);
    });
  });
}

test("a delete failure after insert rolls back the draft and every cascaded row", async ({ user, local }) => {
  await withSqlSession(local.DB_URL, "admin", async (sql) => {
    const intakes = await seedHistory(sql, user.id);
    const before = await snapshot(sql, user.id);
    // Transaction-local trigger installation is rolled back in finally; no persistent test schema.
    await withSqlSession(local.DB_URL, "admin", async (transaction) => {
      await transaction.query(`create function pg_temp.reject_retention_delete() returns trigger language plpgsql as $$
        begin
          if not exists (select 1 from public.training_plans where user_id=old.user_id and intake_id='${intakes[2]}') then
            raise exception using errcode='P0002', message='Draft was not inserted before delete';
          end if;
          raise exception using errcode='P0001', message='Deliberate deletion failure';
        end $$`);
      await transaction.query(
        "create trigger retention_delete_failure before delete on public.training_plans for each row execute function pg_temp.reject_retention_delete()",
      );
      await transaction.query("savepoint before_replacement");
      await transaction.query("set local role authenticated");
      await transaction.query("select set_config('request.jwt.claims',$1,true)", [
        JSON.stringify({ role: "authenticated", sub: user.id }),
      ]);
      try {
        await expect(
          transaction.query(
            "select * from public.replace_training_plan($1,(select updated_at from public.training_intakes where id=$1),$2,$3)",
            [intakes[2], planPayload.planContent, planPayload.explanation],
          ),
        ).rejects.toThrow("P0001");
        await transaction.query("rollback to savepoint before_replacement");
        expect(await snapshot(transaction, user.id)).toEqual(before);
      } finally {
        await transaction.query("rollback");
      }
    });
    expect(await snapshot(sql, user.id)).toEqual(before);
  });
});

test("direct writes cannot bypass authenticated retention RPCs", async ({ user, local }) => {
  await withSqlSession(local.DB_URL, "admin", async (sql) => {
    const intakes = await seedHistory(sql, user.id);
    const before = await snapshot(sql, user.id);
    const denied = await user.client.from("training_plans").insert({
      user_id: user.id,
      intake_id: intakes[2],
      plan_content: planPayload.planContent,
      explanation: planPayload.explanation,
    });
    expect(denied.error?.code).toBe("42501");
    for (const action of ["insert", "update", "delete"] as const) {
      const table = user.client.from("training_intakes");
      const result =
        action === "insert"
          ? await table.insert({
              user_id: user.id,
              goal: "Test",
              experience_level: "beginner",
              health_constraints: "Test",
            })
          : action === "update"
            ? await table.update({ goal: "Changed" }).eq("id", intakes[2])
            : await table.delete().eq("id", intakes[2]);
      expect(result.error?.code).toBe("42501");
    }
    expect(await snapshot(sql, user.id)).toEqual(before);
  });
});

async function seedHistory(sql: SqlSession, userId: string) {
  const intakeIds = [randomUUID(), randomUUID(), randomUUID()];
  for (const [index, id] of intakeIds.entries()) {
    await sql.query(
      "insert into public.training_intakes (id,user_id,goal,experience_level,health_constraints,created_at,updated_at) values ($1,$2,'Test','beginner','Test',now() - ($3::int * interval '1 day'),now() - ($3::int * interval '1 day'))",
      [id, userId, 3 - index],
    );
    if (index === 2) continue;
    const [{ id: planId }] = await sql.query<{ id: string }>(
      "insert into public.training_plans (user_id,intake_id,status,accepted_at,plan_content,explanation) values ($1,$2,'accepted',now(),$3,$4) returning id",
      [userId, id, planPayload.planContent, planPayload.explanation],
    );
    await sql.query(
      "insert into public.workout_feedback (user_id,plan_id,workout_key,difficulty_rating,submission_token) values ($1,$2,'workout-1',5,$3)",
      [userId, planId, randomUUID()],
    );
  }
  await sql.query("commit");
  return intakeIds;
}

function generate(user: TestUser, intakeId: string) {
  return user.api.post("/api/training-plans/generate", {
    form: { intakeId },
    headers: { Accept: "application/json" },
    maxRedirects: 0,
  });
}

test("existing accepted plan retries preserve all history and feedback without AI", async ({ user, local }) => {
  await withSqlSession(local.DB_URL, "admin", async (sql) => {
    const intakes = await seedHistory(sql, user.id);
    const [{ id }] = await sql.query<{ id: string }>(
      "insert into public.training_plans(user_id,intake_id,status,accepted_at,plan_content,explanation) values($1,$2,'accepted',now(),$3,$4) returning id",
      [user.id, intakes[2], planPayload.planContent, planPayload.explanation],
    );
    await sql.query(
      "insert into public.workout_feedback(user_id,plan_id,workout_key,difficulty_rating,submission_token) values($1,$2,'workout-1',5,$3)",
      [user.id, id, randomUUID()],
    );
    const before = await snapshot(sql, user.id);
    const response = await generate(user, intakes[2]);
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ outcome: "saved", planId: id });
    await withSqlSession(local.DB_URL, { userId: user.id }, async (owner) => {
      const rows = await owner.query(
        "select * from public.replace_training_plan($1,(select updated_at from public.training_intakes where id=$1),$2,$3)",
        [intakes[2], planPayload.planContent, "Ignored"],
      );
      expect(rows).toMatchObject([{ outcome: "existing", plan: { id, status: "accepted" } }]);
      await owner.query("commit");
    });
    expect(await snapshot(sql, user.id)).toEqual(before);
    expect(await aiCallCount(user.id)).toBe(0);
  });
});

test("timestamp ties reject generation and saving creates an unambiguous newer intake", async ({ user, local }) => {
  await withSqlSession(local.DB_URL, "admin", async (sql) => {
    const intakes = await seedHistory(sql, user.id);
    await sql.query(
      "insert into public.training_intakes(user_id,goal,experience_level,health_constraints,created_at,updated_at) select user_id,goal,experience_level,health_constraints,created_at,updated_at from public.training_intakes where id=$1",
      [intakes[2]],
    );
    expect((await generate(user, intakes[2])).status()).toBe(409);
    await withSqlSession(local.DB_URL, { userId: user.id }, async (owner) => {
      expect(
        await owner.query(
          "select * from public.replace_training_plan($1,(select updated_at from public.training_intakes where id=$1),$2,$3)",
          [intakes[2], planPayload.planContent, planPayload.explanation],
        ),
      ).toEqual([{ outcome: "stale", plan: null }]);
      const [saved] = await owner.query<{ id: string; token: string }>(
        "select id,updated_at::text as token from public.save_training_intake('New','beginner','Test',null)",
      );
      expect(saved.id).not.toBe(intakes[2]);
      const [updated] = await owner.query<{ id: string; token: string }>(
        "select id,updated_at::text as token from public.save_training_intake('Edited','beginner','Test',null)",
      );
      expect(updated.id).toBe(saved.id);
      expect(updated.token).not.toBe(saved.token);
      expect(
        await owner.query("select * from public.replace_training_plan($1,$2,$3,$4)", [
          saved.id,
          saved.token,
          planPayload.planContent,
          planPayload.explanation,
        ]),
      ).toEqual([{ outcome: "stale", plan: null }]);
      expect(
        await owner.query("select outcome from public.replace_training_plan($1,$2,$3,$4)", [
          updated.id,
          updated.token,
          planPayload.planContent,
          planPayload.explanation,
        ]),
      ).toEqual([{ outcome: "created" }]);
      await owner.query("commit");
    });
    expect(await aiCallCount(user.id)).toBe(0);
    expect(await sql.query("select id from public.training_intakes where user_id=$1", [user.id])).toHaveLength(5);
  });
});

test("missing, foreign and anonymous requests cannot expose or replace another owner's plan", async ({
  user,
  local,
}) => {
  await withTestUser(local, async (other) => {
    await withSqlSession(local.DB_URL, "admin", async (sql) => {
      const intakes = await seedHistory(sql, other.id);
      const before = await snapshot(sql, other.id);
      for (const id of [intakes[2], randomUUID()]) {
        expect((await generate(user, id)).status()).toBe(400);
        await withSqlSession(local.DB_URL, { userId: user.id }, async (owner) => {
          expect(
            await owner.query("select * from public.replace_training_plan($1,now(),$2,$3)", [
              id,
              planPayload.planContent,
              planPayload.explanation,
            ]),
          ).toEqual([{ outcome: "missing", plan: null }]);
        });
      }
      await withSqlSession(local.DB_URL, "anon", async (anon) => {
        // This local Supabase image crashes on a denied function invocation.
        // Assert PostgreSQL's effective ACL as anon without invoking the crashing path.
        expect(
          await anon.query(
            "select has_function_privilege(current_user,'public.replace_training_plan(uuid,timestamptz,jsonb,text)','EXECUTE') as allowed",
          ),
        ).toEqual([{ allowed: false }]);
      });
      const forged = await user.client.rpc("replace_training_plan", {
        p_intake_id: intakes[2],
        p_expected_intake_updated_at: new Date().toISOString(),
        p_plan_content: planPayload.planContent,
        p_explanation: planPayload.explanation,
        p_user_id: other.id,
      });
      expect(forged.error).not.toBeNull();
      expect(await snapshot(sql, other.id)).toEqual(before);
    });
  });
});

test("historical retries are rejected before AI even when their old plan still exists", async ({ user, local }) => {
  await withSqlSession(local.DB_URL, "admin", async (sql) => {
    const intakes = await seedHistory(sql, user.id);
    const response = await generate(user, intakes[0]);
    expect(response.status()).toBe(409);
    expect(await response.json()).toMatchObject({ outcome: "not-saved", code: "stale-intake" });
    expect(await aiCallCount(user.id)).toBe(0);
    expect(await sql.query("select id from public.training_plans where user_id=$1", [user.id])).toHaveLength(2);
  });
});

for (const planB of [false, true]) {
  test(`late AI for A cannot replace a newer intake B (B plan: ${String(planB)})`, async ({ user, local }) => {
    await withSqlSession(local.DB_URL, "admin", async (sql) => {
      const intakes = await seedHistory(sql, user.id);
      const slow = await armGate(user.id, { kind: "ai", mode: "success" });
      const pendingA = generate(user, intakes[2]);
      try {
        await slow.waitUntilReached();
        // A second tab finishes A, allowing the normal intake form to create B.
        const fast = await armGate(user.id, { kind: "ai", mode: "success" });
        const fastA = generate(user, intakes[2]);
        try {
          await fast.waitUntilReached();
        } finally {
          await fast.release();
        }
        expect((await fastA).status()).toBe(200);
        const saved = await user.api.post("/api/training-intakes", {
          form: { goal: "B", experienceLevel: "beginner", healthConstraints: "Test", notes: "" },
          maxRedirects: 0,
        });
        expect(saved.headers().location).toBe("/dashboard?saved=intake");
        const [{ id: b }] = await sql.query<{ id: string }>(
          "select id from public.training_intakes where user_id=$1 order by created_at desc,updated_at desc limit 1",
          [user.id],
        );
        expect(b).not.toBe(intakes[2]);
        if (planB) {
          const gateB = await armGate(user.id, { kind: "ai", mode: "success" });
          const pendingB = generate(user, b);
          try {
            await gateB.waitUntilReached();
          } finally {
            await gateB.release();
          }
          expect((await pendingB).status()).toBe(200);
        }
      } finally {
        await slow.release();
      }
      const before = await snapshot(sql, user.id);
      const response = await pendingA;
      expect(response.status()).toBe(409);
      expect(await response.json()).toMatchObject({ outcome: "not-saved", code: "stale-intake" });
      const calls = await aiCallCount(user.id);
      expect((await generate(user, intakes[2])).status()).toBe(409);
      expect(await aiCallCount(user.id)).toBe(calls);
      expect(await snapshot(sql, user.id)).toEqual(before);
    });
  });
}

test("a saved intake during AI retires history and rejects the old generation token", async ({ user, local }) => {
  await withSqlSession(local.DB_URL, "admin", async (sql) => {
    const intakes = await seedHistory(sql, user.id);
    const gate = await armGate(user.id, { kind: "ai", mode: "success" });
    const pending = generate(user, intakes[2]);
    try {
      await gate.waitUntilReached();
      const saved = await user.api.post("/api/training-intakes", {
        form: { goal: "Zmieniony cel", experienceLevel: "beginner", healthConstraints: "Test", notes: "" },
        maxRedirects: 0,
      });
      expect(saved.headers().location).toBe("/dashboard?saved=intake");
    } finally {
      await gate.release();
    }
    const response = await pending;
    expect(response.status()).toBe(409);
    expect(await response.json()).toMatchObject({ outcome: "not-saved", code: "stale-intake" });
    expect(await sql.query("select id from public.training_plans where user_id=$1", [user.id])).toHaveLength(0);
  });
});

test("successful generation replaces all old plans and feedback, preserving intakes and another owner", async ({
  user,
  local,
}) => {
  await withTestUser(local, async (other) => {
    await withSqlSession(local.DB_URL, "admin", async (sql) => {
      const intakes = await seedHistory(sql, user.id);
      await seedHistory(sql, other.id);
      const otherBefore = await sql.query(
        "select to_jsonb(p) as row from public.training_plans p where user_id=$1 order by id",
        [other.id],
      );
      const gate = await armGate(user.id, { kind: "ai", mode: "success" });
      const pending = generate(user, intakes[2]);
      try {
        await gate.waitUntilReached();
      } finally {
        await gate.release();
      }
      const response = await pending;
      expect(response.status()).toBe(200);
      expect(await response.json()).toMatchObject({ outcome: "saved", intakeId: intakes[2] });
      expect
        .soft(
          await sql.query("select id from public.training_plans where user_id=$1", [user.id]),
          "only the new plan remains",
        )
        .toHaveLength(1);
      expect
        .soft(
          await sql.query("select id from public.workout_feedback where user_id=$1", [user.id]),
          "old feedback is removed",
        )
        .toHaveLength(0);
      expect(await sql.query("select id from public.training_intakes where user_id=$1", [user.id])).toHaveLength(3);
      expect(
        await sql.query("select to_jsonb(p) as row from public.training_plans p where user_id=$1 order by id", [
          other.id,
        ]),
      ).toEqual(otherBefore);
      expect(await sql.query("select id from public.workout_feedback where user_id=$1", [other.id])).toHaveLength(2);
    });
  });
});
