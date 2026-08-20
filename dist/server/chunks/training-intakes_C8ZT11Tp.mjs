globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createClient } from "./supabase_CLmnuVoO.mjs";
import { p as parseTrainingIntakeFormData, s as saveTrainingIntake } from "./training-intakes_CFXRwAHz.mjs";
const prerender = false;
const INTAKE_ROUTE = "/dashboard/intake";
const POST = async (context) => {
  const supabase = createClient(context.request.headers, context.cookies);
  if (!supabase) {
    return redirectWithError(context, "Supabase is not configured");
  }
  const user = context.locals.user ?? await getAuthenticatedUser(supabase);
  if (!user) {
    return redirectWithError(context, "Please sign in to save your intake");
  }
  let input;
  try {
    const formData = await context.request.formData();
    input = parseTrainingIntakeFormData(formData);
  } catch {
    return redirectWithError(context, "Please complete all required intake fields");
  }
  try {
    await saveTrainingIntake(supabase, user.id, input);
  } catch {
    return redirectWithError(context, "We could not save your intake. Please try again");
  }
  return context.redirect("/dashboard?saved=intake");
};
function redirectWithError(context, message) {
  return context.redirect(`${INTAKE_ROUTE}?error=${encodeURIComponent(message)}`);
}
async function getAuthenticatedUser(supabase) {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();
  if (error) return null;
  return user;
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
