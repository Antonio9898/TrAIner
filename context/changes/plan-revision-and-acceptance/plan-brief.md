# Plan Revision and Acceptance — Plan Brief

> Full plan: `context/changes/plan-revision-and-acceptance/plan.md`
> Related research: `context/changes/first-explained-training-plan/research.md`

## What & Why

S-03 completes the plan review loop: an authenticated user can request a complete correction, update the health constraints shaping it, accept the version they intend to follow, and later revise an accepted plan again. The flow must preserve safety constraints and never let failed AI output or stale tabs leave intake and plan data out of sync.

## Starting Point

S-02 already creates one validated draft per intake through OpenRouter and renders it on `/dashboard`. The schema already contains revision and acceptance fields, but there are no lifecycle services, endpoints, controls, or concurrency-safe cross-table updates.

## Desired End State

One correction request generates and validates a complete replacement plan. A short authenticated RPC then atomically updates the source constraints and current plan only if the submitted snapshot is still current; success produces a new draft, while acceptance marks that reviewed version as accepted. Accepted plans can be revised again, and existing workout feedback remains attached unchanged.

## Key Decisions Made

| Decision             | Choice                                                                         | Why                                                                 | Source               |
| -------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------- | -------------------- |
| Revision interaction | One correction textarea; regenerate the complete plan                          | Fits the current overwrite model without chat history               | Plan                 |
| Accepted lifecycle   | Accepted plans can be revised and reopen as drafts                             | User wants continued iteration on the same plan                     | Plan                 |
| Constraint changes   | Update the existing source intake during revision                              | Keeps durable constraints aligned with regenerated content          | Plan                 |
| Atomicity            | Generate/validate first, then update intake and plan in one RPC                | Failed AI or persistence cannot leave mixed state                   | Plan + Supabase docs |
| Feedback             | Keep existing feedback unchanged after revisions                               | Explicitly favors continuity over immutable historical plan content | Plan                 |
| Concurrency          | Compare the exact `updatedAt` snapshot                                         | Prevents stale revision/acceptance from overwriting a newer state   | Plan                 |
| Database security    | `SECURITY INVOKER`, owner RLS, empty `search_path`, authenticated-only execute | Preserves current access model with least privilege                 | Supabase docs        |
| Verification         | Existing checks plus risk-focused manual matrix                                | Avoids adding test infrastructure outside the quality workflow      | Plan                 |

## Scope

**In scope:**

- Transactional Supabase RPCs for revision and acceptance.
- Complete-plan OpenRouter regeneration using current plan, intake, correction, and constraints.
- Zod form/output validation and optimistic concurrency.
- Same-origin authenticated API routes with safe redirect codes.
- Dashboard revision, acceptance, reopening, pending, success, and conflict states.
- Manual verification of feedback preservation, privacy, safety, atomicity, and races.

**Out of scope:**

- Plan versions, revision/chat history, rollback, comparison, or direct exercise editing.
- Feedback deletion, remapping, editing, or version linkage.
- Streaming/background jobs, persisted locks, or provider-call idempotency.
- Medical gates, diagnosis, risk scoring, acknowledgements, trainer/admin/shared flows.
- New automated test framework or CI test stage.

## Architecture / Approach

The route validates an explicit plan id and snapshot, and the service owner-reads the plan and intake. OpenRouter generates a complete replacement outside any database lock; Zod validates it. The authenticated revision RPC then locks the plan, checks `updated_at`, and atomically updates the intake plus plan. Acceptance uses a second conditional RPC. Astro renders lifecycle state, a React revision form handles its two text fields, and a native form handles acceptance.

## Phases at a Glance

| Phase                 | What it delivers                                         | Key risk                                |
| --------------------- | -------------------------------------------------------- | --------------------------------------- |
| 1. Database lifecycle | Least-privilege atomic revision and acceptance RPCs      | Partial writes or privilege bypass      |
| 2. Service logic      | Validation, prompts, full regeneration, RPC mapping      | Safety bypass or stale overwrite        |
| 3. API routes         | Authenticated same-origin mutations and safe redirects   | Privacy leakage or foreign mutation     |
| 4. Dashboard UX       | Revision, acceptance, reopening, status, and conflict UI | Ambiguous lifecycle or unsafe copy      |
| 5. Verification       | Migration/build gates and manual risk matrix             | Races or feedback drift missed manually |

**Prerequisites:** Implemented F-01, F-02, S-01, S-02; local Supabase/Docker for full migration checks; configured Supabase/OpenRouter environment for end-to-end verification.
**Estimated effort:** Approximately 4-6 focused implementation sessions across five phases.

## Open Risks & Assumptions

- Concurrent losing revisions may still consume one provider call because generation intentionally happens before the short database lock; the user accepted optimistic concurrency instead of persistent locking.
- Preserved feedback may reference workout keys or content from an earlier plan version; the UI discloses this, and S-03 does not remap history.
- Current plans can become drafts again after feedback exists; downstream S-04 must treat stored workout key/label as historical submission context, not proof of current plan membership.
- Automated regression coverage is deferred; the implementation must complete the explicit manual race and atomicity matrix.

## Success Criteria (Summary)

- Owners can revise drafts or accepted plans, update constraints atomically, review the complete replacement, accept it, and repeat the loop.
- Failed generation, invalid output, stale snapshots, foreign targets, and persistence errors make no partial change and reveal no private details.
- Feedback remains untouched, safety boundaries remain reminder-only and non-diagnostic, and migration/Astro/lint/build plus responsive manual checks pass.
