import { test, expect } from "./support/fixtures";
import { withSqlSession, waitForBlock, type SqlSession } from "./support/sql";
import { planPayload } from "./support/payload";
import { randomUUID } from "node:crypto";

interface IntakeToken {
  id: string;
  token: string;
}

function save(sql: SqlSession) {
  return sql.query<IntakeToken>(
    "select id, updated_at::text as token from public.save_training_intake('Test','beginner','Test',null)",
  );
}

function replace(sql: SqlSession, intake: IntakeToken) {
  return sql.query<{ outcome: string; plan: { id: string } | null }>(
    "select * from public.replace_training_plan($1,$2,$3,$4)",
    [intake.id, intake.token, planPayload.planContent, planPayload.explanation],
  );
}

test("two replacements of the same intake commit one identical plan", async ({ user, local }) => {
  await withSqlSession(local.DB_URL, "admin", async (observer) => {
    await withSqlSession(local.DB_URL, { userId: user.id }, async (holder) => {
      const [intake] = await save(holder);
      await holder.query("commit");
      await holder.begin({ userId: user.id });
      const [created] = await replace(holder, intake);
      await withSqlSession(local.DB_URL, { userId: user.id }, async (waiter) => {
        const pending = replace(waiter, intake);
        try {
          await waitForBlock(observer, waiter.pid, holder.pid);
        } finally {
          await holder.query("commit");
        }
        expect(await pending).toEqual([{ outcome: "existing", plan: created.plan }]);
        await waiter.query("commit");
      });
      expect(await observer.query("select id from public.training_plans where user_id=$1", [user.id])).toHaveLength(1);
    });
  });
});

for (const action of ["revise", "accept", "feedback"] as const) {
  for (const first of ["action", "save"] as const) {
    test(`${action} and intake deletion remain consistent when ${first} commits first`, async ({ user, local }) => {
      await withSqlSession(local.DB_URL, "admin", async (observer) => {
        await withSqlSession(local.DB_URL, { userId: user.id }, async (setup) => {
          const [oldIntake] = await save(setup);
          const [{ plan }] = await replace(setup, oldIntake);
          const planId = plan?.id;
          if (action === "feedback") {
            await setup.query(
              "select * from public.accept_training_plan($1,(select updated_at from public.training_plans where id=$1))",
              [planId],
            );
          }
          const [{ token }] = await setup.query<{ token: string }>(
            "select updated_at::text as token from public.training_plans where id=$1",
            [planId],
          );
          await setup.query("commit");
          const runAction = (sql: SqlSession) => {
            if (action === "revise")
              return sql.query("select id from public.revise_training_plan($1,$2,'Test','Test','Changed',$3,$4)", [
                planId,
                token,
                planPayload.planContent,
                planPayload.explanation,
              ]);
            if (action === "accept")
              return sql.query("select id from public.accept_training_plan($1,$2)", [planId, token]);
            return sql.query(
              "select id from public.submit_workout_feedback($1,'workout-1',5,null,null,(statement_timestamp() at time zone 'UTC')::date,'UTC',$2)",
              [planId, randomUUID()],
            );
          };
          await withSqlSession(local.DB_URL, { userId: user.id }, async (holder) => {
            await withSqlSession(local.DB_URL, { userId: user.id }, async (waiter) => {
              if (first === "action") expect(await runAction(holder)).toHaveLength(1);
              else expect(await save(holder)).toHaveLength(1);
              const pending = (first === "action" ? save(waiter) : runAction(waiter)).then(
                (rows) => ({ rows }),
                (error: unknown) => ({ error }),
              );
              try {
                await waitForBlock(observer, waiter.pid, holder.pid);
              } finally {
                await holder.query("commit");
              }
              const result = await pending;
              if (first === "action") expect(result).toMatchObject({ rows: [{ id: expect.any(String) }] });
              else expect(result).toEqual({ rows: [] });
              await waiter.query("commit");
            });
          });
          expect(
            await observer.query("select intake_id from public.training_plans where user_id=$1", [user.id]),
          ).toEqual([]);
          expect(
            await observer.query("select id from public.workout_feedback where user_id=$1", [user.id]),
          ).toHaveLength(0);
        });
      });
    });
  }
}

for (const first of ["save", "replace"] as const) {
  test(`intake save and replacement serialize when ${first} commits first`, async ({ user, local }) => {
    await withSqlSession(local.DB_URL, "admin", async (observer) => {
      await withSqlSession(local.DB_URL, { userId: user.id }, async (setup) => {
        const [intake] = await save(setup);
        await setup.query("commit");
        await withSqlSession(local.DB_URL, { userId: user.id }, async (holder) => {
          await withSqlSession(local.DB_URL, { userId: user.id }, async (waiter) => {
            if (first === "save") await save(holder);
            else expect((await replace(holder, intake))[0].outcome).toBe("created");
            const pending = (first === "save" ? replace(waiter, intake) : save(waiter)).then(
              (rows) => ({ rows }),
              (error: unknown) => ({ error }),
            );
            try {
              await waitForBlock(observer, waiter.pid, holder.pid);
            } finally {
              await holder.query("commit");
            }
            const result = await pending;
            expect(result).not.toHaveProperty("error");
            if ("rows" in result) {
              if (first === "save") expect(result.rows).toMatchObject([{ outcome: "stale", plan: null }]);
              else expect(result.rows[0]).not.toMatchObject({ id: intake.id });
            }
            await waiter.query("commit");
            expect(
              await observer.query("select id from public.training_plans where user_id=$1", [user.id]),
            ).toHaveLength(0);
          });
        });
      });
    });
  });
}

test("revision waits on the owner before locking the old plan", async ({ user, local }) => {
  await withSqlSession(local.DB_URL, "admin", async (observer) => {
    await withSqlSession(local.DB_URL, { userId: user.id }, async (setup) => {
      const [intake] = await save(setup);
      const [{ plan }] = await replace(setup, intake);
      expect(plan).not.toBeNull();
      const [{ token }] = await setup.query<{ token: string }>(
        "select updated_at::text as token from public.training_plans where id=$1",
        [plan?.id],
      );
      await setup.query("commit");
      await withSqlSession(local.DB_URL, "admin", async (holder) => {
        await withSqlSession(local.DB_URL, { userId: user.id }, async (waiter) => {
          await holder.query("select pg_advisory_xact_lock(hashtextextended($1,0))", [user.id]);
          const pending = waiter
            .query("select id from public.revise_training_plan($1,$2,'Test','Test','Changed',$3,$4)", [
              plan?.id,
              token,
              planPayload.planContent,
              planPayload.explanation,
            ])
            .then(
              (rows) => ({ rows }),
              (error: unknown) => ({ error }),
            );
          try {
            await waitForBlock(observer, waiter.pid, holder.pid);
            // NOWAIT proves revision has not acquired the plan while waiting for its owner.
            await holder.query("select id from public.training_plans where id=$1 for update nowait", [plan?.id]);
          } finally {
            await holder.query("commit");
          }
          expect(await pending).toMatchObject({ rows: [{ id: plan?.id }] });
          await waiter.query("commit");
        });
      });
    });
  });
});
