import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { z } from "zod";

export const APP_URL = "http://127.0.0.1:4324";
export const CONTROL_URL = "http://127.0.0.1:4325";
export const PROXY_URL = `${CONTROL_URL}/supabase`;

const statusSchema = z.object({
  API_URL: z.string().min(1),
  DB_URL: z.string().min(1),
  ANON_KEY: z.string().min(1),
  SERVICE_ROLE_KEY: z.string().min(1),
});
export type LocalEnvironment = z.infer<typeof statusSchema>;

export function environmentFingerprint(local: LocalEnvironment) {
  return createHash("sha256").update(JSON.stringify(local)).digest("hex");
}

export function assertLocalUrl(value: string, database = false) {
  try {
    const url = new URL(value);
    if (
      url.hostname !== "127.0.0.1" ||
      !(database ? ["postgres:", "postgresql:"] : ["http:"]).includes(url.protocol) ||
      !url.port ||
      url.search ||
      url.hash ||
      (!database && (url.username || url.password || url.pathname !== "/"))
    )
      throw new Error();
  } catch {
    throw new Error("Retention tests require an explicit local loopback URL");
  }
}

export function validateEnvironment(status: unknown, app: Record<string, string | undefined>): LocalEnvironment {
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) throw new Error("Local Supabase status is incomplete");
  const local = parsed.data;
  assertLocalUrl(local.API_URL);
  assertLocalUrl(local.DB_URL, true);
  if (app.SUPABASE_URL !== local.API_URL || app.SUPABASE_KEY !== local.ANON_KEY) {
    throw new Error("App Supabase configuration does not match the local test database");
  }
  return local;
}

export function loadLocalEnvironment(): LocalEnvironment {
  // Never expose CLI stderr, configuration contents, keys or connection strings.
  let status: unknown;
  let app: Record<string, string | undefined>;
  const isolatedWorkdir = process.env.RETENTION_SUPABASE_WORKDIR;
  try {
    status = JSON.parse(
      execFileSync(
        "node_modules/.bin/supabase",
        ["status", "-o", "json", ...(isolatedWorkdir ? ["--workdir", isolatedWorkdir] : [])],
        {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
          timeout: 10_000,
        },
      ),
    );
    if (isolatedWorkdir) {
      const parsed = statusSchema.safeParse(status);
      if (!parsed.success) throw new Error();
      // The launcher injects these exact values only in its test Vite transform.
      // Existing application env files do not configure this isolated instance.
      app = { SUPABASE_URL: parsed.data.API_URL, SUPABASE_KEY: parsed.data.ANON_KEY };
    } else {
      app = parseEnv(readFileSync(".dev.vars", "utf8"));
    }
  } catch {
    throw new Error("Start local Supabase and configure .dev.vars before running retention tests");
  }
  const local = validateEnvironment(status, app);
  if (isolatedWorkdir) return local;
  // Reject conflicting overrides rather than relying on environment precedence.
  const candidates = [
    process.env,
    ...[".env", ".env.local", ".env.development", ".env.development.local", ".dev.vars.local"]
      .filter(existsSync)
      .map((file) => parseEnv(readFileSync(file, "utf8"))),
  ];
  for (const candidate of candidates) {
    if (
      (candidate.SUPABASE_URL && candidate.SUPABASE_URL !== local.API_URL) ||
      (candidate.SUPABASE_KEY && candidate.SUPABASE_KEY !== local.ANON_KEY)
    ) {
      throw new Error("Conflicting Supabase environment override; retention tests refused");
    }
  }
  return local;
}
