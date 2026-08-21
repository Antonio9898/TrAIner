# Post-Workout Feedback — Plan Brief

> Full plan: `context/changes/post-workout-feedback/plan.md`

## What & Why

Build the final MVP slice so a user can record simple feedback after completing a workout from an accepted plan and review recent entries for that workout. Feedback is captured for progress tracking only; automatic AI plan adaptation remains a later change.

## Starting Point

Accepted plans and scheduled workout cards already exist. The database and shared type already model per-workout feedback, but there is no submission service, endpoint, form, history page, or completion action.

## Desired End State

Each accepted workout links to a dedicated page where the owner can save a dated difficulty rating with optional satisfaction and notes. The same page shows recent append-only history, survives plan revisions as read-only context, and prevents duplicate writes from the same submission.

## Key Decisions Made

| Decision        | Choice                                                       | Why                                                           |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| Product scope   | Capture plus per-workout history                             | Completes S-04 without expanding AI behavior                  |
| Feedback fields | Required difficulty; optional satisfaction and notes         | Uses the existing contract while keeping submission quick     |
| Performed date  | Local calendar date, editable within acceptance/today bounds | Supports delayed logging without collecting unnecessary time  |
| Repeat workouts | Multiple rows with per-form UUID idempotency                 | Allows weekly repetition while blocking accidental duplicates |
| Entry point     | Dedicated plan/workout feedback page                         | Keeps the mobile UI focused and dashboard bounded             |
| History         | Latest 50 entries on the selected workout page               | Gives visible progress without global history or pagination   |
| Persistence     | Exclusive atomic database RPC                                | Closes revision races and direct-table bypasses               |
| Mutation model  | Append-only                                                  | Keeps MVP history auditable and avoids edit/delete scope      |
| AI usage        | None in S-04                                                 | Separates signal collection from later adaptation rules       |
| Verification    | Existing gates plus durable manual matrix                    | Matches the repository baseline without hiding untested risks |

## Scope

**In scope:**

- Accepted-workout dashboard links.
- Dedicated feedback form and per-workout recent history.
- Difficulty `1..10`, optional satisfaction `1..5`, optional notes, and performed date.
- Repeat performances with idempotent retry handling.
- Atomic owner/accepted/current-key validation and append-only privileges.
- Read-only historical behavior across draft/revised plan states.
- Durable verification evidence.

**Out of scope:**

- Active workout tracking, timers, sets, reps, or exercise logs.
- Automatic AI adaptation or feedback in revision prompts.
- Global history, analytics, charts, pagination, editing, or deletion.
- Plan versions, medical inference, trainer/admin/shared flows, or new test infrastructure.

## Architecture / Approach

The dashboard links to `/dashboard/plans/[planId]/workouts/[workoutKey]/feedback`. An Astro SSR page owner-loads the explicit plan and bounded history, while a React island owns accessible client validation and native POST. A thin dynamic API route calls a Zod-backed feedback service. That service submits only through a locked, least-privilege Supabase RPC that derives the workout label, validates the local calendar date and current accepted key, and enforces per-user token idempotency.

## Phases at a Glance

| Phase                   | What it delivers                                 | Key risk                               |
| ----------------------- | ------------------------------------------------ | -------------------------------------- |
| 1. Persistence contract | Token, atomic RPC, exclusive mutation privileges | Privilege bypass or revision race      |
| 2. Domain service       | Validation, RPC mapping, exact bounded history   | Leaking or trusting client identity    |
| 3. POST endpoint        | Same-origin authenticated redirects              | Ownership disclosure in failures       |
| 4. Feedback experience  | Dashboard CTA, dedicated form and history        | Confusing draft/revision behavior      |
| 5. Verification         | Automated gates and durable risk matrix          | False confidence without live evidence |

**Prerequisites:** Implemented F-01 and archived/completed S-03; local Supabase/Docker for database verification.

**Estimated effort:** Approximately 4–6 focused implementation sessions across five phases.

## Open Risks & Assumptions

- History for a workout key removed by revision remains preserved and reachable through its prior direct URL, but is not discoverable through a global history view.
- A 50-entry page limit is sufficient for the small MVP; pagination is deferred.
- Browser IANA time zone is accepted as calendar-validation context, while stored/rendered date semantics remain deterministic.
- The security-definer RPC is safe only with explicit owner checks, fixed search path, fully qualified objects, and exact grants.
- No automated regression suite exists yet; `verification.md` must record the risk-focused live checks.

## Success Criteria (Summary)

- An owner can log valid feedback for a current workout only after plan acceptance and review its recent append-only history.
- Exact retries create one row, distinct performances create separate rows, and direct/cross-user mutation cannot bypass the contract.
- Dates do not shift, revision races preserve valid state, historical rows survive revisions, and responsive accessible UX plus repository gates pass.
