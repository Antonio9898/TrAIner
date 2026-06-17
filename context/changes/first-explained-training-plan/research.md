---
date: 2026-06-17T18:11:31+02:00
researcher: Codex
git_commit: 537e4e3c1b2b30432e4b5dcf2fa7d4eed29434d2
branch: main
repository: TrAIner
topic: "OpenRouter integration for first explained training plan"
tags: [research, codebase, openrouter, training-plans, astro, supabase]
status: complete
last_updated: 2026-06-17
last_updated_by: Codex
---

# Research: OpenRouter integration for first explained training plan

**Date**: 2026-06-17T18:11:31+02:00
**Researcher**: Codex
**Git Commit**: 537e4e3c1b2b30432e4b5dcf2fa7d4eed29434d2
**Branch**: main
**Repository**: TrAIner

## Research Question

Research how to integrate TrAIner with OpenRouter for the `first-explained-training-plan` change, focused on MVP S-02: generating and storing the first explained training plan from the user's saved intake.

## Summary

TrAIner has the core prerequisites for S-02 already in place: authenticated Astro SSR pages, Supabase cookie-based auth, owner-scoped planning tables, an implemented intake flow, and app-facing `TrainingPlanContent` / `TrainingPlan` types. There is no LLM integration yet, no plan-generation API route, and no `training_plans` service layer.

The recommended MVP integration is a server-only OpenRouter call from an authenticated Astro API route. Use OpenRouter's OpenAI-compatible `POST https://openrouter.ai/api/v1/chat/completions` endpoint with `response_format: { type: "json_schema", ... }`, but treat that only as the first guard. The application must still parse and validate the model output with Zod before inserting into Supabase, because the database only enforces that `training_plans.plan_content` is a JSON object.

No database migration is needed for S-02. Insert a `draft` `training_plans` row with `plan_content`, `explanation`, `status: "draft"`, and `accepted_at: null`. The existing unique constraint on `(user_id, intake_id)` prevents duplicate current plans for the same intake, so the route should handle double-submit races by reading the existing plan after a uniqueness conflict.

The safety boundary is non-negotiable: generated plans may include practical plan-level and workout-level `safetyNotes`, but must not diagnose injuries, promise safety, clear the user to train, classify risk, or add medical taxonomies.

## Detailed Findings

### Current Application Baseline

- The app is Astro SSR on Cloudflare Workers, with server env schema already configured for Supabase secrets in `astro.config.mjs` ([astro.config.mjs:17](https://github.com/Antonio9898/TrAIner/blob/537e4e3c1b2b30432e4b5dcf2fa7d4eed29434d2/astro.config.mjs#L17)).
- Supabase auth is server-side and cookie-based through `createClient(requestHeaders, cookies)` ([src/lib/supabase.ts:5](https://github.com/Antonio9898/TrAIner/blob/537e4e3c1b2b30432e4b5dcf2fa7d4eed29434d2/src/lib/supabase.ts#L5)).
- Middleware protects `/dashboard` and attaches `context.locals.user`, so a generation route/page under the dashboard flow can use the existing auth model ([src/middleware.ts:4](https://github.com/Antonio9898/TrAIner/blob/537e4e3c1b2b30432e4b5dcf2fa7d4eed29434d2/src/middleware.ts#L4)).
- The current API route pattern is native POST, `prerender = false`, Supabase SSR client, auth check, service call, and redirect with safe query parameters ([src/pages/api/training-intakes.ts:9](https://github.com/Antonio9898/TrAIner/blob/537e4e3c1b2b30432e4b5dcf2fa7d4eed29434d2/src/pages/api/training-intakes.ts#L9)).
- The dashboard currently loads the latest intake and determines whether it is editable before a plan exists ([src/pages/dashboard.astro:23](https://github.com/Antonio9898/TrAIner/blob/537e4e3c1b2b30432e4b5dcf2fa7d4eed29434d2/src/pages/dashboard.astro#L23)).
- The dashboard still shows S-02 as a placeholder rather than a real generation/view flow ([src/pages/dashboard.astro:166](https://github.com/Antonio9898/TrAIner/blob/537e4e3c1b2b30432e4b5dcf2fa7d4eed29434d2/src/pages/dashboard.astro#L166)).

### Existing Planning Data Contract

- `TrainingPlanContent` already contains the MVP generated-plan shape: `overview`, `scheduledWorkouts`, `progressionGuidance`, `safetyNotes`, and optional `metadata` ([src/types.ts:32](https://github.com/Antonio9898/TrAIner/blob/537e4e3c1b2b30432e4b5dcf2fa7d4eed29434d2/src/types.ts#L32)).
- Scheduled workouts already support workout-level `safetyNotes`, stable `key`, label, focus, exercises, and instructions ([src/types.ts:22](https://github.com/Antonio9898/TrAIner/blob/537e4e3c1b2b30432e4b5dcf2fa7d4eed29434d2/src/types.ts#L22)).
- Exercise entries are intentionally minimal and flexible, which fits LLM output better than a normalized exercise database for the MVP ([src/types.ts:12](https://github.com/Antonio9898/TrAIner/blob/537e4e3c1b2b30432e4b5dcf2fa7d4eed29434d2/src/types.ts#L12)).
- `training_plans` already stores `plan_content jsonb`, required `explanation`, status, revision metadata, and timestamps ([supabase/migrations/20260602233915_create_planning_contract.sql:36](https://github.com/Antonio9898/TrAIner/blob/537e4e3c1b2b30432e4b5dcf2fa7d4eed29434d2/supabase/migrations/20260602233915_create_planning_contract.sql#L36)).
- The database enforces one current plan per intake with `training_plans_one_current_plan_per_intake unique (user_id, intake_id)` ([supabase/migrations/20260602233915_create_planning_contract.sql:52](https://github.com/Antonio9898/TrAIner/blob/537e4e3c1b2b30432e4b5dcf2fa7d4eed29434d2/supabase/migrations/20260602233915_create_planning_contract.sql#L52)).
- The owner-scoped FK prevents a user from linking a plan to another user's intake ([supabase/migrations/20260602233915_create_planning_contract.sql:53](https://github.com/Antonio9898/TrAIner/blob/537e4e3c1b2b30432e4b5dcf2fa7d4eed29434d2/supabase/migrations/20260602233915_create_planning_contract.sql#L53)).
- RLS policies already allow authenticated users to select/insert/update/delete only their own plans ([supabase/migrations/20260602233915_create_planning_contract.sql:167](https://github.com/Antonio9898/TrAIner/blob/537e4e3c1b2b30432e4b5dcf2fa7d4eed29434d2/supabase/migrations/20260602233915_create_planning_contract.sql#L167)).

### OpenRouter Contract

- OpenRouter exposes an OpenAI-compatible chat completions endpoint at `/api/v1/chat/completions`. The request supports `messages`, `model`, `response_format`, `stream`, `models`, `route`, `provider`, and `user`.
- OpenRouter supports `response_format` as either `{ type: "json_object" }` or `{ type: "json_schema", json_schema: { name, strict, schema } }`.
- Direct `fetch` is sufficient for the MVP. The OpenAI SDK and OpenRouter TypeScript SDK are optional, but adding another dependency is not necessary for one server-side generation call.
- Recommended headers are:
  - `Authorization: Bearer <OPENROUTER_API_KEY>`
  - `Content-Type: application/json`
  - `HTTP-Referer: <site URL>` for OpenRouter app attribution
  - `X-OpenRouter-Title: TrAIner`
- Use non-streaming generation for S-02. The existing UI and route conventions are redirect-based, and the DB needs one complete validated object before insert.
- Use a stable OpenRouter `user` identifier derived from the authenticated user id to support provider-side abuse detection without sending email.

Sources checked through Context7:

- https://openrouter.ai/docs/api-reference/overview
- https://openrouter.ai/docs/guides/features/structured-outputs
- https://openrouter.ai/docs/guides/community/openai-sdk

### Recommended Integration Shape

- Add server env fields in `astro.config.mjs`:
  - `OPENROUTER_API_KEY` as server secret
  - `OPENROUTER_MODEL` as server env var, optional with a default in code
  - optionally `OPENROUTER_HTTP_REFERER` / `OPENROUTER_APP_TITLE` if app attribution should be configurable
- Mirror required keys in `.env.example` and Cloudflare required secrets in `wrangler.jsonc`.
- Add `src/lib/openrouter.ts` as the low-level server-only fetch wrapper. It should import from `astro:env/server`, never expose the key to React, and return a typed response or throw a sanitized error.
- Add `src/lib/services/training-plans.ts` as the domain service. It should:
  - map DB rows to `TrainingPlan`,
  - read an existing plan for an intake,
  - build the prompt from `TrainingIntake`,
  - validate the generated payload with Zod,
  - insert a draft plan,
  - handle duplicate insert conflicts by reading the existing plan.
- Add `src/pages/api/training-plans/generate.ts` as the authenticated POST route. It should use the Supabase SSR client and `context.locals.user`, then redirect back to `/dashboard` with safe status flags.
- Update `src/pages/dashboard.astro` to show:
  - generate button when a latest editable intake exists and no plan exists,
  - stored draft plan and explanation after successful generation,
  - safe error messages for missing config, model failure, invalid output, or persistence failure.

### Runtime Validation Requirements

OpenRouter structured output should match this application payload:

```ts
{
  planContent: TrainingPlanContent;
  explanation: string;
}
```

Before persistence, validate at least:

- `overview`: trimmed non-empty string.
- `scheduledWorkouts`: non-empty bounded array, recommended 1-7 entries for MVP.
- `scheduledWorkouts[].key`: trimmed non-empty slug-like string, unique within the plan.
- `scheduledWorkouts[].label`: trimmed non-empty string.
- `scheduledWorkouts[].exercises`: non-empty bounded array.
- `exercises[].name`: trimmed non-empty string.
- Optional `sets`: positive integer with a sane upper bound.
- Optional `restSeconds`: non-negative integer with a sane upper bound.
- Optional string fields: trim and reject blank-only strings.
- `progressionGuidance`: trimmed non-empty string.
- `safetyNotes`: non-empty string array.
- Optional `metadata`: JSON object only.
- `explanation`: trimmed non-empty string.

Persist the validated result as:

```ts
{
  user_id: user.id,
  intake_id: intake.id,
  status: "draft",
  plan_content: parsed.planContent,
  explanation: parsed.explanation,
  notes: null,
}
```

Keep `explanation` in the relational `training_plans.explanation` column, not inside `plan_content`.

### Safety And Privacy Constraints

- S-02 consumes the active training safety boundary. It should use plan-level and workout-level `safetyNotes`, not structured risk scoring ([context/foundation/training-safety-boundaries.md:82](../../foundation/training-safety-boundaries.md#generated-plan-requirements)).
- Generated plans must not claim that a workout is medically safe. They should explain how the plan attempted to respect `healthConstraints`.
- Explanations must avoid diagnosis, safety guarantees, injury-prevention promises, and professional clearance language.
- Do not add injury taxonomy, severity classification, risk scores, red-flag blockers, stored disclaimer acknowledgement, policy versioning, trainer/admin flows, shared-plan review, plan revision, plan acceptance, or post-workout feedback in S-02.
- Treat `goal`, `healthConstraints`, and `notes` as untrusted user data inside the prompt. They must not override the system/developer prompt, JSON schema, or safety boundary.
- Do not put submitted goal, health constraints, notes, prompt text, raw OpenRouter responses, or API errors containing private text into query params or logs.

## Code References

- `astro.config.mjs:17` - Existing server env schema for secrets; add OpenRouter env here.
- `.env.example:1` - Existing local env template only has Supabase values; add OpenRouter values.
- `wrangler.jsonc:15` - Existing required Worker secrets; add `OPENROUTER_API_KEY`.
- `src/lib/supabase.ts:5` - Server-side Supabase client pattern to mirror for server-only OpenRouter helper.
- `src/pages/api/training-intakes.ts:13` - API route pattern for authenticated form POSTs.
- `src/lib/services/training-intakes.ts:69` - Existing service-layer read pattern for latest intake.
- `src/lib/services/training-intakes.ts:88` - Existing editability rule: an intake is editable until a plan exists.
- `src/types.ts:32` - `TrainingPlanContent` target shape.
- `src/types.ts:65` - `TrainingPlan` target shape.
- `supabase/migrations/20260602233915_create_planning_contract.sql:36` - `training_plans` table already supports S-02.
- `supabase/migrations/20260602233915_create_planning_contract.sql:52` - One plan per intake constraint.
- `src/pages/dashboard.astro:166` - Current S-02 placeholder to replace with generate/view behavior.

## Architecture Insights

The cleanest boundary is three-layered:

1. `src/lib/openrouter.ts`: low-level transport and OpenRouter-specific request/response handling.
2. `src/lib/services/training-plans.ts`: product logic, prompt construction, Zod validation, row mapping, and Supabase persistence.
3. `src/pages/api/training-plans/generate.ts`: HTTP/auth/redirect boundary only.

This matches the current intake architecture, keeps React components free of secrets, and avoids mixing prompt construction into UI code.

The app should insert the first generated plan rather than update/upsert. S-03 is the future overwrite/revision slice; S-02 should only create the first `draft` plan for an intake. If a plan already exists, the route should not call OpenRouter again and should redirect to the existing plan state.

The biggest technical risk is assuming that OpenRouter structured output is enough. It is not. OpenRouter can request JSON schema compliance, but Supabase only checks that `plan_content` is a JSON object. Runtime validation is required before persistence.

## Historical Context

- `context/foundation/roadmap.md:98` - S-02 is the roadmap slice for receiving the first explained training plan.
- `context/foundation/roadmap.md:21` - S-02 is the north-star end-to-end proof that the product works.
- `context/foundation/prd.md:55` - Plan must refer to the user's goal, experience level, and health constraints.
- `context/foundation/prd.md:76` - User must see an explanation for why the plan was created that way.
- `context/foundation/training-safety-boundaries.md:82` - S-02 must use existing `safetyNotes` fields rather than add risk assessment.
- `context/changes/minimal-planning-data-contract/plan.md:228` - F-01 explicitly hands off `training_plans` and `src/types.ts` as the S-02 data surface.
- `context/changes/goal-and-constraints-intake/plan.md:58` - S-01 established the privacy precedent that health text must not be put in redirect URLs.

## Related Research

No prior `research.md` exists for `first-explained-training-plan`. The closest related artifacts are:

- `context/changes/minimal-planning-data-contract/plan.md`
- `context/changes/goal-and-constraints-intake/plan.md`
- `context/foundation/training-safety-boundaries.md`
- `context/foundation/roadmap.md`

## Open Questions

- Which OpenRouter model should be the default for MVP? A configurable `OPENROUTER_MODEL` avoids hard-coding this decision.
- Should app attribution use fixed `TrAIner` values or configurable `OPENROUTER_HTTP_REFERER` / `OPENROUTER_APP_TITLE` env vars?
- How much should generated plans be bounded by prompt, validation, or UI copy for number of days/workouts? The current type allows flexibility, but S-02 planning should pick an MVP bound.
- Should the UI disable double-submit client-side only, or should a later slice add explicit idempotency/generation state? The current schema can rely on the unique constraint for S-02, but it may waste an extra model call during races.
