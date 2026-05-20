---
bootstrapped_at: 2026-05-20T20:23:55Z
starter_id: 10x-astro-starter
starter_name: 10x Astro Starter (Astro + Supabase + Cloudflare)
project_name: trainer
language_family: js
package_manager: npm
cwd_strategy: git-clone
bootstrapper_confidence: first-class
phase_3_status: ok
audit_command: npm audit --json
---

## Hand-off

```yaml
---
starter_id: 10x-astro-starter
package_manager: npm
project_name: trainer
hints:
  language_family: js
  team_size: solo
  deployment_target: cloudflare-pages
  ci_provider: github-actions
  ci_default_flow: auto-deploy-on-merge
  bootstrapper_confidence: first-class
  path_taken: standard
  quality_override: false
  self_check_answers: null
  has_auth: true
  has_payments: false
  has_realtime: false
  has_ai: true
  has_background_jobs: false
---
```

### Why this stack

TrAIner is a small, after-hours web-app MVP with login, private user data, and an AI-assisted planning flow. The recommended JavaScript/TypeScript starter for this product shape is 10x Astro Starter, which gives a typed, convention-based full-stack baseline with auth/data/deploy conventions already aligned. Cloudflare Pages is the starter default deployment target, GitHub Actions with auto-deploy on merge keeps the solo workflow simple, and bootstrapper support is first-class.

## Pre-scaffold verification

| Signal | Value | Severity | Notes |
| --- | --- | --- | --- |
| npm package | not run | unavailable | Skipped because the starter command uses `git clone`, not an npm `create-*` CLI. |
| GitHub repo | not run | unavailable | `gh api repos/przeprogramowani/10x-astro-starter --jq '.pushed_at'` failed because `gh` is not installed locally. |

## Scaffold log

**Resolved invocation**: `git clone https://github.com/przeprogramowani/10x-astro-starter .bootstrap-scaffold && cd .bootstrap-scaffold && npm install`
**Strategy**: git-clone
**Exit code**: 0
**Files moved**: 18
**Conflicts (.scaffold siblings)**: `README.md.scaffold`
**.gitignore handling**: append-merged
**.bootstrap-scaffold cleanup**: deleted

**Install notes**: `npm install` completed after adding 778 packages. npm reported engine warnings for `astro@6.3.1` and `sitemap@9.0.1` because the local npm version is `9.2.0`, below those packages' declared npm ranges. The installed Node version was `v22.22.1`.

## Post-scaffold audit

**Tool**: `npm audit --json`
**Exit code**: 1
**Summary**: 0 CRITICAL, 1 HIGH, 10 MODERATE, 0 LOW
**Direct vs transitive**: 0/0/3/0 direct of total 0/1/10/0

#### CRITICAL findings

None.

#### HIGH findings

| Package | Direct | Advisory | Range | Fix |
| --- | --- | --- | --- | --- |
| `devalue` | no | GHSA-77vg-94rm-hx3p - Svelte devalue: DoS via sparse array deserialization | `5.6.3 - 5.8.0` | Fix available according to npm audit. |

#### MODERATE findings

| Package | Direct | Via | Range | Fix |
| --- | --- | --- | --- | --- |
| `@astrojs/check` | yes | `@astrojs/language-server` | `>=0.9.3` | `@astrojs/check@0.9.2` per npm audit; semver-major change flagged. |
| `@astrojs/cloudflare` | yes | `@cloudflare/vite-plugin`, `wrangler` | `>=12.2.4` | `@astrojs/cloudflare@12.6.13` per npm audit; semver-major change flagged. |
| `@astrojs/language-server` | no | `volar-service-yaml` | `>=2.14.0` | Fix through `@astrojs/check@0.9.2` per npm audit. |
| `@cloudflare/vite-plugin` | no | `miniflare`, `wrangler`, `ws` | `<=0.0.0-fff677e35 || >=0.0.7` | Fix through `@astrojs/cloudflare@12.6.13` per npm audit. |
| `miniflare` | no | `ws` | `<=0.0.0-fff677e35 || >=3.20250204.0` | Fix through `@astrojs/cloudflare@12.6.13` per npm audit. |
| `volar-service-yaml` | no | `yaml-language-server` | `<=0.0.70` | Fix through `@astrojs/check@0.9.2` per npm audit. |
| `wrangler` | yes | `miniflare` | `<=0.0.0-kickoff-demo || >=3.108.0` | `wrangler@3.107.3` per npm audit; semver-major change flagged. |
| `ws` | no | GHSA-58qx-3vcg-4xpx - Uninitialized memory disclosure | `8.0.0 - 8.20.0` | Fix through `@astrojs/cloudflare@12.6.13` per npm audit. |
| `yaml` | no | GHSA-48c2-rrv3-qjmp - stack overflow via deeply nested YAML collections | `2.0.0 - 2.8.2` | Fix through `@astrojs/check@0.9.2` per npm audit. |
| `yaml-language-server` | no | `yaml` | `1.11.1-08d5f7b.0 - 1.21.1-f1f5a94.0 || 1.22.1-0ae5603.0 - 1.22.1-fc5f874.0` | Fix through `@astrojs/check@0.9.2` per npm audit. |

#### LOW / INFO findings

None.

## Hints recorded but not acted on

| Hint | Value |
| --- | --- |
| bootstrapper_confidence | first-class |
| quality_override | false |
| path_taken | standard |
| self_check_answers | null |
| team_size | solo |
| deployment_target | cloudflare-pages |
| ci_provider | github-actions |
| ci_default_flow | auto-deploy-on-merge |
| has_auth | true |
| has_payments | false |
| has_realtime | false |
| has_ai | true |
| has_background_jobs | false |

## Next steps

Next: a future skill will set up agent context (CLAUDE.md, AGENTS.md). For now, your project is scaffolded and verified - happy hacking.

Useful manual steps in the meantime:
- `git init` if you have not already, to start your own repo history.
- Review any `.scaffold` siblings the conflict policy created and decide which version of each file to keep.
- Address audit findings per your project's risk tolerance; the full breakdown is in this log.
