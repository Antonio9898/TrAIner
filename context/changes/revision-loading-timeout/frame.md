# Frame Brief: Revision loading timeout

## Reported Observation

po probie revise plan, aplikacja laduje sie w nieskonczonosc

## Initial Framing (preserved)

- User's stated cause: none; observation-driven investigation.
- Proposed direction: investigate and resolve the reported loading issue.
- Pre-dispatch narrowing: “Po wysłaniu uwag do zmiany planu”.
- Environment clarification: “Lokalnej — localhost:4321”.

## Dimension Map and Hypothesis Investigation

| Dimension / hypothesis              | Evidence                                                                                                                                                                   | Verdict                                               |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Frontend submission loop            | `src/components/plans/PlanRevisionForm.tsx:56` permits native POST after validation. No ClientRouter in Layout. Dashboard listener targets other forms.                    | NONE for a loop                                       |
| Provider wait without deadline      | `src/lib/openrouter.ts:62` fetch and subsequent JSON read have no cancellation/deadline; `src/pages/api/training-plans/revise.ts:53` awaits completion before redirecting. | STRONG for a missing bound; runtime cause unconfirmed |
| Database lock or network wait       | `src/lib/services/training-plans.ts:465` invokes RPC after generation; SQL locks are brief and contain no AI request. Supabase requests have no application deadline.      | WEAK; no observed stalled database request            |
| Cancelled navigation leaves spinner | Submission state has no reset while remaining on the original document.                                                                                                    | Possible, unconfirmed                                 |

## Narrowing Signals

The user reports the symptom after submitting revision notes, locally. Inspection
of the local tab later found the original generated draft and an enabled form,
not a pending request. A separate production tab had `invalid-revision`; this
does not establish the local failure cause.

## Cross-System Check

The archived revision plan describes native POST and generation outside database
locks. The implementation follows that structure but does not bound provider
latency. Fetch cancellation must remain active through response body consumption;
see [MDN AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).

## Problem Statement and Confidence

The revision flow can wait indefinitely for the AI response without returning an
actionable timeout to the user. This is a confirmed resilience defect, not a proven
explanation of the original local request. Confidence: MEDIUM. Runtime inspection
of a recurrence is needed to distinguish provider, Supabase, and cancelled navigation.

## Handoff

Address bounded generation waiting and user-visible timeout handling. Preserve the
existing validation and persistence boundary. Do not claim the original incident
reproduced without observing it.

## References

- Read-only investigations: `revision_ui`, `revision_backend`.
- `src/lib/openrouter.ts`, `src/pages/api/training-plans/revise.ts`.
- `src/components/plans/PlanRevisionForm.tsx`, `src/lib/services/training-plans.ts`.

## Runtime confirmation and resolution

After the initial investigation, the user supplied the exact request: “napisz go
po polsku”, and explicitly authorized sending the current plan/intake to OpenRouter
and replacing the plan on success. A local browser submission reproduced the error:
OpenRouter returned `finish_reason: length` with `maxTokens: 3000`; the revision POST
finished after 33,644 ms and redirected to `invalid-revision`. This confirms output
truncation as the cause of the reproduced failure, rather than an infinite loop.
Confidence for the reproduced failure: HIGH.

The revision budget is now 8,000 tokens. Repeating the same authorized request
completed in 46,633 ms and redirected to `planAction=revised`. The dashboard displayed
revision count 1, translated Polish plan content, and the successful revision banner.
The shared provider helper also bounds fetch and body consumption to 90 seconds,
clears its timer, and maps timeouts to a dedicated dashboard message. Diagnostics
record only failure metadata, never prompts or generated plan content.

Verification: repository lint passed; Astro check reported 0 errors / 0 warnings
(4 existing deprecation hints); production build passed with existing sitemap and
sandbox log-path warnings. Lint passed again after increasing the revision budget.
An isolated in-memory fault check passed for stalled headers, stalled body, and
successful completion, including timer cleanup. No persistent test suite was added.

The build invalidated the running development dependency cache; the local server
was restarted and the successful browser check ran against that restarted server.
No production deployment was performed.
