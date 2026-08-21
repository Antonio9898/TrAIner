globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_D6sliZai.mjs";
import { C as maybeRenderHead, a6 as addAttribute, G as renderSlot, V as renderTemplate, by as renderHead, F as Fragment } from "./runtime_GlVtDbC7.mjs";
import { r as renderComponent } from "./worker-entry_BgfgFATI.mjs";
import { S as SUPABASE_URL, b as SUPABASE_KEY } from "./server_DIuWeoOc.mjs";
const $$Banner = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Banner;
  const { variant = "info" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["banner", `banner--${variant}`], "class:list")}${addAttribute(variant === "error" ? "alert" : "status", "role")} data-astro-cid-kggsjsm4> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "/Users/antek/projekty/TrAIner/src/components/Banner.astro", void 0);
const configStatuses = [
  {
    name: "Supabase",
    configured: Boolean(SUPABASE_URL && SUPABASE_KEY),
    message: "Supabase nie jest skonfigurowany — funkcje uwierzytelniania są wyłączone.",
    docsUrl: "https://github.com/przeprogramowani/10x-astro-starter#supabase-configuration",
    docsLabel: "Zobacz instrukcję konfiguracji"
  }
];
const missingConfigs = configStatuses.filter((s) => !s.configured);
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { title = "10x Astro Starter" } = Astro2.props;
  return renderTemplate`<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/png" href="/favicon.png"><title>${title}</title>${renderHead()}</head> <body data-astro-cid-sckkx6r4> ${missingConfigs.map((cfg) => renderTemplate`${renderComponent($$result, "Banner", $$Banner, { "variant": "error", "data-astro-cid-sckkx6r4": true }, { "default": ($$result2) => renderTemplate` <strong data-astro-cid-sckkx6r4>Uwaga:</strong> ${cfg.message}${cfg.docsUrl && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-sckkx6r4": true }, { "default": ($$result3) => renderTemplate`${" "}<a${addAttribute(cfg.docsUrl, "href")} target="_blank" rel="noopener noreferrer" data-astro-cid-sckkx6r4> ${cfg.docsLabel ?? "Dokumentacja"} </a>
.
` })}`}` })}`)} ${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "/Users/antek/projekty/TrAIner/src/layouts/Layout.astro", void 0);
export {
  $$Layout as $
};
