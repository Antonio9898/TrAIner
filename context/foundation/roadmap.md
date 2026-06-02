---
project: TrAIner
version: 1
status: draft
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
| F-01 | minimal-planning-data-contract | (foundation) minimalny prywatny kontrakt danych dla celu, ankiety, planu i feedbacku jest gotowy do uzycia przez pionowe slice'y | - | Access Control, Business Logic, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007 | ready |
| F-02 | training-safety-boundaries | (foundation) granice rekomendacji treningowych sa opisane tak, zeby planowanie nie diagnozowalo kontuzji i nie zastepowalo specjalisty | - | Non-Functional Requirements, Non-Goals, FR-003, FR-004, FR-005, FR-008 | ready |
| S-01 | goal-and-constraints-intake | user can log in, enter a training goal, training level, and health constraints | F-01, F-02 | US-01, FR-001, FR-002, FR-003 | proposed |
| S-02 | first-explained-training-plan | user can receive the first explained training plan matched to goal, level, and constraints | F-01, F-02, S-01 | US-01, FR-004, FR-008 | proposed |
| S-03 | plan-revision-and-acceptance | user can request corrections and accept the final training plan | F-02, S-02 | US-01, FR-005, FR-006, FR-008 | proposed |
| S-04 | post-workout-feedback | user can submit simple post-workout feedback so the app can track progress | F-01, S-03 | US-01, FR-007 | proposed |

## Streams

Navigation aid - groups items that share a Prerequisites chain. Canonical ordering still lives in the dependency graph below; this table is the proposed reading order across parallel tracks.

| Stream | Theme | Chain | Note |
|---|---|---|---|
| A | Private planning flow | `F-01` -> `S-01` -> `S-02` -> `S-03` -> `S-04` | Keeps the speed goal focused on the shortest user-visible path from intake to plan to feedback. |
| B | Safety boundaries | `F-02` | Runs alongside the first foundation and joins Stream A before intake, because every planning step must respect the same recommendation boundaries. |

## Baseline

What's already in place in the codebase (auto-researched). Foundations below assume these are present and do NOT re-scaffold them.

- **Frontend:** present - server-rendered app shell, routed pages, and interactive auth forms are present (`astro.config.mjs`, `src/pages/index.astro`, `src/components/auth/SignInForm.tsx`).
- **Backend / API:** partial - auth endpoints exist, but there is no training intake, planning, revision, or feedback API yet (`src/pages/api/auth/signin.ts`, `src/pages/api/auth/signup.ts`).
- **Data:** partial - data tooling and a starter/example database change exist, but no private training goal, intake, plan, revision, or feedback contract exists yet (`supabase/`).
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
- **Status:** ready

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
- **Status:** ready

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
- **Status:** proposed

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
- **Status:** proposed

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
- **Status:** proposed

### S-04: Post-workout feedback

- **Outcome:** user can submit simple post-workout feedback so the app can track progress.
- **Change ID:** post-workout-feedback
- **PRD refs:** US-01, FR-007
- **Prerequisites:** F-01, S-03
- **Parallel with:** -
- **Blockers:** -
- **Unknowns:** -
- **Risk:** Feedback jest czescia pelnego MVP, ale powinien wejsc dopiero po zaakceptowanym planie, bo inaczej produkt zbiera sygnaly bez jasnego planu odniesienia.
- **Status:** proposed

## Backlog Handoff

| Roadmap ID | Change ID | Suggested issue title | Ready for `/10x-plan` | Notes |
|---|---|---|---|---|
| F-01 | minimal-planning-data-contract | Define the minimal private planning data contract | yes | Recommended next move; unlocks the full north-star path. |
| F-02 | training-safety-boundaries | Define training safety and no-diagnosis boundaries | yes | Boundary source: `context/foundation/training-safety-boundaries.md`; needed before intake and plan generation. |
| S-01 | goal-and-constraints-intake | Build goal and constraints intake | no | Wait for F-01 and F-02; consume the safety boundary for intake wording and disclaimer guidance. |
| S-02 | first-explained-training-plan | Build the first explained training plan | no | North-star slice; wait for F-01, F-02, and S-01; consume the safety boundary for plan `safetyNotes`. |
| S-03 | plan-revision-and-acceptance | Build plan revision and acceptance | no | Wait for S-02 and keep F-02 boundaries in force through reminder-only revision copy. |
| S-04 | post-workout-feedback | Build post-workout feedback | no | Wait for accepted plan flow from S-03. |

## Open Roadmap Questions

Brak otwartych pytan roadmapowych. PRD wskazuje: "Brak otwartych pytan."

## Parked

- **Injury diagnosis or replacing medical/professional advice** - Why parked: PRD Non-Goals says the app does not diagnose injuries and does not replace a doctor, physiotherapist, or medical trainer.
- **Trainer, admin, or shared-plan roles** - Why parked: PRD Access Control limits MVP to one flat authenticated-user role and explicitly excludes trainer roles, admin panel, and shared plans.

## Done
