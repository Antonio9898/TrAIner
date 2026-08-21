# Implementation Review Follow-ups

## F1 — Credential exposure containment

- [x] Remove `.env.local` and `dist/server/.dev.vars` from Git tracking without deleting the local files.
- [ ] Revoke and rotate the exposed OpenRouter API key.
- **Decision**: Deferred during implementation-review triage; credential risk remains active.
- [ ] Review provider access logs for unexpected use.
- [ ] Confirm whether any committed Supabase value is privileged; rotate it if so.
- [ ] Decide whether to purge the credential-bearing commits from shared Git history and coordinate the required force-push with all repository users.

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
