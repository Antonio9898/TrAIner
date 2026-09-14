import { randomUUID } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { dev } from "astro";
import { z } from "zod";
import { CONTROL_URL, PROXY_URL, loadLocalEnvironment, environmentFingerprint } from "./environment.ts";
import { planPayload } from "./payload.ts";

const local = loadLocalEnvironment();
const token = process.env.RETENTION_CONTROL_TOKEN;
if (!token) throw new Error("Start the retention launcher through its Playwright config");

const gateSchema = z.discriminatedUnion("kind", [
  z.object({ userId: z.uuid(), kind: z.literal("ai"), mode: z.enum(["success", "error", "invalid"]) }),
  z.object({
    userId: z.uuid(),
    kind: z.literal("rpc"),
    path: z.string().regex(/^\/rest\/v1\/rpc\/[a-z_]+$/),
    mode: z.enum(["pass", "drop"]),
  }),
]);
type Gate = z.infer<typeof gateSchema> & {
  id: string;
  arrived: boolean;
  finished: boolean;
  expired: boolean;
  upstreamStatus?: number;
  release?: () => void;
  cancel?: () => void;
};
const gates = new Map<string, Gate>();
const aiCalls = new Map<string, number>();

async function readBody(request: IncomingMessage) {
  let body = "";
  for await (const chunk of request) {
    body += String(chunk);
    if (body.length > 1_000_000) throw new Error("Test request too large");
  }
  return body;
}
function json(response: ServerResponse, body: unknown, status = 200) {
  response.writeHead(status, { "Content-Type": "application/json" }).end(JSON.stringify(body));
}
function takeGate(userId: string, kind: Gate["kind"], path?: string) {
  return [...gates.values()].find(
    (gate) =>
      gate.userId === userId && gate.kind === kind && !gate.arrived && (gate.kind === "ai" || gate.path === path),
  );
}
async function hold(gate: Gate) {
  gate.arrived = true;
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      gate.expired = true;
      reject(new Error("Test gate expired"));
    }, 15_000);
    gate.release = () => {
      clearTimeout(timer);
      resolve();
    };
    gate.cancel = () => {
      clearTimeout(timer);
      reject(new Error("Test gate cancelled"));
    };
  });
}
function requestOwner(request: IncomingMessage): string {
  try {
    const jwt = request.headers.authorization?.replace(/^Bearer /i, "").split(".")[1];
    const claims: unknown = JSON.parse(Buffer.from(jwt ?? "", "base64url").toString());
    return z.object({ sub: z.uuid() }).parse(claims).sub;
  } catch {
    return "";
  }
}

const server = createServer((request, response) => {
  void (async () => {
    const url = new URL(request.url ?? "/", CONTROL_URL);
    if (url.pathname.startsWith("/control/")) {
      if (request.headers.authorization !== `Bearer ${token}`) {
        json(response, {}, 403);
        return;
      }
      if (request.method === "GET" && url.pathname === "/control/environment") {
        json(response, { fingerprint: environmentFingerprint(local) });
        return;
      }
      if (request.method === "POST" && url.pathname === "/control/gates") {
        const parsed = gateSchema.safeParse(JSON.parse(await readBody(request)));
        if (!parsed.success) {
          json(response, {}, 400);
          return;
        }
        const gate: Gate = { ...parsed.data, id: randomUUID(), arrived: false, finished: false, expired: false };
        gates.set(gate.id, gate);
        json(response, { id: gate.id });
        return;
      }
      const id = url.pathname.split("/")[3];
      if (url.pathname.startsWith("/control/gates/") && id) {
        const gate = gates.get(id);
        if (!gate) {
          json(response, {}, 404);
          return;
        }
        if (request.method === "POST") gate.release?.();
        json(response, {
          arrived: gate.arrived,
          finished: gate.finished,
          expired: gate.expired,
          upstreamStatus: gate.upstreamStatus,
        });
        return;
      }
      if (url.pathname.startsWith("/control/users/") && id) {
        if (request.method === "DELETE") {
          for (const [key, gate] of gates)
            if (gate.userId === id) {
              gate.cancel?.();
              gates.delete(key);
            }
          aiCalls.delete(id);
        }
        json(response, { aiCalls: aiCalls.get(id) ?? 0 });
        return;
      }
      json(response, {}, 404);
      return;
    }

    if (request.method === "POST" && url.pathname === "/chat/completions") {
      const input = z
        .object({
          user: z.uuid(),
          response_format: z.object({
            json_schema: z.object({ name: z.enum(["training_plan_payload", "training_plan_revision_payload"]) }),
          }),
        })
        .parse(JSON.parse(await readBody(request)));
      aiCalls.set(input.user, (aiCalls.get(input.user) ?? 0) + 1);
      const gate = takeGate(input.user, "ai");
      // An unarmed request fails closed: no accidental AI success or external fallback.
      if (gate?.kind !== "ai") {
        json(response, {}, 503);
        return;
      }
      try {
        await hold(gate);
        if (gate.mode === "error") {
          json(response, {}, 503);
          return;
        }
        const payload = {
          ...planPayload,
          ...(input.response_format.json_schema.name === "training_plan_revision_payload"
            ? { revisionSummary: "Testowa korekta planu." }
            : {}),
        };
        json(response, {
          choices: [
            {
              finish_reason: "stop",
              message: { content: gate.mode === "invalid" ? "invalid-json" : JSON.stringify(payload) },
            },
          ],
        });
        return;
      } finally {
        gate.finished = true;
      }
    }

    if (url.pathname.startsWith("/supabase/")) {
      const path = url.pathname.slice("/supabase".length);
      if (!path.startsWith("/auth/v1/") && !path.startsWith("/rest/v1/")) {
        json(response, {}, 404);
        return;
      }
      const gate = request.method === "POST" ? takeGate(requestOwner(request), "rpc", path) : undefined;
      // Claim the gate before awaiting the real upstream transaction.
      if (gate) gate.arrived = true;
      try {
        const headers = new Headers();
        for (const name of [
          "authorization",
          "apikey",
          "content-type",
          "accept",
          "prefer",
          "range",
          "accept-profile",
          "content-profile",
          "x-client-info",
        ]) {
          const value = request.headers[name];
          if (typeof value === "string") headers.set(name, value);
        }
        const method = request.method ?? "GET";
        const body = await readBody(request);
        const upstream = await fetch(`${local.API_URL}${path}${url.search}`, {
          method,
          headers,
          ...(method === "GET" || method === "HEAD" ? {} : { body }),
          redirect: "error",
          signal: AbortSignal.timeout(20_000),
        });
        const bytes = Buffer.from(await upstream.arrayBuffer());
        if (gate) {
          gate.upstreamStatus = upstream.status;
          await hold(gate);
          if (gate.mode === "drop") {
            response.destroy();
            return;
          }
        }
        // fetch has already decompressed the buffered body.
        for (const [name, value] of upstream.headers) {
          if (!["content-encoding", "content-length", "transfer-encoding", "connection"].includes(name))
            response.setHeader(name, value);
        }
        response.writeHead(upstream.status).end(bytes);
      } finally {
        if (gate) gate.finished = true;
      }
      return;
    }
    json(response, {}, 404);
  })().catch(() => {
    // Raw dependency errors can contain credentials or request bodies.
    if (!response.destroyed) json(response, { error: "Test dependency failed" }, 502);
  });
});
await new Promise<void>((resolve, reject) => {
  server.once("error", () => {
    reject(new Error("Retention control port unavailable"));
  });
  server.listen(4325, "127.0.0.1", resolve);
});

function replaceRequired(code: string, target: string, replacement: string) {
  if (!code.includes(target)) throw new Error("HTTP boundary changed; update the retention launcher");
  return code.replace(target, replacement);
}

const app = await dev({
  server: { host: "127.0.0.1", port: 4324 },
  vite: {
    server: { strictPort: true },
    plugins: [
      {
        name: "retention-test-http-boundaries",
        enforce: "pre",
        transform(code, id) {
          if (id.endsWith("/src/lib/openrouter.ts")) {
            code = replaceRequired(
              code,
              "https://openrouter.ai/api/v1/chat/completions",
              `${CONTROL_URL}/chat/completions`,
            );
            code = replaceRequired(
              code,
              "getRequiredEnvValue(OPENROUTER_API_KEY)",
              'getRequiredEnvValue("retention-dummy-key")',
            );
            return replaceRequired(
              code,
              "getRequiredEnvValue(OPENROUTER_MODEL)",
              'getRequiredEnvValue("retention-model")',
            );
          }
          if (id.endsWith("/src/lib/supabase.ts")) {
            code = replaceRequired(
              code,
              'import { SUPABASE_URL, SUPABASE_KEY } from "astro:env/server";',
              `const SUPABASE_URL = ${JSON.stringify(local.API_URL)}; const SUPABASE_KEY = ${JSON.stringify(local.ANON_KEY)};`,
            );
            return replaceRequired(
              code,
              "createServerClient(SUPABASE_URL, SUPABASE_KEY,",
              `createServerClient(${JSON.stringify(PROXY_URL)}, SUPABASE_KEY,`,
            );
          }
          if (id.endsWith("/src/db/supabase.js") || id.endsWith("/src/lib/config-status.ts")) {
            return replaceRequired(
              code,
              id.endsWith("/src/db/supabase.js")
                ? 'import { SUPABASE_KEY, SUPABASE_URL } from "astro:env/server";'
                : 'import { SUPABASE_URL, SUPABASE_KEY } from "astro:env/server";',
              `const SUPABASE_URL = ${JSON.stringify(PROXY_URL)}; const SUPABASE_KEY = ${JSON.stringify(local.ANON_KEY)};`,
            );
          }
        },
      },
    ],
  },
});
let stopping = false;
function stop() {
  if (stopping) return;
  stopping = true;
  for (const gate of gates.values()) gate.cancel?.();
  server.closeAllConnections();
  server.close();
  void app.stop().finally(() => process.exit(0));
}
process.once("SIGTERM", stop);
process.once("SIGINT", stop);
