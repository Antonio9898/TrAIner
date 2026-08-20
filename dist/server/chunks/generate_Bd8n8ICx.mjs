globalThis.process ??= {};
globalThis.process.env ??= {};
import { g as generateDraftTrainingPlanForIntake, O as OpenRouterConfigurationError, d as OpenRouterGenerationError, e as TrainingPlanGenerationValidationError, c as TrainingPlanPersistenceError } from "./training-plans_C07szfLP.mjs";
import { i as isSameOriginRequest } from "./request-security_Cav93J_P.mjs";
import { r as readLatestTrainingIntake, i as isTrainingIntakeEditable } from "./training-intakes_CFXRwAHz.mjs";
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
  let latestIntake = null;
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
  return context.redirect(`${DASHBOARD_ROUTE}?planAction=generated`);
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
function mapGenerationError(error) {
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
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
