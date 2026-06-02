# Minimal Planning Data Contract Implementation Plan

## Overview

This plan defines the smallest private data contract that can support TrAIner's next vertical slices: goal and constraints intake, first explained plan, plan revision/acceptance, and post-workout feedback. The chosen scope is Supabase schema plus shared TypeScript domain types; no UI, API routes, AI calls, or data-access helpers are included in this change.

## Current State Analysis

The app already has Astro SSR, Supabase auth, protected middleware, and a starter `todos` migration. It does not yet have any private training goal, intake, plan, revision, or feedback data contract.

The roadmap marks `minimal-planning-data-contract` as F-01 and makes it a prerequisite for S-01, S-02, S-03, and S-04. PRD privacy guardrails require every user to access only their own goal, survey answers, health constraints, plans, and workout feedback.

## Desired End State

After this plan is implemented, the repository has one new Supabase migration that introduces private, owner-scoped planning tables with RLS and constraints, plus `src/types.ts` domain types that match the database contract. Later slices can build intake UI/API, first plan generation, plan acceptance, and workout feedback without inventing new core tables.

Verification is complete when the migration applies locally, RLS policies restrict rows by `auth.uid()`, the TypeScript types compile under the existing strict config, and lint/build pass with the existing project commands.

### Key Discoveries:

- Roadmap F-01 is explicitly a foundation contract and warns against both over-wide and under-specified data scope: `context/foundation/roadmap.md:56`.
- F-01 unlocks S-01 through S-04, so it must cover goal/intake, plan, revision-by-overwrite, and feedback: `context/foundation/roadmap.md:61`.
- PRD requires login and owner-only access to goals, survey answers, health constraints, plans, and feedback: `context/foundation/prd.md:93`.
- The only current migration is a public example `todos` table, not a privacy-safe training contract: `supabase/migrations/20260528214831_create_todos.sql:1`.
- Supabase auth already exposes the current user through the SSR client and middleware: `src/lib/supabase.ts:5`, `src/middleware.ts:6`.
- CI currently verifies `npx astro sync`, `npm run lint`, and `npm run build`: `.github/workflows/ci.yml:18`.

## What We're NOT Doing

- Building intake pages, dashboards, forms, or any user-facing UI.
- Adding API routes for creating or updating training data.
- Adding `src/lib/` data-access helpers or service methods.
- Integrating AI plan generation or prompt logic.
- Keeping full plan version history or a separate revision request table.
- Normalizing days, exercises, sets, reps, and progression into dedicated tables.
- Modeling a detailed medical profile or injury taxonomy.
- Writing to `context/archive/`.

## Implementation Approach

Create a forward-compatible but intentionally small Supabase contract: relational ownership/lifecycle tables for intake, current plan, and workout feedback, with JSONB for the generated plan content. Use RLS and check constraints to enforce privacy and minimal data quality in the database. Mirror the same domain vocabulary in `src/types.ts` so future UI/API code does not drift from the schema.

## Critical Implementation Details

### Ownership Across Foreign Keys

RLS alone prevents direct row access, but it does not by itself prove that a row's foreign key points to a parent owned by the same user. The migration should use composite ownership constraints such as `(user_id, intake_id)` referencing an owner-scoped unique key on the parent table, and `(user_id, plan_id)` for feedback-to-plan references.

## Phase 1: Supabase Planning Schema

### Overview

Create the minimal database contract for owner-scoped planning data with RLS, constraints, and relationships that future slices can rely on.

### Changes Required:

#### 1. Planning Contract Migration

**File**: `supabase/migrations/20260602HHmmss_create_planning_contract.sql`

**Intent**: Add the private tables needed for the planning lifecycle without building the lifecycle implementation. The schema should support one or more user intakes, one current plan per intake, and per-workout feedback records tied to the current plan.

**Contract**: Create owner-scoped tables for:

- `public.training_intakes`: user goal, `experience_level`, health constraints, optional notes, timestamps, and ownership.
- `public.training_plans`: one current plan per intake, plan status, JSONB plan content, explanation/notes, acceptance timestamp, revision-by-overwrite metadata, timestamps, and ownership.
- `public.workout_feedback`: one feedback record per performed workout, stable `workout_key` or `workout_label` that identifies the scheduled workout/day within the plan content, difficulty/rating fields, optional notes, performed timestamp, and ownership.

Each table must include `user_id uuid not null references auth.users(id) on delete cascade`, primary keys, `created_at`, `updated_at`, and owner-scoped foreign keys where child rows point to parent rows.

`training_plans` must enforce the current-plan invariant with a unique constraint or unique index on `(user_id, intake_id)`, so one intake cannot accumulate multiple current plan rows.

#### 2. RLS Policies

**File**: `supabase/migrations/20260602HHmmss_create_planning_contract.sql`

**Intent**: Ensure authenticated users can only read and mutate their own planning data.

**Contract**: Enable RLS on every new table. Add granular `select`, `insert`, `update`, and `delete` policies for `authenticated`, using `auth.uid() = user_id` for `using` and `with check` clauses. Do not add public `anon` access for planning tables.

#### 3. Data Quality Constraints

**File**: `supabase/migrations/20260602HHmmss_create_planning_contract.sql`

**Intent**: Keep the MVP data usable without over-modeling the training domain.

**Contract**: Add check constraints for the minimal vocabularies selected during planning:

- `experience_level` supports a compact set such as `beginner`, `intermediate`, `advanced`.
- `training_plans.status` supports current-plan lifecycle values such as `draft` and `accepted`.
- Required text fields reject empty strings after trimming.
- JSONB plan content is required and must be a JSON object.
- `workout_feedback` includes a non-empty stable workout/day reference aligned with scheduled entries in `training_plans.plan_content`.
- Feedback rating fields stay within their documented numeric range.

### Success Criteria:

#### Automated Verification:

- Migration file exists under `supabase/migrations/` with the required timestamp naming format.
- Local migration applies cleanly with `npx supabase db reset` when local Supabase/Docker is available.
- RLS is enabled on all new planning tables.
- No new `anon` policies exist for planning tables.
- A unique constraint or unique index enforces one `training_plans` row per `(user_id, intake_id)`.

#### Manual Verification:

- Schema review confirms each child table cannot reference another user's parent row.
- Schema review confirms every planning-table policy for `select`, `insert`, `update`, and `delete` is scoped with `auth.uid() = user_id` in the appropriate `using` and `with check` clauses.
- Schema review confirms `workout_feedback` has a non-empty stable workout/day reference that can be matched to the plan content.
- Schema review confirms the contract is still minimal and does not normalize exercises/sets/reps.
- Schema review confirms revision support is overwrite-based, not version-history-based.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets - the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 2: Shared TypeScript Domain Types

### Overview

Add shared types that express the same planning contract in application code without adding data-access functions.

### Changes Required:

#### 1. Domain Type Definitions

**File**: `src/types.ts`

**Intent**: Give future Astro pages, React islands, and API routes a single source for planning data shapes.

**Contract**: Create exported types for the selected domain vocabulary and row shapes:

- `TrainingExperienceLevel`
- `TrainingPlanStatus`
- `TrainingIntake`
- `TrainingPlan`
- `TrainingPlanContent`
- `WorkoutFeedback`

The types should use app-facing camelCase property names while preserving clear correspondence to database columns.

#### 2. JSONB Plan Content Shape

**File**: `src/types.ts`

**Intent**: Keep plan content flexible enough for AI output while still making the first explained plan usable by S-02.

**Contract**: Define a minimal JSON-compatible `TrainingPlanContent` shape with plan overview, scheduled training days, stable workout/day keys or labels, exercise entries, progression guidance, safety notes, and optional metadata. Do not encode a fully normalized exercise database in TypeScript.

#### 3. Feedback and Intake Shape

**File**: `src/types.ts`

**Intent**: Match the decisions that intake uses minimal structured fields and feedback is stored per performed workout.

**Contract**: Define intake fields for goal, experience level, health constraints, optional notes, and timestamps. Define feedback fields for plan linkage, stable workout/day key or label, performed timestamp, simple rating/difficulty values, optional notes, and timestamps.

### Success Criteria:

#### Automated Verification:

- `src/types.ts` exists and exports all planned type names.
- `npx astro sync` completes successfully.
- `npm run lint` completes successfully.
- `npm run build` completes successfully with the existing Supabase environment requirements satisfied.

#### Manual Verification:

- Type review confirms names and values match the migration constraints.
- Type review confirms no data-access helper or API behavior was added in this phase.
- Type review confirms plan content remains JSONB-friendly and not over-normalized.
- Type review confirms feedback's stable workout/day reference aligns with scheduled entries in `TrainingPlanContent`.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets - the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 3: Contract Verification and Handoff

### Overview

Verify the schema and types together, then document what downstream slices can assume.

### Changes Required:

#### 1. Contract Handoff Notes

**File**: `context/changes/minimal-planning-data-contract/plan.md`

**Intent**: Make the implementation handoff explicit so later slices know what is available and what remains out of scope.

**Contract**: The completed implementation should leave this plan's Progress section as the execution state source. Any implementation notes added during execution must clarify contract decisions without changing step titles in `## Progress`.

#### 2. Downstream Readiness Check

**File**: `context/changes/minimal-planning-data-contract/plan.md`

**Intent**: Confirm the contract unlocks roadmap slices without requiring hidden implementation work.

**Contract**: Review the final migration and `src/types.ts` against S-01, S-02, S-03, and S-04 assumptions:

- S-01 can store goal, experience level, health constraints, and notes.
- S-02 can store one generated plan with explanation and structured JSONB content.
- S-03 can update/accept the current plan through overwrite semantics.
- S-04 can store one feedback record per performed workout and identify which scheduled workout/day it refers to.

### Success Criteria:

#### Automated Verification:

- `npm run lint` completes successfully.
- `npm run build` completes successfully with the existing Supabase environment requirements satisfied.
- `git status --short` shows only expected files changed for this plan's implementation.

#### Manual Verification:

- Human confirms the contract is sufficient for S-01 through S-04, including S-04 identifying which scheduled workout/day each feedback record refers to.
- Human confirms the explicit out-of-scope list still matches the intended MVP boundary.
- Human confirms any Supabase migration is acceptable as a forward-only database change before implementation is considered complete.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before marking the change implemented. Phase blocks use plain bullets - the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Testing Strategy

### Unit Tests:

- No unit tests are required for this foundation slice unless implementation adds executable helpers, which is out of scope.
- Type-level correctness is covered through strict TypeScript compilation during `npm run build`.

### Integration Tests:

- Apply the migration locally with `npx supabase db reset` when local Supabase/Docker is available.
- Manually inspect RLS policies and owner-scoped relationships in the generated schema.
- Optionally verify through Supabase Studio or SQL that authenticated users cannot select, insert, update, or delete another user's rows.

### Manual Testing Steps:

1. Review the migration for owner-scoped tables, RLS, constraints, and no `anon` planning access.
2. Review `src/types.ts` for exact alignment with the migration vocabularies.
3. Walk through S-01, S-02, S-03, and S-04 on paper and confirm each has the data surface it needs.

## Performance Considerations

The MVP target is small scale and low QPS. Add indexes for ownership and common joins, especially `user_id`, `intake_id`, and `plan_id`, but do not introduce analytics-oriented indexes or exercise-level normalization before real query patterns exist.

## Migration Notes

This is a forward-only Supabase migration. Worker rollback does not roll back Supabase schema changes, so implementation should keep the schema additive and avoid destructive changes to existing tables. If local Supabase is unavailable, the migration still needs a human review before any remote application.

## References

- Roadmap F-01: `context/foundation/roadmap.md:56`
- F-01 unlocks downstream slices: `context/foundation/roadmap.md:61`
- PRD privacy/access model: `context/foundation/prd.md:93`
- Current example migration: `supabase/migrations/20260528214831_create_todos.sql:1`
- Supabase SSR client: `src/lib/supabase.ts:5`
- Auth middleware: `src/middleware.ts:6`
- CI verification commands: `.github/workflows/ci.yml:18`
- Package scripts: `package.json:5`
- TypeScript path/include config: `tsconfig.json:1`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Supabase Planning Schema

#### Automated

- [x] 1.1 Migration file exists under `supabase/migrations/` with the required timestamp naming format.
- [x] 1.2 Local migration applies cleanly with `npx supabase db reset` when local Supabase/Docker is available.
- [x] 1.3 RLS is enabled on all new planning tables.
- [x] 1.4 No new `anon` policies exist for planning tables.
- [x] 1.8 A unique constraint or unique index enforces one `training_plans` row per `(user_id, intake_id)`.

#### Manual

- [x] 1.5 Schema review confirms each child table cannot reference another user's parent row.
- [x] 1.6 Schema review confirms the contract is still minimal and does not normalize exercises/sets/reps.
- [x] 1.7 Schema review confirms revision support is overwrite-based, not version-history-based.
- [x] 1.9 Schema review confirms every planning-table policy for `select`, `insert`, `update`, and `delete` is scoped with `auth.uid() = user_id` in the appropriate `using` and `with check` clauses.
- [x] 1.10 Schema review confirms `workout_feedback` has a non-empty stable workout/day reference that can be matched to the plan content.

### Phase 2: Shared TypeScript Domain Types

#### Automated

- [ ] 2.1 `src/types.ts` exists and exports all planned type names.
- [ ] 2.2 `npx astro sync` completes successfully.
- [ ] 2.3 `npm run lint` completes successfully.
- [ ] 2.4 `npm run build` completes successfully with the existing Supabase environment requirements satisfied.

#### Manual

- [ ] 2.5 Type review confirms names and values match the migration constraints.
- [ ] 2.6 Type review confirms no data-access helper or API behavior was added in this phase.
- [ ] 2.7 Type review confirms plan content remains JSONB-friendly and not over-normalized.
- [ ] 2.8 Type review confirms feedback's stable workout/day reference aligns with scheduled entries in `TrainingPlanContent`.

### Phase 3: Contract Verification and Handoff

#### Automated

- [ ] 3.1 `npm run lint` completes successfully.
- [ ] 3.2 `npm run build` completes successfully with the existing Supabase environment requirements satisfied.
- [ ] 3.3 `git status --short` shows only expected files changed for this plan's implementation.

#### Manual

- [ ] 3.4 Human confirms the contract is sufficient for S-01 through S-04, including S-04 identifying which scheduled workout/day each feedback record refers to.
- [ ] 3.5 Human confirms the explicit out-of-scope list still matches the intended MVP boundary.
- [ ] 3.6 Human confirms any Supabase migration is acceptable as a forward-only database change before implementation is considered complete.
