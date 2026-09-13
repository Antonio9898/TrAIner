import { OPENROUTER_API_KEY, OPENROUTER_HTTP_REFERER, OPENROUTER_MODEL } from "astro:env/server";
import type { PlanOperation } from "@/lib/plan-operation";

const OPENROUTER_CHAT_COMPLETIONS_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_APP_TITLE = "TrAIner";
const OPENROUTER_TIMEOUT_MS = 90_000;

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterJsonSchema {
  name: string;
  strict?: boolean;
  schema: Record<string, unknown>;
}

interface OpenRouterChatCompletionRequest {
  messages: OpenRouterMessage[];
  responseFormat: OpenRouterJsonSchema;
  userId: string;
  temperature?: number;
  maxTokens?: number;
  operation?: PlanOperation;
}

interface OpenRouterChatCompletionResponse {
  choices?: {
    finish_reason?: string;
    message?: {
      content?: string | null;
    };
    error?: {
      code?: number;
      message?: string;
    };
  }[];
}

export class OpenRouterConfigurationError extends Error {
  constructor(message = "OpenRouter is not configured") {
    super(message);
    this.name = "OpenRouterConfigurationError";
  }
}

export class OpenRouterGenerationError extends Error {
  constructor(message = "OpenRouter generation failed") {
    super(message);
    this.name = "OpenRouterGenerationError";
  }
}

export class OpenRouterDependencyError extends Error {
  constructor() {
    super("OpenRouter is unavailable");
    this.name = "OpenRouterDependencyError";
  }
}

export class OpenRouterTimeoutError extends OpenRouterGenerationError {
  constructor() {
    super("OpenRouter generation timed out");
    this.name = "OpenRouterTimeoutError";
  }
}

export async function createOpenRouterChatCompletion(request: OpenRouterChatCompletionRequest): Promise<string> {
  if (request.operation) {
    return request.operation.run("ai", (signal) => requestChatCompletion(request, signal), 70_000, 10_000);
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, OPENROUTER_TIMEOUT_MS);
  try {
    return await requestChatCompletion(request, controller.signal);
  } catch (error) {
    if (controller.signal.aborted) throw new OpenRouterTimeoutError();
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function requestChatCompletion(
  { messages, responseFormat, userId, temperature, maxTokens }: OpenRouterChatCompletionRequest,
  signal: AbortSignal,
): Promise<string> {
  const apiKey = getRequiredEnvValue(OPENROUTER_API_KEY);
  const model = getRequiredEnvValue(OPENROUTER_MODEL);
  const referer = getOptionalEnvValue(OPENROUTER_HTTP_REFERER);

  let payload: OpenRouterChatCompletionResponse | null;
  try {
    const response = await fetch(OPENROUTER_CHAT_COMPLETIONS_URL, {
      method: "POST",
      signal,
      headers: buildOpenRouterHeaders(apiKey, referer),
      body: JSON.stringify({
        model,
        messages,
        response_format: {
          type: "json_schema",
          json_schema: responseFormat,
        },
        stream: false,
        user: userId,
        ...(temperature === undefined ? {} : { temperature }),
        ...(maxTokens === undefined ? {} : { max_tokens: maxTokens }),
      }),
    });

    if (!response.ok) {
      // eslint-disable-next-line no-console -- Log failure metadata only; never prompts or model output.
      console.warn("OpenRouter HTTP failure", { status: response.status });
      throw new OpenRouterDependencyError();
    }

    try {
      payload = (await response.json()) as OpenRouterChatCompletionResponse | null;
    } catch (error) {
      if (error instanceof SyntaxError) throw new OpenRouterGenerationError();
      throw error;
    }
  } catch (error) {
    if (signal.aborted) throw signal.reason;
    if (error instanceof OpenRouterGenerationError || error instanceof OpenRouterDependencyError) {
      throw error;
    }
    throw new OpenRouterDependencyError();
  }

  const choice = payload?.choices?.[0];
  if (choice?.finish_reason === "length") {
    // eslint-disable-next-line no-console -- Log failure metadata only; never prompts or model output.
    console.warn("OpenRouter output limit reached", { model, maxTokens });
    throw new OpenRouterGenerationError("OpenRouter output was truncated");
  }
  if (choice?.error) {
    throw new OpenRouterGenerationError();
  }

  const content = choice?.message?.content;
  if (typeof content !== "string" || !content) {
    throw new OpenRouterGenerationError();
  }

  return content;
}

function getRequiredEnvValue(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new OpenRouterConfigurationError();
  }

  return value;
}

function getOptionalEnvValue(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function buildOpenRouterHeaders(apiKey: string, referer: string | null): HeadersInit {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "X-OpenRouter-Title": OPENROUTER_APP_TITLE,
  };

  if (referer) {
    headers["HTTP-Referer"] = referer;
  }

  return headers;
}
