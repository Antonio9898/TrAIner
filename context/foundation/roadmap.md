---
project: TrAIner
version: 2
status: active
updated: 2026-09-12
main_goal: speed
top_blocker: capacity
---

# Roadmap: TrAIner

> Derived from `context/foundation/prd.md` (v1) + auto-researched codebase baseline.
> Edit-in-place; archive when superseded.
> Slices below are listed in dependency order. The "At a glance" table is the index.

## Vision recap

TrAIner ma pomoc osobie trenujacej lub zaczynajacej trening silowy ulozyc plan pod konkretny cel bez udawania diagnozy medycznej. Wartosc produktu nie polega na samej liscie cwiczen, tylko na dopasowaniu planu do celu, poziomu zaawansowania, ograniczen zdrowotnych i prostego feedbacku po treningu.

## North star

**S-02: user can receive the first explained training plan** - W tym dokumencie north star oznacza najmniejszy przeplyw end-to-end, ktory pokazuje, ze produkt faktycznie dziala: zalogowany uzytkownik po podaniu celu i ograniczen dostaje wyjasniony plan dopasowany do swojego kontekstu.

## At a glance

| ID | Change ID | Outcome (user can ...) | Prerequisites | PRD refs | Status |
|---|---|---|---|---|---|
| F-01 | minimal-planning-data-contract | (foundation) minimalny prywatny kontrakt danych dla celu, ankiety, planu i feedbacku jest gotowy do uzycia przez pionowe slice'y | - | Access Control, Business Logic, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007 | implemented |
| F-02 | training-safety-boundaries | (foundation) granice rekomendacji treningowych sa opisane tak, zeby planowanie nie diagnozowalo kontuzji i nie zastepowalo specjalisty | - | Non-Functional Requirements, Non-Goals, FR-003, FR-004, FR-005, FR-008 | implemented |
| S-01 | goal-and-constraints-intake | user can log in, enter a training goal, training level, and health constraints | F-01, F-02 | US-01, FR-001, FR-002, FR-003 | implemented |
| S-02 | first-explained-training-plan | user can receive the first explained training plan matched to goal, level, and constraints | F-01, F-02, S-01 | US-01, FR-004, FR-008 | implemented |
| S-03 | plan-revision-and-acceptance | user can request corrections and accept the final training plan | F-02, S-02 | US-01, FR-005, FR-006, FR-008 | done |
| S-04 | post-workout-feedback | user can submit simple post-workout feedback so the app can track progress | F-01, S-03 | US-01, FR-007 | implemented |

## Streams

Navigation aid - groups items that share a Prerequisites chain. Canonical ordering still lives in the dependency graph below; this table is the proposed reading order across parallel tracks.

| Stream | Theme | Chain | Note |
|---|---|---|---|
| A | Private planning flow | `F-01` -> `S-01` -> `S-02` -> `S-03` -> `S-04` | Keeps the speed goal focused on the shortest user-visible path from intake to plan to feedback. |
| B | Safety boundaries | `F-02` | Runs alongside the first foundation and joins Stream A before intake, because every planning step must respect the same recommendation boundaries. |

## Baseline

What's already in place in the codebase (auto-researched). Foundations below assume these are present and do NOT re-scaffold them.

- **Frontend:** present - server-rendered app shell, auth forms, goal-and-constraints intake, and first-plan generation and display are present (`src/pages/dashboard.astro`, `src/pages/dashboard/intake.astro`).
- **Backend / API:** present for the planned MVP - auth, training intake, first-plan generation, revision, acceptance, and workout feedback endpoints exist (`src/pages/api/training-intakes.ts`, `src/pages/api/training-plans/generate.ts`).
- **Data:** present for the planned MVP - private training intake, plan revision/acceptance fields, and workout feedback tables exist with RLS (`supabase/migrations/20260602233915_create_planning_contract.sql`).
- **Auth:** present - cookie-based session client, protected-route middleware, auth pages, and sign-in/sign-up/sign-out routes are present (`src/lib/supabase.ts`, `src/middleware.ts`, `src/pages/auth/signin.astro`).
- **Deploy / infra:** present - production build target, deploy config, and CI build checks are present (`astro.config.mjs`, `wrangler.jsonc`, `.github/workflows/ci.yml`).
- **Observability:** partial - platform-level observability is enabled, but product-flow logging or error telemetry for planning is not yet defined (`wrangler.jsonc`).

## Foundations

### F-01: Minimal planning data contract

- **Outcome:** (foundation) Minimalny prywatny kontrakt danych dla celu, ankiety, planu, rewizji i feedbacku jest wystarczajaco okreslony, zeby kolejne slice'y mogly go zuzywac bez rozbudowy calej warstwy danych z gory.
- **Change ID:** minimal-planning-data-contract
- **PRD refs:** Access Control, Business Logic, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007
- **Unlocks:** S-01, S-02, S-03, S-04
- **Prerequisites:** -
- **Parallel with:** F-02
- **Blockers:** -
- **Unknowns:** -
- **Risk:** Jesli kontrakt bedzie zbyt szeroki, roadmapa zmieni sie w pozioma przebudowe danych; jesli bedzie zbyt waski, pierwszy plan i feedback nie beda mialy gdzie zapisac prywatnego kontekstu uzytkownika.
- **Status:** implemented

### F-02: Training safety boundaries

- **Outcome:** (foundation) Granice rekomendacji treningowych sa ustalone tak, zeby pytania o ograniczenia zdrowotne, wyjasnienia planu i poprawki nie brzmialy jak diagnoza ani nie ignorowaly zgloszonych ograniczen.
- **Change ID:** training-safety-boundaries
- **Foundation source:** `context/foundation/training-safety-boundaries.md`
- **PRD refs:** Non-Functional Requirements, Non-Goals, FR-003, FR-004, FR-005, FR-008
- **Unlocks:** S-01, S-02, S-03
- **Prerequisites:** -
- **Parallel with:** F-01
- **Blockers:** -
- **Unknowns:** -
- **Risk:** Bez tych granic najwczesniejszy plan moze byc szybki, ale niezgodny z guardrailami PRD; zbyt szerokie granice moga z kolei zablokowac prosty MVP.
- **Status:** implemented

## Slices

### S-01: Goal and constraints intake

- **Outcome:** user can log in, enter a training goal, training level, and health constraints.
- **Change ID:** goal-and-constraints-intake
- **Safety handoff:** consumes `context/foundation/training-safety-boundaries.md` for the free-text `healthConstraints` prompt, neutral examples, and visible disclaimer guidance.
- **PRD refs:** US-01, FR-001, FR-002, FR-003
- **Prerequisites:** F-01, F-02
- **Parallel with:** -
- **Blockers:** -
- **Unknowns:** -
- **Risk:** Ten slice musi zebrac minimum kontekstu potrzebnego do pierwszego planu, ale nie moze sugerowac diagnozy kontuzji ani nadmiernie wydluzac wejscia do produktu.
- **Status:** implemented

### S-02: First explained training plan

- **Outcome:** user can receive the first explained training plan matched to goal, level, and constraints.
- **Change ID:** first-explained-training-plan
- **Safety handoff:** consumes `context/foundation/training-safety-boundaries.md` for constraint-aware plan-level and workout-level `safetyNotes` without structured risk scoring.
- **PRD refs:** US-01, FR-004, FR-008
- **Prerequisites:** F-01, F-02, S-01
- **Parallel with:** -
- **Blockers:** -
- **Unknowns:** -
- **Risk:** To jest najwczesniejszy sprawdzian produktu: jesli plan nie odnosi sie do celu, poziomu i ograniczen z intake'u, pozniejsze poprawki i feedback nie maja sensu.
- **Status:** implemented

### S-03: Plan revision and acceptance

- **Outcome:** user can request corrections and accept the final training plan.
- **Change ID:** plan-revision-and-acceptance
- **Safety handoff:** consumes `context/foundation/training-safety-boundaries.md` for the reminder-only revision boundary that keeps earlier health constraints in force.
- **PRD refs:** US-01, FR-005, FR-006, FR-008
- **Prerequisites:** F-02, S-02
- **Parallel with:** -
- **Blockers:** -
- **Unknowns:** -
- **Risk:** Poprawki musza zachowac te same ograniczenia bezpieczenstwa co pierwszy plan; inaczej uzytkownik moze obejsc guardraile w rozmowie o zmianach.
- **Status:** done

### S-04: Post-workout feedback

- **Outcome:** user can submit simple post-workout feedback so the app can track progress.
- **Change ID:** post-workout-feedback
- **PRD refs:** US-01, FR-007
- **Prerequisites:** F-01, S-03
- **Parallel with:** -
- **Blockers:** -
- **Unknowns:** -
- **Risk:** Feedback jest czescia pelnego MVP, ale powinien wejsc dopiero po zaakceptowanym planie, bo inaczej produkt zbiera sygnaly bez jasnego planu odniesienia.
- **Status:** implemented

## Backlog Handoff

| Roadmap ID | Change ID | Suggested issue title | Ready for `/10x-plan` | Notes |
|---|---|---|---|---|
| F-01 | minimal-planning-data-contract | Define the minimal private planning data contract | no | Implemented; data contract is available to the remaining slices. |
| F-02 | training-safety-boundaries | Define training safety and no-diagnosis boundaries | no | Implemented; keep these boundaries in force for revisions. |
| S-01 | goal-and-constraints-intake | Build goal and constraints intake | no | Implemented; authenticated users can save and edit intake before plan generation. |
| S-02 | first-explained-training-plan | Build the first explained training plan | no | Implemented; the north-star flow is present. |
| S-03 | plan-revision-and-acceptance | Build plan revision and acceptance | no | Implemented and archived; accepted-plan flow is available to S-04. |
| S-04 | post-workout-feedback | Build post-workout feedback | no | Implemented and review approved; verification and resolved findings are recorded in the change folder. |

## Open Roadmap Questions

Brak otwartych pytan roadmapowych. PRD wskazuje: "Brak otwartych pytan."

## Parked

- **Injury diagnosis or replacing medical/professional advice** - Why parked: PRD Non-Goals says the app does not diagnose injuries and does not replace a doctor, physiotherapist, or medical trainer.
- **Trainer, admin, or shared-plan roles** - Why parked: PRD Access Control limits MVP to one flat authenticated-user role and explicitly excludes trainer roles, admin panel, and shared plans.

## Done

- **F-01: Minimal planning data contract** - implemented 2026-06-03 (`context/changes/minimal-planning-data-contract/change.md`).
- **F-02: Training safety boundaries** - implemented 2026-06-03 (`context/changes/training-safety-boundaries/change.md`).
- **S-01: Goal and constraints intake** - implemented 2026-06-03 (`context/changes/goal-and-constraints-intake/change.md`).
- **S-02: First explained training plan** - implemented 2026-06-18 (`context/changes/first-explained-training-plan/change.md`).
- **S-03: user can request corrections and accept the final training plan.** — Archived 2026-08-21 → `context/archive/2026-08-12-plan-revision-and-acceptance/`. Lesson: —.

- **S-04: Post-workout feedback** - implemented and review approved; both review findings resolved 2026-09-12 (`context/changes/post-workout-feedback/reviews/impl-review.md`, `context/changes/post-workout-feedback/follow-ups/review-fixes.md`). Production deployment of the lifecycle-boundary migration is not recorded as complete.
