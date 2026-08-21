globalThis.process ??= {};
globalThis.process.env ??= {};
import { j as jsxRuntimeExports, B as Button, C as CircleAlert } from "./button_CY8vI-lv.mjs";
import { b as requireReactDom } from "./worker-entry_BgfgFATI.mjs";
var reactDomExports = requireReactDom();
function SubmitButton({ pendingText, icon, children }) {
  const { pending } = reactDomExports.useFormStatus();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      type: "submit",
      disabled: pending,
      className: "w-full rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-500",
      children: pending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" }),
        pendingText
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
        icon,
        children
      ] })
    }
  );
}
function ServerError({ message }) {
  if (!message) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-900/30 px-3 py-2 text-sm text-red-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-4 shrink-0" }),
    message
  ] });
}
export {
  ServerError as S,
  SubmitButton as a
};
