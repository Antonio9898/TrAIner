# Implementation Review Follow-ups

## F1 — Credential exposure containment

- [x] Remove `.env.local` and `dist/server/.dev.vars` from Git tracking without deleting the local files.
- [x] Revoke and rotate the exposed OpenRouter API key — user-confirmed after triage.
- [x] Configure the replacement `OPENROUTER_API_KEY` secret in Cloudflare — user-confirmed after triage.
- [ ] Review provider access logs for unexpected use.
- [x] Confirm the committed Supabase value has publishable-key format; no privileged Supabase credential was identified in the reviewed files.
- [x] Purge both credential-bearing paths from rewritten Git history and force-update `origin/main` with an explicit lease.

## F3 — Revision-summary plan drift

- [x] Add a dated implementation addendum accepting the persisted revision summary and documenting its schema, RPC, provider, UI, scope, and rollback effects.
- [x] Reconcile Migration Notes while preserving immutable Progress step titles.

## F5 — Review-scope reconciliation

- [x] Record the exact S-03 feature commit set in `change.md`.
- [x] Identify unrelated interval commits and configuration as independently owned work.
- [ ] Open separate changes for any excluded work that the project intends to retain and evolve.

## F6 — Generated repository state

- [x] Ignore `.astro/`, `dist/`, and `.wrangler/`.
- [x] Remove their existing files from Git tracking without deleting local copies.
- [x] Re-run the production build and confirm generated directories produce no new status entries.
