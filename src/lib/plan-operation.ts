import type { APIContext } from "astro";
import type { PlanOperationErrorCode, PlanOperationErrorResponse, PlanOperationResponse, TrainingPlan } from "@/types";
import { OpenRouterConfigurationError, OpenRouterGenerationError, OpenRouterTimeoutError } from "@/lib/openrouter";
import {
  TrainingPlanConflictError,
  TrainingPlanGenerationValidationError,
  TrainingPlanInvalidRequestError,
} from "@/lib/services/training-plans";

type Stage = "operation" | "auth" | "read" | "ai" | "write";

export class PlanOperationError extends Error {
  constructor(public readonly code: PlanOperationErrorCode) {
    super(code);
    this.name = "PlanOperationError";
  }
}

/** A cancelled operation never becomes active again, even if a dependency resolves late. */
export class PlanOperation {
  readonly startedAt = Date.now();
  readonly requestId = crypto.randomUUID();
  readonly deadline: number;
  private readonly controller = new AbortController();
  private readonly disconnect: () => void;
  writeStarted = false;
  resultCode = "dependency-unavailable";

  constructor(
    private readonly requestSignal: AbortSignal,
    budgetMs = 85_000,
  ) {
    this.deadline = this.startedAt + budgetMs;
    this.disconnect = () => {
      this.controller.abort(new PlanOperationError("dependency-unavailable"));
    };
    requestSignal.addEventListener("abort", this.disconnect, { once: true });
    if (requestSignal.aborted) this.disconnect();
  }

  get signal() {
    return this.controller.signal;
  }

  assertActive() {
    if (Date.now() >= this.deadline && !this.signal.aborted) {
      this.controller.abort(new PlanOperationError("operation-timeout"));
    }
    if (this.signal.aborted) {
      throw this.signal.reason instanceof PlanOperationError
        ? this.signal.reason
        : new PlanOperationError("dependency-unavailable");
    }
  }

  async run<T>(
    stage: Stage,
    work: (signal: AbortSignal) => PromiseLike<T>,
    limitMs = 10_000,
    reserveMs = 0,
  ): Promise<T> {
    this.assertActive();
    const budget = Math.min(limitMs, this.deadline - Date.now() - reserveMs);
    if (budget <= 0) {
      this.controller.abort(new PlanOperationError("operation-timeout"));
      this.assertActive();
    }
    const startedAt = Date.now();
    const assertStageActive = () => {
      if (Date.now() >= startedAt + budget && !this.signal.aborted) {
        this.controller.abort(new PlanOperationError("operation-timeout"));
      }
      this.assertActive();
    };
    this.log(stage, "start", startedAt, "started");
    let code = "dependency-unavailable";
    let onAbort: (() => void) | undefined;
    const cancelled = new Promise<never>((_, reject) => {
      onAbort = () => {
        reject(this.signal.reason as PlanOperationError);
      };
      this.signal.addEventListener("abort", onAbort, { once: true });
    });
    const timer = setTimeout(() => {
      this.controller.abort(new PlanOperationError("operation-timeout"));
    }, budget);
    try {
      // The race also bounds dependencies which ignore AbortSignal.
      const result = await Promise.race([
        Promise.resolve().then(() => {
          assertStageActive();
          return work(this.signal);
        }),
        cancelled,
      ]);
      assertStageActive();
      code = stage === "operation" ? this.resultCode : "ok";
      return result;
    } catch (error) {
      code = error instanceof PlanOperationError ? error.code : "dependency-unavailable";
      throw error;
    } finally {
      clearTimeout(timer);
      if (onAbort) this.signal.removeEventListener("abort", onAbort);
      this.log(stage, "end", startedAt, code);
    }
  }

  /** Supabase consumes JSON after fetch resolves; buffer the body inside the same limit. */
  fetch: typeof fetch = async (input, init) => {
    this.assertActive();
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
    const stage = url.pathname.includes("/auth/") ? "auth" : ["GET", "HEAD"].includes(method) ? "read" : "write";
    const existingSignals = [init?.signal, input instanceof Request ? input.signal : undefined].filter(
      (signal): signal is AbortSignal => Boolean(signal),
    );
    const onAbort = () => {
      this.controller.abort(new PlanOperationError("dependency-unavailable"));
    };
    for (const signal of existingSignals) {
      signal.addEventListener("abort", onAbort, { once: true });
      if (signal.aborted) onAbort();
    }
    try {
      return await this.run(stage, async (signal) => {
        this.assertActive();
        if (stage === "write") this.writeStarted = true;
        const response = await fetch(input, { ...init, signal });
        const body = await response.arrayBuffer();
        this.assertActive();
        return new Response([101, 204, 205, 304].includes(response.status) ? null : body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      });
    } catch {
      // Auth SDK logs fetch exceptions. Keep provider errors/URLs out of that log.
      this.assertActive();
      throw new PlanOperationError("dependency-unavailable");
    } finally {
      for (const signal of existingSignals) signal.removeEventListener("abort", onAbort);
    }
  };

  dispose() {
    this.requestSignal.removeEventListener("abort", this.disconnect);
    this.controller.abort(new PlanOperationError("dependency-unavailable"));
  }

  private log(stage: Stage, event: "start" | "end", startedAt: number, code: string) {
    // eslint-disable-next-line no-console -- Controlled metadata only; no user data or raw errors.
    console.info("plan-operation", {
      requestId: this.requestId,
      stage,
      event,
      durationMs: Date.now() - startedAt,
      code,
    });
  }
}

export function wantsPlanJson(request: Request): boolean {
  return (request.headers.get("Accept") ?? "").split(",").some((entry) => {
    const [type, ...parameters] = entry.trim().toLowerCase().split(";");
    return type === "application/json" && !parameters.some((parameter) => /^\s*q=0(?:\.0*)?\s*$/.test(parameter));
  });
}

const errorStatus: Record<PlanOperationErrorCode, number> = {
  "invalid-request": 400,
  "missing-intake": 400,
  "signin-required": 401,
  "request-not-allowed": 403,
  "plan-conflict": 409,
  "intake-already-planned": 409,
  "operation-timeout": 504,
  "invalid-generation": 502,
  "invalid-revision": 502,
  "dependency-unavailable": 503,
  "supabase-not-configured": 503,
  "openrouter-not-configured": 503,
};

export function planJson(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", Vary: "Accept" } });
}

export function planErrorResponse(context: APIContext, code: PlanOperationErrorCode): Response {
  const operation = context.locals.planOperation;
  if (operation) operation.resultCode = code;
  const body: PlanOperationErrorResponse = {
    outcome: operation?.writeStarted ? "unknown" : "not-saved",
    code,
    ...(operation ? { requestId: operation.requestId } : {}),
  };
  if (context.url.pathname === "/api/training-plans/current" || wantsPlanJson(context.request)) {
    return planJson(body, errorStatus[code]);
  }
  return new Response(null, {
    status: 303,
    headers: {
      Location: `/dashboard?planError=${body.outcome === "unknown" ? "outcome-unknown" : code}`,
      "Cache-Control": "no-store",
      Vary: "Accept",
    },
  });
}

export function planSavedResponse(context: APIContext, plan: TrainingPlan, action: "generated" | "revised"): Response {
  const operation = context.locals.planOperation;
  if (!operation) return planErrorResponse(context, "dependency-unavailable");
  operation.assertActive();
  operation.resultCode = "saved";
  if (wantsPlanJson(context.request)) {
    return planJson({
      outcome: "saved",
      planId: plan.id,
      intakeId: plan.intakeId,
      updatedAt: plan.updatedAt,
      requestId: operation.requestId,
    } satisfies PlanOperationResponse);
  }
  return new Response(null, {
    status: 303,
    headers: { Location: `/dashboard?planAction=${action}`, "Cache-Control": "no-store", Vary: "Accept" },
  });
}

export function planFailureResponse(context: APIContext, error: unknown): Response {
  const operation = context.locals.planOperation;
  // Supabase/helper catches may wrap an abort; the request-scoped reason remains authoritative.
  if (operation?.signal.aborted) {
    const reason: unknown = operation.signal.reason;
    return planErrorResponse(context, reason instanceof PlanOperationError ? reason.code : "dependency-unavailable");
  }
  if (error instanceof PlanOperationError) return planErrorResponse(context, error.code);
  if (error instanceof TrainingPlanInvalidRequestError) return planErrorResponse(context, "invalid-request");
  if (error instanceof TrainingPlanConflictError) return planErrorResponse(context, "plan-conflict");
  if (error instanceof OpenRouterTimeoutError) return planErrorResponse(context, "operation-timeout");
  if (error instanceof OpenRouterConfigurationError) return planErrorResponse(context, "openrouter-not-configured");
  if (error instanceof OpenRouterGenerationError || error instanceof TrainingPlanGenerationValidationError) {
    return planErrorResponse(
      context,
      context.url.pathname.endsWith("/revise") ? "invalid-revision" : "invalid-generation",
    );
  }
  return planErrorResponse(context, "dependency-unavailable");
}
