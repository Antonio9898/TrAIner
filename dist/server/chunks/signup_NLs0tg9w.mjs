globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_D6sliZai.mjs";
import { V as renderTemplate, C as maybeRenderHead } from "./runtime_GlVtDbC7.mjs";
import { a as reactExports, r as renderComponent } from "./worker-entry_DEz_L5c8.mjs";
import { $ as $$Layout } from "./Layout_BRge9u11.mjs";
import { c as createLucideIcon, j as jsxRuntimeExports } from "./button_BQAh045K.mjs";
import { F as FormField, M as Mail, P as PasswordToggle, L as Lock } from "./PasswordToggle_mrkXIPrW.mjs";
import { S as ServerError, a as SubmitButton } from "./ServerError_DJBSbsUg.mjs";
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
const MIN_PASSWORD_LENGTH = 6;
function SignUpForm({ serverError }) {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = reactExports.useState(false);
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
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    if (!confirmPassword) {
      next.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match";
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
  const passwordHint = !errors.password && password.length > 0 && password.length < MIN_PASSWORD_LENGTH ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-blue-100/50", children: [
    MIN_PASSWORD_LENGTH - password.length,
    " more character",
    MIN_PASSWORD_LENGTH - password.length !== 1 ? "s" : "",
    " needed"
  ] }) : void 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { method: "POST", action: "/api/auth/signup", className: "space-y-4", onSubmit: handleSubmit, noValidate: true, children: [
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
        placeholder: "Min. 6 characters",
        error: errors.password,
        hint: passwordHint,
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormField,
      {
        id: "confirmPassword",
        name: "confirmPassword",
        label: "Confirm password",
        type: showConfirmPassword ? "text" : "password",
        value: confirmPassword,
        onChange: (v) => {
          setConfirmPassword(v);
          clearError("confirmPassword");
        },
        placeholder: "Re-enter your password",
        error: errors.confirmPassword,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-4" }),
        endContent: /* @__PURE__ */ jsxRuntimeExports.jsx(
          PasswordToggle,
          {
            visible: showConfirmPassword,
            onToggle: () => {
              setShowConfirmPassword(!showConfirmPassword);
            }
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ServerError, { message: serverError }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SubmitButton, { pendingText: "Creating account...", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-4" }), children: "Create account" })
  ] });
}
const $$Signup = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Signup;
  const error = Astro2.url.searchParams.get("error");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sign up" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-cosmic flex min-h-screen items-center justify-center p-4"> <div class="w-full max-w-sm rounded-2xl border border-white/10 bg-white/10 p-8 text-white backdrop-blur-xl"> <h1 class="mb-6 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-center text-2xl font-bold text-transparent">
Sign up
</h1> ${renderComponent($$result2, "SignUpForm", SignUpForm, { "serverError": error, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/auth/SignUpForm", "client:component-export": "default" })} <p class="mt-4 text-center text-sm text-blue-100/60">
Already have an account? <a href="/auth/signin" class="text-purple-300 hover:underline">Sign in</a> </p> </div> </div> ` })}`;
}, "/home/antek/TrAIner/src/pages/auth/signup.astro", void 0);
const $$file = "/home/antek/TrAIner/src/pages/auth/signup.astro";
const $$url = "/auth/signup";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Signup,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
