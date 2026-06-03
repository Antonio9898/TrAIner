# Goal and Constraints Intake - Plan Brief

> Full plan: `context/changes/goal-and-constraints-intake/plan.md`
> Research inputs: `context/foundation/roadmap.md`, `context/foundation/prd.md`, `context/foundation/training-safety-boundaries.md`, `context/changes/minimal-planning-data-contract/plan.md`

## What & Why

Build S-01 from the roadmap: an authenticated user can enter a training goal, training level, and health constraints. This creates the first private planning context that future plan generation can use without diagnosing injuries or replacing professional medical advice.

## Starting Point

F-01 already created the private `training_intakes` data contract and app-facing types. F-02 already settled the safety boundary: one free-text health-constraints prompt, neutral examples, visible disclaimer, no stored acknowledgement, and no runtime medical blockers.

## Desired End State

Signed-in users can open `/dashboard/intake`, create or edit their latest pre-plan intake, and return to `/dashboard` with a saved summary. The intake stores goal, experience level, health constraints, and optional notes through Supabase RLS using the user's existing session.

## Key Decisions Made

| Decision | Choice | Why | Source |
| --- | --- | --- | --- |
| Route | `/dashboard/intake` | Keeps the route under the existing protected dashboard prefix. | Plan |
| Repeat intake | Edit latest intake until a plan exists | Avoids duplicate pre-plan rows while preserving future plan context. | Plan |
| Submit destination | Redirect to dashboard summary | Confirms persistence and prepares the S-02 handoff. | Plan |
| Empty constraints | Explicit `no known constraints` option | Satisfies the non-empty DB constraint without forcing awkward manual text. | Plan |
| Validation | Add zod for server validation | Matches repository API-route guidance. | Plan |
| Error handling | Redirect with generic safe errors | Preserves existing native POST pattern without leaking health text in URLs. | Plan |
| Scope | Include optional notes | Uses the existing `notes` column for schedule/equipment/preferences context. | Plan |
| Verification | Build/lint plus manual authenticated flow | Matches current CI and avoids adding test tooling before the repo has tests. | Plan |
| Safety wording | Free-text prompt plus visible disclaimer | Already decided by the safety boundary foundation. | Research |
| Schema | No migration | Existing F-01 contract already covers S-01. | Research |

## Scope

**In scope:**

- `/dashboard/intake` protected page.
- React intake form island with goal, experience level, health constraints, no-known-constraints option, and optional notes.
- zod-backed server validation and POST route.
- Supabase read/save helpers for latest editable intake.
- Dashboard saved-intake summary and next-step placeholder.
- Manual authenticated flow verification.

**Out of scope:**

- New migrations or RLS changes.
- AI plan generation, revision, acceptance, or feedback.
- Medical checklist, injury taxonomy, diagnosis, risk scoring, red-flag blockers, or stored disclaimer acknowledgement.
- Trainer/admin/shared-plan roles.
- New automated test framework.

## Architecture / Approach

Use the existing Astro SSR pattern: `/dashboard/intake` renders an Astro shell, server-fetches the latest editable intake, and mounts a React form island. The form submits with a native POST to `/api/training-intakes`; the route validates with zod, saves through the cookie-based Supabase SSR client, and redirects to `/dashboard?saved=intake` or back to the intake page with a generic safe error.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Server Persistence Contract | zod, validation, latest-intake read/save helper, POST route | Accidentally leaking private form text in redirects or using the wrong Supabase client |
| 2. Protected Intake UI | `/dashboard/intake` page and React form with safety copy | Health prompt drifting into medical checklist or diagnosis wording |
| 3. Dashboard Summary and Verification | Dashboard summary, navigation, build/lint/manual checks | Summary/edit behavior creating duplicate pre-plan intakes |

**Prerequisites:** F-01 planning data contract and F-02 safety boundary are implemented.
**Estimated effort:** ~2-3 implementation sessions across 3 phases.

## Open Risks & Assumptions

- Local Supabase may be unavailable; if so, persistence verification needs human schema review or a configured environment.
- The "latest intake has a plan" branch is future-compatible for S-02 but may need simulated data during S-01 verification.
- Adding zod requires dependency installation and lockfile update.

## Success Criteria (Summary)

- Signed-in users can create and edit their latest pre-plan intake from `/dashboard/intake`.
- Dashboard shows the saved intake summary and a clear next-step placeholder.
- The flow preserves safety and privacy boundaries: no diagnosis, no medical checklist, no acknowledgement storage, no red-flag blocking, and no private health text in URLs.
