<!-- IMPL-REVIEW-REPORT -->
# Implementation Review: Post-Workout Feedback Implementation Plan

- **Plan**: context/changes/post-workout-feedback/plan.md
- **Scope**: Phases 1–5 of 5
- **Date**: 2026-08-24
- **Verdict**: APPROVED — both findings fixed on 2026-09-12
- **Findings**: 0 critical, 2 warnings (resolved), 0 observations

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| Plan Adherence | PASS |
| Scope Discipline | PASS |
| Safety & Quality | PASS |
| Architecture | PASS |
| Pattern Consistency | PASS |
| Success Criteria | PASS |

## Verification

| Command / check | Result | Evidence |
|-----------------|--------|----------|
| `npx supabase db reset` | PASS | Applied the complete migration chain through `20260821180722_add_workout_feedback_submission_rpc.sql` and reseeded the local database. |
| `npx astro sync` | PASS | Generated types successfully. The sandboxed attempt could not write Wrangler state outside the workspace; the permitted rerun passed. |
| `npm run lint` | PASS | ESLint exited 0; existing `astro-eslint-parser` compatibility notices were non-failing. |
| `npm run build` | PASS | Cloudflare SSR build completed. Existing CSS-minifier and sitemap warnings were non-failing. |
| Migration contract inspection | PASS | The migration has owner/token uniqueness, a fixed empty search path, explicit owner resolution, conflict-safe replay handling, a plan lock, revoked direct feedback mutations, and an exact authenticated RPC grant. |
| Manual evidence review | PASS | `verification.md` records database, HTTP, privacy, lifecycle, accessibility, and responsive checks. All 46 Progress rows are complete and carry commit SHA suffixes. |

## Findings

### F1 — Feedback invariants inherit the direct training-plan update bypass

- **Severity**: ⚠️ WARNING
- **Impact**: 🔬 HIGH — architectural stakes; think carefully before deciding
- **Dimension**: Architecture
- **Location**: supabase/migrations/20260821180722_add_workout_feedback_submission_rpc.sql:125; supabase/migrations/20260602233915_create_planning_contract.sql:179
- **Detail**: The feedback RPC correctly locks the owner plan and trusts its `status`, `accepted_at`, and `plan_content` when enforcing accepted-plan/current-workout submission. However, authenticated owners still retain a direct `UPDATE` policy and table privilege on `training_plans`. A direct Supabase REST client can therefore set its own plan to an accepted-looking state with arbitrary scheduled workouts before invoking the feedback RPC. Cross-user isolation remains intact, but the claimed exclusive lifecycle boundary is bypassable. This is the inherited S-03 architecture risk previously recorded and skipped in `context/archive/2026-08-12-plan-revision-and-acceptance/reviews/impl-review.md`.
- **Fix**: Make audited training-plan lifecycle RPCs the exclusive mutation boundary by revoking direct authenticated `UPDATE` and preserving legitimate writes through narrow `SECURITY DEFINER` functions with explicit `auth.uid()` checks, a fixed search path, and exact grants after auditing all callers.
  - Strength: Enforces accepted/current-workout state at the database boundary for direct API clients as well as the application UI.
  - Tradeoff: Changes the shared training-plan privilege model and requires auditing every existing mutation caller before revocation.
  - Confidence: HIGH — the RPC reads the trusted lifecycle fields at lines 125–150, while the base migration explicitly permits owner updates at lines 179–184.
  - Blind spot: Existing clients outside the reviewed feature may depend on direct owner updates and require migration.
- **Decision**: FIXED — 2026-09-12. Added `20260912120000_enforce_training_plan_lifecycle_boundary.sql`: revoked direct owner UPDATE, removed its policy, switched the audited owner-scoped acceptance/revision functions to SECURITY DEFINER with their existing empty search paths and explicit execution grants, and restricted INSERT to an initial draft with no acceptance or revision history. Transactional verification against the local database passed for owner lifecycle operations, forbidden direct writes, stale versions, foreign/missing identities, and feedback before/after revision. Migration is not deployed. This enforces lifecycle transitions, not AI provenance of client-supplied plan content.

### F2 — JavaScript-only mount removes the native form fallback

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Safety & Quality
- **Location**: src/pages/dashboard/plans/[planId]/workouts/[workoutKey]/feedback.astro:194
- **Detail**: `PostWorkoutFeedbackForm` is mounted with `client:only="react"`, so the server response contains no form HTML and the core feedback action disappears when the island bundle fails to load or execute. The endpoint and component use a native POST, but the page does not provide the plan's stated resilient native POST behavior. Comparable interactive forms in this repository, including `PlanRevisionForm`, use `client:load` and are server-rendered before hydration.
- **Fix A ⭐ Recommended**: Server-render a functional form shell and progressively enhance browser-local date and time-zone values after hydration.
  - Strength: Restores an immediately available native form and matches the repository's SSR-plus-hydration pattern.
  - Tradeoff: Browser time zone is unavailable during SSR, so the no-JavaScript submission contract needs an explicit safe fallback or server-handled missing-zone rule.
  - Confidence: HIGH — `client:only` omits server HTML by definition and the page has no alternate form.
  - Blind spot: The product requirement for no-JavaScript submission has not been separately prioritized against exact browser-zone validation.
- **Fix B**: Keep the JavaScript-only form and amend the plan to state that JavaScript availability is required for browser-local date/time-zone capture.
  - Strength: Preserves the exact browser-zone contract and avoids introducing a potentially misleading server-side date or zone fallback.
  - Tradeoff: Accepts that a transient hydration failure removes the primary action and weakens resilience relative to existing forms.
  - Confidence: HIGH — this accurately documents the implementation already shipped.
  - Blind spot: Real-world island load-failure frequency has not been measured.
- **Decision**: FIXED VIA FIX A — 2026-09-12. Switched to client:load with a functional server-rendered native form. Date and time zone are blank in SSR and manually editable, with server-generated time-zone suggestions. The extracted hook detects browser defaults after hydration without overwriting existing values and recalculates bounds for the selected zone. Native required/length validation and an enabled initial submit button preserve no-JavaScript submission; uncontrolled fields preserve values entered before hydration. Browser checks passed with JavaScript disabled, the bundle blocked, UTC−7/UTC+14 contexts, invalid/corrected zones, and pre-hydration input. See follow-ups/review-fixes.md for verification scope.
