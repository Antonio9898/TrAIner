import { Client, type QueryResultRow } from "pg";
import { expect } from "@playwright/test";
import { assertLocalUrl } from "./environment";

export type SqlRole = { userId: string } | "anon" | "admin";

export class SqlSession {
  private client: Client;
  pid = 0;

  constructor(connectionString: string) {
    assertLocalUrl(connectionString, true);
    this.client = new Client({
      connectionString,
      connectionTimeoutMillis: 5_000,
      statement_timeout: 12_000,
      lock_timeout: 10_000,
      application_name: "retention-test",
    });
    // Report only safe error metadata through query(), never a raw connection error.
    this.client.on("error", () => {
      /* query() reports sanitized connection failures. */
    });
  }

  async connect() {
    try {
      await this.client.connect();
    } catch {
      throw new Error("Could not connect to local retention database");
    }
    this.pid = (await this.query<{ pid: number }>("select pg_backend_pid() as pid"))[0].pid;
  }

  async query<R extends QueryResultRow = Record<string, unknown>>(sql: string, values: unknown[] = []): Promise<R[]> {
    try {
      return (await this.client.query<R>(sql, values)).rows;
    } catch (error) {
      const code =
        typeof error === "object" &&
        error &&
        "code" in error &&
        typeof error.code === "string" &&
        /^[0-9A-Z]{5}$/.test(error.code)
          ? error.code
          : "unknown";
      throw new Error(`Retention SQL failed (${code})`);
    }
  }

  async begin(role: SqlRole) {
    await this.query("begin");
    if (role === "admin") return;
    await this.query(role === "anon" ? "set local role anon" : "set local role authenticated");
    await this.query("select set_config('request.jwt.claims', $1, true)", [
      JSON.stringify(role === "anon" ? { role: "anon" } : { role: "authenticated", sub: role.userId }),
    ]);
  }

  async close() {
    // Closing a connection rolls back any unfinished transaction, including failures.
    await this.client.end();
  }
}

export async function withSqlSession<T>(
  connectionString: string,
  role: SqlRole,
  work: (session: SqlSession) => Promise<T>,
): Promise<T> {
  const session = new SqlSession(connectionString);
  try {
    await session.connect();
    await session.begin(role);
    return await work(session);
  } finally {
    await session.close();
  }
}

export async function waitForBlock(observer: SqlSession, waiterPid: number, blockerPid: number, timeout = 5_000) {
  await expect
    .poll(
      async () => {
        const rows = await observer.query<{ blocked: boolean }>(
          "select $2::int = any(pg_blocking_pids($1::int)) as blocked",
          [waiterPid, blockerPid],
        );
        return rows[0].blocked;
      },
      { timeout, message: "Expected SQL session to wait on the specified blocker" },
    )
    .toBe(true);
}
