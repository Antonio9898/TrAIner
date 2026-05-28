---
project: TrAIner
researched_at: 2026-05-26
recommended_platform: Cloudflare Workers
runner_up: Vercel
context_type: mvp
tech_stack:
  language: TypeScript/JavaScript
  framework: Astro 6 SSR + React 19 islands
  runtime: Cloudflare Workers runtime
---

## Recommendation

**Deploy on Cloudflare Workers.**

Cloudflare Workers is the best fit for this MVP because the repository already uses Astro SSR with `@astrojs/cloudflare`, Wrangler, and a Worker entrypoint in `wrangler.jsonc`. The accepted constraints are request/response only, no always-on background process requirement, external Supabase is fine, and single-region data latency is acceptable. The important correction is that this is a Workers decision, not a Cloudflare Pages decision: Astro 6 with the current Cloudflare adapter targets Workers and Pages deploy commands should be avoided.

## Decision Inputs

- Persistent server-side connections: not required for the MVP.
- Cost posture: keep low operational cost, but prioritize fast iteration and low maintenance.
- Platform familiarity: the starter already points at Cloudflare, but the implementation target is Workers.
- User geography: single-region data is acceptable; global edge rendering is a useful bonus.
- Managed services: Supabase remains external for auth and data.
- Hard filters: no platform was removed before scoring because the MVP is stateless and does not require persistent workers or WebSockets.

## Platform Comparison

| Platform           | CLI-first | Managed/serverless | Agent-readable docs | Stable deploy API | MCP / integration | Result          |
| ------------------ | --------- | ------------------ | ------------------- | ----------------- | ----------------- | --------------- |
| Cloudflare Workers | Pass      | Pass               | Pass                | Pass              | Pass              | Recommended     |
| Vercel             | Pass      | Pass               | Pass                | Pass              | Partial           | Runner-up       |
| Netlify            | Pass      | Pass               | Pass                | Partial           | Pass              | Third option    |
| Fly.io             | Pass      | Partial            | Pass                | Partial           | Partial           | Not shortlisted |
| Railway            | Partial   | Partial            | Pass                | Partial           | Partial           | Not shortlisted |
| Render             | Partial   | Partial            | Pass                | Partial           | Partial           | Not shortlisted |

Cloudflare Workers wins because the repo is already configured for the Workers runtime, Wrangler supports deploys, version uploads, rollback, secrets, and tailing logs, and Cloudflare publishes both agent-readable docs and managed MCP servers. It also avoids an adapter migration and fits the MVP's stateless SSR shape.

Vercel is a strong fallback for Astro SSR and has excellent deploy ergonomics, but this repository would need an adapter migration to `@astrojs/vercel` and a runtime shift away from Workers. Vercel MCP is useful but beta, so it remains a partial signal rather than a reason to displace the existing Worker-aligned setup.

Netlify has a strong CLI, deploy previews, an official MCP server, and a mature Jamstack workflow. It ranks third because rollback is less CLI-native for this use case, and the newer credit model can pause projects that exceed account limits unless billing controls are handled deliberately.

Fly.io is good when the application needs persistent processes, regional VMs, or long-running workers. That is not this MVP. It would add Docker or machine lifecycle concerns that the current Astro SSR app does not need.

Railway has a strong developer experience and can deploy with `railway up`, but the rollback and idle-cost story are weaker for a small stateless frontend-backed app. It is a better fit when co-located services are the main priority.

Render is a simple PaaS with deploy hooks, API support, and a CLI, but it is less edge-native and less CLI-complete for rollback than Workers. For this project it introduces more operational surface than the MVP needs.

### Shortlisted Platforms

#### 1. Cloudflare Workers (Recommended)

Workers matches the current Astro Cloudflare adapter, the checked-in Wrangler config, and the project shape. It gives the agent a clear CLI-first loop: build, deploy, set secrets, upload preview versions, tail logs, and roll back Worker versions.

#### 2. Vercel

Vercel is the cleanest alternate SSR host for Astro if Cloudflare becomes blocked by account, billing, or org constraints. The tradeoff is a deliberate adapter migration plus acceptance that Vercel MCP is beta.

#### 3. Netlify

Netlify is a viable third option with strong previews, a good CLI, and a first-class MCP story. Its credit limits and rollback workflow make it less attractive than Workers for this repository's already-Cloudflare-aligned starter.

## Anti-Bias Cross-Check: Cloudflare Workers

### Devil's Advocate: Weaknesses

1. The `@astrojs/cloudflare` v13 and Astro 6 path is newer enough that runtime drift between Astro, Vite, Wrangler, and workerd can break builds or local previews unexpectedly.
2. The existing `tech-stack.md` mentions Cloudflare Pages as the starter default, which can mislead a future agent into running `wrangler pages deploy` even though the current adapter targets Workers.
3. Supabase access depends on correctly mapping `.dev.vars`, Workers Secrets, and Astro server environment access. A mismatch can make auth fail only after deployment.
4. AI-assisted planning may later outgrow a simple request/response Worker if generation becomes long-running, retry-heavy, or queue-like.
5. Preview URLs are useful for smoke tests, but preview observability is weaker than production-like deployments because preview URL logs are limited.

### Pre-Mortem: How This Could Fail

Six months after launch, the deployment choice failed because the team treated "Cloudflare" as one interchangeable target. A later agent copied an older Pages workflow, changed scripts around `wrangler pages deploy`, and broke the Astro 6 Cloudflare adapter assumptions. Local tests still looked plausible, but production auth failed because Supabase values were present in `.dev.vars` and missing from Workers Secrets. At the same time, plan generation became slower and users began asking for multi-step revisions, turning what started as a bounded request into a workload that needed retries, cancellation, and background continuation. The team tried to roll back quickly, but the rollback only restored Worker code while a Supabase migration had already changed data shape. Debugging dragged because the broken build had only been tested through preview URLs with limited logs. The root mistake was choosing Workers correctly, then failing to keep the operational contract explicit: Workers-only commands, separate secret stores, bounded AI calls, and human-approved data migrations.

### Unknown Unknowns

- Astro 6 local development with the Cloudflare adapter now uses the real Workers runtime through workerd, so older `wrangler dev` assumptions may be stale.
- Cloudflare environment selection for Astro 6 is determined at build time; future environment-specific deploys should build with the intended `CLOUDFLARE_ENV` before `wrangler deploy`.
- `wrangler secret put` creates and deploys a new Worker version immediately; use versioned secret commands when gradual deployments are required.
- Worker preview URLs are generated from deployed or uploaded versions, but they remain on `workers.dev` and cannot currently provide the same log workflow as production-like deployments.
- A Worker rollback restores code, not Supabase schema or data. Database changes need their own rollout and rollback plan.

## Operational Story

- **Preview deploys**: Use Worker version preview URLs produced by `npx wrangler versions upload`; add `--preview-alias <name>` for stable branch-like preview URLs when needed. If Workers Builds is enabled later, use production branch deploys for `main` and version uploads for non-production branches.
- **Secrets**: Local development values live in `.dev.vars`. Deployed values live in Workers Secrets set with `npx wrangler secret put SUPABASE_URL` and `npx wrangler secret put SUPABASE_KEY`. Do not store real Supabase values as plaintext Wrangler vars or commit them to the repository.
- **Rollback**: Use `npx wrangler rollback <VERSION_ID> --message "rollback"` to reactivate a previous Worker version. This does not roll back Supabase schema or data migrations.
- **Approval**: Human approval is required for the first production deploy, domain binding, primary secret rotation, billing changes, and destructive Supabase changes. Agents may run builds, inspect logs, upload previews, and prepare deploy commands.
- **Logs**: Use `npx wrangler tail <worker-name> --format json` for live runtime logs. Emit structured JSON logs for auth and planning flows, and keep in mind that high-volume tailing can sample or omit detail.

## Risk Register

| Risk                                    | Source           | Likelihood | Impact | Mitigation                                                                                                                      |
| --------------------------------------- | ---------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Astro 6 plus Workers runtime drift      | Research finding | Medium     | High   | Keep `@astrojs/cloudflare` and `wrangler` pinned, run `npm run build`, and smoke-test auth routes before deploy.                |
| Workers vs Pages confusion              | Devil's advocate | Medium     | Medium | Treat this as a Workers-only deployment contract and avoid `wrangler pages deploy` in docs, scripts, and deployment plans.      |
| Supabase secret or environment mismatch | Pre-mortem       | Medium     | High   | Configure `.dev.vars` locally and Workers Secrets remotely; smoke-test sign-in, sign-up, and sign-out after deployment.         |
| AI generation outgrows request/response | Unknown unknowns | Medium     | High   | Keep MVP AI calls bounded; add Queues, Workflows, or a separate Worker only after a concrete long-running workload appears.     |
| Code rollback does not roll back data   | Pre-mortem       | Medium     | High   | Treat Supabase migrations as human-approved changes and prefer forward-compatible schema deployments.                           |
| Preview observability gaps              | Research finding | Low        | Medium | Use preview URLs for basic smoke tests, then debug serious issues through staging or production-like Workers with logs enabled. |

## Getting Started

These are the first commands for this repository. They are Workers commands, not Pages commands.

```bash
npm run build
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_KEY
npx wrangler deploy
npx wrangler tail <worker-name> --format json
npx wrangler rollback <VERSION_ID> --message "rollback"
```

For a non-production preview without activating a new production deployment:

```bash
npx wrangler versions upload
```

After the first deploy, smoke-test `/auth/signin`, `/auth/signup`, `/auth/signout`, and `/dashboard` with production Workers Secrets configured.

## Validation

- Contains all six evaluated platforms.
- Includes a top-three shortlist: Cloudflare Workers, Vercel, Netlify.
- Records the Cloudflare Workers anti-bias cross-check.
- Includes the operational story, risk register, getting-started commands, and out-of-scope notes.
- Keeps Supabase external.
- Does not write under `context/archive/`.
- Does not chain into `/10x-implement`.

## Out of Scope

The following were not evaluated or implemented in this research:

- Docker image configuration
- CI/CD pipeline setup
- Production-scale architecture such as multi-region high availability or disaster recovery
- Supabase migration rollback implementation
- The deployment execution itself

## Sources

Official sources from the accepted decision plan, checked on 2026-05-26:

- [Astro Cloudflare adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Cloudflare Astro guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)
- [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Wrangler Workers commands](https://developers.cloudflare.com/workers/wrangler/commands/workers/)
- [Worker preview URLs](https://developers.cloudflare.com/workers/configuration/previews/)
- [Workers secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Cloudflare MCP servers](https://developers.cloudflare.com/agents/model-context-protocol/mcp-servers-for-cloudflare/)
- [Vercel Astro](https://vercel.com/docs/frameworks/frontend/astro)
- [Vercel MCP](https://vercel.com/docs/agent-resources/vercel-mcp)
- [Netlify pricing](https://www.netlify.com/pricing/)
- [Netlify MCP Server](https://docs.netlify.com/build/build-with-ai/netlify-mcp-server/)
- [Fly.io flyctl](https://fly.io/docs/flyctl/)
- [Fly.io deploy command](https://fly.io/docs/flyctl/deploy/)
- [Railway CLI deployment](https://docs.railway.com/cli/deploying)
- [Railway deployment actions](https://docs.railway.com/deployments/deployment-actions)
- [Render CLI](https://render.com/docs/cli)
- [Render rollbacks](https://render.com/docs/rollbacks)
