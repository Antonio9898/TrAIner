# Plan Revision and Acceptance Implementation Plan

## Overview

Build roadmap slice S-03 so an authenticated user can request a complete revision of the current training plan, update the health constraints that shape that revision, accept the version they intend to follow, and later revise an accepted plan again. The existing plan row remains the current-plan identity: each successful revision atomically overwrites its content, updates its source intake constraints, increments revision metadata, and returns the plan to `draft`; acceptance moves that current version to `accepted`.

The change extends the existing Astro SSR, OpenRouter, Zod, and Supabase flow. It deliberately preserves the MVP's overwrite model and any existing workout feedback instead of adding plan version history. A short authenticated PostgreSQL RPC owns each state transition so related writes are atomic and stale browser tabs cannot overwrite a newer plan state.

## Current State Analysis

S-02 already leaves one validated `draft` plan per intake and renders it inline on `/dashboard`. The provider transport, structured response format, application-level Zod validation, typed row mapping, safe redirect pattern, owner-only RLS, and one-current-plan constraint are all implemented.

The data contract already has `status`, `accepted_at`, `revision_count`, `last_revision_requested_at`, and `last_revision_note`, but there is no revision or acceptance service, API route, or UI. Updates through the existing RLS policy are not conditional on a previously viewed plan version, so application code alone could otherwise allow a slow model call or stale tab to overwrite a newer revision or acceptance.

The accepted product decisions broaden the original frozen-intake handoff: a revision form may update the existing intake's health constraints, including for an accepted plan. A successful revision reopens that plan as `draft`. Existing workout feedback remains attached to the same plan even when its workout content or keys change; S-03 neither deletes nor rewrites feedback.

## Desired End State

After implementation, the owner of the plan can submit one free-text correction request together with the current or updated health constraints. The server reads the exact owner-scoped plan and intake, generates and validates a complete replacement plan, then invokes one authenticated RPC that checks the plan snapshot and atomically updates both records. Failed generation, invalid output, persistence failure, or a stale snapshot leaves the intake, plan, revision metadata, and feedback unchanged.

A draft can be accepted without an AI call. An accepted plan remains visible as the current plan and can later be revised; the next successful revision clears `accepted_at` and changes the status back to `draft`. Conflicting operations return a safe refresh-and-retry message. Verification is complete when the migration resets locally, Astro sync/lint/build pass, and the manual matrix covers revision, acceptance, reopening, failures, concurrency, privacy, safety language, responsive UI, and feedback preservation.

### Key Discoveries:

- Roadmap S-03 is the ready successor to the implemented first-plan slice and is the prerequisite for post-workout feedback: `context/foundation/roadmap.md:112`, `context/foundation/roadmap.md:125`.
- PRD FR-005 requires corrections to keep earlier health constraints in force, while FR-006 defines acceptance as the version the user intends to perform: `context/foundation/prd.md:70`, `context/foundation/prd.md:72`.
- F-02 fixes revision safety as reminder-only behavior without acknowledgement storage, red-flag blockers, or a separate risk model: `context/foundation/training-safety-boundaries.md:105`.
- F-01 deliberately chose one current plan per intake and revision-by-overwrite rather than version history: `context/changes/minimal-planning-data-contract/plan.md:228`.
- The current database already stores revision and acceptance metadata and enforces status/timestamp coherence: `supabase/migrations/20260602233915_create_planning_contract.sql:36`, `supabase/migrations/20260602233915_create_planning_contract.sql:70`.
- Workout feedback references the mutable plan row and stores a workout key and optional label; the selected product behavior keeps those records untouched after later revisions: `supabase/migrations/20260602233915_create_planning_contract.sql:76`.
- The existing plan service centralizes strict output validation, OpenRouter response schema, row mapping, first-plan prompting, and persistence: `src/lib/services/training-plans.ts:101`, `src/lib/services/training-plans.ts:166`, `src/lib/services/training-plans.ts:214`.
- The current dashboard hard-codes draft-oriented copy and has no revision or acceptance controls: `src/pages/dashboard.astro:160`, `src/pages/dashboard.astro:366`.
- The repository has no test runner or test script; CI currently runs Astro sync, lint, and build: `package.json:5`, `.github/workflows/ci.yml:18`.
- Current Supabase guidance supports calling PostgreSQL functions with `rpc()`, defaults database functions to `SECURITY INVOKER`, recommends an empty `search_path` with fully qualified objects, and recommends revoking broad function execution before granting it explicitly.

## What We're NOT Doing

- Adding plan-version rows, a revision history table, a chat transcript, rollback UI, or side-by-side plan comparison.
- Creating a chat interface, structured correction categories, or direct per-exercise editing.
- Deleting, remapping, versioning, or otherwise mutating existing `workout_feedback` when a plan is revised.
- Adding a new plan detail/history route; S-03 stays centered on the latest-plan dashboard flow.
- Adding streaming, background jobs, persisted `revising` state, automatic retries, or provider-call idempotency infrastructure.
- Adding medical diagnosis, medical review, risk scores, red-flag blocking, professional clearance, or disclaimer acknowledgement storage.
- Adding trainer, admin, shared-plan, or cross-user behavior.
- Introducing Vitest, Playwright, a test script, or a new test/CI strategy in this slice.
- Logging or persisting raw prompts, raw model responses, provider errors, or prior plan snapshots.
- Writing to `context/archive/`.

## Implementation Approach

Keep model work outside database transactions: read the owner-scoped snapshot, generate a complete replacement with OpenRouter, and validate it with the existing Zod contract before attempting persistence. Then make the database mutation short and atomic through an authenticated Supabase RPC. The RPC locks the targeted current plan, compares its `updated_at` with the submitted snapshot token, and either applies all intake/plan updates or applies none.

Use two least-privilege PostgreSQL functions: one for the cross-table revision transition and one for conditional/idempotent acceptance. Both run as `SECURITY INVOKER`, use `auth.uid()` and existing owner RLS, set an empty `search_path`, reference fully qualified objects, return the resulting plan row, and expose `EXECUTE` only to `authenticated`. A missing, foreign, or stale draft target yields no returned row and is mapped to the same safe conflict result so ownership is not disclosed.

Keep HTTP routes thin and dashboard messages enumerated. The service layer owns form parsing, prompt construction, output validation, owner-scoped reads, RPC invocation, result mapping, and domain error classification. The dashboard mounts one React revision form for the correction request and health constraints, while acceptance remains a small native POST action.

## Critical Implementation Details

### Timing & Lifecycle

Never hold a row lock while waiting for OpenRouter. The revision service performs the provider call first and passes the original `updatedAt` snapshot into the short RPC; a concurrent winner causes the RPC to return no row, the generated result is discarded, and the user is asked to refresh. A successful revision always sets `status = 'draft'` and `accepted_at = null`, even when the starting plan was accepted.

### State Sequencing

The revision RPC must lock and validate the owner-scoped plan before it changes either table. It then updates `training_intakes.health_constraints` only when the value differs and updates the plan content, explanation, latest revision note/time, and count in the same call. Acceptance uses the same snapshot rule for a draft, but an already accepted row is returned unchanged so repeated acceptance submits are idempotent; a stale request must never accept a newer draft created by another revision.

### User Experience Spec

The revision form has one correction-request textarea plus a separate, prefilled health-constraints textarea because constraints are durable source data, not conversation text. Copy must explain that revising an accepted plan reopens it as a draft and that any earlier workout feedback remains attached and may describe an older plan version.

## Phase 1: Transactional Database Lifecycle Contract

### Overview

Add the two authenticated PostgreSQL functions that make revision and acceptance atomic, owner-scoped, and safe under concurrent requests.

### Changes Required:

#### 1. Plan Lifecycle RPC Migration

**File**: `supabase/migrations/20260812HHmmss_add_training_plan_lifecycle_rpcs.sql`

**Intent**: Introduce database-level transition functions without changing the existing tables, RLS policies, or overwrite-based data model.

**Contract**: Create `public.revise_training_plan` with inputs for `plan_id`, expected `updated_at`, revision note, health constraints, validated plan JSON, and explanation. It returns the resulting `public.training_plans` row when applied. Inside one function call it must:

- Resolve and row-lock the plan by `id` and `auth.uid()`.
- Return no row before any mutation when the target is missing/foreign or `updated_at` does not exactly match the expected snapshot.
- Accept either current status (`draft` or `accepted`).
- Update the linked owner-scoped intake's `health_constraints` when changed.
- Overwrite `plan_content` and `explanation`, increment `revision_count` from the locked row, set `last_revision_requested_at` from database time, store the trimmed latest revision note, set `status = 'draft'`, and clear `accepted_at`.
- Leave `notes`, ownership, intake linkage, creation time, and every `workout_feedback` row unchanged.
- Return the updated plan row after the existing `updated_at` trigger runs.

The function must reject blank revision notes/constraints/explanations and non-object plan content consistently with existing table invariants. Any failure after the first mutation must abort the whole function call so intake and plan cannot diverge.

#### 2. Conditional Acceptance RPC

**File**: `supabase/migrations/20260812HHmmss_add_training_plan_lifecycle_rpcs.sql`

**Intent**: Make acceptance use database time and the same concurrency boundary as revision without calling OpenRouter.

**Contract**: Create `public.accept_training_plan(plan_id, expected_updated_at)` returning the current `public.training_plans` row. It must lock by `id` and `auth.uid()`, return an already accepted row unchanged for duplicate-submit idempotency, update a matching draft to `status = 'accepted'` with database `now()` in `accepted_at`, and return no row for a missing/foreign or stale draft. It must never accept a newer draft using an older page's snapshot.

#### 3. Function Security and Privileges

**File**: `supabase/migrations/20260812HHmmss_add_training_plan_lifecycle_rpcs.sql`

**Intent**: Keep RPC execution aligned with the existing authenticated user and RLS rather than introducing a privilege bypass.

**Contract**: Both functions use `SECURITY INVOKER`, `set search_path = ''`, fully qualified `public.*` and `auth.uid()` references, and explicit argument types. Revoke execution from `PUBLIC` and `anon`, then grant the exact signatures to `authenticated`. Do not grant direct anonymous access or add a service-role path.

### Success Criteria:

#### Automated Verification:

- The timestamped migration creates both `public.revise_training_plan` and `public.accept_training_plan`.
- `npx supabase db reset` applies the full migration chain when local Supabase/Docker is available.
- Static inspection confirms both functions use `SECURITY INVOKER`, an empty `search_path`, fully qualified objects, and explicit owner/snapshot checks.
- Static inspection confirms `PUBLIC` and `anon` execution are revoked and only `authenticated` receives `EXECUTE`.
- The migration does not add or alter planning tables, RLS policies, status values, or feedback columns.

#### Manual Verification:

- SQL review confirms revision updates intake and plan in one transaction and returns no partial state on failure.
- SQL review confirms a stale or foreign target changes no row and does not disclose ownership.
- SQL review confirms acceptance is idempotent for an already accepted row but cannot accept a newer draft with an old snapshot.
- SQL review confirms revision reopens accepted plans and leaves all workout feedback untouched.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets; the corresponding `- [ ]` checkboxes live in `## Progress`.

---

## Phase 2: Revision and Acceptance Service Logic

### Overview

Extend the existing training-plan domain service with validated action inputs, complete-plan revision generation, owner-scoped snapshot reads, RPC persistence, and explicit conflict/error results.

### Changes Required:

#### 1. Owner-Scoped Intake Read

**File**: `src/lib/services/training-intakes.ts`

**Intent**: Let revision load the immutable source fields and current health constraints for the plan's specific intake instead of relying on whichever intake is latest.

**Contract**: Add a read helper accepting the caller's Supabase SSR client, explicit `userId`, and `intakeId`. It returns the mapped intake only when both owner and id match, uses the existing selected columns and error style, and returns `null` for an unavailable target.

#### 2. Revision and Acceptance Input Contracts

**File**: `src/lib/services/training-plans.ts`

**Intent**: Validate native form input before owner reads or provider calls and share the exact contract between routes and service operations.

**Contract**: Add Zod-backed parsers for:

- Revision: UUID `planId`, ISO timestamp `expectedUpdatedAt`, trimmed non-empty `revisionNote` capped at 2,000 characters, and trimmed non-empty `healthConstraints`.
- Acceptance: UUID `planId` and ISO timestamp `expectedUpdatedAt`.

Do not add a new maximum to durable health constraints in S-03 because existing saved intakes have no such bound. Invalid data must fail before any OpenRouter or Supabase mutation call.

#### 3. Shared Complete-Plan Output Contract

**File**: `src/lib/services/training-plans.ts`

**Intent**: Reuse one strict model-output contract for first generation and every revision.

**Contract**: Refactor the existing response format, JSON parsing, Zod payload validation, and sanitized validation error boundary only as needed for reuse. A revision must produce the complete `planContent` plus complete `explanation`, with the same 2-5 workout bounds, unique keys, exercise constraints, optional-field rules, and safety-note requirements as S-02. Do not support patches or partial plan objects.

#### 4. Constraint-Aware Revision Prompt

**File**: `src/lib/services/training-plans.ts`

**Intent**: Ask OpenRouter for a complete corrected plan while keeping saved source context and safety constraints authoritative.

**Contract**: Build revision messages from the owner-scoped intake, current full plan, one correction request, and submitted health constraints. Treat all four as untrusted data. The system instructions must require the new constraints and correction request to shape the result without allowing either to override the JSON schema, no-diagnosis boundary, practical safety notes, or professional-care guidance. Tell the model it is replacing the complete current plan and explanation; do not ask for conversational prose or a patch.

#### 5. Revision Service Operation

**File**: `src/lib/services/training-plans.ts`

**Intent**: Coordinate safe preflight, provider generation, validation, and the atomic database transition.

**Contract**: Add an exported operation that reads the plan by explicit owner/id, verifies the submitted snapshot before spending a provider call, loads that plan's owner-scoped intake, calls OpenRouter, validates the complete output, and invokes `supabase.rpc('revise_training_plan', ...)` with the same snapshot. Map no returned row to a dedicated sanitized conflict error. Map provider, generated-output, and persistence failures distinctly without including prompt content, health constraints, revision text, raw output, or database details in the public error.

The provider call happens before the RPC. If another request wins between preflight and persistence, discard the generated result and report a conflict. Increment metadata only through the successful RPC; failed attempts leave all stored values unchanged.

#### 6. Acceptance Service Operation

**File**: `src/lib/services/training-plans.ts`

**Intent**: Expose the accepted-state transition through the same domain boundary as revision.

**Contract**: Add an exported operation that calls `supabase.rpc('accept_training_plan', ...)`, maps the returned row, treats an already accepted result as success, and maps no returned row to the same safe conflict class. It performs no OpenRouter call and never mutates revision metadata or feedback.

### Success Criteria:

#### Automated Verification:

- Revision and acceptance form parsers reject malformed IDs/timestamps and blank inputs before side effects; revision notes over 2,000 characters are rejected.
- First generation and revision share the same strict complete-plan parser and OpenRouter response schema.
- Revision reads by explicit owner/plan/intake identity and does not rely on the latest intake lookup.
- Revision performs a preflight snapshot check, validates provider output, and persists only through `revise_training_plan` RPC.
- Acceptance persists only through `accept_training_plan` RPC and makes no provider call.
- Service error classes distinguish invalid request, generation/validation failure, conflict, and persistence failure without exposing private payloads.

#### Manual Verification:

- Review confirms a correction request cannot override saved/submitted constraints or the F-02 no-diagnosis boundary.
- Review confirms invalid provider output and RPC conflicts leave intake, plan, metadata, status, and feedback unchanged.
- Review confirms revising an accepted plan returns a draft with cleared `acceptedAt` and incremented revision metadata.
- Review confirms accepting a draft sets `acceptedAt`, while accepting an accepted plan is an idempotent success.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Authenticated Plan Action Routes

### Overview

Add thin POST routes for revision and acceptance, sharing the established same-origin/authentication pattern and returning only enumerated dashboard status codes.

### Changes Required:

#### 1. Same-Origin Request Helper

**File**: `src/lib/request-security.ts`

**Intent**: Reuse the existing origin validation instead of copying a security-sensitive implementation across three mutation routes.

**Contract**: Extract or add a server helper with the current generate-route behavior: require an `Origin` header, parse it safely, and compare its normalized origin to the request URL origin. Update generation to import this helper without weakening existing behavior.

#### 2. Revision API Route

**File**: `src/pages/api/training-plans/revise.ts`

**Intent**: Connect the dashboard revision form to the domain service.

**Contract**: Export `prerender = false` and `POST`. Require same-origin, configured Supabase, and an authenticated user from locals or `auth.getUser()`. Parse native `FormData` through the revision schema, invoke the service, and redirect to `/dashboard?planAction=revised` on success.

Map failures to enumerated `planError` codes for request-not-allowed, Supabase not configured, sign-in required, invalid request, OpenRouter not configured, invalid revision, plan conflict, and save failure. Never echo a plan id, timestamp, correction request, constraints, prompt, raw output, provider message, or database message in the URL or logs.

#### 3. Acceptance API Route

**File**: `src/pages/api/training-plans/accept.ts`

**Intent**: Connect the draft acceptance action to the transactional service without involving the model.

**Contract**: Apply the same same-origin, Supabase, authentication, form-validation, and safe-redirect boundaries. Redirect to `/dashboard?planAction=accepted` for both a successful transition and an idempotent already-accepted result. Return `planError=plan-conflict` for a stale/missing/foreign draft target and `planError=save-failed` for sanitized persistence failure.

### Success Criteria:

#### Automated Verification:

- Both new API files export `prerender = false` and uppercase `POST` handlers.
- Generation, revision, and acceptance use the shared same-origin helper.
- Both routes use the cookie-based Supabase SSR client and explicit authenticated user id; neither uses a service-role client.
- Form data is parsed by Zod-backed service contracts before action calls.
- Success and failure redirects contain only enumerated `planAction`/`planError` codes.

#### Manual Verification:

- Unauthenticated, cross-origin, unconfigured, invalid, foreign, and stale requests cannot mutate a plan.
- Revision maps model/config/output failures to generic user-facing codes while acceptance never invokes OpenRouter.
- URL and logging review finds no revision note, health constraint, plan content, prompt, raw output, or provider/database error detail.
- Duplicate acceptance resolves as success, while an old acceptance form cannot accept a newer revised draft.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Dashboard Revision and Acceptance Experience

### Overview

Turn the stored-plan dashboard state into a complete review loop with clear draft/accepted semantics, one correction request, editable durable constraints, pending states, safety copy, and conflict feedback.

### Changes Required:

#### 1. Plan Revision Form Island

**File**: `src/components/plans/PlanRevisionForm.tsx`

**Intent**: Provide focused client validation and pending feedback for the richer revision form while preserving a native server POST.

**Contract**: Add a controlled React form posting to `/api/training-plans/revise` with hidden `planId` and `expectedUpdatedAt`, one correction-request textarea, and a separately labeled health-constraints textarea prefilled from the plan's source intake. Validate required trimmed values and the 2,000-character correction limit client-side, set accessible field errors, and use existing `cn()`, button, error, and pending-state conventions.

Include visible reminder-only safety copy: revisions still respect provided constraints; changed pain, symptoms, or professional guidance belong in the constraints field; TrAIner does not diagnose or replace a professional. For an accepted plan, explain that a successful revision reopens it as a draft. Explain that prior feedback, if any, remains attached and may refer to earlier content. Do not add acknowledgement controls.

#### 2. Dashboard Lifecycle Data and Messages

**File**: `src/pages/dashboard.astro`

**Intent**: Render lifecycle state from the stored row and give safe feedback after action redirects.

**Contract**: Replace hard-coded draft copy with status-aware title, badge, timestamps, revision count, and last-revision context. Continue loading the latest intake and its plan server-side, then pass exact plan id/snapshot and current constraints to the revision island. Map known `planAction` and `planError` codes to safe success/error banners; unknown values get one generic action failure. Keep existing generation messages working.

#### 3. Draft Acceptance Action

**File**: `src/pages/dashboard.astro`

**Intent**: Let the user explicitly mark the current reviewed draft as the plan they intend to follow.

**Contract**: Show a POST form to `/api/training-plans/accept` only for `draft`, with hidden `planId` and `expectedUpdatedAt`, concise acceptance meaning, and submit disabling/pending copy. Hide the action for accepted plans and show the accepted timestamp instead. Acceptance is not presented as medical clearance or a safety guarantee.

#### 4. Responsive and Accessible Action States

**File**: `src/pages/dashboard.astro`

**Intent**: Extend the current inline plan view without making the primary plan content or actions difficult to use on mobile.

**Contract**: Place review actions in a clear order after/beside the plan without obscuring the explanation, workouts, progression, or safety notes. Preserve long-text wrapping, visible labels, focus styles, semantic status/error messaging, and disabled submit states. Extend the existing dashboard submit script only for native forms not managed by React; do not duplicate listeners on the revision island.

### Success Criteria:

#### Automated Verification:

- The revision island posts explicit plan/snapshot identity and includes one correction field plus a separate prefilled constraints field.
- Client validation blocks blank revision/constraint values and correction requests over 2,000 characters.
- The dashboard renders draft versus accepted state, revision metadata, safe action banners, and the appropriate acceptance action.
- Draft and accepted plans both expose revision, while only drafts expose acceptance.
- Revision and acceptance submits show pending/disabled states without duplicate handler ownership.
- User-provided and generated text retains responsive wrapping and no raw JSON is introduced.

#### Manual Verification:

- A user can revise a draft, see the complete replacement, review updated rationale/safety notes, and then accept it.
- A user can revise an accepted plan, including changing constraints, and see it reopen as a draft.
- The UI clearly warns that prior workout feedback remains attached and may describe an earlier plan version.
- Stale-tab conflicts show a refresh-and-retry message and do not silently replace the visible plan.
- Safety copy remains reminder-only, visible, non-diagnostic, and free of acknowledgement or blocking controls.
- The full review flow is keyboard-usable and readable on current mobile and desktop layouts.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 5: Verification and Handoff

### Overview

Run the existing repository checks plus a risk-focused manual matrix for atomicity, concurrency, lifecycle transitions, privacy, safety, and preserved feedback.

### Changes Required:

#### 1. Automated Repository Checks

**File**: repository verification commands

**Intent**: Verify migrations and application code through the project's current quality gates without adding test infrastructure.

**Contract**: Run `npx supabase db reset` when local Supabase/Docker is available, then `npx astro sync`, `npm run lint`, and `npm run build` with required Supabase/OpenRouter environment values. Record any unavailable environment check explicitly rather than bypassing it.

#### 2. Manual Lifecycle and Failure Matrix

**File**: manual authenticated flow

**Intent**: Exercise the behaviors that lint/build cannot prove and that carry the highest product risk.

**Contract**: Verify successful draft revision, acceptance, accepted-plan revision/reopening, unchanged constraints, changed constraints, provider/config/invalid-output failure, persistence failure, duplicate acceptance, parallel revisions, revise-versus-accept conflict, stale/foreign ids, and long/blank input. Inspect the database after failure/conflict cases to confirm no partial intake/plan/metadata changes.

#### 3. Feedback, Privacy, and Safety Review

**File**: manual data and UI review

**Intent**: Confirm the user's deliberate mutable-plan behavior does not silently mutate historical feedback or weaken existing boundaries.

**Contract**: Seed or inspect a feedback row for the plan, revise/reopen it, and confirm the feedback row remains byte-for-byte unchanged even if workout keys change. Confirm all plan/intake reads and mutations remain owner-scoped, URLs/logs contain no private text or raw model/provider details, and all revision/acceptance copy avoids diagnosis, clearance, safety guarantees, or stored acknowledgement.

#### 4. Plan Progress Handoff

**File**: `context/changes/plan-revision-and-acceptance/plan.md`

**Intent**: Keep the canonical execution state ready for phase-by-phase implementation.

**Contract**: Implementers update only the matching `## Progress` rows as each criterion is verified, append the closing commit SHA at phase end, and do not rename step titles.

### Success Criteria:

#### Automated Verification:

- `npx supabase db reset` completes when local Supabase/Docker is available.
- `npx astro sync` completes successfully.
- `npm run lint` completes successfully.
- `npm run build` completes successfully with required environment values.
- `git status --short` shows only files expected by this implementation.

#### Manual Verification:

- The full draft revision, acceptance, accepted-plan reopening, and re-acceptance loop works for the owner.
- Generation, validation, database, stale-snapshot, and duplicate-submit scenarios preserve atomic state and show safe feedback.
- Existing workout feedback remains unchanged and attached after plan content changes.
- No private intake/revision text, prompt, raw output, provider detail, or database detail appears in URLs or logs.
- Mobile/desktop and keyboard review confirms usable forms, plan content, pending states, status messaging, and safety copy.
- Human confirms S-03 does not add version history, chat, feedback editing, medical gates, or test infrastructure.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before marking the change implemented.

---

## Accepted Implementation Addendum — Revision Summary

**Accepted**: 2026-08-21

Implementation may persist a model-generated `last_revision_summary` for the latest successful revision.

- A follow-up migration adds the nullable column with a 600-character limit.
- The revision RPC accepts and stores the validated summary atomically.
- Revision responses extend the shared complete-plan payload with `revisionSummary`; the nested plan contract remains shared.
- The dashboard may display the summary as “What changed”.
- No revision history or prior summaries are retained.
- Rollback requires removing the UI/service field, restoring the previous RPC signature, and dropping the column and constraint.

---

## Testing Strategy

### Unit Tests:

- No unit-test framework or test script is added in S-03, per the selected scope and the repository's separate quality-strategy workflow.
- Zod contracts, output validation reuse, domain errors, and RPC result mapping are verified by lint/build plus focused code review and manual failure injection.

### Integration Tests:

- Use local Supabase to exercise both authenticated RPCs with matching, stale, missing, and foreign snapshots.
- Verify the revision RPC updates the source intake and plan together and that a forced failure leaves both unchanged.
- Verify concurrent mutation behavior with two authenticated browser tabs or equivalent sequential stale form submissions.
- Verify a feedback row survives accepted-plan reopening and later plan-content overwrite unchanged.

### Manual Testing Steps:

1. Reset local Supabase and sign in as the owner of a generated draft.
2. Submit blank and oversized correction requests and confirm client/server rejection without a provider call.
3. Submit a valid correction with unchanged constraints and confirm a complete replacement, incremented count, latest note/time, and `draft` status.
4. Change health constraints during another revision and confirm intake and plan update together only after valid model output.
5. Force provider/config/invalid-output failure and confirm no intake, plan, status, timestamp, revision metadata, or feedback change.
6. Accept the draft and confirm database-time `acceptedAt`, accepted UI, hidden accept action, and no model call.
7. Repeat acceptance and confirm idempotent success without another state change.
8. Revise the accepted plan and confirm it reopens as draft with cleared `acceptedAt`.
9. Seed/retain workout feedback, revise the plan so workout keys may differ, and confirm the feedback row is untouched.
10. Open the same plan in two tabs; submit two revisions and confirm only one snapshot wins.
11. Race revision against acceptance and confirm the stale operation reports conflict without overwriting the winner.
12. Submit missing/foreign plan ids and confirm no ownership disclosure or mutation.
13. Inspect URLs and logs for private inputs, prompts, raw output, provider details, and database details.
14. Complete keyboard, mobile, and desktop review of revision, pending, error, draft, accepted, and safety states.

## Performance Considerations

Each revision uses one preflight read, one owner-scoped intake read, one bounded non-streaming OpenRouter call, and one short RPC. The model call deliberately happens before row locking, so database locks remain brief; the tradeoff is that a losing concurrent request can consume a provider call before its snapshot conflict is detected. The MVP accepts that cost instead of introducing persisted locks, queues, or generation idempotency.

Send only the current intake context, current complete plan, and one bounded correction request to the provider. Continue enforcing 2-5 workouts so prompt/response size and dashboard rendering remain predictable. Existing owner/intake indexes and primary keys are sufficient for the RPC lookups.

## Migration Notes

The initial lifecycle migration is additive and introduces functions only. The accepted revision-summary addendum adds a follow-up migration with one nullable column and replaces the revision function signature to accept the validated summary. Neither migration rewrites existing rows or changes the status vocabulary.

Rollback of the addendum requires removing the summary UI/service field, restoring the previous revision function signature, and dropping the summary constraint and column. Rolling back the remaining application code without dropping the lifecycle functions is safe because no pre-S-03 path calls them.

Applying the migration grants authenticated users only function execution in addition to their existing table privileges and RLS policies. If a local reset is unavailable, the SQL still requires manual review of function ownership, `SECURITY INVOKER`, empty `search_path`, grants, row locking, snapshot comparison, and all-or-nothing update order before remote application.

## References

- Change identity: `context/changes/plan-revision-and-acceptance/change.md`
- Roadmap S-03: `context/foundation/roadmap.md:112`
- PRD revision and acceptance requirements: `context/foundation/prd.md:70`
- Revision safety boundary: `context/foundation/training-safety-boundaries.md:105`
- Overwrite lifecycle handoff: `context/changes/minimal-planning-data-contract/plan.md:228`
- Related first-plan research: `context/changes/first-explained-training-plan/research.md`
- Existing output and persistence service: `src/lib/services/training-plans.ts:101`, `src/lib/services/training-plans.ts:270`
- Existing intake service: `src/lib/services/training-intakes.ts:69`
- Existing mutation-route pattern: `src/pages/api/training-plans/generate.ts:26`
- Current plan UI: `src/pages/dashboard.astro:160`
- Planning schema and RLS: `supabase/migrations/20260602233915_create_planning_contract.sql:36`, `supabase/migrations/20260602233915_create_planning_contract.sql:167`
- Supabase database functions: `https://supabase.com/docs/guides/database/functions`
- Supabase JavaScript RPC: `https://supabase.com/docs/reference/javascript/rpc`
- Supabase RLS guidance: `https://supabase.com/docs/guides/database/postgres/row-level-security`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Transactional Database Lifecycle Contract

#### Automated

- [x] 1.1 The timestamped migration creates both `public.revise_training_plan` and `public.accept_training_plan`. — bea188b
- [x] 1.2 `npx supabase db reset` applies the full migration chain when local Supabase/Docker is available. — bea188b
- [x] 1.3 Static inspection confirms both functions use `SECURITY INVOKER`, an empty `search_path`, fully qualified objects, and explicit owner/snapshot checks. — bea188b
- [x] 1.4 Static inspection confirms `PUBLIC` and `anon` execution are revoked and only `authenticated` receives `EXECUTE`. — bea188b
- [x] 1.5 The migration does not add or alter planning tables, RLS policies, status values, or feedback columns. — bea188b

#### Manual

- [x] 1.6 SQL review confirms revision updates intake and plan in one transaction and returns no partial state on failure. — bea188b
- [x] 1.7 SQL review confirms a stale or foreign target changes no row and does not disclose ownership. — bea188b
- [x] 1.8 SQL review confirms acceptance is idempotent for an already accepted row but cannot accept a newer draft with an old snapshot. — bea188b
- [x] 1.9 SQL review confirms revision reopens accepted plans and leaves all workout feedback untouched. — bea188b

### Phase 2: Revision and Acceptance Service Logic

#### Automated

- [x] 2.1 Revision and acceptance form parsers reject malformed IDs/timestamps and blank inputs before side effects; revision notes over 2,000 characters are rejected. — 43451ce
- [x] 2.2 First generation and revision share the same strict complete-plan parser and OpenRouter response schema. — 43451ce
- [x] 2.3 Revision reads by explicit owner/plan/intake identity and does not rely on the latest intake lookup. — 43451ce
- [x] 2.4 Revision performs a preflight snapshot check, validates provider output, and persists only through `revise_training_plan` RPC. — 43451ce
- [x] 2.5 Acceptance persists only through `accept_training_plan` RPC and makes no provider call. — 43451ce
- [x] 2.6 Service error classes distinguish invalid request, generation/validation failure, conflict, and persistence failure without exposing private payloads. — 43451ce

#### Manual

- [x] 2.7 Review confirms a correction request cannot override saved/submitted constraints or the F-02 no-diagnosis boundary. — 43451ce
- [x] 2.8 Review confirms invalid provider output and RPC conflicts leave intake, plan, metadata, status, and feedback unchanged. — 43451ce
- [x] 2.9 Review confirms revising an accepted plan returns a draft with cleared `acceptedAt` and incremented revision metadata. — 43451ce
- [x] 2.10 Review confirms accepting a draft sets `acceptedAt`, while accepting an accepted plan is an idempotent success. — 43451ce

### Phase 3: Authenticated Plan Action Routes

#### Automated

- [x] 3.1 Both new API files export `prerender = false` and uppercase `POST` handlers. — c53b1b1
- [x] 3.2 Generation, revision, and acceptance use the shared same-origin helper. — c53b1b1
- [x] 3.3 Both routes use the cookie-based Supabase SSR client and explicit authenticated user id; neither uses a service-role client. — c53b1b1
- [x] 3.4 Form data is parsed by Zod-backed service contracts before action calls. — c53b1b1
- [x] 3.5 Success and failure redirects contain only enumerated `planAction`/`planError` codes. — c53b1b1

#### Manual

- [x] 3.6 Unauthenticated, cross-origin, unconfigured, invalid, foreign, and stale requests cannot mutate a plan. — c53b1b1
- [x] 3.7 Revision maps model/config/output failures to generic user-facing codes while acceptance never invokes OpenRouter. — c53b1b1
- [x] 3.8 URL and logging review finds no revision note, health constraint, plan content, prompt, raw output, or provider/database error detail. — c53b1b1
- [x] 3.9 Duplicate acceptance resolves as success, while an old acceptance form cannot accept a newer revised draft. — c53b1b1

### Phase 4: Dashboard Revision and Acceptance Experience

#### Automated

- [x] 4.1 The revision island posts explicit plan/snapshot identity and includes one correction field plus a separate prefilled constraints field. — 2eb4e6b
- [x] 4.2 Client validation blocks blank revision/constraint values and correction requests over 2,000 characters. — 2eb4e6b
- [x] 4.3 The dashboard renders draft versus accepted state, revision metadata, safe action banners, and the appropriate acceptance action. — 2eb4e6b
- [x] 4.4 Draft and accepted plans both expose revision, while only drafts expose acceptance. — 2eb4e6b
- [x] 4.5 Revision and acceptance submits show pending/disabled states without duplicate handler ownership. — 2eb4e6b
- [x] 4.6 User-provided and generated text retains responsive wrapping and no raw JSON is introduced. — 2eb4e6b

#### Manual

- [x] 4.7 A user can revise a draft, see the complete replacement, review updated rationale/safety notes, and then accept it. — 2eb4e6b
- [x] 4.8 A user can revise an accepted plan, including changing constraints, and see it reopen as a draft. — 2eb4e6b
- [x] 4.9 The UI clearly warns that prior workout feedback remains attached and may describe an earlier plan version. — 2eb4e6b
- [x] 4.10 Stale-tab conflicts show a refresh-and-retry message and do not silently replace the visible plan. — 2eb4e6b
- [x] 4.11 Safety copy remains reminder-only, visible, non-diagnostic, and free of acknowledgement or blocking controls. — 2eb4e6b
- [x] 4.12 The full review flow is keyboard-usable and readable on current mobile and desktop layouts. — 2eb4e6b

### Phase 5: Verification and Handoff

#### Automated

- [x] 5.1 `npx supabase db reset` completes when local Supabase/Docker is available. — fdccf45
- [x] 5.2 `npx astro sync` completes successfully. — fdccf45
- [x] 5.3 `npm run lint` completes successfully. — fdccf45
- [x] 5.4 `npm run build` completes successfully with required environment values. — fdccf45
- [x] 5.5 `git status --short` shows only files expected by this implementation. — fdccf45

#### Manual

- [x] 5.6 The full draft revision, acceptance, accepted-plan reopening, and re-acceptance loop works for the owner. — fdccf45
- [x] 5.7 Generation, validation, database, stale-snapshot, and duplicate-submit scenarios preserve atomic state and show safe feedback. — fdccf45
- [x] 5.8 Existing workout feedback remains unchanged and attached after plan content changes. — fdccf45
- [x] 5.9 No private intake/revision text, prompt, raw output, provider detail, or database detail appears in URLs or logs. — fdccf45
- [x] 5.10 Mobile/desktop and keyboard review confirms usable forms, plan content, pending states, status messaging, and safety copy. — fdccf45
- [x] 5.11 Human confirms S-03 does not add version history, chat, feedback editing, medical gates, or test infrastructure. — fdccf45
