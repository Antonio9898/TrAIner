globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_D6sliZai.mjs";
import { W as createRenderInstruction, V as renderTemplate, C as maybeRenderHead, a6 as addAttribute } from "./runtime_GlVtDbC7.mjs";
import { a as reactExports, r as renderComponent } from "./worker-entry_BgfgFATI.mjs";
import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, B as Button, C as CircleAlert } from "./button_CY8vI-lv.mjs";
import { H as HeartPulse } from "./heart-pulse_BzErN1rT.mjs";
import { $ as $$Layout } from "./Layout_BL_q2_6n.mjs";
import { r as readLatestTrainingIntake, i as isTrainingIntakeEditable } from "./training-intakes_CFXRwAHz.mjs";
import { h as readTrainingPlanForIntake } from "./training-plans_C07szfLP.mjs";
import { c as createClient } from "./supabase_CLmnuVoO.mjs";
async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}<\/script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode);
const MAX_REVISION_NOTE_LENGTH = 2e3;
const fieldBase = "w-full resize-y rounded-lg border bg-white/10 px-3 py-2 text-white placeholder-white/40 transition-colors focus:outline-none focus:ring-2";
function PlanRevisionForm({
  planId,
  expectedUpdatedAt,
  initialHealthConstraints,
  accepted
}) {
  const [revisionNote, setRevisionNote] = reactExports.useState("");
  const [healthConstraints, setHealthConstraints] = reactExports.useState(initialHealthConstraints);
  const [errors, setErrors] = reactExports.useState({});
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  function clearError(field) {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: void 0 }));
  }
  function validate() {
    const next = {};
    if (!revisionNote.trim()) {
      next.revisionNote = "Describe the correction you want";
    } else if (revisionNote.trim().length > MAX_REVISION_NOTE_LENGTH) {
      next.revisionNote = `Correction requests must be ${MAX_REVISION_NOTE_LENGTH.toLocaleString()} characters or fewer`;
    }
    if (!healthConstraints.trim()) {
      next.healthConstraints = "Health constraints are required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }
  function handleSubmit(event) {
    if (!validate()) {
      event.preventDefault();
      return;
    }
    setIsSubmitting(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { method: "POST", action: "/api/training-plans/revise", className: "space-y-5", onSubmit: handleSubmit, noValidate: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "hidden", name: "planId", value: planId }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "hidden", name: "expectedUpdatedAt", value: expectedUpdatedAt }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "revisionNote", className: "mb-1 flex items-center gap-2 text-sm font-medium text-blue-100/85", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-4 text-white/45" }),
        "What should change?"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          id: "revisionNote",
          name: "revisionNote",
          value: revisionNote,
          onChange: (event) => {
            setRevisionNote(event.target.value);
            clearError("revisionNote");
          },
          rows: 5,
          maxLength: MAX_REVISION_NOTE_LENGTH + 1,
          placeholder: "For example: reduce lower-body volume and replace movements that aggravate my knee",
          "aria-invalid": Boolean(errors.revisionNote),
          "aria-describedby": errors.revisionNote ? "revisionNote-error" : "revisionNote-hint",
          className: cn(
            fieldBase,
            errors.revisionNote ? "border-red-400/60 focus:ring-red-400" : "border-white/20 focus:ring-cyan-300"
          )
        }
      ),
      errors.revisionNote ? /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { id: "revisionNote-error", message: errors.revisionNote }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { id: "revisionNote-hint", className: "mt-1 text-xs text-blue-100/60", children: [
        revisionNote.length.toLocaleString(),
        " / ",
        MAX_REVISION_NOTE_LENGTH.toLocaleString(),
        " characters"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          htmlFor: "healthConstraints",
          className: "mb-1 flex items-center gap-2 text-sm font-medium text-blue-100/85",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HeartPulse, { className: "size-4 text-white/45" }),
            "Health constraints"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          id: "healthConstraints",
          name: "healthConstraints",
          value: healthConstraints,
          onChange: (event) => {
            setHealthConstraints(event.target.value);
            clearError("healthConstraints");
          },
          rows: 5,
          placeholder: "Describe injuries, pain, health constraints, or movement limitations that should shape the revision",
          "aria-invalid": Boolean(errors.healthConstraints),
          "aria-describedby": errors.healthConstraints ? "healthConstraints-error" : "healthConstraints-hint",
          className: cn(
            fieldBase,
            errors.healthConstraints ? "border-red-400/60 focus:ring-red-400" : "border-white/20 focus:ring-cyan-300"
          )
        }
      ),
      errors.healthConstraints ? /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { id: "healthConstraints-error", message: errors.healthConstraints }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "healthConstraints-hint", className: "mt-1 text-xs leading-5 text-blue-100/60", children: "Update this durable context if pain, symptoms, limitations, or professional guidance changed." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-lg border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-50/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Revisions still respect the constraints you provide. TrAIner does not diagnose injuries or replace a doctor, physiotherapist, or medical trainer." }),
      accepted && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "A successful revision will reopen this accepted plan as a draft for another review." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Earlier workout feedback stays attached and may describe content from an older version of this plan." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "submit",
        disabled: isSubmitting,
        className: "w-full rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-slate-950 transition-colors hover:bg-cyan-200",
        children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" }),
          "Revising plan..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-4" }),
          "Request complete revision"
        ] })
      }
    )
  ] });
}
function FieldError({ id, message }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { id, className: "mt-1 flex items-center gap-1 text-xs text-red-300", role: "alert", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-3 shrink-0" }),
    message
  ] });
}
const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Dashboard;
  const { user } = Astro2.locals;
  const experienceLabels = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced"
  };
  let latestIntake = null;
  let latestIntakeEditable = false;
  let storedPlan = null;
  let loadError = null;
  const supabase = createClient(Astro2.request.headers, Astro2.cookies);
  if (supabase && user) {
    try {
      latestIntake = await readLatestTrainingIntake(supabase, user.id);
      if (latestIntake) {
        storedPlan = await readTrainingPlanForIntake(supabase, user.id, latestIntake.id);
        latestIntakeEditable = storedPlan ? false : await isTrainingIntakeEditable(supabase, user.id, latestIntake.id);
      }
    } catch {
      loadError = "We could not load your dashboard summary.";
    }
  } else if (!supabase) {
    loadError = "Supabase is not configured, so your intake summary cannot be loaded.";
  }
  const savedIntake = Astro2.url.searchParams.get("saved") === "intake";
  const legacyGeneratedPlan = Astro2.url.searchParams.get("generated") === "plan";
  const legacyGenerationError = Astro2.url.searchParams.get("error");
  const planAction = Astro2.url.searchParams.get("planAction") ?? (legacyGeneratedPlan ? "generated" : null);
  const planErrorCode = Astro2.url.searchParams.get("planError") ?? legacyGenerationError;
  const planActionMessages = {
    generated: storedPlan ? "Plan generated. Your draft is ready below." : "Plan generation finished. Refresh the dashboard if the draft is not visible.",
    revised: "Plan revised. Review the complete replacement draft below before accepting it.",
    accepted: "Plan accepted. This is now the plan you intend to follow."
  };
  const planErrorMessages = {
    "request-not-allowed": "We could not verify this request. Please try again from the dashboard.",
    "supabase-not-configured": "Plan actions are unavailable because Supabase is not configured.",
    "signin-required": "Please sign in before changing a plan.",
    "missing-intake": "Save an intake before generating a plan.",
    "intake-already-planned": "This intake already has a plan.",
    "openrouter-not-configured": "Plan generation is not configured yet.",
    "invalid-generation": "We could not generate a valid plan. Please try again.",
    "invalid-request": "The plan request was invalid. Refresh the dashboard and try again.",
    "invalid-revision": "We could not create a valid revised plan. Your current plan was not changed.",
    "plan-conflict": "This plan changed in another tab. Refresh the dashboard and try again.",
    "save-failed": "We could not save the plan change. Your current plan was not changed."
  };
  const planError = planErrorCode ? planErrorMessages[planErrorCode] ?? "We could not complete that plan action. Please try again." : planAction && !planActionMessages[planAction] ? "We could not confirm that plan action. Please try again." : null;
  const planSuccess = planAction && planActionMessages[planAction] ? planActionMessages[planAction] : null;
  const updatedAt = latestIntake ? new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(latestIntake.updatedAt)) : null;
  const intakeLinkLabel = latestIntake ? latestIntakeEditable ? "Edit intake" : "Start new intake" : "Start intake";
  function formatPlanDate(value) {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium"
    }).format(new Date(value));
  }
  function formatPlanDateTime(value) {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  }
  function formatExerciseDetails(exercise) {
    const details = [];
    if (exercise.sets) {
      details.push(`${exercise.sets} sets`);
    }
    if (exercise.reps) {
      details.push(exercise.reps);
    }
    if (exercise.loadGuidance) {
      details.push(exercise.loadGuidance);
    }
    if (exercise.restSeconds !== void 0) {
      details.push(`${exercise.restSeconds}s rest`);
    }
    return details;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Dashboard" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="bg-cosmic min-h-screen px-4 py-8 text-white"> <div class="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-5"> <header class="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"> <div> <p class="text-sm text-blue-100/65">Signed in as</p> <h1 class="mt-1 text-2xl font-semibold break-words text-white">${user?.email}</h1> </div> <div class="flex flex-wrap items-center gap-3"> <a href="/dashboard/intake" class="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-200"> ${intakeLinkLabel} </a> <form method="POST" action="/api/auth/signout"> <button type="submit" class="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
Sign out
</button> </form> </div> </header> ${savedIntake && renderTemplate`<p class="rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-50">
Intake saved. Your dashboard summary has been updated.
</p>`} ${planSuccess && renderTemplate`<p class="rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-50" role="status"> ${planSuccess} </p>`} ${planError && renderTemplate`<p class="rounded-lg border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-50" role="alert"> ${planError} </p>`} ${loadError && renderTemplate`<p class="rounded-lg border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-50"> ${loadError} </p>`} <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]"> <div class="space-y-5"> ${storedPlan ? renderTemplate`<section class="rounded-lg border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-6"> <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"> <div> <p class="text-sm text-blue-100/65"> ${storedPlan.status === "accepted" ? "Accepted plan" : "Plan under review"} </p> <h2 class="mt-1 text-2xl font-semibold text-white"> ${storedPlan.status === "accepted" ? "Accepted training plan" : storedPlan.revisionCount > 0 ? "Revised draft plan" : "First explained plan"} </h2> <p class="mt-2 text-sm leading-6 break-words text-blue-100/75">
Created ${formatPlanDate(storedPlan.createdAt)} · Updated${" "} ${formatPlanDateTime(storedPlan.updatedAt)} </p> <p class="mt-1 text-sm leading-6 break-words text-blue-100/75"> ${storedPlan.revisionCount === 0 ? "Original version" : `${storedPlan.revisionCount} complete ${storedPlan.revisionCount === 1 ? "revision" : "revisions"}`} ${storedPlan.lastRevisionRequestedAt && ` · Last revised ${formatPlanDateTime(storedPlan.lastRevisionRequestedAt)}`} </p> </div> <p${addAttribute([
    "w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase",
    storedPlan.status === "accepted" ? "border-emerald-200/30 bg-emerald-300/10 text-emerald-50" : "border-cyan-200/30 bg-cyan-300/10 text-cyan-50"
  ], "class:list")}> ${storedPlan.status} </p> </div> <div class="space-y-6"> <details class="group rounded-lg border border-cyan-200/20 bg-slate-950/20 p-4 sm:p-5"${addAttribute(Boolean(planError), "open")}> <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:outline-none [&::-webkit-details-marker]:hidden"> <span> <span class="block text-xs font-semibold text-cyan-100/70 uppercase">Review actions</span> <span class="mt-1 block text-xl font-semibold text-white">Revise or accept this plan</span> </span> <span class="shrink-0 text-xl text-cyan-100 transition-transform group-open:rotate-180" aria-hidden="true">
⌄
</span> </summary> <div class="mt-5"> <p class="mb-5 text-sm leading-6 break-words text-blue-100/75">
Enter your requested correction below. Accept a draft only when it is the version you intend to
                        follow; acceptance is not medical clearance or a safety guarantee.
</p> <div class="grid gap-5 xl:grid-cols-2"> <div class="rounded-lg border border-white/10 bg-white/5 p-4"> <h3 class="text-base font-semibold text-white">Request a revision</h3> <p class="mt-1 text-sm leading-6 text-blue-100/70">
Describe one correction and review the durable health constraints used for the replacement.
</p> <div class="mt-4"> ${renderComponent($$result2, "PlanRevisionForm", PlanRevisionForm, { "client:load": true, "planId": storedPlan.id, "expectedUpdatedAt": storedPlan.updatedAt, "initialHealthConstraints": latestIntake?.healthConstraints ?? "", "accepted": storedPlan.status === "accepted", "client:component-hydration": "load", "client:component-path": "@/components/plans/PlanRevisionForm", "client:component-export": "default" })} </div> </div> <div class="h-fit rounded-lg border border-white/10 bg-white/5 p-4"> ${storedPlan.status === "draft" ? renderTemplate`<form method="POST" action="/api/training-plans/accept" class="space-y-4" data-plan-native-form> <input type="hidden" name="planId"${addAttribute(storedPlan.id, "value")}> <input type="hidden" name="expectedUpdatedAt"${addAttribute(storedPlan.updatedAt, "value")}> <div> <h3 class="text-base font-semibold text-white">Accept this draft</h3> <p class="mt-1 text-sm leading-6 break-words text-blue-100/70">
Mark this reviewed version as the plan you intend to follow. You can still request a
                                  later revision, which will reopen it as a draft.
</p> </div> <button type="submit" data-plan-submit data-loading-label="Accepting plan..." class="w-full rounded-lg bg-emerald-300 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-100 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70">
Accept this plan
</button> </form>` : renderTemplate`<div> <h3 class="text-base font-semibold text-white">Plan accepted</h3> <p class="mt-1 text-sm leading-6 break-words text-blue-100/70">
Accepted ${formatPlanDateTime(storedPlan.acceptedAt)}. This records the version you
                                intend to follow; it does not guarantee safety or replace professional guidance.
</p> </div>`} </div> </div> </div> </details> ${storedPlan.lastRevisionNote && renderTemplate`<section class="rounded-lg border border-cyan-200/20 bg-cyan-300/10 px-4 py-3"> <p class="text-xs font-semibold text-cyan-50/75 uppercase">Latest revision request</p> <p class="mt-1 text-sm leading-6 break-words whitespace-pre-wrap text-cyan-50/90"> ${storedPlan.lastRevisionNote} </p> </section>`} ${storedPlan.status === "draft" && storedPlan.lastRevisionSummary && renderTemplate`<section class="rounded-lg border border-amber-300/25 bg-amber-300/10 px-4 py-3"> <p class="text-xs font-semibold text-amber-50/80 uppercase">What changed</p> <p class="mt-1 text-sm leading-6 break-words whitespace-pre-wrap text-amber-50/90"> ${storedPlan.lastRevisionSummary} </p> </section>`} <section class="space-y-2"> <p class="text-xs font-semibold text-blue-100/50 uppercase">Why this plan</p> <p class="text-sm leading-6 break-words whitespace-pre-wrap text-blue-50/90"> ${storedPlan.explanation} </p> </section> <section class="space-y-2"> <p class="text-xs font-semibold text-blue-100/50 uppercase">Overview</p> <p class="text-sm leading-6 break-words whitespace-pre-wrap text-blue-50/90"> ${storedPlan.planContent.overview} </p> </section> <section class="space-y-4"> <div> <p class="text-xs font-semibold text-blue-100/50 uppercase">Scheduled workouts</p> <h3 class="mt-1 text-lg font-semibold text-white">This week</h3> </div> <div class="space-y-4"> ${storedPlan.planContent.scheduledWorkouts.map((workout, workoutIndex) => renderTemplate`<article class="rounded-lg border border-white/10 bg-white/5 p-4"> <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"> <div> <p class="text-xs font-semibold text-cyan-100/70 uppercase">Workout ${workoutIndex + 1}</p> <h4 class="mt-1 text-base font-semibold break-words text-white">${workout.label}</h4> ${workout.focus && renderTemplate`<p class="mt-1 text-sm leading-6 break-words whitespace-pre-wrap text-blue-100/75"> ${workout.focus} </p>`} </div> </div> <ol class="mt-4 space-y-3"> ${workout.exercises.map((exercise, exerciseIndex) => {
    const details = formatExerciseDetails(exercise);
    return renderTemplate`<li class="rounded-lg border border-white/10 bg-slate-950/20 p-3"> <div class="flex gap-3"> <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-xs font-semibold text-slate-950"> ${exerciseIndex + 1} </span> <div class="min-w-0 flex-1"> <p class="text-sm font-semibold break-words text-white">${exercise.name}</p> ${details.length > 0 && renderTemplate`<p class="mt-1 text-sm leading-6 break-words text-blue-100/75"> ${details.join(" / ")} </p>`} ${exercise.notes && renderTemplate`<p class="mt-2 text-sm leading-6 break-words whitespace-pre-wrap text-blue-50/85"> ${exercise.notes} </p>`} </div> </div> </li>`;
  })} </ol> ${workout.instructions && renderTemplate`<div class="mt-4 rounded-lg border border-white/10 bg-white/5 px-3 py-2"> <p class="text-xs font-semibold text-blue-100/50 uppercase">Instructions</p> <p class="mt-1 text-sm leading-6 break-words whitespace-pre-wrap text-blue-50/85"> ${workout.instructions} </p> </div>`} ${workout.safetyNotes && workout.safetyNotes.length > 0 && renderTemplate`<div class="mt-4 rounded-lg border border-amber-300/25 bg-amber-300/10 px-3 py-2"> <p class="text-xs font-semibold text-amber-50/80 uppercase">Workout safety notes</p> <ul class="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-50"> ${workout.safetyNotes.map((note) => renderTemplate`<li class="break-words whitespace-pre-wrap">${note}</li>`)} </ul> </div>`} </article>`)} </div> </section> <section class="space-y-2"> <p class="text-xs font-semibold text-blue-100/50 uppercase">Progression</p> <p class="text-sm leading-6 break-words whitespace-pre-wrap text-blue-50/90"> ${storedPlan.planContent.progressionGuidance} </p> </section> <section class="rounded-lg border border-amber-300/25 bg-amber-300/10 px-4 py-3"> <p class="text-xs font-semibold text-amber-50/80 uppercase">Plan safety notes</p> <ul class="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-50"> ${storedPlan.planContent.safetyNotes.map((note) => renderTemplate`<li class="break-words whitespace-pre-wrap">${note}</li>`)} </ul> <p class="mt-3 text-sm leading-6 break-words text-amber-50/90">
TrAIner does not diagnose injuries or replace advice from a doctor, physiotherapist, or medical
                      trainer. If you have pain, symptoms, a medical condition, or uncertainty about training, consult a
                      qualified professional.
</p> </section> </div> </section>` : renderTemplate`<section class="rounded-lg border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-6"> <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"> <div> <p class="text-sm text-blue-100/65">Planning intake</p> <h2 class="mt-1 text-xl font-semibold text-white">Goal and constraints</h2> </div> <a href="/dashboard/intake" class="w-fit rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-cyan-100 transition-colors hover:bg-white/20"> ${intakeLinkLabel} </a> </div> ${latestIntake ? renderTemplate`<div class="space-y-4"> <div> <p class="text-xs font-semibold text-blue-100/50 uppercase">Goal</p> <p class="mt-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm leading-6 break-words whitespace-pre-wrap text-white"> ${latestIntake.goal} </p> </div> <div class="grid gap-4 sm:grid-cols-2"> <div> <p class="text-xs font-semibold text-blue-100/50 uppercase">Experience level</p> <p class="mt-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm leading-6 break-words whitespace-pre-wrap text-white"> ${experienceLabels[latestIntake.experienceLevel]} </p> </div> ${updatedAt && renderTemplate`<div> <p class="text-xs font-semibold text-blue-100/50 uppercase">Last updated</p> <p class="mt-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm leading-6 break-words whitespace-pre-wrap text-white"> ${updatedAt} </p> </div>`} </div> <div> <p class="text-xs font-semibold text-blue-100/50 uppercase">Health constraints</p> <p class="mt-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm leading-6 break-words whitespace-pre-wrap text-white"> ${latestIntake.healthConstraints} </p> </div> ${latestIntake.notes && renderTemplate`<div> <p class="text-xs font-semibold text-blue-100/50 uppercase">Optional notes</p> <p class="mt-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm leading-6 break-words whitespace-pre-wrap text-white"> ${latestIntake.notes} </p> </div>`} <p class="rounded-lg border border-blue-200/15 bg-blue-300/10 px-3 py-2 text-sm leading-6 text-blue-50/80"> ${latestIntakeEditable ? "This intake can still be edited before the first plan is generated." : "This intake is already associated with a plan. A new submission will start a fresh intake."} </p> </div>` : renderTemplate`<div class="rounded-lg border border-dashed border-white/20 bg-white/5 px-4 py-8 text-center"> <h3 class="text-lg font-semibold text-white">No intake saved yet</h3> <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-blue-100/70">
Add your training goal, experience level, health constraints, and optional notes so TrAIner can
                      prepare your first explained plan.
</p> <a href="/dashboard/intake" class="mt-5 inline-flex rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-200">
Start intake
</a> </div>`} </section>`} </div> <aside class="space-y-5"> ${storedPlan && latestIntake ? renderTemplate`<section class="rounded-lg border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-6"> <p class="text-sm text-blue-100/65">Plan source</p> <h2 class="mt-1 text-xl font-semibold text-white">Latest intake</h2> <div class="mt-4 space-y-4"> <div> <p class="text-xs font-semibold text-blue-100/50 uppercase">Goal</p> <p class="mt-1 text-sm leading-6 break-words whitespace-pre-wrap text-white">${latestIntake.goal}</p> </div> <div> <p class="text-xs font-semibold text-blue-100/50 uppercase">Experience</p> <p class="mt-1 text-sm leading-6 text-white">${experienceLabels[latestIntake.experienceLevel]}</p> </div> <p class="rounded-lg border border-blue-200/15 bg-blue-300/10 px-3 py-2 text-sm leading-6 text-blue-50/80">
This intake now shapes the current ${storedPlan.status} plan. Update its health constraints through
                    the revision form so plan and source context stay aligned.
</p> <a href="/dashboard/intake" class="inline-flex rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-cyan-100 transition-colors hover:bg-white/20">
Start new intake
</a> </div> </section>` : renderTemplate`<section class="rounded-lg border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-6"> <p class="text-sm text-blue-100/65">Next step</p> <h2 class="mt-1 text-xl font-semibold text-white">First explained plan</h2> ${latestIntake && latestIntakeEditable ? renderTemplate`<form method="POST" action="/api/training-plans/generate" class="mt-4 space-y-4" data-plan-native-form> <p class="text-sm leading-6 break-words text-blue-100/75">
Generate a one-week draft plan matched to your saved goal, experience level, and constraints.
</p> <button type="submit" data-plan-submit data-loading-label="Generating..." class="w-full rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70">
Generate my plan
</button> </form>` : renderTemplate`<p class="mt-3 text-sm leading-6 break-words text-blue-100/75">
Save an editable intake before generating your first explained plan.
</p>`} </section>`} <section class="rounded-lg border border-amber-300/30 bg-amber-300/10 p-5 shadow-2xl backdrop-blur-xl sm:p-6"> <p class="text-sm font-semibold text-amber-50">Training boundary</p> <p class="mt-2 text-sm leading-6 break-words text-amber-50/90">
TrAIner can help adapt a training plan to the constraints you provide, but it does not diagnose injuries
              or replace advice from a doctor, physiotherapist, or medical trainer.
</p> </section> </aside> </div> </div> </main> ` })} ${renderScript($$result, "/Users/antek/projekty/TrAIner/src/pages/dashboard.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/antek/projekty/TrAIner/src/pages/dashboard.astro", void 0);
const $$file = "/Users/antek/projekty/TrAIner/src/pages/dashboard.astro";
const $$url = "/dashboard";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
