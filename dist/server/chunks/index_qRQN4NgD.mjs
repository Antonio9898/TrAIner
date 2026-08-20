globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_D6sliZai.mjs";
import { C as maybeRenderHead, V as renderTemplate } from "./runtime_GlVtDbC7.mjs";
import { c as createClient } from "./index_QdA31lQC.mjs";
import { S as SUPABASE_URL, b as SUPABASE_KEY } from "./server_DIuWeoOc.mjs";
if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_KEY are required");
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data, error } = await supabase.from("todos").select("id,name").overrideTypes();
  const todos = data ?? [];
  return renderTemplate`${error ? renderTemplate`${maybeRenderHead()}<p>${error.message}</p>` : renderTemplate`<ul>${todos.map((entry) => renderTemplate`<li>${entry.name}</li>`)}</ul>`}`;
}, "/home/antek/TrAIner/src/pages/index.astro", void 0);
const $$file = "/home/antek/TrAIner/src/pages/index.astro";
const $$url = "";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
