globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, C as CircleAlert } from "./button_CY8vI-lv.mjs";
const __iconNode$3 = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$2);
const __iconNode$1 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$1);
const __iconNode = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode);
const inputBase = "w-full rounded-lg bg-white/10 border px-3 py-2 pl-10 text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-colors";
function FormField({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  hint,
  icon,
  endContent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: id, className: "mb-1 block text-sm text-blue-100/80", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id,
          name: name ?? id,
          type,
          value,
          onChange: (e) => {
            onChange(e.target.value);
          },
          placeholder,
          className: cn(
            inputBase,
            error ? "border-red-400/60 focus:ring-red-400" : "border-white/20 focus:ring-purple-400"
          )
        }
      ),
      endContent
    ] }),
    error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 flex items-center gap-1 text-xs text-red-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-3" }),
      error
    ] }) : hint
  ] });
}
function PasswordToggle({ visible, onToggle }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: onToggle,
      className: "absolute top-1/2 right-3 -translate-y-1/2 text-white/40 transition-colors hover:text-white/70",
      "aria-label": visible ? "Hide password" : "Show password",
      children: visible ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" })
    }
  );
}
export {
  FormField as F,
  Lock as L,
  Mail as M,
  PasswordToggle as P
};
