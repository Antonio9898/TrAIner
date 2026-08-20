globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createClient } from "./supabase_CLmnuVoO.mjs";
const POST = async (context) => {
  const form = await context.request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const supabase = createClient(context.request.headers, context.cookies);
  if (!supabase) {
    return context.redirect(`/auth/signin?error=${encodeURIComponent("Supabase is not configured")}`);
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return context.redirect(`/auth/signin?error=${encodeURIComponent(error.message)}`);
  }
  return context.redirect("/dashboard");
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
