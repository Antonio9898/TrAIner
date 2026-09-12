import type { APIContext, APIRoute } from "astro";
import { OpenRouterConfigurationError, OpenRouterGenerationError, OpenRouterTimeoutError } from "@/lib/openrouter";
import { isSameOriginRequest } from "@/lib/request-security";
import {
  parseTrainingPlanRevisionFormData,
  reviseTrainingPlan,
  TrainingPlanConflictError,
  TrainingPlanGenerationValidationError,
  TrainingPlanInvalidRequestError,
  TrainingPlanPersistenceError,
  type TrainingPlanRevisionInput,
} from "@/lib/services/training-plans";
import { createClient } from "@/lib/supabase";

export const prerender = false;

const DASHBOARD_ROUTE = "/dashboard";

type RevisionErrorCode =
  | "request-not-allowed"
  | "supabase-not-configured"
  | "signin-required"
  | "invalid-request"
  | "openrouter-not-configured"
  | "generation-timeout"
  | "invalid-revision"
  | "plan-conflict"
  | "save-failed";

export const POST: APIRoute = async (context) => {
  if (!isSameOriginRequest(context.request)) {
    return redirectWithError(context, "request-not-allowed");
  }

  const supabase = createClient(context.request.headers, context.cookies);
  if (!supabase) {
    return redirectWithError(context, "supabase-not-configured");
  }

  const user = context.locals.user ?? (await getAuthenticatedUser(supabase));
  if (!user) {
    return redirectWithError(context, "signin-required");
  }

  let input: TrainingPlanRevisionInput;
  try {
    const formData = await context.request.formData();
    input = parseTrainingPlanRevisionFormData(formData);
  } catch {
    return redirectWithError(context, "invalid-request");
  }

  try {
    await reviseTrainingPlan(supabase, user.id, input);
  } catch (error) {
    return redirectWithError(context, mapRevisionError(error));
  }

  return context.redirect(`${DASHBOARD_ROUTE}?planAction=revised`);
};

function redirectWithError(context: APIContext, code: RevisionErrorCode) {
  return context.redirect(`${DASHBOARD_ROUTE}?planError=${code}`);
}

async function getAuthenticatedUser(supabase: NonNullable<ReturnType<typeof createClient>>) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return null;
  return user;
}

function mapRevisionError(error: unknown): RevisionErrorCode {
  if (error instanceof TrainingPlanInvalidRequestError) {
    return "invalid-request";
  }

  if (error instanceof OpenRouterConfigurationError) {
    return "openrouter-not-configured";
  }

  if (error instanceof OpenRouterTimeoutError) {
    return "generation-timeout";
  }

  if (error instanceof OpenRouterGenerationError || error instanceof TrainingPlanGenerationValidationError) {
    return "invalid-revision";
  }

  if (error instanceof TrainingPlanConflictError) {
    return "plan-conflict";
  }

  if (error instanceof TrainingPlanPersistenceError) {
    return "save-failed";
  }

  return "invalid-revision";
}
