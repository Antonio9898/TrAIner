# Minimal Planning Data Contract - Plan Brief

> Full plan: `context/changes/minimal-planning-data-contract/plan.md`

## What & Why

Define the minimal private data contract for TrAIner's planning flow: training goal/intake, current plan, overwrite-based revisions, and per-workout feedback. This is the F-01 foundation slice from the roadmap and unlocks the user-visible intake, first plan, revision, and feedback slices.

## Starting Point

The app already has Astro SSR, Supabase auth, middleware, CI, and one starter `todos` migration. It does not yet have any private training tables or shared domain types for the planning lifecycle.

## Desired End State

The repository contains one new Supabase migration with owner-scoped planning tables, RLS policies, and constraints. It also contains `src/types.ts` with domain types that match the database contract and can be consumed by future UI/API work.

## Key Decisions Made

| Decision | Choice | Why |
| --- | --- | --- |
| Change scope | DB + TypeScript types | Gives future slices a clear contract without building UI, APIs, or helpers too early. |
| Data model | Relational core + JSONB plan content | Keeps ownership and lifecycle queryable while leaving generated plan details flexible. |
| Plan revisions | Overwrite current plan | Simplifies MVP scope and avoids version-history work in F-01. |
| Feedback | One record per performed workout | Supports progress tracking without exercise-level logging. |
| Intake shape | Minimal structured fields + notes | Captures goal, level, and constraints without modeling medical diagnosis. |
| Safety | RLS + constraints/statuses | Enforces privacy and minimal data quality in the database. |
| Phase structure | Schema, types, handoff verification | Keeps implementation incremental and reviewable. |

## Scope

**In scope:**

- Supabase migration for `training_intakes`, `training_plans`, and `workout_feedback`.
- Owner-scoped RLS and no anonymous planning access.
- Check constraints for status, experience level, required text, JSONB object shape, and feedback ranges.
- `src/types.ts` domain types matching the migration.
- Verification that S-01 through S-04 can consume the contract.

**Out of scope:**

- UI, API routes, services, AI generation, prompt logic, and data-access helpers.
- Full plan version history or separate revision request records.
- Exercise/set/rep normalization.
- Detailed medical or injury taxonomy.

## Architecture / Approach

Use Supabase as the private data layer. Store lifecycle ownership and relationships relationally, store generated plan details in JSONB, and mirror the same domain vocabulary in TypeScript. Child tables must preserve ownership through owner-scoped foreign keys, not just direct-row RLS.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Supabase Planning Schema | Migration with owner-scoped planning tables, RLS, and constraints. | RLS may protect direct rows but miss cross-owner foreign-key references. |
| 2. Shared TypeScript Domain Types | `src/types.ts` with intake, plan, plan content, and feedback types. | Types may drift from DB constraint vocabularies. |
| 3. Contract Verification and Handoff | Final lint/build/schema review and downstream readiness check. | Contract may still be too narrow for S-01 through S-04. |

**Prerequisites:** Local Supabase/Docker for full migration verification, or a human SQL review if local reset is unavailable.
**Estimated effort:** About 1-2 focused implementation sessions across 3 phases.

## Open Risks & Assumptions

- Overwrite-based revisions mean historical feedback does not preserve a full previous plan version.
- Supabase migrations are forward-only for this project; Worker rollback will not roll back schema.
- Local build may require the existing Supabase environment variables because current pages import the Supabase client.

## Success Criteria (Summary)

- Migration applies cleanly and all planning tables have owner-only RLS.
- `src/types.ts` compiles and matches migration vocabularies.
- Human review confirms S-01, S-02, S-03, and S-04 have enough data surface without extra foundation schema work.
