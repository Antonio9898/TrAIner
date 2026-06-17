# First Explained Training Plan - Plan Brief

> Full plan: `context/changes/first-explained-training-plan/plan.md`
> Research: `context/changes/first-explained-training-plan/research.md`

## What & Why

Build S-02: the first end-to-end proof that TrAIner can produce an explained training plan from a saved intake. The user should see a plan matched to their goal, level, and constraints, with practical safety notes and an explanation that does not pretend to diagnose or clear them for training.

## Starting Point

The app already has auth, dashboard, saved intake flow, owner-scoped planning tables, and `TrainingPlanContent` types. It does not yet have OpenRouter integration, a plan-generation service/route, or UI that renders a stored plan.

## Desired End State

A signed-in user with a saved editable intake can generate a first draft plan from `/dashboard`. The app calls OpenRouter server-side, validates the structured JSON with Zod, stores one `draft` plan for the intake, and renders the full plan inline on the dashboard. Failures show safe generic messages and store nothing when model output is invalid.

## Key Decisions Made

| Decision | Choice | Why | Source |
| --- | --- | --- | --- |
| Provider integration | Direct server-side OpenRouter `fetch` | One generation call does not justify adding an SDK dependency. | Research |
| Model selection | Required `OPENROUTER_MODEL`, no code fallback | Cost and quality stay explicit and deploys fail clearly when model config is missing. | Plan |
| Plan size | One week, 2-5 workouts | Gives a useful MVP plan while keeping validation and dashboard rendering bounded. | Plan |
| Duplicate submit | UI double-submit guard plus DB unique constraint | Avoids new schema/state while accepting rare wasted parallel model calls. | Plan |
| Invalid model output | Store nothing, no retry, safe dashboard error | Prevents bad plan data and keeps cost/control simple. | Plan |
| UI destination | Full plan inline on dashboard | Fastest north-star proof without adding a separate route. | Plan |
| OpenRouter attribution | Fixed `TrAIner` title, optional referer env | Keeps setup small while supporting production URL attribution. | Plan |
| Safety boundary | Use `safetyNotes`, no diagnosis/risk/clearance | Matches the established product-safety contract. | Research |

## Scope

**In scope:**

- OpenRouter env/config and server-only transport helper.
- Training-plan service with prompt construction, Zod validation, row mapping, and draft insert.
- Authenticated POST route at `src/pages/api/training-plans/generate.ts`.
- Dashboard generate form and full inline plan display.
- Safe error handling and manual verification of privacy/safety boundaries.

**Out of scope:**

- Schema or RLS changes.
- Plan revision, regeneration, acceptance, or feedback.
- Streaming, background jobs, persisted generation state, or automatic retry.
- Raw prompt/output storage.
- Medical taxonomy, diagnosis, risk scoring, red-flag blockers, or clearance language.

## Architecture / Approach

Use three server-side layers: `src/lib/openrouter.ts` for provider transport, `src/lib/services/training-plans.ts` for domain generation and persistence, and `src/pages/api/training-plans/generate.ts` for HTTP/auth/redirect handling. `/dashboard` remains the single user-facing surface for S-02, switching between no-intake, generate, error, and stored-plan states.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. OpenRouter Runtime Contract | Env schema, secret docs, and provider fetch helper | Accidentally exposing secrets or hiding model config. |
| 2. Training Plan Generation Service | Prompt, Zod validation, row mapping, draft insert | Treating structured output as sufficient without validation. |
| 3. Generation Route | Authenticated POST and safe redirects | Leaking private text or allowing generation without an editable intake. |
| 4. Dashboard Generate and View UI | Generate action and full inline plan display | Long generated content breaking mobile or safety copy drifting. |
| 5. Verification and Handoff | Lint/build/manual E2E checks | Env-dependent build or provider failures during verification. |

**Prerequisites:** Working Supabase auth/intake flow, OpenRouter API key, explicit `OPENROUTER_MODEL`, and optional `OPENROUTER_HTTP_REFERER`.
**Estimated effort:** About 2-3 focused implementation sessions across 5 phases.

## Open Risks & Assumptions

- OpenRouter model behavior may still produce invalid output despite JSON schema mode; Zod validation is the hard gate.
- The MVP accepts rare wasted model calls during parallel double-submit races instead of adding persisted generation state.
- Build/dev verification now depends on OpenRouter env values where Astro env validation requires them.
- Dashboard remains the only plan view in S-02; a dedicated plan route is left for a later slice if needed.

## Success Criteria (Summary)

- A signed-in user can generate and view a first explained draft plan from a saved intake.
- The stored plan is owner-scoped, tied to the correct intake, and renders inline with explanation, workouts, progression, and safety notes.
- Invalid output or provider/config failures store nothing and do not leak private intake text, prompts, raw output, or provider details.
