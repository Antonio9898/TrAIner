globalThis.process ??= {};
globalThis.process.env ??= {};
import { f as parseTrainingPlanRevisionFormData, r as reviseTrainingPlan, T as TrainingPlanInvalidRequestError, O as OpenRouterConfigurationError, d as OpenRouterGenerationError, e as TrainingPlanGenerationValidationError, b as TrainingPlanConflictError, c as TrainingPlanPersistenceError } from "./training-plans_C07szfLP.mjs";
import { i as isSameOriginRequest } from "./request-security_Cav93J_P.mjs";
import { c as createClient } from "./supabase_CLmnuVoO.mjs";
const prerender = false;
const DASHBOARD_ROUTE = "/dashboard";
const POST = async (context) => {
  if (!isSameOriginRequest(context.request)) {
    return redirectWithError(context, "request-not-allowed");
  }
  const supabase = createClient(context.request.headers, context.cookies);
  if (!supabase) {
    return redirectWithError(context, "supabase-not-configured");
  }
  const user = context.locals.user ?? await getAuthenticatedUser(supabase);
  if (!user) {
    return redirectWithError(context, "signin-required");
  }
  let input;
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
function redirectWithError(context, code) {
  return context.redirect(`${DASHBOARD_ROUTE}?planError=${code}`);
}
async function getAuthenticatedUser(supabase) {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}
function mapRevisionError(error) {
  if (error instanceof TrainingPlanInvalidRequestError) {
    return "invalid-request";
  }
  if (error instanceof OpenRouterConfigurationError) {
    return "openrouter-not-configured";
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
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
