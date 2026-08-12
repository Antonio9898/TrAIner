import type { APIContext, APIRoute } from "astro";
import { isSameOriginRequest } from "@/lib/request-security";
import {
  acceptTrainingPlan,
  parseTrainingPlanAcceptanceFormData,
  TrainingPlanConflictError,
  TrainingPlanInvalidRequestError,
  TrainingPlanPersistenceError,
  type TrainingPlanAcceptanceInput,
} from "@/lib/services/training-plans";
import { createClient } from "@/lib/supabase";

export const prerender = false;

const DASHBOARD_ROUTE = "/dashboard";

type AcceptanceErrorCode =
  | "request-not-allowed"
  | "supabase-not-configured"
  | "signin-required"
  | "invalid-request"
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

  let input: TrainingPlanAcceptanceInput;
  try {
    const formData = await context.request.formData();
    input = parseTrainingPlanAcceptanceFormData(formData);
  } catch {
    return redirectWithError(context, "invalid-request");
  }

  try {
    await acceptTrainingPlan(supabase, user.id, input);
  } catch (error) {
    return redirectWithError(context, mapAcceptanceError(error));
  }

  return context.redirect(`${DASHBOARD_ROUTE}?planAction=accepted`);
};

function redirectWithError(context: APIContext, code: AcceptanceErrorCode) {
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

function mapAcceptanceError(error: unknown): AcceptanceErrorCode {
  if (error instanceof TrainingPlanInvalidRequestError) {
    return "invalid-request";
  }

  if (error instanceof TrainingPlanConflictError) {
    return "plan-conflict";
  }

  if (error instanceof TrainingPlanPersistenceError) {
    return "save-failed";
  }

  return "save-failed";
}
