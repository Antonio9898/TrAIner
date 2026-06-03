# Goal and Constraints Intake Implementation Plan

## Overview

Build the first user-visible planning intake slice for TrAIner. Authenticated users will open `/dashboard/intake`, enter a training goal, choose an experience level, provide health constraints through one free-text prompt or an explicit "no known constraints" option, add optional notes, save the intake, and return to `/dashboard` to see a saved summary and next-step placeholder.

This plan consumes the already implemented F-01 planning data contract and F-02 safety boundary. It does not add schema, AI plan generation, medical classification, or runtime red-flag blocking.

## Current State Analysis

The app already has Astro SSR, React islands, Supabase auth, a protected dashboard, and a private planning data contract. The dashboard is currently a placeholder that greets the signed-in user and offers sign out. The `training_intakes` table already stores the S-01 data surface: `goal`, `experience_level`, `health_constraints`, optional `notes`, owner `user_id`, and timestamps.

The safety boundary for S-01 is settled upstream: health constraints are one free-text prompt, supported by neutral examples and visible no-diagnosis disclaimer copy. The MVP must not store disclaimer acknowledgement, infer diagnoses, classify injury severity, or block plan generation from this intake.

## Desired End State

After this plan is implemented, a signed-in user can visit `/dashboard/intake`, complete or edit their latest editable intake, submit it through a server-side POST route, and land back on `/dashboard` with a summary of the saved intake. If the latest intake does not yet have a generated plan, S-01 updates that row rather than creating duplicate pre-plan intakes. If the latest intake already has a plan in a later slice, a new intake can be created without modifying the planned intake.

Verification is complete when the route is protected, invalid inputs are rejected on both client and server, Supabase writes are owner-scoped through the cookie-based SSR client, the dashboard summary reflects the saved data, and build/lint plus manual authenticated flow checks pass.

### Key Discoveries:

- Roadmap S-01 outcome is "user can log in, enter a training goal, training level, and health constraints": `context/foundation/roadmap.md:85`.
- S-01 must consume `context/foundation/training-safety-boundaries.md` for free-text `healthConstraints`, neutral examples, and visible disclaimer guidance: `context/foundation/roadmap.md:89`.
- `training_intakes` already stores `goal`, `experience_level`, `health_constraints`, optional `notes`, owner `user_id`, and timestamps: `supabase/migrations/20260602233915_create_planning_contract.sql:13`.
- Database constraints reject empty goal and health constraints, and restrict experience level to `beginner`, `intermediate`, or `advanced`: `supabase/migrations/20260602233915_create_planning_contract.sql:24`.
- Owner-only RLS already exists for planning rows: `supabase/migrations/20260602233915_create_planning_contract.sql:138`.
- App-facing `TrainingIntake` and `TrainingExperienceLevel` types already exist: `src/types.ts:8`, `src/types.ts:40`.
- Middleware protects `/dashboard` and attaches `context.locals.user`: `src/middleware.ts:4`, `src/middleware.ts:13`.
- Existing auth forms use Astro page shells, React form islands, native POSTs, client validation, and redirect-based server errors: `src/pages/auth/signin.astro:16`, `src/components/auth/SignInForm.tsx:36`.
- Existing API routes parse `formData()` and redirect with encoded non-sensitive errors: `src/pages/api/auth/signin.ts:5`.
- Repository guidance says API routes should validate input with zod, but zod is not installed yet: `CLAUDE.md:45`, `package.json:7`.

## What We're NOT Doing

- Adding or changing Supabase tables, columns, constraints, or RLS policies.
- Generating a training plan, calling an AI model, or creating plan prompts.
- Building plan revision, acceptance, or post-workout feedback.
- Adding medical checklists, injury taxonomy, severity classification, risk scoring, red-flag blockers, or professional clearance logic.
- Storing disclaimer acknowledgement or safety-policy versioning.
- Adding trainer, admin, shared-plan, or multi-user behavior.
- Introducing a test runner or broad automated UI/API test framework in this slice.
- Reworking the public home page beyond what is required to keep the authenticated flow coherent.
- Writing to `context/archive/`.

## Implementation Approach

Use the existing Astro SSR architecture: a protected `/dashboard/intake` page renders the shell and fetches the latest editable intake server-side, a React island handles interactive form state and client validation, and a native POST submits to an Astro API route. The API route uses zod for server validation, the cookie-based Supabase SSR client for authenticated writes, and redirect-based errors that do not echo private health data into URLs.

The persistence model is "edit latest until a plan exists": find the latest intake for the authenticated user, check whether a `training_plans` row already references it, update it if no plan exists, and insert a new intake if the latest one is already planned or no intake exists. This keeps S-01 from creating duplicate pre-plan intakes while staying compatible with S-02.

## Critical Implementation Details

### Latest Editable Intake

The "edit latest until a plan exists" rule depends on `training_plans`, even though this slice does not generate plans. The save helper should treat the latest intake with no associated `training_plans` row as editable; once a plan row exists for the latest intake, a later submission should create a new intake rather than overwrite context that may already have shaped a plan.

### Health Data In Redirects

Do not put submitted `goal`, `healthConstraints`, or `notes` values in query params when an error occurs. Redirects may include generic `error` or `saved` flags only; private free-text health data should stay in form state before submit or in Supabase after a successful save.

## Phase 1: Server Persistence Contract

### Overview

Add the validation dependency, shared intake persistence logic, and POST route that saves the authenticated user's latest editable intake.

### Changes Required:

#### 1. zod Dependency

**File**: `package.json`

**Intent**: Add the validation dependency required by repository API-route guidance.

**Contract**: Add `zod` as an application dependency and update the lockfile through the package manager. The implementation should keep package manager metadata consistent with the existing npm workflow.

#### 2. Intake Validation and Persistence Helper

**File**: `src/lib/services/training-intakes.ts`

**Intent**: Centralize S-01 intake validation vocabulary, latest-intake lookup, create/update behavior, and row mapping so the API route and dashboard page do not duplicate Supabase query details.

**Contract**: Export a zod schema or parse function for the form input with these fields:

- `goal`: required, trimmed non-empty text.
- `experienceLevel`: required, one of `beginner`, `intermediate`, `advanced`.
- `healthConstraints`: required, trimmed non-empty text, with exact support for the no-known-constraints value `no known constraints`.
- `notes`: optional trimmed text, stored as `null` when blank.

Export service functions that can:

- Read the latest intake for the authenticated user.
- Determine whether the latest intake is still editable by checking for an associated `training_plans` row.
- Save input by updating the latest editable intake or inserting a new intake.
- Map database snake_case rows to the app-facing `TrainingIntake` shape from `src/types.ts`.

The helper must use the caller's Supabase SSR client and explicit `userId`; it must not use `src/db/supabase.js` or a service-role style client.

#### 3. Training Intake POST Route

**File**: `src/pages/api/training-intakes.ts`

**Intent**: Provide the server mutation endpoint used by the intake form.

**Contract**: Add a dynamic POST route that:

- Exports `const prerender = false`.
- Creates the Supabase SSR client with `createClient(context.request.headers, context.cookies)`.
- Verifies a signed-in user through Supabase auth or `context.locals.user`.
- Parses `formData()` and validates through the zod-backed schema.
- Saves through the intake service.
- Redirects to `/dashboard?saved=intake` on success.
- Redirects to `/dashboard/intake?error=<safe message>` on validation, auth, config, or Supabase save failure.
- Never includes submitted health data, notes, or goal text in the redirect URL.

### Success Criteria:

#### Automated Verification:

- `zod` is present in `package.json` and `package-lock.json`.
- `src/lib/services/training-intakes.ts` exists and exports validation plus read/save helpers.
- `src/pages/api/training-intakes.ts` exists, exports `const prerender = false`, and supports POST.
- The API route uses the Supabase SSR client from `src/lib/supabase.ts`, not `src/db/supabase.js`.
- The save path updates the latest intake when no plan exists and inserts a new intake when the latest intake already has a plan.

#### Manual Verification:

- Review confirms server validation rejects empty `goal`, invalid `experienceLevel`, empty `healthConstraints`, and blank-only `notes`.
- Review confirms unauthenticated or unconfigured Supabase cases redirect with generic safe errors.
- Review confirms no submitted free-text health data is added to query params or logs by the planned code path.
- Review confirms no migration or RLS change was introduced.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets - the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 2: Protected Intake UI

### Overview

Create the protected `/dashboard/intake` experience with a React form island that matches existing form conventions and applies the safety boundary language.

### Changes Required:

#### 1. Intake Page Route

**File**: `src/pages/dashboard/intake.astro`

**Intent**: Add the authenticated intake page under the existing protected dashboard route prefix.

**Contract**: Render an Astro page using `Layout`, read the current user from `Astro.locals`, fetch the latest editable intake through the intake service, read safe `error` query params, and mount the React intake form with `client:load`. The route should rely on the existing `/dashboard` middleware prefix for page protection.

#### 2. Goal and Constraints Form Island

**File**: `src/components/intake/GoalAndConstraintsForm.tsx`

**Intent**: Give users a focused intake form that validates obvious client errors before the native POST and reuses the visual conventions from auth forms.

**Contract**: Build a controlled React form that posts to `/api/training-intakes` and includes:

- Training goal textarea or text input.
- Experience level control for `beginner`, `intermediate`, and `advanced`.
- One health constraints textarea with neutral examples from `context/foundation/training-safety-boundaries.md`.
- Explicit "No known constraints" option that fills or stores `no known constraints`.
- Optional notes textarea for schedule, equipment, or preference context.
- Visible no-diagnosis/professional-care disclaimer that preserves the F-02 meaning.
- Client validation for required fields and enum selection.
- Server error display using the existing `ServerError` pattern or a matching local equivalent.
- Submit button with pending state matching `SubmitButton`.

Do not require or store disclaimer acknowledgement.

#### 3. Form Field Support

**File**: `src/components/intake/GoalAndConstraintsForm.tsx`

**Intent**: Support textarea and option controls without forcing them through the existing input-only auth `FormField`.

**Contract**: Either define small local form-control helpers inside the intake component or add narrowly scoped intake form subcomponents if the component becomes hard to scan. Use `cn()` for conditional Tailwind classes. Do not introduce unrelated shadcn components unless the implementation genuinely needs them.

### Success Criteria:

#### Automated Verification:

- `src/pages/dashboard/intake.astro` exists and renders the intake form island.
- `src/components/intake/GoalAndConstraintsForm.tsx` exists and posts to `/api/training-intakes`.
- The form includes goal, experience level, health constraints, no-known-constraints option, optional notes, disclaimer, server error display, and pending submit state.
- Client validation prevents empty goal and empty health constraints before native submit.
- The route path remains under `/dashboard`, so existing middleware protection applies.

#### Manual Verification:

- A signed-in user can open `/dashboard/intake`.
- An unauthenticated user who opens `/dashboard/intake` is redirected to sign in by middleware.
- The form is usable on mobile and desktop without overlapping text or broken controls.
- The health constraints prompt is free text with neutral examples, not a medical checklist or diagnosis flow.
- The disclaimer is visible and does not ask for stored acknowledgement.
- Selecting "No known constraints" results in the exact saved value `no known constraints`.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets - the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 3: Dashboard Summary and Verification

### Overview

Update the protected dashboard to show the saved intake summary, provide the path into the intake form, and run the complete S-01 verification pass.

### Changes Required:

#### 1. Dashboard Intake Summary

**File**: `src/pages/dashboard.astro`

**Intent**: Replace the placeholder-only dashboard with the S-01 landing state: a saved intake summary when one exists, or a clear call to start intake when it does not.

**Contract**: Fetch the latest intake for the authenticated user through the intake service. Render:

- Current signed-in user context and sign-out action.
- If an intake exists: goal, experience level, health constraints, optional notes when present, and a link back to `/dashboard/intake` to edit while no plan exists.
- If no intake exists: a primary link to `/dashboard/intake`.
- A safe saved-state message when `?saved=intake` is present.
- A next-step placeholder for S-02 that does not create an AI generation route or promise a generated plan is already available.

#### 2. Authenticated Navigation Entry

**File**: `src/components/Topbar.astro` or `src/pages/dashboard.astro`

**Intent**: Make the intake route discoverable from the authenticated area.

**Contract**: Add a link to `/dashboard/intake` in the protected user experience. If `Topbar` remains unused by live routes, keep the navigation entry local to the dashboard rather than refactoring layout/navigation globally.

#### 3. End-to-End Verification

**File**: repository verification commands and manual flow

**Intent**: Verify that S-01 works as a vertical slice without introducing a new test framework.

**Contract**: Run the existing automated checks and manually test the authenticated flow:

- `npx astro sync`
- `npm run lint`
- `npm run build`
- Sign in, open `/dashboard/intake`, submit invalid data, submit valid data, land on `/dashboard`, see the summary, return to edit, resubmit, and confirm the dashboard updates.
- Confirm unauthenticated access redirects to sign-in.
- Confirm server error redirects do not expose submitted health data in the URL.
- If local Supabase is available, confirm the saved row is owner-scoped and no anonymous access is introduced.

### Success Criteria:

#### Automated Verification:

- `npx astro sync` completes successfully.
- `npm run lint` completes successfully.
- `npm run build` completes successfully with the existing Supabase environment requirements satisfied.
- `git status --short` shows only expected files changed for this implementation.

#### Manual Verification:

- Signed-in user can create an intake and see the saved dashboard summary.
- Signed-in user can edit the latest pre-plan intake without creating duplicate pre-plan rows.
- Empty required fields and invalid experience values are rejected with clear user-facing messages.
- Unauthenticated page access redirects to sign-in.
- Server-side errors do not include submitted goal, health constraints, or notes in URL params.
- The final UI preserves F-02 safety boundaries: no diagnosis, no medical checklist, no acknowledgement storage, and no runtime blocking.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before marking the change implemented. Phase blocks use plain bullets - the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Testing Strategy

### Unit Tests:

- No new test runner is required for this slice because the repository currently has no test script and the approved verification depth is build/lint plus manual authenticated flow.
- If implementation extracts pure validation helpers beyond the zod schema, they may be manually reviewed rather than introducing test tooling in S-01.

### Integration Tests:

- Manual local integration against Supabase is the main persistence check.
- Verify `training_intakes` writes through the authenticated SSR client and respects RLS by using the signed-in user's session, not a service client.
- Verify latest-intake update behavior before a plan exists, and new-intake insertion once a plan exists if that state can be simulated locally.

### Manual Testing Steps:

1. Sign in with a test user.
2. Open `/dashboard/intake`.
3. Submit with empty required fields and confirm client validation appears.
4. Submit a valid goal, experience level, health constraints, and optional notes.
5. Confirm redirect to `/dashboard?saved=intake`.
6. Confirm the dashboard summary displays the saved intake.
7. Return to `/dashboard/intake`, verify the form is prefilled, edit the intake, and submit again.
8. Confirm the dashboard reflects the edited intake and no duplicate pre-plan intake was created.
9. Sign out and confirm `/dashboard/intake` redirects to sign-in.
10. Trigger or inspect server-error paths and confirm no private submitted text appears in URL params.

## Performance Considerations

The MVP target is small scale and low QPS. The dashboard and intake page should read only the authenticated user's latest intake and, when needed, one associated plan-existence check. Avoid broad table scans, client-side loading of all intakes, or analytics-oriented queries. Existing indexes and owner-scoped RLS are sufficient for this slice unless implementation uncovers a concrete query issue.

## Migration Notes

No migration is planned. S-01 uses the existing `training_intakes` table and existing `training_plans` table only to decide whether the latest intake is still editable. If implementation discovers a real schema gap, stop and revise the plan before changing the migration contract.

## References

- Roadmap S-01: `context/foundation/roadmap.md:85`
- S-01 safety handoff: `context/foundation/roadmap.md:89`
- Safety boundary disclaimer guidance: `context/foundation/training-safety-boundaries.md:30`
- Safety boundary free-text prompt guidance: `context/foundation/training-safety-boundaries.md:45`
- No acknowledgement storage: `context/foundation/training-safety-boundaries.md:43`
- Current intake schema: `supabase/migrations/20260602233915_create_planning_contract.sql:13`
- Intake constraints: `supabase/migrations/20260602233915_create_planning_contract.sql:24`
- Planning RLS: `supabase/migrations/20260602233915_create_planning_contract.sql:138`
- App-facing intake types: `src/types.ts:8`, `src/types.ts:40`
- Supabase SSR client: `src/lib/supabase.ts:5`
- Protected dashboard middleware: `src/middleware.ts:4`
- Existing auth form island pattern: `src/pages/auth/signin.astro:16`, `src/components/auth/SignInForm.tsx:36`
- Existing redirect-based auth API pattern: `src/pages/api/auth/signin.ts:5`
- Existing CI commands: `.github/workflows/ci.yml:18`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` - <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Server Persistence Contract

#### Automated

- [x] 1.1 `zod` is present in `package.json` and `package-lock.json`. — f314231
- [x] 1.2 `src/lib/services/training-intakes.ts` exists and exports validation plus read/save helpers. — f314231
- [x] 1.3 `src/pages/api/training-intakes.ts` exists, exports `const prerender = false`, and supports POST. — f314231
- [x] 1.4 The API route uses the Supabase SSR client from `src/lib/supabase.ts`, not `src/db/supabase.js`. — f314231
- [x] 1.5 The save path updates the latest intake when no plan exists and inserts a new intake when the latest intake already has a plan. — f314231

#### Manual

- [x] 1.6 Review confirms server validation rejects empty `goal`, invalid `experienceLevel`, empty `healthConstraints`, and blank-only `notes`. — f314231
- [x] 1.7 Review confirms unauthenticated or unconfigured Supabase cases redirect with generic safe errors. — f314231
- [x] 1.8 Review confirms no submitted free-text health data is added to query params or logs by the planned code path. — f314231
- [x] 1.9 Review confirms no migration or RLS change was introduced. — f314231

### Phase 2: Protected Intake UI

#### Automated

- [x] 2.1 `src/pages/dashboard/intake.astro` exists and renders the intake form island.
- [x] 2.2 `src/components/intake/GoalAndConstraintsForm.tsx` exists and posts to `/api/training-intakes`.
- [x] 2.3 The form includes goal, experience level, health constraints, no-known-constraints option, optional notes, disclaimer, server error display, and pending submit state.
- [x] 2.4 Client validation prevents empty goal and empty health constraints before native submit.
- [x] 2.5 The route path remains under `/dashboard`, so existing middleware protection applies.

#### Manual

- [x] 2.6 A signed-in user can open `/dashboard/intake`.
- [x] 2.7 An unauthenticated user who opens `/dashboard/intake` is redirected to sign in by middleware.
- [x] 2.8 The form is usable on mobile and desktop without overlapping text or broken controls.
- [x] 2.9 The health constraints prompt is free text with neutral examples, not a medical checklist or diagnosis flow.
- [x] 2.10 The disclaimer is visible and does not ask for stored acknowledgement.
- [x] 2.11 Selecting "No known constraints" results in the exact saved value `no known constraints`.

### Phase 3: Dashboard Summary and Verification

#### Automated

- [ ] 3.1 `npx astro sync` completes successfully.
- [ ] 3.2 `npm run lint` completes successfully.
- [ ] 3.3 `npm run build` completes successfully with the existing Supabase environment requirements satisfied.
- [ ] 3.4 `git status --short` shows only expected files changed for this implementation.

#### Manual

- [ ] 3.5 Signed-in user can create an intake and see the saved dashboard summary.
- [ ] 3.6 Signed-in user can edit the latest pre-plan intake without creating duplicate pre-plan rows.
- [ ] 3.7 Empty required fields and invalid experience values are rejected with clear user-facing messages.
- [ ] 3.8 Unauthenticated page access redirects to sign-in.
- [ ] 3.9 Server-side errors do not include submitted goal, health constraints, or notes in URL params.
- [ ] 3.10 The final UI preserves F-02 safety boundaries: no diagnosis, no medical checklist, no acknowledgement storage, and no runtime blocking.
