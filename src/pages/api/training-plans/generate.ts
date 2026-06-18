import type { APIContext, APIRoute } from "astro";
import { OpenRouterConfigurationError, OpenRouterGenerationError } from "@/lib/openrouter";
import { isTrainingIntakeEditable, readLatestTrainingIntake } from "@/lib/services/training-intakes";
import {
  generateDraftTrainingPlanForIntake,
  TrainingPlanGenerationValidationError,
  TrainingPlanPersistenceError,
} from "@/lib/services/training-plans";
import { createClient } from "@/lib/supabase";
import type { TrainingIntake } from "@/types";

export const prerender = false;

const DASHBOARD_ROUTE = "/dashboard";

type GenerationErrorCode =
  | "supabase-not-configured"
  | "signin-required"
  | "missing-intake"
  | "intake-already-planned"
  | "openrouter-not-configured"
  | "invalid-generation"
  | "save-failed";

export const POST: APIRoute = async (context) => {
  const supabase = createClient(context.request.headers, context.cookies);
  if (!supabase) {
    return redirectWithError(context, "supabase-not-configured");
  }

  const user = context.locals.user ?? (await getAuthenticatedUser(supabase));
  if (!user) {
    return redirectWithError(context, "signin-required");
  }

  let latestIntake: TrainingIntake | null = null;
  let latestIntakeEditable = false;

  try {
    latestIntake = await readLatestTrainingIntake(supabase, user.id);
    latestIntakeEditable = latestIntake ? await isTrainingIntakeEditable(supabase, user.id, latestIntake.id) : false;
  } catch {
    return redirectWithError(context, "save-failed");
  }

  if (!latestIntake) {
    return redirectWithError(context, "missing-intake");
  }

  if (!latestIntakeEditable) {
    return redirectWithError(context, "intake-already-planned");
  }

  try {
    await generateDraftTrainingPlanForIntake(supabase, user.id, latestIntake);
  } catch (error) {
    return redirectWithError(context, mapGenerationError(error));
  }

  return context.redirect(`${DASHBOARD_ROUTE}?generated=plan`);
};

function redirectWithError(context: APIContext, code: GenerationErrorCode) {
  return context.redirect(`${DASHBOARD_ROUTE}?error=${code}`);
}

async function getAuthenticatedUser(supabase: NonNullable<ReturnType<typeof createClient>>) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return null;
  return user;
}

function mapGenerationError(error: unknown): GenerationErrorCode {
  if (error instanceof OpenRouterConfigurationError) {
    return "openrouter-not-configured";
  }

  if (error instanceof OpenRouterGenerationError || error instanceof TrainingPlanGenerationValidationError) {
    return "invalid-generation";
  }

  if (error instanceof TrainingPlanPersistenceError) {
    return "save-failed";
  }

  return "invalid-generation";
}
