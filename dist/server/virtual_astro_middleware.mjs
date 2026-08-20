globalThis.process ??= {};
globalThis.process.env ??= {};
import { e as defineMiddleware, ah as sequence } from "./chunks/runtime_GlVtDbC7.mjs";
import { c as createClient } from "./chunks/supabase_CLmnuVoO.mjs";
const PROTECTED_ROUTES = ["/dashboard"];
const onRequest$1 = defineMiddleware(async (context, next) => {
  const supabase = createClient(context.request.headers, context.cookies);
  if (supabase) {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    context.locals.user = user ?? null;
  } else {
    context.locals.user = null;
  }
  if (PROTECTED_ROUTES.some((route) => context.url.pathname.startsWith(route))) {
    if (!context.locals.user) {
      return context.redirect("/auth/signin");
    }
  }
  return next();
});
const onRequest = sequence(
  onRequest$1
);
export {
  onRequest
};
