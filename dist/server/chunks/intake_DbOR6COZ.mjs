globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_D6sliZai.mjs";
import { V as renderTemplate, C as maybeRenderHead } from "./runtime_GlVtDbC7.mjs";
import { a as reactExports, r as renderComponent } from "./worker-entry_BgfgFATI.mjs";
import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, C as CircleAlert } from "./button_CY8vI-lv.mjs";
import { S as ServerError, a as SubmitButton } from "./ServerError_D-R1WWoQ.mjs";
import { H as HeartPulse } from "./heart-pulse_BzErN1rT.mjs";
import { $ as $$Layout } from "./Layout_BL_q2_6n.mjs";
import { a as readLatestEditableTrainingIntake } from "./training-intakes_CFXRwAHz.mjs";
import { c as createClient } from "./supabase_CLmnuVoO.mjs";
const __iconNode$4 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$4);
const __iconNode$3 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode$1);
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
];
const Target = createLucideIcon("target", __iconNode);
const NO_KNOWN_CONSTRAINTS = "no known constraints";
const EXPERIENCE_OPTIONS = [
  {
    value: "beginner",
    label: "Beginner",
    description: "New to structured strength training."
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Comfortable with common lifts and weekly training."
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Experienced with progression and higher training volume."
  }
];
const fieldBase = "w-full rounded-lg border bg-white/10 px-3 py-2 text-white placeholder-white/40 transition-colors focus:outline-none focus:ring-2";
function GoalAndConstraintsForm({ initialIntake, serverError }) {
  const [goal, setGoal] = reactExports.useState(initialIntake?.goal ?? "");
  const [experienceLevel, setExperienceLevel] = reactExports.useState(
    initialIntake?.experienceLevel ?? ""
  );
  const [healthConstraints, setHealthConstraints] = reactExports.useState(initialIntake?.healthConstraints ?? "");
  const [notes, setNotes] = reactExports.useState(initialIntake?.notes ?? "");
  const [errors, setErrors] = reactExports.useState({});
  function validate() {
    const next = {};
    if (!goal.trim()) {
      next.goal = "Training goal is required";
    }
    if (!EXPERIENCE_OPTIONS.some((option) => option.value === experienceLevel)) {
      next.experienceLevel = "Choose an experience level";
    }
    if (!healthConstraints.trim()) {
      next.healthConstraints = "Health constraints are required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }
  function clearError(field) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: void 0 }));
  }
  function handleSubmit(event) {
    if (!validate()) {
      event.preventDefault();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { method: "POST", action: "/api/training-intakes", className: "space-y-5", onSubmit: handleSubmit, noValidate: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TextAreaField,
      {
        id: "goal",
        label: "Training goal",
        value: goal,
        onChange: (value) => {
          setGoal(value);
          clearError("goal");
        },
        placeholder: "Build strength for three full-body sessions per week",
        error: errors.goal,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "size-4" }),
        rows: 4
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("legend", { className: "mb-2 flex items-center gap-2 text-sm text-blue-100/80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-4 text-white/45" }),
        "Experience level"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-3", children: EXPERIENCE_OPTIONS.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          className: cn(
            "flex min-h-28 cursor-pointer flex-col justify-between rounded-lg border px-3 py-3 transition-colors",
            experienceLevel === option.value ? "border-cyan-300/70 bg-cyan-400/15 text-white" : "border-white/15 bg-white/5 text-blue-100/80 hover:border-white/30 hover:bg-white/10"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: option.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "mt-0.5 size-4 accent-cyan-300",
                  type: "radio",
                  name: "experienceLevel",
                  value: option.value,
                  checked: experienceLevel === option.value,
                  onChange: () => {
                    setExperienceLevel(option.value);
                    clearError("experienceLevel");
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-3 text-xs leading-5 text-blue-100/65", children: option.description })
          ]
        },
        option.value
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.experienceLevel })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TextAreaField,
        {
          id: "healthConstraints",
          label: "Health constraints",
          value: healthConstraints,
          onChange: (value) => {
            setHealthConstraints(value);
            clearError("healthConstraints");
          },
          placeholder: "Do you have injuries, pain, health constraints, or movement limitations that should shape your training plan? Add anything relevant in your own words.",
          error: errors.healthConstraints,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(HeartPulse, { className: "size-4" }),
          rows: 5,
          hint: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs leading-5 text-blue-100/60", children: "Examples: knee pain during squats, recovering shoulder, avoid overhead pressing, doctor told me to avoid high-impact exercise." })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "mt-3 inline-flex items-center gap-2 rounded-lg border border-emerald-300/40 bg-emerald-400/10 px-3 py-2 text-sm font-medium text-emerald-100 transition-colors hover:bg-emerald-400/20",
          onClick: () => {
            setHealthConstraints(NO_KNOWN_CONSTRAINTS);
            clearError("healthConstraints");
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }),
            "No known constraints"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TextAreaField,
      {
        id: "notes",
        label: "Optional notes",
        value: notes,
        onChange: setNotes,
        placeholder: "Schedule, equipment, exercise preferences, or anything else that helps shape the plan",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4" }),
        rows: 4
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-50", children: "TrAIner can help adapt a training plan to the constraints you provide, but it does not diagnose injuries or replace advice from a doctor, physiotherapist, or medical trainer. If you have pain, symptoms, a medical condition, or uncertainty about training, consult a qualified professional." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ServerError, { message: serverError }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SubmitButton, { pendingText: "Saving intake...", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" }), children: "Save intake" })
  ] });
}
function TextAreaField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  icon,
  rows,
  error,
  hint,
  readOnly = false
}) {
  const textareaName = name === void 0 ? id : name;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: id, className: "mb-1 flex items-center gap-2 text-sm text-blue-100/80", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/45", children: icon }),
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        id,
        name: textareaName ?? void 0,
        value,
        onChange: (event) => {
          onChange(event.target.value);
        },
        placeholder,
        rows,
        readOnly,
        className: cn(
          fieldBase,
          "resize-y leading-6 read-only:cursor-default read-only:text-emerald-50",
          error ? "border-red-400/60 focus:ring-red-400" : "border-white/20 focus:ring-cyan-300"
        )
      }
    ),
    error ? /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: error }) : hint
  ] });
}
function FieldError({ message }) {
  if (!message) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 flex items-center gap-1 text-xs text-red-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-3 shrink-0" }),
    message
  ] });
}
const $$Intake = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Intake;
  const { user } = Astro2.locals;
  let latestEditableIntake = null;
  let loadError = null;
  const supabase = createClient(Astro2.request.headers, Astro2.cookies);
  if (supabase && user) {
    try {
      latestEditableIntake = await readLatestEditableTrainingIntake(supabase, user.id);
    } catch {
      loadError = "We could not load your current intake. You can still submit the form.";
    }
  }
  const queryError = Astro2.url.searchParams.get("error");
  const safeQueryError = queryError && queryError.length <= 160 ? queryError : queryError ? "Something went wrong. Please try again." : null;
  const serverError = safeQueryError ?? loadError;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Training intake" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="bg-cosmic min-h-screen px-4 py-8 text-white"> <div class="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-5"> <a href="/dashboard" class="w-fit text-sm text-cyan-200 transition-colors hover:text-cyan-100 hover:underline">
Back to dashboard
</a> <section class="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-8"> <div class="mb-6"> <p class="mb-2 text-sm text-blue-100/65">${user?.email}</p> <h1 class="text-3xl font-bold text-white">Training intake</h1> <p class="mt-2 max-w-2xl text-sm leading-6 text-blue-100/75">
Share the goal, experience level, and constraints that should shape your first training plan.
</p> </div> ${renderComponent($$result2, "GoalAndConstraintsForm", GoalAndConstraintsForm, { "initialIntake": latestEditableIntake, "serverError": serverError, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/intake/GoalAndConstraintsForm", "client:component-export": "default" })} </section> </div> </main> ` })}`;
}, "/Users/antek/projekty/TrAIner/src/pages/dashboard/intake.astro", void 0);
const $$file = "/Users/antek/projekty/TrAIner/src/pages/dashboard/intake.astro";
const $$url = "/dashboard/intake";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Intake,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
