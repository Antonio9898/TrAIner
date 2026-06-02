# Training Safety Boundaries - Plan Brief

> Full plan: `context/changes/training-safety-boundaries/plan.md`

## What & Why

Define TrAIner's doc-only safety boundary for training recommendations. The boundary prevents future intake, plan generation, explanation, and revision work from drifting into injury diagnosis, medical advice, or ignoring user-provided health constraints.

## Starting Point

The PRD already says the app must not diagnose injuries or replace a doctor, physiotherapist, or medical trainer. F-01 is implemented and provides `healthConstraints` plus plan/workout `safetyNotes`, but there is no durable foundation document that tells downstream slices how to use those fields safely.

## Desired End State

The repository has `context/foundation/training-safety-boundaries.md` as the reusable safety contract. The roadmap points `S-01`, `S-02`, and `S-03` to that document, and the implementation remains documentation-only: no code, no migration, no acknowledgement storage, and no runtime blocker.

## Key Decisions Made

| Decision    | Choice                           | Why                                                                  |
| ----------- | -------------------------------- | -------------------------------------------------------------------- |
| Scope       | Doc-only boundary                | Keep F-02 as a foundation contract, not implementation.              |
| Escalation  | Informational warning only       | Warn users without blocking plan generation in the MVP.              |
| Persistence | No acknowledgement               | Avoid premature schema and audit scope.                              |
| AI output   | Safety notes only                | Use existing `safetyNotes` shape rather than adding risk assessment. |
| Intake copy | Free text with neutral examples  | Collect useful constraints without a medical checklist.              |
| Revisions   | Only remind user                 | Keep revision safety lightweight and doc-only.                       |
| Testing     | Doc review plus reference checks | Verify downstream usability without brittle scripts.                 |
| Handoff     | Foundation doc plus roadmap      | Make the boundary visible where future slice planning starts.        |

## Scope

**In scope:**

- New `context/foundation/training-safety-boundaries.md`.
- Roadmap update pointing F-02 and downstream slices to the foundation document.
- Manual reference walkthrough for `S-01`, `S-02`, and `S-03`.

**Out of scope:**

- TypeScript constants, runtime safety gates, prompt helpers, UI, API routes, migrations, and acknowledgement storage.
- Red-flag blocking, structured risk scoring, injury taxonomy, diagnosis, or medical advice.
- PRD rewrite beyond the existing guardrails.

## Architecture / Approach

Use a living foundation document as the contract surface. Downstream slices consume it manually: `S-01` for intake copy/disclaimer, `S-02` for plan/workout `safetyNotes`, and `S-03` for reminder-only revision behavior.

## Phases at a Glance

| Phase                          | What it delivers                                      | Key risk                                                                  |
| ------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------- |
| 1. Foundation Safety Boundary  | The durable safety/no-diagnosis document.             | Copy may accidentally imply diagnosis or blocking despite doc-only scope. |
| 2. Roadmap Handoff             | Roadmap references to the boundary for future slices. | Future implementers may miss the document if the handoff is weak.         |
| 3. Contract Review and Handoff | Final reference checks and scope review.              | Doc-only implementation may still hide accidental code/schema scope.      |

**Prerequisites:** F-01 planning data contract is implemented.
**Estimated effort:** About 1 focused implementation session across 3 phases.

## Open Risks & Assumptions

- Informational warnings only are less protective than blocking severe cases; this is an accepted MVP tradeoff.
- Safety notes only may not prevent overconfident explanations unless future S-02 prompt/copy work honors the foundation document.
- No acknowledgement means there is no stored proof that the user saw the safety boundary.

## Success Criteria (Summary)

- Foundation safety document exists and captures the eight planning decisions.
- Roadmap points F-02/S-01/S-02/S-03 to the foundation document.
- Human review confirms the implementation stayed doc-only and avoided diagnosis, medical taxonomy, acknowledgement storage, and runtime blocking.
