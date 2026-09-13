import type { APIRoute } from "astro";
import { isSameOriginRequest } from "@/lib/request-security";
import { parseTrainingPlanRevisionFormData, reviseTrainingPlan } from "@/lib/services/training-plans";
import { PlanOperationError, planErrorResponse, planFailureResponse, planSavedResponse } from "@/lib/plan-operation";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  if (!isSameOriginRequest(context.request)) return planErrorResponse(context, "request-not-allowed");
  const { planSupabase: supabase, planOperation: operation, user } = context.locals;
  if (!supabase || !operation) return planErrorResponse(context, "dependency-unavailable");
  if (!user) return planErrorResponse(context, "signin-required");

  try {
    let formData: FormData;
    try {
      formData = await operation.run("read", () => context.request.formData());
    } catch (error) {
      if (error instanceof PlanOperationError) throw error;
      throw new PlanOperationError("invalid-request");
    }
    const input = parseTrainingPlanRevisionFormData(formData);
    const plan = await reviseTrainingPlan(supabase, user.id, input, operation);
    return planSavedResponse(context, plan, "revised");
  } catch (error) {
    return planFailureResponse(context, error);
  }
};
