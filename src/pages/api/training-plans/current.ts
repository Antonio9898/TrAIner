import type { APIRoute } from "astro";
import { z } from "zod";
import { planErrorResponse, planFailureResponse, planJson } from "@/lib/plan-operation";
import type { CurrentTrainingPlanResponse } from "@/types";

export const prerender = false;

const querySchema = z.union([z.object({ planId: z.uuid() }).strict(), z.object({ intakeId: z.uuid() }).strict()]);
const metadataSchema = z.object({
  id: z.uuid(),
  intake_id: z.uuid(),
  updated_at: z.iso.datetime({ offset: true }),
  revision_count: z.number().int().nonnegative(),
  status: z.enum(["draft", "accepted"]),
});

export const GET: APIRoute = async (context) => {
  const { planSupabase: supabase, planOperation: operation, user } = context.locals;
  if (!supabase || !operation) return planErrorResponse(context, "dependency-unavailable");
  if (!user) return planErrorResponse(context, "signin-required");
  const entries = [...context.url.searchParams.entries()];
  const parsed = querySchema.safeParse(Object.fromEntries(entries));
  if (entries.length !== 1 || !parsed.success) return planErrorResponse(context, "invalid-request");

  try {
    const target = parsed.data;
    const { data, error } = await supabase
      .from("training_plans")
      .select("id,intake_id,updated_at,revision_count,status")
      .eq("user_id", user.id)
      .eq("planId" in target ? "id" : "intake_id", "planId" in target ? target.planId : target.intakeId)
      .limit(1)
      .maybeSingle();
    operation.assertActive();
    if (error) return planErrorResponse(context, "dependency-unavailable");
    const row = data ? metadataSchema.parse(data) : null;
    const body: CurrentTrainingPlanResponse = {
      plan: row
        ? {
            id: row.id,
            intakeId: row.intake_id,
            updatedAt: row.updated_at,
            revisionCount: row.revision_count,
            status: row.status,
          }
        : null,
      requestId: operation.requestId,
    };
    operation.resultCode = "checked";
    return planJson(body);
  } catch (error) {
    return planFailureResponse(context, error);
  }
};
