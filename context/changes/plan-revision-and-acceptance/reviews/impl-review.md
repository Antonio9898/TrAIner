<!-- IMPL-REVIEW-REPORT -->

# Implementation Review: Plan Revision and Acceptance

- **Plan**: `context/changes/plan-revision-and-acceptance/plan.md`
- **Scope**: Phases 1–5 of 5
- **Date**: 2026-08-21
- **Verdict**: REJECTED
- **Triage**: COMPLETE — 3 fixed, 1 partially fixed/deferred, 3 skipped
- **Findings**: 1 critical, 5 warnings, 1 observation

## Verdicts

| Dimension           | Verdict |
| ------------------- | ------- |
| Plan Adherence      | FAIL    |
| Scope Discipline    | WARNING |
| Safety & Quality    | FAIL    |
| Architecture        | FAIL    |
| Pattern Consistency | PASS    |
| Success Criteria    | FAIL    |

## Verification

| Check                    | Result         | Evidence                                                                                                                                                                                     |
| ------------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npx supabase db reset`  | PASS           | Both 2026-08-12 migrations applied and the local database restarted successfully.                                                                                                            |
| `npx astro sync`         | PASS           | Completed after allowing Wrangler to write its normal user-level logs and registry.                                                                                                          |
| `npm run lint`           | PASS           | ESLint exited 0; it emitted existing `astro-eslint-parser` compatibility notices.                                                                                                            |
| `npm run build`          | PASS           | Astro SSR/Cloudflare build exited 0; it emitted a non-blocking CSS warning.                                                                                                                  |
| Clean status after build | PASS AFTER FIX | The initial review build changed 15 tracked `dist/` paths and created 14 untracked bundles. After F6, a fresh build created no untracked `dist/`, `.astro/`, or `.wrangler/` status entries. |

## Findings

### F1 — Live provider credential committed to shared Git history

- **Severity**: ❌ CRITICAL
- **Impact**: 🔬 HIGH — architectural stakes; think carefully before deciding
- **Dimension**: Safety & Quality
- **Location**: `.env.local:3`; `dist/server/.dev.vars:3`
- **Detail**: Both tracked files contain a non-empty OpenRouter credential, and the commits that introduced them are reachable from `origin/main`. `.gitignore` now names `.env.local`, but ignoring a file after commit does not remove the credential from current files or history. Supabase values are also present; the inspected Supabase key has publishable-key format, but its intended privilege still needs confirmation. No credential values were printed during this review.
- **Fix**: Revoke and rotate the OpenRouter credential immediately; assess and rotate any privileged Supabase credential, remove both environment files from tracking, purge exposed secrets from shared history, and keep runtime values only in local/Cloudflare secret storage.
  - Strength: Contains the active credential incident and removes both current and historical exposure paths.
  - Tradeoff: Requires coordinated credential rollout and, if history is rewritten, coordination with every clone and deployment source.
  - Confidence: HIGH — the files contain non-placeholder values and their introducing commits are on `origin/main`.
  - Blind spot: Provider access logs and downstream copies were not available, so unauthorized use cannot be ruled out here.
- **Decision**: PARTIALLY FIXED / DEFERRED — `.env.local` and `dist/server/.dev.vars` were removed from Git tracking while preserved locally and ignored. The user deferred OpenRouter revocation/rotation and shared-history cleanup; the exposed credential risk remains active.

### F2 — Authenticated owners can bypass lifecycle RPC invariants

- **Severity**: ⚠️ WARNING
- **Impact**: 🔬 HIGH — architectural stakes; think carefully before deciding
- **Dimension**: Architecture
- **Location**: `supabase/migrations/20260602233915_create_planning_contract.sql:179`; `supabase/migrations/20260812235500_add_training_plan_revision_summary.sql:25`
- **Detail**: The new RPCs correctly enforce owner locks and snapshot comparison, but the existing owner UPDATE policies and table privileges remain active. Local privilege inspection confirms `authenticated` retains UPDATE on both `training_plans` and `training_intakes`. An authenticated client can therefore write its own rows directly through Supabase REST and bypass snapshot checks, validated complete-plan output, revision metadata sequencing, and the claim that the RPC owns each lifecycle transition. Cross-user isolation remains intact.
- **Fix**: Make audited lifecycle RPCs the exclusive mutation boundary by revoking direct lifecycle-table UPDATE privileges and using narrowly scoped `SECURITY DEFINER` functions with explicit `auth.uid()` checks, fixed `search_path`, and exact grants; preserve any other legitimate updates through separate narrow functions.
  - Strength: Enforces the concurrency and lifecycle contract at the database boundary even for direct API clients.
  - Tradeoff: Changes the privilege model and requires auditing every existing intake/plan update caller before revocation.
  - Confidence: HIGH — RLS policy text and live local privilege checks both confirm the bypass path.
  - Blind spot: There may be non-S-03 clients that depend on direct owner updates and need migration.
- **Decision**: SKIPPED — direct authenticated-owner UPDATE access remains available and can bypass lifecycle RPC invariants.

### F3 — Revision summary expands the schema and provider contract outside the plan

- **Severity**: ⚠️ WARNING
- **Impact**: 🔬 HIGH — architectural stakes; think carefully before deciding
- **Dimension**: Plan Adherence
- **Location**: `supabase/migrations/20260812235500_add_training_plan_revision_summary.sql:1`; `src/lib/services/training-plans.ts:43`
- **Detail**: The plan says the migration adds functions only, adds no columns, and reuses one strict model-output contract. Phase 4 instead adds `training_plans.last_revision_summary`, replaces the revision RPC signature, requires a separate `revisionSummary` model field/schema, extends shared types, and renders the value on the dashboard. This is related functionality, but it is durable schema/API drift and makes completed Progress item 2.2 inaccurate.
- **Fix A ⭐ Recommended**: Add a reviewed plan addendum that explicitly accepts the summary column, RPC signature, model-output extension, rollback path, and corrected Progress wording.
  - Strength: Preserves useful implemented UX while restoring an accurate architectural source of truth.
  - Tradeoff: Requires explicit acceptance of the expanded persistence and provider contract after implementation.
  - Confidence: HIGH — the contradiction is direct between plan lines 83/167/442 and the migration/service implementation.
  - Blind spot: The product owner has not confirmed that persisting model-authored summaries is desirable.
- **Fix B**: Remove the summary column, extra RPC argument, distinct response field/schema, shared type, and dashboard block.
  - Strength: Restores the approved functions-only migration and shared response contract exactly.
  - Tradeoff: Removes the dedicated “What changed” UX and requires another design for that copy.
  - Confidence: HIGH — the extra surface is isolated and traceable across migration, service, type, and dashboard.
  - Blind spot: Existing deployed rows may already contain summaries and would need a rollback decision.
- **Decision**: FIXED VIA FIX A — a dated implementation addendum now accepts and documents the revision-summary column, RPC signature, provider response extension, UI use, scope boundary, and rollback path; Migration Notes were reconciled without changing historical Progress titles.

### F4 — Revision requests can generate unbounded paid provider traffic

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Safety & Quality
- **Location**: `src/pages/api/training-plans/revise.ts:52`; `src/lib/services/training-plans.ts:451`
- **Detail**: Every authenticated, same-origin, valid revision starts a paid OpenRouter completion. There is no server-side per-user rate limit, cooldown, quota, or in-flight key. Concurrent or scripted requests can all incur generation cost even though the snapshot RPC allows only one result to persist. The plan explicitly accepts one losing concurrent provider call and excludes provider idempotency infrastructure, but it does not bound repeated or abusive revision traffic.
- **Fix**: Add a server-enforced per-user revision rate limit or cooldown before the provider call while retaining snapshot compare-and-swap for persistence.
  - Strength: Bounds provider-cost abuse without changing the atomic lifecycle design.
  - Tradeoff: Adds durable or platform rate-limit state and user-facing handling for throttled requests.
  - Confidence: HIGH — no server-side limiting mechanism exists in the request or service path.
  - Blind spot: Expected revision frequency and an acceptable quota have not been specified.
- **Decision**: SKIPPED — no server-side revision rate limit or cooldown will be added in this triage; provider-cost exposure remains accepted for now.

### F5 — The review interval contains unrelated implementation scope

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Scope Discipline
- **Location**: `src/middleware.ts:18`; `supabase/config.toml:1`; `.agents/`; `.gitignore:1`
- **Detail**: The plan interval contains 130 non-context changed paths, including a root-route redirect, local Supabase configuration changes, the toolkit installation, environment files, generated Astro/build output, and Wrangler runtime state. These changes are not described by any S-03 phase. Some came from separately named commits, but they remain mixed into the implementation range and obscure feature review and rollback boundaries.
- **Fix**: Record unrelated work under separate changes and keep future feature commit ranges limited to the plan; explicitly reconcile or revert each current extra that is not intended repository state.
  - Strength: Restores auditable scope and makes future reviews, rollback, and blame substantially safer.
  - Tradeoff: Retrospective separation on an already-shared branch may require follow-up commits rather than clean commit surgery.
  - Confidence: HIGH — commit/path comparison clearly separates the planned files from the extra changes.
  - Blind spot: Some extras may be intentional repository-wide maintenance that simply lacks its own change record.
- **Decision**: FIXED — `change.md` now records the exact S-03 feature commits and explicitly excludes unrelated interval commits/configuration from this change; code and published history were left untouched.

### F6 — Generated runtime state invalidates the clean-status success criterion

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Success Criteria
- **Location**: `.gitignore:3`; `eslint.config.js:13`
- **Detail**: The repository tracks 52 `dist/` files, 5 `.astro/` files, and 10 `.wrangler/` files. A fresh successful build produced 29 status entries because content-hashed bundles replaced tracked outputs. ESLint ignores two generated trees, but that does not prevent stale bundles, Miniflare SQLite/WAL state, or copied environment data from entering Git. Progress item 5.5 is marked complete but is not reproducible.
- **Fix**: Restore ignores for `dist/`, `.astro/`, and `.wrangler/`, untrack generated/runtime files, and generate deployment output in CI or the deploy step.
- **Decision**: FIXED — `.astro/`, `dist/`, and `.wrangler/` are ignored and removed from Git tracking while preserved locally. A fresh production build passed without introducing generated-directory status entries.

### F7 — Manual completion has no durable verification evidence

- **Severity**: 👁 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Success Criteria
- **Location**: `context/changes/plan-revision-and-acceptance/plan.md:530`
- **Detail**: All manual rows are checked and stamped with phase commits, but the diff preserves no test notes, screenshots, database observations, or result matrix for the authenticated lifecycle, stale-tab, feedback-preservation, privacy, mobile, and keyboard checks. Code inspection supports several claims, but this review cannot independently distinguish performed manual verification from checkbox attestation.
- **Fix**: Add a concise verification note that records environment, scenarios exercised, outcomes, and any unavailable checks without including private user data.
- **Decision**: SKIPPED — no additional durable manual-verification note will be added during this triage.

## Triage Summary

- **Fixed**: F3 (Fix A), F5, F6
- **Partially fixed / deferred**: F1 — files untracked; credential rotation and history cleanup remain pending
- **Skipped**: F2, F4, F7
- **Accepted as rules**: None
- **Final verdict**: REJECTED — the critical credential exposure remains active until the OpenRouter key is revoked and rotated
