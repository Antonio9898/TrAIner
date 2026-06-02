---
project: TrAIner
version: 1
status: active
created: 2026-06-03
checked_at: 2026-06-03
source_change: training-safety-boundaries
---

# Training Safety Boundaries

## Purpose and Scope

This foundation document defines how TrAIner handles health constraints in intake, generated plans, explanations, and revisions. It is a product-safety and implementation handoff contract for `S-01`, `S-02`, and `S-03`.

The boundary is intentionally doc-only. It does not add TypeScript constants, runtime validation, API behavior, database schema, stored acknowledgement, prompt helpers, or blocking logic.

TrAIner uses existing planning fields from F-01:

- `healthConstraints` in app-facing TypeScript and `health_constraints` in the database.
- plan-level `safetyNotes` in `TrainingPlanContent`.
- workout-level `safetyNotes` in `TrainingPlanScheduledWorkout`.

## No Diagnosis or Specialist Replacement

TrAIner must clearly communicate that it does not diagnose injuries, treat health conditions, or replace a doctor, physiotherapist, or medical trainer.

Health constraints are used only to make training recommendations more cautious and context-aware. They are not used to label a condition, infer a diagnosis, clear a user for exercise, or promise that a plan is safe.

## User-Facing Disclaimer

Any intake, plan, explanation, or revision flow that asks about health constraints or shows training recommendations should include visible disclaimer copy with this meaning:

> TrAIner can help adapt a training plan to the constraints you provide, but it does not diagnose injuries or replace advice from a doctor, physiotherapist, or medical trainer. If you have pain, symptoms, a medical condition, or uncertainty about training, consult a qualified professional.

The copy may be shortened for UI fit, but it must preserve these points:

- The app is not a diagnosis or medical-advice tool.
- The app does not replace a professional.
- User-provided constraints matter and should be reviewed before training.
- Professional care is the right path for medical uncertainty or concerning symptoms.

Do not require or store acknowledgement of this disclaimer in the MVP unless a later plan explicitly adds persistence and owner-scoped RLS.

## Intake Question Guidance

`S-01` should collect health constraints with one free-text prompt, not a medical checklist or structured injury taxonomy.

Recommended prompt:

> Do you have injuries, pain, health constraints, or movement limitations that should shape your training plan? Add anything relevant in your own words.

Neutral examples are acceptable when they help the user understand the field:

- "knee pain during squats"
- "recovering shoulder, avoid overhead pressing"
- "doctor told me to avoid high-impact exercise"
- "no known constraints"

Avoid wording that asks the user to self-diagnose or choose a condition category. Do not ask the product to classify severity or decide whether a condition permits training.

## Informational Warning Behavior

Warnings are informational only in this foundation change. The app may tell users to seek professional care, start slowly, or stop and get help for concerning symptoms, but this document does not define automatic blockers, red-flag gates, or runtime refusal logic.

Allowed warning behavior:

- Display general professional-care guidance when the user mentions pain, symptoms, known conditions, disability, or uncertainty.
- Remind users that generated plans depend on the accuracy and completeness of their own constraints.
- Use public-health references only as background for safe warning language.

Not allowed in this change:

- Blocking plan generation.
- Creating red-flag rules.
- Assigning risk scores.
- Inferring diagnoses.
- Clearing a user for training.

If a future slice chooses to add blocking behavior, it needs its own plan and must decide storage, policy versioning, user messaging, and rollback behavior explicitly.

## Generated Plan Requirements

`S-02` should use the existing `safetyNotes` fields instead of adding structured risk assessment.

Plan-level `safetyNotes` should mention broad constraints that shape the whole plan, such as load progression, movement limits, symptoms to monitor, or professional-care reminders.

Workout-level `safetyNotes` should mention constraints that affect a specific scheduled workout, such as avoiding a movement pattern, using a lighter progression, or substituting an exercise if discomfort appears.

Generated plans must not claim that a workout is medically safe. They should explain how the plan attempted to respect `healthConstraints` and should keep the safety language practical and bounded.

## Explanation Guidance

Plan explanations should describe training-fit rationale: why the plan structure, progression, exercise selection, or constraints-aware adjustments match the user's goal, experience level, and `healthConstraints`.

Explanations must avoid:

- Diagnosing the cause of pain or injury.
- Stating that an exercise is safe for a condition.
- Promising injury prevention.
- Sounding like a professional clearance to train.

When relevant, explanations should point back to `safetyNotes` and remind the user to consult a professional for medical questions or concerning symptoms.

## Revision Behavior

`S-03` should treat revisions as reminder-only safety behavior. If a user asks for changes, the revision flow should remind them that the updated plan should still respect previously provided constraints.

Revision copy should preserve this meaning:

> I can revise the training plan, but changes should still respect your earlier health constraints. If your pain, symptoms, or professional guidance has changed, update the constraints before relying on the revised plan.

The MVP does not add stored acknowledgement, red-flag blocking, medical review, or a separate revision risk model.

## Privacy Boundary

Health constraints are private user data. They must not be shown to other users, trainers, admins, or shared-plan viewers in the MVP.

The current F-01 data contract already stores planning data under owner-scoped rows. Future code that reads `healthConstraints`, `health_constraints`, or safety-related plan content must preserve the flat authenticated-user access model from the PRD.

## Explicit Non-Goals

This foundation does not define or require:

- Medical diagnosis.
- Medical advice.
- Injury taxonomy.
- Contraindication database.
- Stored disclaimer acknowledgement.
- Policy version tracking.
- Risk scoring.
- Red-flag blocking.
- Runtime safety gates.
- Trainer/admin flows.
- Shared-plan safety review.
- API routes, UI, migrations, or AI prompt implementation.

## Downstream Consumption Notes

`S-01` consumes this boundary before writing intake copy. It should use one free-text `healthConstraints` prompt, visible disclaimer copy, and neutral examples without adding medical categories.

`S-02` consumes this boundary before building first-plan generation. It should write constraint-aware plan-level and workout-level `safetyNotes`, and explanations should describe training-fit rationale without diagnosis or safety guarantees.

`S-03` consumes this boundary before building revision UI or AI behavior. It should remind users that requested changes should respect previously provided constraints, without adding acknowledgement storage or runtime blocking.

`S-04` is not directly unlocked by F-02. It may inherit accepted-plan safety context later, but post-workout feedback is not part of this foundation boundary.

## Source Notes

These sources were checked on 2026-06-03 and are used only as warning-language background, not as medical rules:

- NIDDK, "Tips for Starting Physical Activity": background for starting slowly and consulting a health care professional when health problems or disabilities affect activity. The NIDDK page says its information is not updated regularly, so do not treat it as a current medical-rule source.
- NIDDK, "Health Tips for Older Adults": background for asking a health care professional about safely becoming active or increasing activity. The NIDDK page says its information is not updated regularly, so do not treat it as a current medical-rule source.
- MedlinePlus, "Chest Pain": background for professional-care warning copy around serious symptoms and for the general principle that health information is not a substitute for professional medical care. Last updated: 2025-08-24.

The product boundary is still the PRD and this document. Public-health sources can shape cautious language, but future implementation plans must not derive automatic blockers, diagnosis logic, or training clearance rules from them without a separate explicit plan.
