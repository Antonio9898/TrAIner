globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createClient } from "./supabase_CLmnuVoO.mjs";
const prerender = false;
function getSafeNextPath(next) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  return next;
}
const GET = async (context) => {
  const tokenHash = context.url.searchParams.get("token_hash");
  const type = context.url.searchParams.get("type");
  const next = getSafeNextPath(context.url.searchParams.get("next"));
  if (!tokenHash || !type) {
    return context.redirect(`/auth/signin?error=${encodeURIComponent("Invalid confirmation link")}`);
  }
  const supabase = createClient(context.request.headers, context.cookies);
  if (!supabase) {
    return context.redirect(`/auth/signin?error=${encodeURIComponent("Supabase is not configured")}`);
  }
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type
  });
  if (error) {
    return context.redirect(`/auth/signin?error=${encodeURIComponent(error.message)}`);
  }
  return context.redirect(next);
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
