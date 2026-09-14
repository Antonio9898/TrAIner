import type { APIRoute } from "astro";
import { z } from "zod";
import { isSameOriginRequest } from "@/lib/request-security";
import { readLatestTrainingIntake, readTrainingIntake } from "@/lib/services/training-intakes";
import { generateDraftTrainingPlanForIntake } from "@/lib/services/training-plans";
import {
  PlanOperationError,
  planErrorResponse,
  planFailureResponse,
  planSavedResponse,
  wantsPlanJson,
} from "@/lib/plan-operation";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  if (!isSameOriginRequest(context.request)) return planErrorResponse(context, "request-not-allowed");
  const { planSupabase: supabase, planOperation: operation, user } = context.locals;
  if (!supabase || !operation) return planErrorResponse(context, "dependency-unavailable");
  if (!user) return planErrorResponse(context, "signin-required");

  try {
    let intakeId: string | undefined;
    const contentType = context.request.headers.get("Content-Type") ?? "";
    if (
      wantsPlanJson(context.request) ||
      /^(multipart\/form-data|application\/x-www-form-urlencoded)(;|$)/i.test(contentType)
    ) {
      let formData: FormData;
      try {
        formData = await operation.run("read", () => context.request.formData());
      } catch (error) {
        if (error instanceof PlanOperationError) throw error;
        throw new PlanOperationError("invalid-request");
      }
      const value = formData.get("intakeId");
      if (value !== null || wantsPlanJson(context.request)) {
        const parsed = z.uuid().safeParse(value);
        if (!parsed.success || formData.getAll("intakeId").length !== 1) {
          return planErrorResponse(context, "invalid-request");
        }
        intakeId = parsed.data;
      }
    }

    const intake = await operation.run("read", () =>
      intakeId ? readTrainingIntake(supabase, user.id, intakeId) : readLatestTrainingIntake(supabase, user.id),
    );
    operation.assertActive();
    if (!intake) return planErrorResponse(context, "missing-intake");

    operation.assertActive();
    const plan = await generateDraftTrainingPlanForIntake(supabase, user.id, intake, operation);
    return planSavedResponse(context, plan, "generated");
  } catch (error) {
    return planFailureResponse(context, error);
  }
};
