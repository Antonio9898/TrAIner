import { createServer } from "node:http";
import { dev } from "astro";

// Redirect only the external HTTP boundary, in the test launcher, never production.
const mock = createServer((request, response) => {
  void (async () => {
    if (request.method !== "POST" || request.url !== "/chat/completions") {
      response.writeHead(404).end();
      return;
    }
    let body = "";
    for await (const chunk of request) body += String(chunk);
    const input = JSON.parse(body) as {
      response_format: { json_schema: { name: string } };
      messages: { content: string }[];
    };
    const schema = input.response_format.json_schema.name;
    const revised = schema === "training_plan_revision_payload";
    if (
      !["training_plan_payload", "training_plan_revision_payload"].includes(schema) ||
      (revised &&
        !input.messages.some(
          ({ content }) =>
            content.includes("Zamień przysiady na most biodrowy") && content.includes("Przysiad do ławki"),
        ))
    ) {
      response.writeHead(422).end("Unexpected LLM request");
      return;
    }
    const payload = {
      planContent: {
        overview: revised ? "Tydzień z mostem biodrowym zamiast przysiadów." : "Tydzień z przysiadem do ławki.",
        scheduledWorkouts: [
          {
            key: "workout-1",
            label: "Trening A",
            exercises: [{ name: revised ? "Most biodrowy" : "Przysiad do ławki", sets: 2, reps: "10" }],
          },
          { key: "workout-2", label: "Trening B", exercises: [{ name: "Wiosłowanie gumą", sets: 2, reps: "12" }] },
        ],
        progressionGuidance: "Zwiększaj obciążenie stopniowo.",
        safetyNotes: ["Przerwij ćwiczenie przy bólu i skonsultuj się ze specjalistą."],
      },
      explanation: revised
        ? "Zmieniono ćwiczenie zgodnie z prośbą."
        : "Dwa treningi dopasowane do początkującej osoby.",
      ...(revised ? { revisionSummary: "Zastąpiono przysiad mostem biodrowym." } : {}),
    };
    response.writeHead(200, { "Content-Type": "application/json" }).end(
      JSON.stringify({
        choices: [{ finish_reason: "stop", message: { content: JSON.stringify(payload) } }],
      }),
    );
  })().catch(() => response.writeHead(500).end("Invalid mock request"));
});
await new Promise<void>((resolve) => mock.listen(0, "127.0.0.1", resolve));
const address = mock.address();
if (!address || typeof address === "string") throw new Error("Mock did not bind a TCP port");
await dev({
  server: { host: "127.0.0.1", port: 4323 },
  vite: {
    plugins: [
      {
        name: "e2e-openrouter-http-endpoint",
        enforce: "pre",
        transform(code, id) {
          if (!id.endsWith("/src/lib/openrouter.ts")) return;
          const endpoint = "https://openrouter.ai/api/v1/chat/completions";
          if (!code.includes(endpoint)) throw new Error("OpenRouter endpoint changed; update the test launcher");
          return code
            .replace(endpoint, `http://127.0.0.1:${address.port}/chat/completions`)
            .replace("getRequiredEnvValue(OPENROUTER_API_KEY)", 'getRequiredEnvValue("e2e-dummy-key")')
            .replace("getRequiredEnvValue(OPENROUTER_MODEL)", 'getRequiredEnvValue("e2e-model")');
        },
      },
    ],
  },
});
