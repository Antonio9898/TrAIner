globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_D6sliZai.mjs";
import { V as renderTemplate, C as maybeRenderHead } from "./runtime_GlVtDbC7.mjs";
import { a as reactExports, r as renderComponent } from "./worker-entry_BgfgFATI.mjs";
import { $ as $$Layout } from "./Layout_BL_q2_6n.mjs";
import { c as createLucideIcon, j as jsxRuntimeExports } from "./button_CY8vI-lv.mjs";
import { F as FormField, M as Mail, P as PasswordToggle, L as Lock } from "./PasswordToggle_CcyLIyrT.mjs";
import { S as ServerError, a as SubmitButton } from "./ServerError_D-R1WWoQ.mjs";
const __iconNode = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
];
const LogIn = createLucideIcon("log-in", __iconNode);
function SignInForm({ serverError }) {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [errors, setErrors] = reactExports.useState({});
  function validate() {
    const next = {};
    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address";
    }
    if (!password) {
      next.password = "Password is required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }
  function clearError(field) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: void 0 }));
  }
  function handleSubmit(e) {
    if (!validate()) {
      e.preventDefault();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { method: "POST", action: "/api/auth/signin", className: "space-y-4", onSubmit: handleSubmit, noValidate: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormField,
      {
        id: "email",
        type: "email",
        label: "Email",
        value: email,
        onChange: (v) => {
          setEmail(v);
          clearError("email");
        },
        placeholder: "you@example.com",
        error: errors.email,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-4" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormField,
      {
        id: "password",
        label: "Password",
        type: showPassword ? "text" : "password",
        value: password,
        onChange: (v) => {
          setPassword(v);
          clearError("password");
        },
        placeholder: "Your password",
        error: errors.password,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-4" }),
        endContent: /* @__PURE__ */ jsxRuntimeExports.jsx(
          PasswordToggle,
          {
            visible: showPassword,
            onToggle: () => {
              setShowPassword(!showPassword);
            }
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ServerError, { message: serverError }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SubmitButton, { pendingText: "Signing in...", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "size-4" }), children: "Sign in" })
  ] });
}
const $$Signin = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Signin;
  const error = Astro2.url.searchParams.get("error");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sign in" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-cosmic flex min-h-screen items-center justify-center p-4"> <div class="w-full max-w-sm rounded-2xl border border-white/10 bg-white/10 p-8 text-white backdrop-blur-xl"> <h1 class="mb-6 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-center text-2xl font-bold text-transparent">
Sign in
</h1> ${renderComponent($$result2, "SignInForm", SignInForm, { "serverError": error, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/auth/SignInForm", "client:component-export": "default" })} <p class="mt-4 text-center text-sm text-blue-100/60">
Don't have an account? <a href="/auth/signup" class="text-purple-300 hover:underline">Sign up</a> </p> </div> </div> ` })}`;
}, "/Users/antek/projekty/TrAIner/src/pages/auth/signin.astro", void 0);
const $$file = "/Users/antek/projekty/TrAIner/src/pages/auth/signin.astro";
const $$url = "/auth/signin";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Signin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
