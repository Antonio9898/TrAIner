# First Explained Training Plan Implementation Plan

## Overview

Build S-02: the first end-to-end proof that TrAIner can turn a saved intake into an explained training plan. A signed-in user with a saved, editable intake will generate one draft plan through a server-side OpenRouter call, the app will validate the model output with Zod, persist the plan in the existing `training_plans` table, and render the full plan inline on the dashboard.

This plan uses the existing F-01 planning data contract, F-02 safety boundary, and S-01 intake flow. It does not add schema, revisions, acceptance, post-workout feedback, medical classification, or plan version history.

## Current State Analysis

The app already has Astro SSR, React islands, Supabase cookie auth, protected `/dashboard` routes, owner-scoped planning tables, and a completed intake flow. The dashboard loads the latest intake and knows whether it is editable, but the "First explained plan" panel is still a placeholder.

No OpenRouter integration exists yet. There is no server-only provider wrapper, no `training-plans` service, no generation route, and no UI that reads or renders stored `training_plans` rows. The database already supports S-02, but it only checks that `plan_content` is a JSON object, so application-level validation is mandatory.

## Desired End State

After implementation, a signed-in user with a saved intake can click a generate button on `/dashboard`. The server route uses the current user's Supabase session, calls OpenRouter with the required `OPENROUTER_MODEL`, validates a one-week plan containing 2-5 scheduled workouts, stores a `draft` `training_plans` row, and redirects back to the dashboard.

The dashboard then shows the stored explanation, overview, scheduled workouts, progression guidance, and plan/workout safety notes inline. If generation fails, invalid model output is returned, Supabase is unavailable, env is missing, or the user is not authenticated, the user sees only a safe generic message and no private intake text appears in URLs or logs.

### Key Discoveries:

- S-02 is the roadmap north-star: a signed-in user receives an explained plan matched to goal, level, and constraints: `context/foundation/roadmap.md:21`, `context/foundation/roadmap.md:98`.
- The PRD requires the plan to reference the user's goal, account for level and health constraints, and explain why it was composed that way: `context/foundation/prd.md:55`.
- `TrainingPlanContent` already has the MVP shape for overview, scheduled workouts, progression guidance, and safety notes: `src/types.ts:32`.
- `training_plans` already stores `status`, `plan_content`, `explanation`, revision metadata, and timestamps: `supabase/migrations/20260602233915_create_planning_contract.sql:36`.
- The unique `(user_id, intake_id)` constraint enforces one current plan per intake: `supabase/migrations/20260602233915_create_planning_contract.sql:52`.
- The database only checks `plan_content` is a JSON object, so Zod must validate the model payload before persistence: `supabase/migrations/20260602233915_create_planning_contract.sql:57`.
- Existing intake services use Zod schemas, typed row mapping, explicit user IDs, `.overrideTypes`, and wrapped Supabase errors: `src/lib/services/training-intakes.ts:32`.
- Existing API routes use `prerender = false`, Supabase SSR client creation, auth checks, service calls, and redirect-based safe messages: `src/pages/api/training-intakes.ts:9`.
- The dashboard currently reads the latest intake and editability server-side: `src/pages/dashboard.astro:23`.
- The current S-02 dashboard panel is a placeholder to replace with generation and stored-plan display: `src/pages/dashboard.astro:166`.
- OpenRouter's chat completions endpoint supports `response_format` with `json_schema`, non-streaming generation, and a stable `user` field for abuse detection.

## What We're NOT Doing

- Adding or changing Supabase tables, columns, constraints, RLS policies, or migrations.
- Adding plan revision, regeneration, overwrite, acceptance, or post-workout feedback.
- Adding a separate `/dashboard/plan` route.
- Adding streaming generation, progress polling, background jobs, queueing, or a persisted `generating` state.
- Automatically retrying failed or invalid model outputs.
- Storing raw prompts, raw OpenRouter responses, private intake text, or model errors for debugging.
- Adding injury taxonomy, diagnosis, risk scores, red-flag blockers, medical clearance, contraindication databases, or disclaimer acknowledgement storage.
- Adding trainer, admin, shared-plan, or multi-user behavior.
- Introducing a broad automated test framework in this slice.
- Writing to `context/archive/`.

## Implementation Approach

Use a three-layer server-side boundary:

1. `src/lib/openrouter.ts` handles OpenRouter transport, headers, env, request/response typing, and sanitized provider errors.
2. `src/lib/services/training-plans.ts` owns product logic: reading existing plans, building the prompt from `TrainingIntake`, defining and applying Zod validation, mapping DB rows, and inserting the first draft plan.
3. `src/pages/api/training-plans/generate.ts` owns HTTP concerns only: POST, auth, latest editable intake lookup, safe redirect flags, and status-to-message mapping.

The UI remains dashboard-centered for the MVP. `/dashboard` should fetch both latest intake and any existing plan for that intake, show a generate form only when the latest intake is still editable, disable the submit button client-side after submit, and show the full stored plan inline after generation.

## Critical Implementation Details

### Model Configuration

`OPENROUTER_MODEL` is required. The implementation should not hard-code a fallback model or omit `model` from the request, because quality and cost must stay explicit for the MVP.

### Output Contract

OpenRouter structured outputs are a provider-side guard, not the application contract. The service must parse and validate the final message content with Zod before inserting into Supabase. Invalid JSON or validation failure returns a safe generation error and stores nothing.

### Duplicate Submit Boundary

S-02 uses client-side submit disabling plus the existing unique constraint on `(user_id, intake_id)`. It does not add a persisted `generating` state. The backend should avoid obvious duplicate work by checking for an existing plan before generation, but a rare parallel model call is acceptable for this MVP.

### Safety Language

Prompt, validation, and UI copy must preserve the F-02 boundary: plans may include practical plan-level and workout-level `safetyNotes`, but must not diagnose, promise safety, prevent injury, classify risk, or clear the user to train.

## Phase 1: OpenRouter Runtime Contract

### Overview

Add the server-only OpenRouter configuration and transport boundary without touching product logic or UI.

### Changes Required:

#### 1. Astro Env Schema

**File**: `astro.config.mjs`

**Intent**: Declare the OpenRouter server env values used by the generation flow.

**Contract**: Add server env fields for:

- `OPENROUTER_API_KEY`: secret, required for generation at runtime.
- `OPENROUTER_MODEL`: server env value, required; no code fallback.
- `OPENROUTER_HTTP_REFERER`: optional server env value.

Keep values server-only and do not expose them to React or client bundles.

#### 2. Local Env Template

**File**: `.env.example`

**Intent**: Make local setup for S-02 discoverable.

**Contract**: Add placeholders for `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, and optional `OPENROUTER_HTTP_REFERER`. The example should make clear that model selection is required.

#### 3. Cloudflare Secret Requirements

**File**: `wrangler.jsonc`

**Intent**: Ensure production deploys fail clearly if the required OpenRouter secret is missing.

**Contract**: Add `OPENROUTER_API_KEY` to `secrets.required`. Do not require optional attribution values in Wrangler.

#### 4. OpenRouter Transport Helper

**File**: `src/lib/openrouter.ts`

**Intent**: Centralize OpenRouter request construction so provider details and secrets do not leak into services or pages.

**Contract**: Export a server-only function that posts to `https://openrouter.ai/api/v1/chat/completions` with:

- `Authorization: Bearer <OPENROUTER_API_KEY>`.
- `Content-Type: application/json`.
- Fixed `X-OpenRouter-Title: TrAIner`.
- Optional `HTTP-Referer` when `OPENROUTER_HTTP_REFERER` is configured.
- Required `model` from `OPENROUTER_MODEL`.
- `stream: false`.
- `response_format` using `type: "json_schema"`.
- Stable `user` identifier derived from authenticated `user.id`, not email.

The helper should return assistant message content or throw sanitized errors that do not include private prompt text or raw provider output.

### Success Criteria:

#### Automated Verification:

- `astro.config.mjs` declares server-only OpenRouter env fields.
- `.env.example` documents required OpenRouter setup.
- `wrangler.jsonc` includes `OPENROUTER_API_KEY` in required secrets.
- `src/lib/openrouter.ts` exists and does not expose API keys to client-side code.
- `src/lib/openrouter.ts` uses direct `fetch`, non-streaming chat completions, JSON schema response format, fixed title attribution, optional referer, and stable user id.

#### Manual Verification:

- Review confirms no OpenRouter secret, prompt text, or raw provider response is logged or placed in URLs.
- Review confirms `OPENROUTER_MODEL` is required and no fallback/default model is embedded in code.
- Review confirms OpenRouter errors are safe for route-level user messages.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets; the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 2: Training Plan Generation Service

### Overview

Add the domain service that turns a saved intake into a validated draft plan row.

### Changes Required:

#### 1. Training Plan Row Mapping

**File**: `src/lib/services/training-plans.ts`

**Intent**: Give pages and routes a typed service boundary for reading and writing `training_plans`.

**Contract**: Define internal row types and exported mapping/read helpers for:

- Reading a plan by `userId` and `intakeId`.
- Mapping snake_case `training_plans` rows to the app-facing `TrainingPlan` type.
- Selecting only the columns needed by S-02.

Follow the style from `src/lib/services/training-intakes.ts`: explicit `userId`, caller-provided Supabase SSR client, typed `.overrideTypes`, and wrapped Supabase errors.

#### 2. Plan Output Validation

**File**: `src/lib/services/training-plans.ts`

**Intent**: Enforce a product-safe and UI-renderable plan shape before persistence.

**Contract**: Add a Zod schema for the generated payload:

- Root payload has `planContent` and `explanation`.
- `planContent.overview` is trimmed non-empty text.
- `planContent.scheduledWorkouts` has 2-5 entries.
- Each scheduled workout has a unique slug-like non-empty `key`, non-empty `label`, optional `focus`, non-empty `exercises`, optional `instructions`, optional non-empty `safetyNotes`, and optional JSON-object metadata.
- Each exercise has non-empty `name`, optional bounded positive `sets`, optional non-empty `reps`, optional non-empty `loadGuidance`, optional bounded non-negative `restSeconds`, optional non-empty `notes`, and optional JSON-object metadata.
- `planContent.progressionGuidance` is trimmed non-empty text.
- `planContent.safetyNotes` is a non-empty array of non-empty strings.
- `explanation` is trimmed non-empty text.

The schema should trim strings and reject blank-only optional strings rather than persisting empty values.

#### 3. Prompt Construction

**File**: `src/lib/services/training-plans.ts`

**Intent**: Build a generation request that uses the saved intake while preserving prompt-injection and safety boundaries.

**Contract**: Add prompt-building logic that treats `goal`, `healthConstraints`, and `notes` as untrusted user-provided data. The prompt must request:

- One week of training.
- 2-5 scheduled workouts.
- Plan-level and workout-level `safetyNotes` where relevant.
- Explanation based on goal, experience level, and health constraints.
- No medical diagnosis, no safety guarantee, no injury-prevention promise, no professional clearance.
- JSON only through the schema contract.

Do not include private user email or account metadata in prompts.

#### 4. Draft Plan Creation

**File**: `src/lib/services/training-plans.ts`

**Intent**: Generate and persist the first draft plan for an intake.

**Contract**: Export a service function that:

- Checks whether a plan already exists for the intake and returns it without calling OpenRouter when found.
- Calls the OpenRouter helper with prompt messages, schema, and stable user id.
- Parses and validates the assistant content.
- Inserts a row with `user_id`, `intake_id`, `status: "draft"`, `plan_content`, `explanation`, and `notes: null`.
- Returns the mapped `TrainingPlan`.
- On invalid model output, throws a sanitized validation error and stores nothing.
- On Supabase unique-conflict during insert, reads and returns the existing plan rather than creating a duplicate or overwriting.

### Success Criteria:

#### Automated Verification:

- `src/lib/services/training-plans.ts` exists and exports read/map/generate helpers.
- The service reads and writes through the caller-provided Supabase SSR client.
- The service validates model output with Zod before insert.
- The service enforces 2-5 scheduled workouts for S-02.
- The service inserts draft plans with `accepted_at` omitted or null-compatible and `notes: null`.
- The service does not write raw prompts, raw model responses, or private intake text to logs.

#### Manual Verification:

- Review confirms invalid JSON or schema-invalid output cannot create a `training_plans` row.
- Review confirms the prompt preserves the F-02 no-diagnosis and no-clearance boundary.
- Review confirms generation freezes the intake by creating the plan row that S-01 editability already checks.
- Review confirms no migration was introduced.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Generation Route

### Overview

Add the authenticated POST endpoint that connects the dashboard form to the generation service.

### Changes Required:

#### 1. Generate Plan API Route

**File**: `src/pages/api/training-plans/generate.ts`

**Intent**: Provide the server mutation endpoint for first-plan generation.

**Contract**: Add a POST route that:

- Exports `const prerender = false`.
- Creates the Supabase SSR client with `createClient(context.request.headers, context.cookies)`.
- Verifies the current user from `context.locals.user` or Supabase auth.
- Reads the latest intake for the user.
- Requires that the latest intake exists and is editable.
- Calls the training plan generation service.
- Redirects to `/dashboard?generated=plan` on success.
- Redirects to `/dashboard?error=<safe-code-or-message>` for missing Supabase config, auth failure, missing intake, non-editable intake, missing OpenRouter config, provider failure, invalid model output, or persistence failure.

Redirects must use generic codes/messages only. They must not include submitted goal, health constraints, notes, prompt text, raw OpenRouter output, or provider error details.

#### 2. Error Classification

**File**: `src/pages/api/training-plans/generate.ts`

**Intent**: Keep user-facing failures understandable without leaking implementation or private data.

**Contract**: Map service/provider failures to safe dashboard messages such as:

- Supabase not configured.
- Please sign in.
- Save an intake before generating a plan.
- This intake already has a plan.
- OpenRouter is not configured.
- We could not generate a valid plan. Please try again.
- We could not save your generated plan. Please try again.

The route should not expose stack traces or provider messages to the query string.

### Success Criteria:

#### Automated Verification:

- `src/pages/api/training-plans/generate.ts` exists, exports `const prerender = false`, and supports POST.
- The route uses `src/lib/supabase.ts` SSR client and never uses a service-role client.
- The route reads the latest editable intake before calling generation.
- The route redirects with safe success/error flags only.
- The route does not place private intake text, prompts, raw output, or provider errors in query params.

#### Manual Verification:

- Review confirms unauthenticated requests cannot generate plans.
- Review confirms a user with no intake gets a safe dashboard error.
- Review confirms a planned intake cannot trigger overwrite/regeneration in S-02.
- Review confirms missing OpenRouter config does not attempt a provider call.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Dashboard Generate and View UI

### Overview

Replace the S-02 placeholder with dashboard-centered generation and full stored-plan rendering.

### Changes Required:

#### 1. Dashboard Data Loading

**File**: `src/pages/dashboard.astro`

**Intent**: Load the stored plan alongside the latest intake so the dashboard can choose between generate and view states.

**Contract**: Update the server-side dashboard frontmatter to:

- Read the latest intake.
- Determine whether the intake is editable.
- Read any stored `TrainingPlan` for the latest intake.
- Read safe `generated` and `error` query flags.
- Preserve existing no-intake and load-error behavior.

If a plan exists, the intake should be treated as non-editable and the plan display should be the primary S-02 state.

#### 2. Generate Form

**File**: `src/pages/dashboard.astro`

**Intent**: Let the user trigger first-plan generation from the dashboard.

**Contract**: Replace the placeholder S-02 panel with a POST form to `/api/training-plans/generate` when:

- The user has a latest intake.
- That intake is editable.
- No stored plan exists.

The submit control should use client-side double-submit prevention. This can be a minimal inline script or a small React island if needed, but the implementation should avoid adding broad UI architecture for one button. The button copy should be product-facing, not implementation-facing.

#### 3. Inline Plan Display

**File**: `src/pages/dashboard.astro`

**Intent**: Make S-02 feel like a real product outcome, not a technical dump.

**Contract**: Render the stored plan inline on the dashboard:

- Plan explanation.
- Overview.
- Scheduled workouts with label, focus when present, exercises, sets/reps/load/rest/notes when present, instructions when present, and workout safety notes when present.
- Progression guidance.
- Plan-level safety notes.
- Draft status context.
- Existing professional-care disclaimer meaning from F-02.

Keep rendering resilient to optional fields and long generated text. Use responsive layout and existing dashboard visual conventions.

#### 4. Dashboard Messages

**File**: `src/pages/dashboard.astro`

**Intent**: Show safe user feedback for generation success and failure.

**Contract**: Add safe success/error messages for:

- `?generated=plan`.
- Missing or unsafe `error` values from the generation route.

Messages must not echo private intake fields or raw provider details.

### Success Criteria:

#### Automated Verification:

- `src/pages/dashboard.astro` imports and uses the training-plan service read helper.
- The dashboard shows a generate form only for a latest editable intake without a stored plan.
- The dashboard shows the full stored plan inline after generation.
- The generate button has client-side double-submit prevention.
- The dashboard does not render raw JSON dumps as the primary plan experience.
- Long generated text uses wrapping styles consistent with the existing dashboard.

#### Manual Verification:

- A signed-in user with no intake sees the existing start-intake path.
- A signed-in user with an editable intake can trigger generation.
- During submit, the UI prevents obvious repeated clicks.
- After successful generation, the dashboard shows explanation, overview, workouts, progression, and safety notes inline.
- After a stored plan exists, the dashboard no longer offers first-plan generation for that intake.
- On generation failure, the dashboard shows a generic safe error and no private text appears in the URL.
- The UI remains usable on mobile and desktop without overlapping text.
- The final UI preserves F-02 boundaries: no diagnosis, no medical checklist, no risk scoring, no clearance language, and no stored acknowledgement.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 5: Verification and Handoff

### Overview

Run the repository verification commands and document that S-02 is ready for implementation handoff.

### Changes Required:

#### 1. Automated Checks

**File**: repository verification commands

**Intent**: Verify the implementation compiles and follows existing lint rules.

**Contract**: Run:

- `npx astro sync`
- `npm run lint`
- `npm run build`

The build requires Supabase env values and now also OpenRouter env values where Astro env validation requires them. If the environment is unavailable, record that explicitly instead of bypassing verification.

#### 2. Manual End-to-End Checks

**File**: manual flow

**Intent**: Verify S-02 works as a user-visible vertical slice.

**Contract**: Manually test:

- Sign in.
- Save or confirm an editable intake.
- Generate a plan.
- Confirm redirect to `/dashboard?generated=plan`.
- Confirm stored plan renders inline.
- Confirm the same intake no longer offers first-plan generation.
- Trigger or review safe failure paths for missing intake, missing config, provider/validation failure, and unauthenticated access.
- Inspect URLs and logs used during testing to confirm private intake text and raw model output are absent.

#### 3. Plan Progress Update

**File**: `context/changes/first-explained-training-plan/plan.md`

**Intent**: Keep this plan as the execution status source for future agents.

**Contract**: Implementers should update only the `## Progress` checkboxes as phases land, appending commit hashes when available and not renaming step titles.

### Success Criteria:

#### Automated Verification:

- `npx astro sync` completes successfully.
- `npm run lint` completes successfully.
- `npm run build` completes successfully with required env configured.
- `git status --short` shows only expected files changed for this implementation.

#### Manual Verification:

- Signed-in user can generate the first explained plan from a saved intake.
- Generated plan is stored as a `draft` row for the correct owner and intake.
- Stored plan appears inline on the dashboard with explanation and safety notes.
- Invalid model output stores nothing and returns a safe error.
- Repeated click behavior does not create duplicate plan rows.
- No prompt text, health constraints, notes, raw model output, or provider errors appear in URLs or logs.
- Human confirms the implementation stays within S-02 scope and does not introduce S-03/S-04 behavior.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before marking the change implemented.

---

## Testing Strategy

### Unit Tests:

- No new test runner is required for this slice because the repository currently relies on lint/build plus manual flow checks.
- The highest-value pure-code verification is review of the Zod generated-plan schema: bounds, trimming, unique workout keys, optional string handling, and JSON metadata handling.
- If implementation introduces pure helper functions for parsing or mapping, they may be manually reviewed unless a test runner is already added in another slice.

### Integration Tests:

- Use the authenticated Supabase SSR client path end-to-end; do not use a service-role client.
- Verify a successful generation inserts exactly one `training_plans` row for `(user_id, intake_id)`.
- Verify a generated row freezes the intake through the existing `isTrainingIntakeEditable` behavior.
- Verify invalid model output and provider failures do not create rows.

### Manual Testing Steps:

1. Configure `SUPABASE_URL`, `SUPABASE_KEY`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, and optional `OPENROUTER_HTTP_REFERER`.
2. Sign in with a test user.
3. Create or confirm a saved intake on `/dashboard/intake`.
4. Open `/dashboard` and confirm the generate action is visible.
5. Click generate and confirm the button prevents repeated clicks.
6. Confirm redirect to `/dashboard?generated=plan`.
7. Confirm the dashboard renders explanation, overview, 2-5 workouts, progression guidance, and plan-level safety notes.
8. Confirm each workout renders exercises and any workout-level safety notes.
9. Confirm the original intake is no longer editable for first-plan generation.
10. Test or review safe error cases: no intake, missing env, invalid model output, provider failure, unauthenticated access.
11. Confirm URLs and logs do not contain private intake free text, prompts, raw model output, or provider error details.
12. Review copy for the no-diagnosis/no-clearance boundary.

## Performance Considerations

The MVP target is small scale and low QPS. S-02 should use one non-streaming provider call per generation attempt and one insert. Avoid client-side polling, background infrastructure, broad table scans, or analytics-oriented queries. The current owner/intake index and unique constraint are sufficient for this slice.

The dashboard should render the stored JSONB plan server-side from the authenticated user's row. Keep generated output bounded to 2-5 workouts so dashboard rendering remains predictable on mobile and desktop.

## Migration Notes

No migration is planned. The existing `training_plans` table, JSONB content column, explanation column, status check, owner-scoped FK, unique `(user_id, intake_id)` constraint, and RLS policies are sufficient for S-02.

If implementation discovers a real schema gap, stop and revise this plan before adding a migration. Worker rollback will not roll back Supabase schema changes, so unplanned schema edits are out of scope.

## References

- Related research: `context/changes/first-explained-training-plan/research.md`
- Change identity: `context/changes/first-explained-training-plan/change.md`
- Roadmap S-02: `context/foundation/roadmap.md:98`
- S-02 north-star: `context/foundation/roadmap.md:21`
- PRD plan acceptance criteria: `context/foundation/prd.md:55`
- PRD explanation requirement: `context/foundation/prd.md:76`
- Safety generated-plan requirements: `context/foundation/training-safety-boundaries.md:82`
- Safety explanation guidance: `context/foundation/training-safety-boundaries.md:92`
- Privacy boundary: `context/foundation/training-safety-boundaries.md:115`
- Existing data contract handoff: `context/changes/minimal-planning-data-contract/plan.md:228`
- S-01 privacy precedent for redirects: `context/changes/goal-and-constraints-intake/plan.md:58`
- Env schema location: `astro.config.mjs:17`
- Worker required secrets: `wrangler.jsonc:15`
- Existing service pattern: `src/lib/services/training-intakes.ts:32`
- Existing API route pattern: `src/pages/api/training-intakes.ts:9`
- Training plan content type: `src/types.ts:32`
- Training plan app type: `src/types.ts:65`
- Training plans table: `supabase/migrations/20260602233915_create_planning_contract.sql:36`
- One plan per intake constraint: `supabase/migrations/20260602233915_create_planning_contract.sql:52`
- Dashboard placeholder: `src/pages/dashboard.astro:166`
- OpenRouter API reference: `https://openrouter.ai/docs/api-reference/overview`
- OpenRouter structured outputs: `https://openrouter.ai/docs/guides/features/structured-outputs`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` - <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: OpenRouter Runtime Contract

#### Automated

- [x] 1.1 `astro.config.mjs` declares server-only OpenRouter env fields. — 729539b
- [x] 1.2 `.env.example` documents required OpenRouter setup. — 729539b
- [x] 1.3 `wrangler.jsonc` includes `OPENROUTER_API_KEY` in required secrets. — 729539b
- [x] 1.4 `src/lib/openrouter.ts` exists and does not expose API keys to client-side code. — 729539b
- [x] 1.5 `src/lib/openrouter.ts` uses direct `fetch`, non-streaming chat completions, JSON schema response format, fixed title attribution, optional referer, and stable user id. — 729539b

#### Manual

- [x] 1.6 Review confirms no OpenRouter secret, prompt text, or raw provider response is logged or placed in URLs. — 729539b
- [x] 1.7 Review confirms `OPENROUTER_MODEL` is required and no fallback/default model is embedded in code. — 729539b
- [x] 1.8 Review confirms OpenRouter errors are safe for route-level user messages. — 729539b

### Phase 2: Training Plan Generation Service

#### Automated

- [x] 2.1 `src/lib/services/training-plans.ts` exists and exports read/map/generate helpers. — bf3217d
- [x] 2.2 The service reads and writes through the caller-provided Supabase SSR client. — bf3217d
- [x] 2.3 The service validates model output with Zod before insert. — bf3217d
- [x] 2.4 The service enforces 2-5 scheduled workouts for S-02. — bf3217d
- [x] 2.5 The service inserts draft plans with `accepted_at` omitted or null-compatible and `notes: null`. — bf3217d
- [x] 2.6 The service does not write raw prompts, raw model responses, or private intake text to logs. — bf3217d

#### Manual

- [x] 2.7 Review confirms invalid JSON or schema-invalid output cannot create a `training_plans` row. — bf3217d
- [x] 2.8 Review confirms the prompt preserves the F-02 no-diagnosis and no-clearance boundary. — bf3217d
- [x] 2.9 Review confirms generation freezes the intake by creating the plan row that S-01 editability already checks. — bf3217d
- [x] 2.10 Review confirms no migration was introduced. — bf3217d

### Phase 3: Generation Route

#### Automated

- [ ] 3.1 `src/pages/api/training-plans/generate.ts` exists, exports `const prerender = false`, and supports POST.
- [ ] 3.2 The route uses `src/lib/supabase.ts` SSR client and never uses a service-role client.
- [ ] 3.3 The route reads the latest editable intake before calling generation.
- [ ] 3.4 The route redirects with safe success/error flags only.
- [ ] 3.5 The route does not place private intake text, prompts, raw output, or provider errors in query params.

#### Manual

- [ ] 3.6 Review confirms unauthenticated requests cannot generate plans.
- [ ] 3.7 Review confirms a user with no intake gets a safe dashboard error.
- [ ] 3.8 Review confirms a planned intake cannot trigger overwrite/regeneration in S-02.
- [ ] 3.9 Review confirms missing OpenRouter config does not attempt a provider call.

### Phase 4: Dashboard Generate and View UI

#### Automated

- [ ] 4.1 `src/pages/dashboard.astro` imports and uses the training-plan service read helper.
- [ ] 4.2 The dashboard shows a generate form only for a latest editable intake without a stored plan.
- [ ] 4.3 The dashboard shows the full stored plan inline after generation.
- [ ] 4.4 The generate button has client-side double-submit prevention.
- [ ] 4.5 The dashboard does not render raw JSON dumps as the primary plan experience.
- [ ] 4.6 Long generated text uses wrapping styles consistent with the existing dashboard.

#### Manual

- [ ] 4.7 A signed-in user with no intake sees the existing start-intake path.
- [ ] 4.8 A signed-in user with an editable intake can trigger generation.
- [ ] 4.9 During submit, the UI prevents obvious repeated clicks.
- [ ] 4.10 After successful generation, the dashboard shows explanation, overview, workouts, progression, and safety notes inline.
- [ ] 4.11 After a stored plan exists, the dashboard no longer offers first-plan generation for that intake.
- [ ] 4.12 On generation failure, the dashboard shows a generic safe error and no private text appears in the URL.
- [ ] 4.13 The UI remains usable on mobile and desktop without overlapping text.
- [ ] 4.14 The final UI preserves F-02 boundaries: no diagnosis, no medical checklist, no risk scoring, no clearance language, and no stored acknowledgement.

### Phase 5: Verification and Handoff

#### Automated

- [ ] 5.1 `npx astro sync` completes successfully.
- [ ] 5.2 `npm run lint` completes successfully.
- [ ] 5.3 `npm run build` completes successfully with required env configured.
- [ ] 5.4 `git status --short` shows only expected files changed for this implementation.

#### Manual

- [ ] 5.5 Signed-in user can generate the first explained plan from a saved intake.
- [ ] 5.6 Generated plan is stored as a `draft` row for the correct owner and intake.
- [ ] 5.7 Stored plan appears inline on the dashboard with explanation and safety notes.
- [ ] 5.8 Invalid model output stores nothing and returns a safe error.
- [ ] 5.9 Repeated click behavior does not create duplicate plan rows.
- [ ] 5.10 No prompt text, health constraints, notes, raw model output, or provider errors appear in URLs or logs.
- [ ] 5.11 Human confirms the implementation stays within S-02 scope and does not introduce S-03/S-04 behavior.
