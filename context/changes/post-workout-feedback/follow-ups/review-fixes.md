# Implementation Review Follow-ups

## F1 — Training-plan lifecycle boundary

- [x] Audit application callers: generation directly inserts a draft; revision and acceptance use the existing lifecycle RPCs. No application caller directly updates training plans.
- [x] Add a new migration revoking direct authenticated UPDATE and removing the owner UPDATE policy.
- [x] Preserve lifecycle writes through the existing functions with SECURITY DEFINER, explicit auth.uid() ownership predicates, empty search_path, and authenticated-only execution grants.
- [x] Restrict owner INSERT to draft, null accepted_at, zero revision_count, and null revision timestamp/note/summary.
- [x] Verify migration and lifecycle behavior against local PostgreSQL in a rolled-back transaction.
- [x] Run npm run lint and git diff --check.

Verification on 2026-09-12: all assertions passed for valid draft insertion; rejection of forged acceptance and each revision-history field; direct UPDATE denial (including table/column privilege inspection); owner acceptance, revision with linked-intake update, and re-acceptance; rejection of stale timestamps; foreign-owner and missing-identity denial; accepted-plan feedback, draft feedback denial, and preserved feedback history. Function execution grants, SECURITY DEFINER, and empty search_path were checked explicitly. Lint passed with existing non-failing parser notices.

The migration and disposable fixtures were rolled back after verification. No existing data was reset or changed, and no production deployment was performed. AI plan generation was not invoked; its existing database INSERT shape was exercised directly. No frontend or application code changed.

## F2 — Feedback form resilience

- [x] Render the form using client:load with stable server/client initial HTML.
- [x] Provide required manual date and time-zone fields with native suggestions, validation, and an enabled initial submit button.
- [x] Extract browser date/zone enhancement into src/components/hooks/useWorkoutFeedbackDate.ts; preserve pre-hydration input and recalculate bounds when the zone changes.
- [x] Preserve ratings and notes entered before hydration by keeping native fields uncontrolled and validating actual FormData.
- [x] Verify native POST with JavaScript disabled and with the script bundle blocked.
- [x] Verify hydration without errors in America/Los_Angeles (UTC−7) and Pacific/Kiritimati (UTC+14), acceptance-day boundaries, invalid-zone correction, and stable submission tokens.
- [x] Verify pre-hydration date, time zone, difficulty, and notes survive through submission.
- [x] Inspect the isolated form at 375px width and confirm no horizontal overflow.
- [x] Run npm run lint, npm run build, and git diff --check.

Verification on 2026-09-12 used the real React component and hook rendered to HTML in an isolated local fixture, hydrated with React, and submitted by Chrome to a local POST capture endpoint. A timing check first exposed loss of a pre-hydration note; the uncontrolled-field correction passed the repeated scenario. Date values remained unchanged when switching zones, while allowed bounds followed the selected zone. Native required validation blocked empty submissions. The mobile screenshot was visually inspected.

This verification did not create real feedback through the authenticated application API or invoke AI. The API validation and database date/time-zone contract are unchanged. Build and lint passed with existing non-failing CSS/sitemap/parser notices. No production deployment was performed.
