# Training Safety Boundaries Implementation Plan

## Overview

This plan defines TrAIner's doc-only safety boundary for training recommendations. The goal is to give future intake, plan generation, explanation, and revision slices a durable contract that keeps the product from diagnosing injuries, replacing a health professional, or ignoring user-provided health constraints.

The selected scope is intentionally narrow: create a living foundation document and update the roadmap handoff. This change does not add TypeScript types, runtime gates, database tables, acknowledgement tracking, UI, API routes, or AI prompt implementation.

## Current State Analysis

The PRD already establishes the product safety guardrail: training plans must not ignore reported injuries or health constraints, and the app must clearly communicate that it does not diagnose injuries or replace a doctor, physiotherapist, or medical trainer.

The roadmap marks `training-safety-boundaries` as F-02, a foundation slice that unlocks `S-01`, `S-02`, and `S-03`. It is meant to run alongside the private planning data contract and join the user-visible flow before intake, plan generation, and revision work begins.

F-01 is implemented and provides the current planning data surface. The database stores `training_intakes.health_constraints`, while `src/types.ts` exposes `healthConstraints` plus string-based plan and workout `safetyNotes`. There is no dedicated safety policy document, structured risk model, stored acknowledgement, or runtime safety gate yet.

## Desired End State

After this plan is implemented, the repository has a new `context/foundation/training-safety-boundaries.md` foundation document that future slices can read before building intake, first plan generation, explanations, or revisions. The document captures the exact decisions from planning: informational warnings only, no acknowledgement storage, free-text intake with neutral examples, safety notes only for generated plans, and reminder-only revision boundaries.

The roadmap also points future implementers to the foundation document and marks F-02 as available/implemented. Verification is complete when the foundation document exists, the roadmap handoff references it, and a manual walkthrough confirms `S-01`, `S-02`, and `S-03` can consume the boundary without adding hidden runtime or schema requirements.

### Key Discoveries:

- Roadmap F-02 is a foundation slice for safety boundaries and no-diagnosis behavior: `context/foundation/roadmap.md:69`.
- F-02 unlocks `S-01`, `S-02`, and `S-03`, but not `S-04` directly: `context/foundation/roadmap.md:74`.
- PRD guardrails require plans not to ignore reported injuries or health constraints and require health data privacy: `context/foundation/prd.md:40`.
- PRD FR-003 keeps health-constraint questions in scope but says they must not suggest diagnosis: `context/foundation/prd.md:66`.
- PRD FR-005 warns that revisions must not bypass earlier health constraints: `context/foundation/prd.md:70`.
- F-01 deliberately excluded a detailed medical profile or injury taxonomy: `context/changes/minimal-planning-data-contract/plan.md:36`.
- The current app type contract has `healthConstraints` and `safetyNotes`, but no structured safety policy or policy version: `src/types.ts:28`.
- The implemented migration stores required `health_constraints` and accepts plan JSONB without validating safety-note structure: `supabase/migrations/20260602233915_create_planning_contract.sql:18`.
- NIDDK guidance supports "start slowly" and health-professional consultation for users with health problems or disabilities; MedlinePlus supports professional care guidance for serious symptoms. This plan uses those sources only to shape product warning language, not to define medical rules.

## What We're NOT Doing

- Adding TypeScript safety policy constants or shared safety types.
- Adding runtime validation, blockers, prompt helpers, or service-layer enforcement.
- Adding a Supabase migration, policy acknowledgement table, policy version field, or audit trail.
- Blocking plan generation for red flags or severe symptoms in this foundation change.
- Building intake UI, plan-generation API routes, revision UI, or AI prompt logic.
- Creating a detailed medical profile, injury taxonomy, contraindication database, or structured risk assessment.
- Rewriting the PRD beyond existing guardrails.
- Writing to `context/archive/`.

## Implementation Approach

Create a living foundation document that future slices must cite and consume. Keep the language product-safe but lightweight: the app gives informational warnings, asks for health constraints in free text with neutral examples, uses safety notes in generated plans, and reminds users during revisions that changes should respect their constraints.

Then update the roadmap so the next implementer sees the boundary where slice planning starts. This is the handoff mechanism chosen during planning instead of code-level enforcement.

## Critical Implementation Details

### Informational Warning Means No Blocking

The planning decision explicitly chose informational warnings only. The foundation document may mention examples of symptoms or situations where a user should seek professional care, but it must not define those examples as automatic blockers or require a runtime red-flag gate in this change.

## Phase 1: Foundation Safety Boundary

### Overview

Create the durable foundation document that describes how TrAIner talks about health constraints and safety without diagnosing injuries or replacing a professional.

### Changes Required:

#### 1. Safety Boundary Foundation Document

**File**: `context/foundation/training-safety-boundaries.md`

**Intent**: Establish the reusable safety boundary that downstream slices will follow. The document should be specific enough to guide copy, plan outputs, explanations, and revisions while staying outside medical diagnosis and runtime enforcement.

**Contract**: Create a foundation document with these sections:

- Purpose and scope.
- No-diagnosis and no-specialist-replacement stance.
- User-facing disclaimer copy or copy requirements.
- Intake question guidance: one free-text constraints prompt with neutral examples.
- Informational warning behavior: show warnings and professional-care guidance, but do not block plan generation in this change.
- Generated plan requirements: use existing plan-level and workout-level `safetyNotes` to mention constraints.
- Explanation guidance: explanations should describe training-fit rationale, mention relevant constraints when relevant, avoid diagnosis or safety guarantees, and defer medical questions to professionals.
- Revision behavior: remind users that requested changes should respect previously provided constraints.
- Privacy boundary: health constraints are private user data and must not be shared with other users.
- Explicit non-goals: medical diagnosis, medical advice, injury taxonomy, stored acknowledgement, risk scoring, red-flag blocking, trainer/admin flows.
- Downstream consumption notes for `S-01`, `S-02`, and `S-03`.
- Source notes for the public-health references used as warning-language background. Record `checked_at: 2026-06-03`, note that NIDDK pages are background-only because they are not updated regularly, and do not derive medical rules from these sources.

Do not add executable code or schema in this phase.

### Success Criteria:

#### Automated Verification:

- `context/foundation/training-safety-boundaries.md` exists.
- The document includes references to `healthConstraints`, `safetyNotes`, `S-01`, `S-02`, and `S-03`.
- `git diff --name-only` for this phase shows no `src/` or `supabase/migrations/` changes.

#### Manual Verification:

- Human review confirms the document says TrAIner does not diagnose injuries or replace a doctor, physiotherapist, or medical trainer.
- Human review confirms the document uses informational warnings only and does not define automatic blockers.
- Human review confirms the intake guidance uses free text with neutral examples, not a medical checklist.
- Human review confirms generated-plan guidance is limited to `safetyNotes`, not full structured risk assessment.
- Human review confirms explanation guidance avoids diagnosis or safety guarantees while describing training-fit rationale.
- Human review confirms the document does not require storing user acknowledgement.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets - the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 2: Roadmap Handoff

### Overview

Make the foundation boundary visible at the roadmap level so future slice planning starts from the new document rather than rediscovering safety decisions.

### Changes Required:

#### 1. F-02 Status and Handoff Notes

**File**: `context/foundation/roadmap.md`

**Intent**: Show that the F-02 foundation contract is available once implemented and point future work to the safety boundary document.

**Contract**: Update the roadmap's F-02 references so they point to `context/foundation/training-safety-boundaries.md`. Keep the roadmap's existing status vocabulary consistent: do not invent a one-off F-02 status unless the same roadmap convention is updated consistently for other implemented foundation slices. The update should preserve the existing dependency graph: `S-01`, `S-02`, and `S-03` still depend on F-02.

#### 2. Downstream Slice Notes

**File**: `context/foundation/roadmap.md`

**Intent**: Ensure the next implementer knows exactly where the safety boundary applies.

**Contract**: Add concise notes to the relevant roadmap entries or backlog handoff:

- `S-01` consumes the intake wording and disclaimer guidance.
- `S-02` consumes the plan `safetyNotes` requirement.
- `S-03` consumes the reminder-only revision boundary.

Do not expand `S-04` unless the edit merely clarifies that F-02 does not directly unlock post-workout feedback.

### Success Criteria:

#### Automated Verification:

- `rg -n "training-safety-boundaries.md" context/foundation/roadmap.md` finds the foundation document reference.
- `rg -n "S-01|S-02|S-03" context/foundation/roadmap.md` still finds all three downstream slices.
- `git diff --name-only` for this phase shows only foundation/roadmap documentation changes, not code or migrations.

#### Manual Verification:

- Roadmap review confirms F-02 is visible as the safety-boundary source for future intake, first-plan, and revision slices.
- Roadmap review confirms the dependency order remains `F-02 -> S-01/S-02/S-03`.
- Roadmap review confirms no new product scope was introduced for trainer/admin roles, medical diagnosis, stored acknowledgements, or runtime blocking.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets - the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 3: Contract Review and Handoff

### Overview

Verify the foundation document and roadmap handoff together, then leave the change in a state that future implementers can consume without re-asking the same safety questions.

### Changes Required:

#### 1. Reference Walkthrough

**File**: `context/changes/training-safety-boundaries/plan.md`

**Intent**: Confirm the implemented boundary is usable by the three downstream slices and record execution state in the plan's progress section.

**Contract**: Review the final foundation document and roadmap against these downstream assumptions:

- `S-01` can ask about health constraints using one free-text prompt with neutral examples.
- `S-01` can show a visible disclaimer without storing acknowledgement.
- `S-02` can generate plans using plan-level and workout-level `safetyNotes`.
- `S-02` can show informational warning copy without blocking plan generation.
- `S-03` can remind users that revisions should respect constraints.

Any implementation notes added to this plan must clarify execution decisions without renaming progress step titles.

#### 2. Scope Guardrail Review

**File**: `context/changes/training-safety-boundaries/plan.md`

**Intent**: Prevent scope creep from turning this doc-only foundation into a medical/risk-scoring implementation.

**Contract**: Review the final diff and confirm it did not add code, migrations, stored acknowledgement, runtime gates, or structured medical taxonomies. If such files appear, either remove them from the implementation or explicitly pause for a new plan.

### Success Criteria:

#### Automated Verification:

- `test -f context/foundation/training-safety-boundaries.md` succeeds.
- `rg -n "training-safety-boundaries.md" context/foundation/roadmap.md` succeeds.
- `git diff --name-only` shows only expected files changed for this doc-only implementation.

#### Manual Verification:

- Human confirms the foundation document is sufficient for `S-01`, `S-02`, and `S-03` planning.
- Human confirms the document matches the eight planning decisions captured in this plan.
- Human confirms the explicit out-of-scope list still matches the intended MVP boundary.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before marking the change implemented. Phase blocks use plain bullets - the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Implementation Handoff Notes

This change deliberately creates a foundation document, not code. Downstream slices should consume the finished boundary as follows:

- `S-01` reads it before writing intake copy and stores constraints in the existing `healthConstraints`/`health_constraints` field.
- `S-02` reads it before designing plan generation and writes constraint-aware plan/workout `safetyNotes`.
- `S-03` reads it before designing revision UI or AI behavior and uses reminder-only safety messaging.

The plan preserves the user's decisions from the planning conversation:

- Scope: doc-only boundary.
- Escalation: informational warning only.
- Persistence: no acknowledgement.
- AI output: safety notes only.
- Intake copy: free text with neutral examples.
- Revisions: only remind the user.
- Testing: document review plus reference checks.
- Handoff: foundation document plus roadmap handoff.

## Testing Strategy

### Unit Tests:

- No unit tests are required because this foundation change adds no executable code.

### Integration Tests:

- No integration tests are required because this change adds no API routes, data-access helpers, or migrations.
- The equivalent integration check is the manual roadmap walkthrough from `S-01` through `S-03`.

### Manual Testing Steps:

1. Review `context/foundation/training-safety-boundaries.md` against PRD FR-003, FR-004, FR-005, FR-008, the Non-Functional Requirements, and the Non-Goals.
2. Review the foundation document against F-01's existing `healthConstraints` and `safetyNotes` fields.
3. Walk through `S-01`, `S-02`, and `S-03` in the roadmap and confirm each can consume the document without hidden code/schema work.
4. Confirm no source files, migrations, acknowledgement storage, runtime gates, or medical taxonomies were added.

## Performance Considerations

There are no runtime performance implications because the change is documentation-only.

## Migration Notes

No Supabase migration is part of this change. If a future slice chooses to store acknowledgement, policy versioning, or structured safety metadata, that must be planned as a separate schema change with owner-scoped RLS.

## References

- Roadmap F-02: `context/foundation/roadmap.md:69`
- F-02 downstream unlocks: `context/foundation/roadmap.md:74`
- PRD guardrails: `context/foundation/prd.md:40`
- PRD health-constraint intake risk: `context/foundation/prd.md:66`
- PRD revision bypass risk: `context/foundation/prd.md:70`
- F-01 no medical taxonomy boundary: `context/changes/minimal-planning-data-contract/plan.md:36`
- Existing plan/workout safety-note fields: `src/types.ts:28`
- Existing health-constraint field: `src/types.ts:45`
- Existing health-constraint database column: `supabase/migrations/20260602233915_create_planning_contract.sql:18`
- NIDDK starting physical activity guidance: https://www.niddk.nih.gov/health-information/weight-management/tips-get-active/tips-starting-physical-activity
- NIDDK older-adult activity safety guidance: https://www.niddk.nih.gov/health-information/weight-management/healthy-eating-physical-activity-for-life/health-tips-for-older-adults
- MedlinePlus chest pain guidance: https://medlineplus.gov/chestpain.html

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` - <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Foundation Safety Boundary

#### Automated

- [x] 1.1 `context/foundation/training-safety-boundaries.md` exists. — ddcc40a
- [x] 1.2 The document includes references to `healthConstraints`, `safetyNotes`, `S-01`, `S-02`, and `S-03`. — ddcc40a
- [x] 1.3 `git diff --name-only` for this phase shows no `src/` or `supabase/migrations/` changes. — ddcc40a

#### Manual

- [x] 1.4 Human review confirms the document says TrAIner does not diagnose injuries or replace a doctor, physiotherapist, or medical trainer. — ddcc40a
- [x] 1.5 Human review confirms the document uses informational warnings only and does not define automatic blockers. — ddcc40a
- [x] 1.6 Human review confirms the intake guidance uses free text with neutral examples, not a medical checklist. — ddcc40a
- [x] 1.7 Human review confirms generated-plan guidance is limited to `safetyNotes`, not full structured risk assessment. — ddcc40a
- [x] 1.8 Human review confirms explanation guidance avoids diagnosis or safety guarantees while describing training-fit rationale. — ddcc40a
- [x] 1.9 Human review confirms the document does not require storing user acknowledgement. — ddcc40a

### Phase 2: Roadmap Handoff

#### Automated

- [x] 2.1 `rg -n "training-safety-boundaries.md" context/foundation/roadmap.md` finds the foundation document reference. — 98d8701
- [x] 2.2 `rg -n "S-01|S-02|S-03" context/foundation/roadmap.md` still finds all three downstream slices. — 98d8701
- [x] 2.3 `git diff --name-only` for this phase shows only foundation/roadmap documentation changes, not code or migrations. — 98d8701

#### Manual

- [x] 2.4 Roadmap review confirms F-02 is visible as the safety-boundary source for future intake, first-plan, and revision slices. — 98d8701
- [x] 2.5 Roadmap review confirms the dependency order remains `F-02 -> S-01/S-02/S-03`. — 98d8701
- [x] 2.6 Roadmap review confirms no new product scope was introduced for trainer/admin roles, medical diagnosis, stored acknowledgements, or runtime blocking. — 98d8701

### Phase 3: Contract Review and Handoff

#### Automated

- [x] 3.1 `test -f context/foundation/training-safety-boundaries.md` succeeds. — 0ce03a0
- [x] 3.2 `rg -n "training-safety-boundaries.md" context/foundation/roadmap.md` succeeds. — 0ce03a0
- [x] 3.3 `git diff --name-only` shows only expected files changed for this doc-only implementation. — 0ce03a0

#### Manual

- [x] 3.4 Human confirms the foundation document is sufficient for `S-01`, `S-02`, and `S-03` planning. — 0ce03a0
- [x] 3.5 Human confirms the document matches the eight planning decisions captured in this plan. — 0ce03a0
- [x] 3.6 Human confirms the explicit out-of-scope list still matches the intended MVP boundary. — 0ce03a0
