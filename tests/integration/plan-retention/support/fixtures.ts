import { randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { test as base, expect, request, type APIRequestContext } from "@playwright/test";
import { z } from "zod";
import {
  APP_URL,
  CONTROL_URL,
  loadLocalEnvironment,
  environmentFingerprint,
  type LocalEnvironment,
} from "./environment";

export interface TestUser {
  id: string;
  api: APIRequestContext;
  client: SupabaseClient;
}
type GateInput =
  | { kind: "ai"; mode: "success" | "error" | "invalid" }
  | { kind: "rpc"; mode: "pass" | "drop"; path: string };
const gateStateSchema = z.object({
  arrived: z.boolean(),
  finished: z.boolean(),
  expired: z.boolean(),
  upstreamStatus: z.number().optional(),
});

export async function control(path: string, method = "GET", body?: unknown): Promise<unknown> {
  const token = process.env.RETENTION_CONTROL_TOKEN;
  if (!token) throw new Error("Missing retention control token");
  try {
    const response = await fetch(`${CONTROL_URL}/control/${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    throw new Error("Retention control request failed");
  }
}

export async function armGate(userId: string, input: GateInput) {
  const { id } = z.object({ id: z.uuid() }).parse(await control("gates", "POST", { userId, ...input }));
  const state = async () => gateStateSchema.parse(await control(`gates/${id}`));
  return {
    state,
    async waitUntilReached() {
      await expect
        .poll(
          async () => {
            const value = await state();
            if (value.expired) throw new Error("Retention gate expired before release");
            return value.arrived && (input.kind === "ai" || value.upstreamStatus !== undefined);
          },
          { timeout: 8_000, message: "Expected request to reach test gate" },
        )
        .toBe(true);
    },
    async release() {
      await control(`gates/${id}`, "POST");
    },
  };
}

export async function aiCallCount(userId: string) {
  return z.object({ aiCalls: z.number() }).parse(await control(`users/${userId}`)).aiCalls;
}

export async function withTestUser<T>(local: LocalEnvironment, work: (user: TestUser) => Promise<T>): Promise<T> {
  // Revalidate on every creation; no administrative write precedes this check.
  const verified = loadLocalEnvironment();
  if (
    verified.API_URL !== local.API_URL ||
    verified.DB_URL !== local.DB_URL ||
    verified.SERVICE_ROLE_KEY !== local.SERVICE_ROLE_KEY
  ) {
    throw new Error("Local retention environment changed during test");
  }
  const launcher = z.object({ fingerprint: z.string() }).parse(await control("environment"));
  if (launcher.fingerprint !== environmentFingerprint(verified)) {
    throw new Error("Retention launcher and fixture database configurations differ");
  }
  const options = { auth: { persistSession: false, autoRefreshToken: false } };
  const admin = createClient(local.API_URL, local.SERVICE_ROLE_KEY, options);
  const email = `retention-${randomUUID()}@example.com`;
  const password = `Retention!${randomUUID()}`;
  const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (created.error) throw new Error("Could not create local retention user");
  const id = created.data.user.id;
  let api: APIRequestContext | undefined;
  try {
    const client = createClient(local.API_URL, local.ANON_KEY, options);
    const signedIn = await client.auth.signInWithPassword({ email, password });
    if (signedIn.error) throw new Error("Could not create retention user session");
    api = await request.newContext({ baseURL: APP_URL, extraHTTPHeaders: { Origin: APP_URL }, timeout: 25_000 });
    const login = await api.post("/api/auth/signin", { form: { email, password }, maxRedirects: 0 });
    if (login.status() !== 302 || login.headers().location !== "/dashboard")
      throw new Error("Retention app sign-in failed");
    return await work({ id, api, client });
  } finally {
    // Attempt every cleanup even if another cleanup fails. Delete only the exact
    // auth ID returned by this createUser call; FK cascades remove its records.
    const cleanup = await Promise.allSettled([control(`users/${id}`, "DELETE"), api?.dispose()]);
    const deleted = await admin.auth.admin.deleteUser(id);
    expect(
      Boolean(deleted.error) || cleanup.some((result) => result.status === "rejected"),
      `Retention fixture cleanup failed (auth status: ${deleted.error?.status ?? "ok"}; control/dispose: ${cleanup.map((result) => result.status).join(",")})`,
    ).toBe(false);
  }
}

export const test = base.extend<{ local: LocalEnvironment; user: TestUser }>({
  // eslint-disable-next-line no-empty-pattern -- Playwright requires destructured fixture dependencies.
  local: async ({}, runFixture) => {
    await runFixture(loadLocalEnvironment());
  },
  user: async ({ local }, runFixture) => {
    await withTestUser(local, runFixture);
  },
});
export { expect };
