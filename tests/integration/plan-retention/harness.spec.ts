import { randomUUID } from "node:crypto";
import { z } from "zod";
import { test, expect, armGate, aiCallCount, withTestUser, type TestUser } from "./support/fixtures";
import { validateEnvironment, assertLocalUrl } from "./support/environment";
import { withSqlSession, waitForBlock, type SqlSession } from "./support/sql";

const savedSchema = z.object({
  outcome: z.literal("saved"),
  planId: z.uuid(),
  intakeId: z.uuid(),
  updatedAt: z.string(),
});

async function saveIntake(user: TestUser, sql: SqlSession) {
  const response = await user.api.post("/api/training-intakes", {
    form: {
      goal: `Test ${randomUUID()}`,
      experienceLevel: "beginner",
      healthConstraints: "Brak znanych ograniczeń",
      notes: "",
    },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(302);
  expect(response.headers().location).toBe("/dashboard?saved=intake");
  const rows = await sql.query<{ id: string }>(
    "select id from public.training_intakes where user_id = $1 order by created_at desc, updated_at desc",
    [user.id],
  );
  expect(rows).toHaveLength(1);
  return rows[0].id;
}

function generate(user: TestUser, intakeId: string) {
  return user.api.post("/api/training-plans/generate", {
    form: { intakeId },
    headers: { Accept: "application/json" },
    maxRedirects: 0,
  });
}

test("configuration rejects remote databases and mismatched app settings", async ({ user, local }) => {
  expect(await aiCallCount(user.id)).toBe(0);
  for (const value of [
    "https://remote.supabase.co",
    "http://127.0.0.1.evil.test:54321",
    "http://localhost:54321",
    "http://127.0.0.1:54321/?host=remote",
  ]) {
    expect(() => {
      assertLocalUrl(value);
    }).toThrow("local loopback");
  }
  const app = { SUPABASE_URL: local.API_URL, SUPABASE_KEY: local.ANON_KEY };
  expect(() =>
    validateEnvironment({ ...local, DB_URL: "postgresql://postgres:secret@remote.test:5432/postgres" }, app),
  ).toThrow("local loopback");
  expect(() => validateEnvironment(local, { ...app, SUPABASE_URL: "https://remote.supabase.co" })).toThrow(
    "does not match",
  );
  expect(() => validateEnvironment(local, { ...app, SUPABASE_KEY: "incorrect-test-key" })).toThrow("does not match");
});

test("real authenticated API waits for AI and persists a readable plan", async ({ user, local }) => {
  await withSqlSession(local.DB_URL, { userId: user.id }, async (sql) => {
    const intakeId = await saveIntake(user, sql);
    const gate = await armGate(user.id, { kind: "ai", mode: "success" });
    const pending = generate(user, intakeId);
    try {
      await gate.waitUntilReached();
      expect(await sql.query("select id from public.training_plans where user_id = $1", [user.id])).toHaveLength(0);
    } finally {
      await gate.release();
    }
    const response = await pending;
    expect(response.status()).toBe(200);
    const saved = savedSchema.parse(await response.json());
    expect(saved.intakeId).toBe(intakeId);
    expect(await sql.query("select id from public.training_plans where id = $1", [saved.planId])).toHaveLength(1);
    const current = await user.api.get(`/api/training-plans/current?intakeId=${intakeId}`);
    expect(current.status()).toBe(200);
    expect(await current.json()).toMatchObject({ plan: { id: saved.planId, intakeId } });
    expect(await aiCallCount(user.id)).toBe(1);
  });
});

for (const mode of ["error", "invalid"] as const) {
  test(`controlled AI ${mode} leaves the database unchanged`, async ({ user, local }) => {
    await withSqlSession(local.DB_URL, { userId: user.id }, async (sql) => {
      const intakeId = await saveIntake(user, sql);
      const gate = await armGate(user.id, { kind: "ai", mode });
      const pending = generate(user, intakeId);
      try {
        await gate.waitUntilReached();
      } finally {
        await gate.release();
      }
      const response = await pending;
      expect(response.status()).toBe(mode === "error" ? 503 : 502);
      expect(await response.json()).toMatchObject({
        outcome: "not-saved",
        code: mode === "error" ? "dependency-unavailable" : "invalid-generation",
      });
      expect(await sql.query("select id from public.training_plans where user_id = $1", [user.id])).toHaveLength(0);
      expect(await sql.query("select id from public.training_intakes where user_id = $1", [user.id])).toEqual([
        { id: intakeId },
      ]);
    });
  });
}

test("SQL sessions observe the actual blocker and roll back on failure", async ({ user, local }) => {
  await withSqlSession(local.DB_URL, "admin", async (observer) => {
    await withSqlSession(local.DB_URL, { userId: user.id }, async (holder) => {
      await withSqlSession(local.DB_URL, { userId: user.id }, async (waiter) => {
        expect(holder.pid).not.toBe(waiter.pid);
        const lock = "select pg_advisory_xact_lock(hashtextextended($1, 0))";
        await holder.query(lock, [user.id]);
        const blocked = waiter.query(lock, [user.id]).then(
          () => "acquired",
          () => "failed",
        );
        try {
          await waitForBlock(observer, waiter.pid, holder.pid);
        } finally {
          await holder.query("rollback");
        }
        expect(await blocked).toBe("acquired");
      });
    });
    const intakeId = randomUUID();
    await expect(
      withSqlSession(local.DB_URL, "admin", async (sql) => {
        await sql.query(
          "insert into public.training_intakes (id, user_id, goal, experience_level, health_constraints) values ($1, $2, 'test', 'beginner', 'test')",
          [intakeId, user.id],
        );
        throw new Error("deliberate test failure");
      }),
    ).rejects.toThrow("deliberate test failure");
    expect(await observer.query("select id from public.training_intakes where id = $1", [intakeId])).toHaveLength(0);
  });
});

test("fixture cleanup after failure removes only its own user and rows", async ({ user, local }) => {
  await withSqlSession(local.DB_URL, "admin", async (sql) => {
    const survivorIntake = await saveIntake(user, sql);
    let removedId = "";
    await expect(
      withTestUser(local, async (other) => {
        removedId = other.id;
        const otherIntake = await saveIntake(other, sql);
        await withSqlSession(local.DB_URL, { userId: user.id }, async (owner) => {
          expect(await owner.query("select id from public.training_intakes where id = $1", [otherIntake])).toHaveLength(
            0,
          );
        });
        await withSqlSession(local.DB_URL, "anon", async (anon) => {
          expect(
            await anon.query("select id from public.training_intakes where id = any($1::uuid[])", [
              [survivorIntake, otherIntake],
            ]),
          ).toHaveLength(0);
        });
        throw new Error("deliberate fixture failure");
      }),
    ).rejects.toThrow("deliberate fixture failure");
    expect(await sql.query("select id from auth.users where id = $1", [removedId])).toHaveLength(0);
    expect(await sql.query("select id from public.training_intakes where user_id = $1", [removedId])).toHaveLength(0);
    expect(await sql.query("select id from public.training_intakes where user_id = $1", [user.id])).toEqual([
      { id: survivorIntake },
    ]);
  });
});

test("launcher loses the RPC response only after a real revision commit", async ({ user, local }) => {
  await withSqlSession(local.DB_URL, { userId: user.id }, async (sql) => {
    const intakeId = await saveIntake(user, sql);
    const initialGate = await armGate(user.id, { kind: "ai", mode: "success" });
    const initial = generate(user, intakeId);
    try {
      await initialGate.waitUntilReached();
    } finally {
      await initialGate.release();
    }
    const saved = savedSchema.parse(await (await initial).json());
    const ai = await armGate(user.id, { kind: "ai", mode: "success" });
    const rpc = await armGate(user.id, { kind: "rpc", mode: "drop", path: "/rest/v1/rpc/revise_training_plan" });
    const pending = user.api.post("/api/training-plans/revise", {
      form: {
        planId: saved.planId,
        expectedUpdatedAt: saved.updatedAt,
        revisionNote: "Testowa korekta",
        healthConstraints: "Brak znanych ograniczeń",
      },
      headers: { Accept: "application/json" },
      maxRedirects: 0,
    });
    try {
      await ai.waitUntilReached();
    } finally {
      await ai.release();
    }
    try {
      await rpc.waitUntilReached();
      expect((await rpc.state()).upstreamStatus).toBe(200);
      expect(await sql.query("select revision_count from public.training_plans where id = $1", [saved.planId])).toEqual(
        [{ revision_count: 1 }],
      );
    } finally {
      await rpc.release();
    }
    const response = await pending;
    expect(response.status()).toBe(503);
    expect(await response.json()).toMatchObject({ outcome: "unknown", code: "dependency-unavailable" });
    const current = await user.api.get(`/api/training-plans/current?planId=${saved.planId}`);
    expect(await current.json()).toMatchObject({ plan: { id: saved.planId, revisionCount: 1 } });
    expect(await aiCallCount(user.id)).toBe(2);
  });
});
