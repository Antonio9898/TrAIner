globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_D6sliZai.mjs";
import { V as renderTemplate, C as maybeRenderHead } from "./runtime_GlVtDbC7.mjs";
import { r as renderComponent } from "./worker-entry_BgfgFATI.mjs";
import { $ as $$Layout } from "./Layout_BL_q2_6n.mjs";
const $$ConfirmEmail = createComponent(($$result, $$props, $$slots) => {
  const content = {
    emoji: "📧",
    heading: "Check your email",
    description: "We've sent a confirmation link to your email address. Click it to activate your account.",
    linkText: "Back to sign in"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": content.heading }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-cosmic flex min-h-screen items-center justify-center p-4"> <div class="w-full max-w-sm rounded-2xl border border-white/10 bg-white/10 p-8 text-center text-white backdrop-blur-xl"> <div class="mb-4 text-5xl">${content.emoji}</div> <h1 class="mb-3 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-2xl font-bold text-transparent"> ${content.heading} </h1> <p class="mb-6 text-blue-100/80">${content.description}</p> <a href="/auth/signin" class="text-sm text-purple-300 hover:underline"> ${content.linkText} </a> </div> </div> ` })}`;
}, "/Users/antek/projekty/TrAIner/src/pages/auth/confirm-email.astro", void 0);
const $$file = "/Users/antek/projekty/TrAIner/src/pages/auth/confirm-email.astro";
const $$url = "/auth/confirm-email";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$ConfirmEmail,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
