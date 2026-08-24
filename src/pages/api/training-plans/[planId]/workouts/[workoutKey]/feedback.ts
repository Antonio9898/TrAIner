import type { APIContext, APIRoute } from "astro";
import { isSameOriginRequest } from "@/lib/request-security";
import {
  parseWorkoutFeedbackSubmissionFormData,
  submitWorkoutFeedback,
  WorkoutFeedbackConflictError,
  WorkoutFeedbackInvalidRequestError,
  WorkoutFeedbackPersistenceError,
  WorkoutFeedbackUnavailableError,
  type WorkoutFeedbackRouteIdentity,
  type WorkoutFeedbackSubmissionInput,
} from "@/lib/services/workout-feedback";
import { createClient } from "@/lib/supabase";

export const prerender = false;

type FeedbackErrorCode = "invalid-request" | "unavailable" | "token-conflict" | "save-failed";

export const POST: APIRoute = async (context) => {
  const routeIdentity = decodeRouteIdentity(context);

  if (!isSameOriginRequest(context.request)) {
    return redirectWithError(context, routeIdentity, "invalid-request");
  }

  const supabase = createClient(context.request.headers, context.cookies);
  if (!supabase) {
    return redirectWithError(context, routeIdentity, "save-failed");
  }

  const user = context.locals.user ?? (await getAuthenticatedUser(supabase));
  if (!user) {
    return redirectWithError(context, routeIdentity, "unavailable");
  }

  if (!routeIdentity) {
    return redirectWithError(context, routeIdentity, "invalid-request");
  }

  let input: WorkoutFeedbackSubmissionInput;
  try {
    const formData = await context.request.formData();
    input = parseWorkoutFeedbackSubmissionFormData(routeIdentity, formData);
  } catch {
    return redirectWithError(context, routeIdentity, "invalid-request");
  }

  try {
    await submitWorkoutFeedback(supabase, input);
  } catch (error) {
    return redirectWithError(context, routeIdentity, mapFeedbackError(error));
  }

  return context.redirect(`${feedbackPageRoute(routeIdentity)}?feedbackAction=saved#feedback-history`);
};

function decodeRouteIdentity(context: APIContext): WorkoutFeedbackRouteIdentity | null {
  const planId = decodeRouteParam(context.params.planId);
  const workoutKey = decodeRouteParam(context.params.workoutKey);

  if (planId === null || workoutKey === null) {
    return null;
  }

  return { planId, workoutKey };
}

function decodeRouteParam(value: string | undefined): string | null {
  if (value === undefined) {
    return null;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function redirectWithError(
  context: APIContext,
  routeIdentity: WorkoutFeedbackRouteIdentity | null,
  code: FeedbackErrorCode,
) {
  const destination = routeIdentity ? feedbackPageRoute(routeIdentity) : "/dashboard";
  return context.redirect(`${destination}?feedbackError=${code}`);
}

function feedbackPageRoute({ planId, workoutKey }: WorkoutFeedbackRouteIdentity): string {
  return `/dashboard/plans/${encodeURIComponent(planId)}/workouts/${encodeURIComponent(workoutKey)}/feedback`;
}

async function getAuthenticatedUser(supabase: NonNullable<ReturnType<typeof createClient>>) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return null;
  return user;
}

function mapFeedbackError(error: unknown): FeedbackErrorCode {
  if (error instanceof WorkoutFeedbackInvalidRequestError) {
    return "invalid-request";
  }

  if (error instanceof WorkoutFeedbackUnavailableError) {
    return "unavailable";
  }

  if (error instanceof WorkoutFeedbackConflictError) {
    return "token-conflict";
  }

  if (error instanceof WorkoutFeedbackPersistenceError) {
    return "save-failed";
  }

  return "save-failed";
}
