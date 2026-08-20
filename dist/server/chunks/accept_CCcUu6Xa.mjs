globalThis.process ??= {};
globalThis.process.env ??= {};
import { i as isSameOriginRequest } from "./request-security_Cav93J_P.mjs";
import { p as parseTrainingPlanAcceptanceFormData, a as acceptTrainingPlan, T as TrainingPlanInvalidRequestError, b as TrainingPlanConflictError, c as TrainingPlanPersistenceError } from "./training-plans_C07szfLP.mjs";
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
function mapAcceptanceError(error) {
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
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
