# Post-Workout Feedback Implementation Plan

## Overview

Build roadmap slice S-04 so an authenticated user can record a completed workout from an accepted training plan and review recent feedback for that specific workout. A feedback entry captures a required perceived-difficulty rating, optional satisfaction and notes, and an editable calendar date. The change records and displays feedback only; it does not automatically revise a plan or send feedback to OpenRouter.

The implementation extends the existing Astro SSR, React form, Zod validation, Supabase RLS, and POST/redirect/GET patterns. A narrowly scoped database function is the exclusive feedback mutation boundary so accepted-plan status, current workout membership, append-only history, and idempotency remain true under direct API access and concurrent plan revision.

## Current State Analysis

The dashboard renders the current plan and its scheduled workouts, but those workout cards are static. There is no workout-session, completion, feedback service, API route, or feedback UI. Plan acceptance is already implemented, and revising an accepted plan reopens the same plan row as a draft.

The foundation schema already contains `workout_feedback` with owner and plan linkage, a stable workout key and label snapshot, difficulty `1..10`, optional satisfaction `1..5`, optional notes, and `performed_at`. Owner-only RLS exists, but authenticated users can currently insert, update, and delete their rows directly. Those privileges would bypass accepted-plan, current-key, idempotency, and append-only rules if left in place.

The project has no automated test runner. CI currently runs Astro sync, lint, and build, so risk-specific database exercises and a durable manual verification record are required for behavior that static checks cannot prove.

## Desired End State

Each workout card in an accepted plan links to a dedicated feedback page. The user can submit one completed-workout entry with a local calendar date, required difficulty, optional satisfaction, and optional notes. Repeated performances use distinct submission tokens and create distinct rows, while replaying the same form token with the same payload returns the original row without duplication.

The dedicated page shows at most the 50 newest owner-scoped entries for that plan and workout key. When a revision reopens the plan as a draft, existing history remains readable but new submissions are blocked. When a later plan version removes the workout key, a previously known direct URL can still show preserved history using stored labels, but it cannot create new feedback.

Verification is complete when the migration applies, mutation privileges and RPC grants match the exclusive boundary, repository checks pass, and the manual matrix proves privacy, date handling, idempotency, plan-revision serialization, historical preservation, accessibility, and responsive behavior.

### Key Discoveries:

- The roadmap requires simple feedback only after an accepted plan: `context/foundation/roadmap.md:125`.
- The existing feedback table already models one record per performed workout and allows repeated keys: `supabase/migrations/20260602233915_create_planning_contract.sql:76`.
- Scheduled workouts have stable unique keys suitable for route and feedback identity: `src/types.ts:22`, `src/lib/services/training-plans.ts:96`.
- The current dashboard has no completion action; the workout-card header is the natural CTA integration point: `src/pages/dashboard.astro:330`.
- Revision deliberately preserves feedback even when workout content or keys change: `context/archive/2026-08-12-plan-revision-and-acceptance/plan-brief.md:20`.
- Existing owner mutation policies do not enforce accepted status, current workout membership, idempotency, or append-only history: `supabase/migrations/20260602233915_create_planning_contract.sql:198`.
- The S-03 implementation review identified direct table privileges as a bypass of RPC-owned lifecycle rules: `context/archive/2026-08-12-plan-revision-and-acceptance/reviews/impl-review.md:49`.
- Existing routes and forms provide same-origin, authentication, safe redirect, accessible validation, and pending-state patterns: `src/pages/api/training-plans/accept.ts:25`, `src/components/plans/PlanRevisionForm.tsx:39`.
- CI has no unit or browser test stage: `.github/workflows/ci.yml:18`, `package.json:5`.

## What We're NOT Doing

- Building a workout timer, active session, set/rep tracker, exercise log, or completion checklist.
- Sending feedback to OpenRouter or automatically adapting/revising a training plan.
- Adding dashboard-wide or global feedback history, analytics, charts, trends, pagination, or load-more behavior.
- Adding feedback editing or deletion in UI, API, service, or direct authenticated table access.
- Adding plan version history or remapping historical feedback after a plan revision.
- Adding a new test framework, test script, Playwright suite, or CI stage.
- Collecting an exact workout time; the selected contract is a calendar date.
- Adding medical interpretation, diagnosis, risk scoring, or runtime health gates.
- Adding trainer, admin, shared-plan, or cross-user behavior.
- Writing to `context/archive/`.

## Implementation Approach

Use a stable page URL, `/dashboard/plans/[planId]/workouts/[workoutKey]/feedback`, with a matching dynamic POST endpoint. Route parameters carry canonical plan/workout identity; the browser never supplies a trusted workout label. The Astro page owner-reads the explicit plan and feedback history, mounts a React form only for a current workout in an accepted plan, and always renders permitted historical rows independently of current JSON membership.

Add one forward Supabase migration that introduces a per-user submission token and a narrow `submit_workout_feedback` function. The function runs as `SECURITY DEFINER` with an empty search path, explicit `auth.uid()` checks, fully qualified objects, exact grants, and a plan lock that serializes against revision. Direct authenticated insert/update/delete access is removed; owner-scoped SELECT remains for the history page.

The new service owns FormData normalization, Zod validation, RPC invocation, row mapping, exact history reads, and sanitized domain errors. The API remains thin and redirects only enumerated status codes. No feedback reaches the AI revision path in this slice.

## Critical Implementation Details

### Timing & lifecycle

The RPC must acquire a plan lock that conflicts with S-03 revision's `FOR UPDATE` lock before it validates accepted status and current workout membership. If feedback wins, it records against the accepted pre-revision plan and revision proceeds afterward; if revision wins, the awakened submission observes a draft and creates nothing.

### State sequencing

An exact submission-token replay is resolved before current plan-state validation, so a lost response can still return the original row after a later revision. Reusing a token with a different canonical payload must fail. The insert path must also handle two simultaneous first uses of the same token without creating two rows.

### User experience spec

The performed date is a calendar value, not a time instant. The form submits the browser's IANA time zone; the RPC validates the selected date against the plan's acceptance day and current day in that zone, stores a canonical UTC-midnight timestamp, and history renders the date as UTC/raw ISO so it never shifts to an adjacent day.

## Phase 1: Atomic Feedback Persistence Contract

### Overview

Make feedback submission idempotent, accepted-plan-only, current-workout-only, private, and append-only at the database boundary.

### Changes Required:

#### 1. Feedback Submission Migration

**File**: `supabase/migrations/<timestamp>_add_workout_feedback_submission_rpc.sql`

**Intent**: Extend the existing table with transport-level idempotency without changing its one-row-per-performance model.

**Contract**: Add nullable `submission_token uuid`, backfill existing rows with unique generated UUIDs, make the column non-null, and add a unique constraint on `(user_id, submission_token)`. Do not add a database default and do not add uniqueness on workout key or performed date. Existing feedback rows and plan relationships remain unchanged.

#### 2. Exclusive Submission RPC

**File**: `supabase/migrations/<timestamp>_add_workout_feedback_submission_rpc.sql`

**Intent**: Enforce every first-write invariant atomically instead of trusting client fields or a preflight application read.

**Contract**: Add `public.submit_workout_feedback` accepting plan UUID, workout key, difficulty, optional satisfaction, optional notes, performed calendar date, IANA time zone, and submission token. It returns one `workout_feedback` row for a successful insert or an exact replay. The function must:

- Resolve ownership only through `auth.uid()` and accept no user ID or workout label.
- Normalize the key and notes; enforce difficulty `1..10`, satisfaction `null|1..5`, and notes `null|1..2000`.
- Resolve an existing owner/token row first, returning it only when the canonical payload is identical.
- Lock the owner plan, require `accepted` status and `accepted_at`, and serialize against revision.
- Safely locate the exact key in `plan_content.scheduledWorkouts` and snapshot its current label.
- Validate the IANA zone and require the performed date to be no earlier than the local acceptance date and no later than the current local date.
- Insert with conflict-safe token handling; a concurrent identical replay returns the winner, while altered token reuse fails.
- Leave all historical feedback unchanged during plan revisions.

#### 3. Privileges and Append-Only Boundary

**File**: `supabase/migrations/<timestamp>_add_workout_feedback_submission_rpc.sql`

**Intent**: Prevent direct Supabase REST mutations from bypassing the selected product rules.

**Contract**: Run the function as tightly scoped `SECURITY DEFINER`, set `search_path = ''`, fully qualify all objects/functions, and explicitly check `auth.uid()`. Revoke direct authenticated `INSERT`, `UPDATE`, and `DELETE` privileges on `workout_feedback`, remove the corresponding mutation policies, preserve owner-only SELECT RLS, revoke function execution from broad roles, and grant the exact signature only to `authenticated`.

### Success Criteria:

#### Automated Verification:

- Timestamped migration adds, backfills, and constrains the submission token without deleting feedback.
- `npx supabase db reset` applies the full migration chain.
- Schema inspection confirms unique `(user_id, submission_token)` and no workout/date uniqueness.
- Privilege inspection confirms authenticated SELECT remains while direct INSERT, UPDATE, and DELETE are unavailable.
- Function inspection confirms fixed search path, fully qualified references, explicit owner checks, exact grants, and no anonymous/service-role execution.

#### Manual Verification:

- SQL review confirms plan revision and feedback submission serialize through conflicting plan locks.
- SQL review confirms a first insert derives the label from the current accepted plan and an exact replay cannot create another row.
- SQL review confirms historical rows remain unchanged and direct owner mutations cannot bypass append-only behavior.

**Implementation Note**: After completing this phase and all automated verification passes, pause for human confirmation before proceeding.

---

## Phase 2: Feedback Domain Service

### Overview

Add the typed validation, persistence, history, and error boundary consumed by the page and endpoint.

### Changes Required:

#### 1. Feedback Input and Row Contracts

**File**: `src/lib/services/workout-feedback.ts`

**Intent**: Normalize untrusted form values and map database rows without expanding the public entity with the internal token.

**Contract**: Define private Supabase row/input shapes and Zod-backed parsing for route plan/key identity, UUID submission token, integer ratings, optional trimmed notes capped at 2,000 characters, `YYYY-MM-DD` performed date, and bounded IANA time-zone text. Empty satisfaction and notes normalize to `null`.

#### 2. Submission Operation and Errors

**File**: `src/lib/services/workout-feedback.ts`

**Intent**: Keep HTTP code unaware of database details and expose only stable domain outcomes.

**Contract**: Add a submission operation that calls only `submit_workout_feedback`, maps exactly one returned row to `WorkoutFeedback`, and classifies invalid input, unavailable plan/workout state, idempotency conflict, and persistence failure without exposing ownership, notes, SQL, or raw database messages.

#### 3. Owner-Scoped Context and History Reads

**File**: `src/lib/services/workout-feedback.ts`

**Intent**: Support a dedicated page for current and historical workout keys without adding dashboard queries.

**Contract**: Read the explicit plan by owner/id and query feedback by owner, plan, and exact workout key, ordered by `performed_at DESC, created_at DESC`, limited to 50 rows. Return enough context to distinguish current accepted workout, current draft workout, removed key with history, and unavailable key with no history. Render history from stored label/key snapshots rather than joining them back to current plan content.

### Success Criteria:

#### Automated Verification:

- Zod parsing rejects malformed route identities, tokens, dates, zones, ratings, and oversized notes before RPC invocation.
- Empty optional satisfaction and notes normalize to `null`.
- Submission persists only through the named RPC and maps one row or a sanitized domain error.
- History reads are owner/plan/key scoped, deterministically ordered, and bounded to 50.
- `npx astro sync` and `npm run lint` pass.

#### Manual Verification:

- Review confirms no client-supplied label or user ID reaches persistence.
- Review confirms no feedback content is added to OpenRouter prompts or plan-revision inputs.
- Review confirms removed-key history depends on stored snapshots, not current plan membership.

**Implementation Note**: After completing this phase and all automated verification passes, pause for human confirmation before proceeding.

---

## Phase 3: Authenticated Feedback Endpoint

### Overview

Expose submission through a thin POST route that follows existing security and redirect conventions.

### Changes Required:

#### 1. Dynamic Feedback POST Route

**File**: `src/pages/api/training-plans/[planId]/workouts/[workoutKey]/feedback.ts`

**Intent**: Accept native form submissions without trusting hidden plan/workout identity or leaking private values in redirects.

**Contract**: Export `prerender = false` and uppercase `POST`. Reject non-same-origin requests, create the cookie-backed Supabase client, resolve the authenticated user, combine decoded route params with FormData, call the service, and redirect to the canonical dedicated page. Success uses `feedbackAction=saved#feedback-history`; failures use enumerated codes for invalid request, unavailable plan/workout state, token conflict, and save failure. Missing and foreign resources share the same safe outcome.

### Success Criteria:

#### Automated Verification:

- Route exports `prerender = false` and uppercase `POST`.
- Same-origin and authenticated-user checks happen before submission.
- Route identity comes from decoded URL params; form data contains no trusted label or user ID.
- Redirect URLs contain only enumerated codes and canonical encoded identity.
- `npm run lint` passes.

#### Manual Verification:

- Unauthenticated, cross-origin, foreign, missing, draft, and removed-key submissions create no row and reveal no ownership details.
- URLs and logs contain no notes, database messages, or private payloads.
- Valid success and every known failure return understandable safe page messaging.

**Implementation Note**: After completing this phase and all automated verification passes, pause for human confirmation before proceeding.

---

## Phase 4: Dedicated Feedback Experience

### Overview

Add the selected per-workout entry point, accessible form, and append-only recent history without turning the dashboard into a workout tracker.

### Changes Required:

#### 1. Dashboard Workout CTA

**File**: `src/pages/dashboard.astro`

**Intent**: Make feedback discoverable only when the displayed plan is ready to follow.

**Contract**: Add a `Log completed workout` link to each scheduled-workout card only when `storedPlan.status === 'accepted'`. Build the canonical URL from encoded plan ID and stable workout key. Do not add active-session controls or load feedback on the dashboard.

#### 2. Dedicated Feedback Page

**File**: `src/pages/dashboard/plans/[planId]/workouts/[workoutKey]/feedback.astro`

**Intent**: Present one focused mobile-friendly place for submitting and reviewing the selected workout's feedback.

**Contract**: Owner-load explicit plan/workout context and recent history. Show plan/workout identity, back navigation, safe status/error banners, and the form only when the current plan is accepted and still contains the key. A draft or removed key with history remains read-only with explanatory copy. A missing/foreign plan or absent key with no history gets one non-disclosing unavailable state.

Render at most 50 entries newest first with stored workout label fallback, performed calendar date, difficulty, optional satisfaction, and optional notes. Show no edit/delete controls. When plan revisions may have changed the same key's content, state that earlier entries can describe an older version.

#### 3. Feedback Form Island

**File**: `src/components/workouts/PostWorkoutFeedbackForm.tsx`

**Intent**: Collect the agreed minimal feedback with clear rating semantics and resilient native POST behavior.

**Contract**: Render required difficulty radio controls `1..10`, optional satisfaction controls `1..5` with a clear unset choice, optional notes capped at 2,000 characters, and a required date input initialized to the browser's local day. Generate one UUID token per form instance, retain it throughout retries, and submit the browser IANA time zone. Provide associated labels/legends, hints, character count, `aria-invalid`/`aria-describedby`, inline `role='alert'` errors, and a disabled pending state.

### Success Criteria:

#### Automated Verification:

- Accepted workout cards expose canonical feedback links; draft cards do not.
- Dedicated page gates the form by current accepted membership while reading history independently.
- Form exposes the selected required/optional fields, one stable token, local date, and IANA zone.
- Client validation matches server bounds and pending state prevents repeat clicks.
- User and stored text keeps responsive wrapping; no raw JSON is rendered.
- `npx astro sync`, `npm run lint`, and `npm run build` pass.

#### Manual Verification:

- Keyboard-only users can operate both rating groups, date, notes, submit, and back navigation with visible focus.
- Mobile and desktop layouts keep the form, validation, workout context, and history readable.
- Draft and removed-key pages preserve readable history but clearly block new submission.
- Same-key history after revision warns that older entries may describe earlier content.

**Implementation Note**: After completing this phase and all automated verification passes, pause for human confirmation before proceeding.

---

## Phase 5: Verification and Handoff

### Overview

Run existing automated gates and preserve durable evidence for the database, security, lifecycle, history, date, and UI scenarios that require live verification.

### Changes Required:

#### 1. Automated Repository Checks

**File**: repository verification commands

**Intent**: Verify the forward migration and application using the project's current quality gates.

**Contract**: Run `npx supabase db reset`, `npx astro sync`, `npm run lint`, and `npm run build` with required environment values. Inspect final privileges/function grants and ensure `git status --short` contains only expected implementation and change artifacts.

#### 2. Durable Verification Record

**File**: `context/changes/post-workout-feedback/verification.md`

**Intent**: Avoid unverifiable manual checkbox claims by recording environment, scenarios, outcomes, and unavailable checks without private data.

**Contract**: Record results for valid boundary ratings, null optionals, note limit, acceptance-day/past/future dates, time-zone edges, exact token replay, altered token reuse, parallel replay, legitimate repeated performance, revision race, draft/re-accepted behavior, removed keys, cross-user access, direct-table privilege denial, safe redirects/logs, keyboard navigation, and mobile/desktop layout.

### Success Criteria:

#### Automated Verification:

- `npx supabase db reset` completes successfully.
- `npx astro sync` completes successfully.
- `npm run lint` completes successfully.
- `npm run build` completes successfully with required environment values.
- Final privilege/grant inspection matches the exclusive submission contract.
- `git status --short` contains only expected paths.

#### Manual Verification:

- Exact token replay keeps one row and the same ID; altered reuse fails; a new token permits another performance of the same workout/date.
- Date boundaries, UTC rendering, and representative time-zone edges preserve the selected calendar day.
- Submission and revision races produce one valid serial order without stale-key or draft feedback.
- Feedback remains unchanged/readable after revision; only current keys can accept new feedback after re-acceptance.
- Cross-user and direct REST mutation attempts are denied without disclosure.
- Authenticated owner flow, safe messages, keyboard controls, and mobile/desktop layouts are recorded in `verification.md`.

**Implementation Note**: After completing this phase and all automated verification passes, pause for human confirmation before marking the change implemented.

---

## Testing Strategy

### Unit Tests:

- Do not introduce a test runner in S-04; the repository has no test script or quality-plan artifact yet.
- Treat Zod contracts, RPC mapping, and view-state branching as mandatory code-review targets until the separate testing rollout establishes executable unit conventions.

### Integration Tests:

- Exercise the RPC against local Supabase for first insert, exact replay, changed-payload token reuse, concurrent identical tokens, accepted/draft/foreign plans, current/removed keys, rating bounds, date bounds, and revision locking.
- Inspect table privileges using authenticated access to confirm SELECT-only direct access and RPC-only mutation.
- Verify owner/plan/key history filtering with records from another workout, plan, and user.

### Manual Testing Steps:

1. Accept a plan and open each workout's dedicated feedback page from the dashboard.
2. Submit boundary ratings with blank and populated optional fields and confirm stored/rendered values.
3. Submit today, the acceptance day, a valid past day, a future day, and a pre-acceptance day.
4. Replay the same token, alter a replay payload, and submit a new token for the same workout/date.
5. Race submission against revision, then verify draft read-only behavior and re-accepted current-key behavior.
6. Revise away a workout key and confirm its known direct URL preserves history without a form.
7. Test foreign identifiers and direct authenticated table mutations without ownership disclosure.
8. Complete keyboard, mobile, desktop, URL, log, and private-text review.

## Performance Considerations

The dashboard adds links only and performs no feedback queries, avoiding per-workout N+1 reads. The dedicated page performs one owner-scoped plan read and one bounded history query. Existing owner/plan and owner/performed-time indexes are sufficient for the small-scale MVP; the unique submission-token index is required, but no analytics/history index is added until real query volume justifies it.

## Migration Notes

The migration is forward-only. Normal application rollback should remove S-04 page/service/route calls but leave the submission token, RPC, grants, and stored feedback intact. If an explicit database downgrade is unavoidable, first deploy code that no longer calls the RPC, then remove its grant/function and deliberately decide whether restoring direct mutation privileges is acceptable before dropping token metadata. Never delete feedback rows during rollback.

## References

- Change identity: `context/changes/post-workout-feedback/change.md`
- Roadmap S-04: `context/foundation/roadmap.md:125`
- PRD feedback requirement: `context/foundation/prd.md:74`
- Feedback schema and RLS: `supabase/migrations/20260602233915_create_planning_contract.sql:76`
- Plan lifecycle locks: `supabase/migrations/20260812235500_add_training_plan_revision_summary.sql:77`
- Workout identity and feedback types: `src/types.ts:22`, `src/types.ts:76`
- Existing plan service conventions: `src/lib/services/training-plans.ts:299`
- Existing POST route convention: `src/pages/api/training-plans/accept.ts:25`
- Existing accessible form convention: `src/components/plans/PlanRevisionForm.tsx:39`
- Dashboard workout cards: `src/pages/dashboard.astro:330`
- Historical feedback invariant: `context/archive/2026-08-12-plan-revision-and-acceptance/plan-brief.md:67`
- S-03 privilege review finding: `context/archive/2026-08-12-plan-revision-and-acceptance/reviews/impl-review.md:49`
- CI gates: `.github/workflows/ci.yml:18`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Atomic Feedback Persistence Contract

#### Automated

- [ ] 1.1 Timestamped migration adds, backfills, and constrains the submission token without deleting feedback.
- [ ] 1.2 `npx supabase db reset` applies the full migration chain.
- [ ] 1.3 Schema inspection confirms token uniqueness without workout/date uniqueness.
- [ ] 1.4 Privilege inspection confirms owner SELECT and RPC-only mutation.
- [ ] 1.5 Function inspection confirms the exclusive least-privilege contract.

#### Manual

- [ ] 1.6 Plan revision and feedback submission serialize through conflicting locks.
- [ ] 1.7 First insert snapshots the current label and exact replay creates no duplicate.
- [ ] 1.8 Historical rows are unchanged and direct owner mutation cannot bypass append-only behavior.

### Phase 2: Feedback Domain Service

#### Automated

- [ ] 2.1 Zod rejects malformed identities, tokens, dates, zones, ratings, and oversized notes before RPC invocation.
- [ ] 2.2 Empty optional satisfaction and notes normalize to null.
- [ ] 2.3 Submission uses only the RPC and maps one row or a sanitized error.
- [ ] 2.4 History reads are exact, deterministic, and limited to 50 rows.
- [ ] 2.5 `npx astro sync` and `npm run lint` pass.

#### Manual

- [ ] 2.6 Persistence trusts no client label or user ID.
- [ ] 2.7 Feedback does not enter OpenRouter or plan-revision inputs.
- [ ] 2.8 Removed-key history uses stored snapshots.

### Phase 3: Authenticated Feedback Endpoint

#### Automated

- [ ] 3.1 Dynamic route exports `prerender = false` and uppercase `POST`.
- [ ] 3.2 Same-origin and authentication checks precede submission.
- [ ] 3.3 Canonical plan/workout identity comes from decoded route parameters.
- [ ] 3.4 Redirects contain only enumerated codes and encoded canonical identity.
- [ ] 3.5 `npm run lint` passes.

#### Manual

- [ ] 3.6 Invalid and unavailable submissions create no row and disclose no ownership.
- [ ] 3.7 URLs and logs contain no private form or database details.
- [ ] 3.8 Success and known failure messages are safe and understandable.

### Phase 4: Dedicated Feedback Experience

#### Automated

- [ ] 4.1 Accepted cards expose feedback links and draft cards do not.
- [ ] 4.2 Dedicated page gates submission independently from history reads.
- [ ] 4.3 Form exposes the selected fields, stable token, local date, and IANA zone.
- [ ] 4.4 Client bounds and pending behavior match server contracts.
- [ ] 4.5 Text remains responsive and no raw JSON is rendered.
- [ ] 4.6 `npx astro sync`, `npm run lint`, and `npm run build` pass.

#### Manual

- [ ] 4.7 Rating, date, notes, submit, and navigation controls are keyboard-usable.
- [ ] 4.8 Mobile and desktop layouts keep context, validation, and history readable.
- [ ] 4.9 Draft and removed-key pages preserve history while blocking submission.
- [ ] 4.10 Revised same-key history explains that older entries may describe earlier content.

### Phase 5: Verification and Handoff

#### Automated

- [ ] 5.1 `npx supabase db reset` completes successfully.
- [ ] 5.2 `npx astro sync` completes successfully.
- [ ] 5.3 `npm run lint` completes successfully.
- [ ] 5.4 `npm run build` completes successfully with required environment values.
- [ ] 5.5 Final privilege and function grants match the exclusive submission contract.
- [ ] 5.6 `git status --short` contains only expected paths.

#### Manual

- [ ] 5.7 Idempotency and legitimate-repeat scenarios match the selected behavior.
- [ ] 5.8 Date and time-zone cases preserve the selected calendar day.
- [ ] 5.9 Submission and revision races preserve accepted/current-key invariants.
- [ ] 5.10 Feedback survives revision and re-acceptance behavior is correct.
- [ ] 5.11 Cross-user and direct mutation attempts are denied without disclosure.
- [ ] 5.12 Owner flow, accessibility, responsive layout, and safe messaging are recorded in `verification.md`.
