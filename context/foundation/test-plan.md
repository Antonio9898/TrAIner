# Test Plan

> Phased test rollout for this project. Strategy is frozen at the top
> (§1–§5); cookbook patterns at the bottom (§6) fill in as phases ship.
> Read before writing any new test.
>
> Refresh: re-run `/10x-test-plan --refresh` when stale (see §8).
>
> Last updated: 2026-09-12

## 1. Strategy

1. **Cost × signal.** Wybierz najtańszy test wykrywający rzeczywistą regresję; e2e i AI wymagają dodatkowego sygnału.
2. **User concerns are first-class evidence.** Obawy użytkownika mają wagę dokumentacji. Wywiad: Q1 pominięte; Q2 „narzedzie AI utknelo bez komunikatu”; Q3 „generowanie i poprawki planu”; Q4 pominięte z braku testów; Q5: §7.
3. **Risks are scenarios, not code locations.** This plan documents *what
   could fail* and *why we believe it's likely* — drawn from documents,
   interview, and codebase *signal* (churn, structure, test base). It does
   NOT claim to know which line owns the failure. That knowledge is
   produced by `/10x-research` during each rollout phase. If the plan and
   research disagree about where the failure lives, research is the
   ground truth.

Zakres zaakceptowany: `src/`, `supabase/migrations/`; 13.08–12.09.2026: 12 commitów. Hot-spoty: `src/pages` — 5; `src/components/workouts`, `src/pages/dashboard`, `src/lib/services`, `src/components/plans` — po 4. Wykluczono dokumentację, fixtures, archiwum, pliki generowane i build.

## 2. Risk Map

High/Medium/Low: wpływ oznacza odpowiednio utratę dostępu/danych/prywatności, degradację z obejściem, kosmetykę; prawdopodobieństwo: incydent/częste zmiany, okazjonalne zmiany, stabilność.

| # | Risk (failure scenario) | Impact | Likelihood | Source (evidence — not anchor) |
|---|---|---|---|---|
| 1 | Generowanie/poprawka zawiesza się bez komunikatu. | High | High | Wywiad Q2/Q3 |
| 2 | Poprawka nadpisuje nowszy plan lub zapisuje częściowe zmiany. | High | High | Wywiad Q3; archiwalny S-03: Desired End State |
| 3 | Plan ignoruje ograniczenia zdrowotne lub sugeruje diagnozę. | High | High | PRD guardrails, FR-004/005/008; wywiad Q3 |
| 4 | Użytkownik odczytuje/zmienia cudze dane. | High | Medium | PRD Access Control |
| 5 | Błędny wynik AI zostaje zapisany/pokazany jako poprawny plan. | High | Medium | PRD US-01; archiwalny S-03: Desired End State |
| 6 | Feedback ginie lub wskazuje niewłaściwy trening po rewizji. | High | Medium | Roadmapa S-04; archiwalny S-03: zachowanie feedbacku |

### Risk Response Guidance

| Risk | What would prove protection | Must challenge | Context `/10x-research` must ground | Likely cheapest layer | Anti-pattern to avoid |
|---|---|---|---|---|---|
| #1 | Oczekiwanie kończy czytelny błąd; można kontynuować. | Timeout serwera odblokowuje UI. | Limity, propagacja błędu, późny wynik | Integracja + interakcja | Happy-path-only |
| #2 | Brak częściowych zapisów/nadpisania nowszego stanu. | Sukces gwarantuje kolejność. | Transakcje, snapshot, akceptacja, ponowienia | Integracja bazy | Mockowanie transakcji |
| #3 | Kontekst zachowany; treść respektuje ograniczenia. | Poprawny format gwarantuje sens. | Kontrakt zaleceń, kontekst, niezależna rubryka | Kontrakt + ocena AI | Dokładne brzmienie jako oracle |
| #4 | Obcy/anonimowy dostęp odrzucony bez zmian/ujawnienia. | Login wystarcza. | Sesja, własność, API, uprawnienia bazy | Integracja bazy/API | Wyłącznie właściciel |
| #5 | Błędny wynik nie daje sukcesu/nie niszczy stanu. | HTTP 200 wystarcza. | Walidacja, zapis, tłumaczenie błędów | Integracja; kontrolowany dostawca | Oczekiwania kopiowane z implementacji |
| #6 | Feedback zachowuje poprawne powiązanie. | Ten sam plan oznacza ten sam trening. | Tożsamość treningu, ponowienia, rewizja | Integracja bazy | Sama liczba rekordów |

Challenger: research zweryfikuje istnienie timeoutu/ponowienia; brakujące zabezpieczenia zgłosi jako lukę produktu. Ocena AI nie dowodzi medycznego bezpieczeństwa.

## 3. Phased Rollout

| # | Phase name | Goal (one line) | Risks covered | Test types | Status | Change folder |
|---|---|---|---|---|---|---|
| 1 | Generowanie i obsługa błędów | Uruchomić runner; wykrywać zawieszenie i pozorny sukces. | #1, #5 | integration + interaction | change opened | context/changes/testing-generation-error-handling/ |
| 2 | Prywatność i trwałość danych | Udowodnić izolację, atomowość i zachowanie feedbacku. | #2, #4, #6 | database/API integration | not started | — |
| 3 | Znaczenie odpowiedzi AI | Sprawdzać ograniczenia na syntetycznych przypadkach. | #3 | contract + AI evaluation | not started | — |
| 4 | Przepływ użytkownika i CI | Chronić przepływ; egzekwować wdrożone testy. | #1–#6 | e2e + gates | not started | — |

Kolejność: incydent → trwałość/prywatność → semantyka → egzekwowanie. Każdy etap uzupełnia §6.

## 4. Stack

Profil **none**: zero konfiguracji/plików testowych. Manifest: Astro ^7.3.2, React ^19.2.6, Supabase; instrukcje opisują starsze Astro 6. Dokładne wersje runnerów dobierze research.

| Layer | Tool | Version | Notes |
|---|---|---|---|
| Integracja/interakcja | Brak; kandydat Vitest | nieustalona | Etap 1; checked: 2026-09-12 |
| Baza | Brak; kandydat pgTAP | nieustalona | Etap 2; checked: 2026-09-12 |
| AI | Ocena według rubryki | model nieustalony | Etap 3; nie używać do formatu/brzmienia; checked: 2026-09-12 |
| E2E | Brak; kandydat Playwright | nieustalona | Etap 4; checked: 2026-09-12 |

**Stack grounding tools (current session)** — checked: 2026-09-12:
- Docs: Context7 niedostępny.
- Search: web; [Astro testing](https://docs.astro.build/en/guides/testing/), [Supabase testing](https://supabase.com/docs/guides/local-development/testing/overview). Exa niedostępna.
- Runtime/browser: CUA dostępne, nieużyte; Playwright MCP niedostępny.
- Provider/platform: brak konektorów tego repo do GitHub/Cloudflare/Supabase.

## 5. Quality Gates

| Gate | Where | Required? | Catches |
|---|---|---|---|
| Sync/lint/build | istniejące CI | required | Błędy statyczne/builda |
| Typecheck | CI, etap 4 | required after §3 Phase 4 | Błędy typów |
| Integracja/interakcja/baza/kontrakty | lokalnie etapy 1–3; CI etap 4 | required after §3 Phase 4 | #1–#6 deterministycznie |
| Krytyczne e2e | CI, etap 4 | required after §3 Phase 4 | Sesja → plan → feedback |
| Ocena AI | lokalnie, etap 3 | selektywna | Sprzeczności znaczenia |

## 6. Cookbook Patterns

Każdy wpis po wdrożeniu poda lokalizację, nazewnictwo, test referencyjny, komendę uruchomienia i granice mockowania. Oczekiwania pochodzą z wymagań/kontraktu, nie z kodu pod testem.

### 6.1 Brak odpowiedzi i błędny wynik AI

TBD — see §3 Phase 1: ograniczone oczekiwanie, komunikat błędu, możliwość dalszego działania, brak pozornego sukcesu i nieuprawnionego zapisu. Mockuj granicę dostawcy, nie wewnętrzną logikę aplikacji.

### 6.2 Prywatność, atomowość i feedback

TBD — see §3 Phase 2: rzeczywiste role bazy, dwaj użytkownicy i anonim, konflikt rewizji/akceptacji, rollback i zachowanie tożsamości feedbacku.

### 6.3 Nowy endpoint API

TBD — see §3 Phases 1–2: walidacja niezaufanego wejścia, brak sesji/obcy właściciel, odpowiedź oraz skutki w bazie. Preferuj integrację; e2e tylko dla dodatkowego sygnału.

### 6.4 Znaczenie wygenerowanego planu

TBD — see §3 Phase 3: syntetyczne przypadki i niezależna rubryka ograniczeń/no-diagnosis, test przekazania kontekstu, selektywna ocena treści. Nie używaj oceny AI do deterministycznej walidacji ani różnic stylistycznych. Ustal koszt, powtarzalność i sposób rozstrzygania wyników.

### 6.5 Krytyczny przepływ przeglądarkowy

TBD — see §3 Phase 4: login, generowanie, poprawka, akceptacja, feedback oraz widoczny błąd/koniec oczekiwania. Uzupełnij faktyczne komendy i kroki CI; nie duplikuj macierzy integracyjnej.

## 7. What We Deliberately Don't Test

- **Gotowe komponenty UI** — bez testowania ich wewnętrznej implementacji; wywiad Q5. Integracja komponentów w krytycznym przepływie pozostaje w zakresie. Wróć do decyzji po istotnej lokalnej modyfikacji komponentu.
- **Drobne różnice sformułowań AI** — bez porównywania dokładnego tekstu, gdy znaczenie pozostaje takie samo; wywiad Q5. Pominięte ograniczenie lub zmieniony sens zaleceń nadal podlega #3.

## 8. Freshness Ledger

- Strategy (§1–§5) last reviewed: 2026-09-12; brief zaakceptowany przez użytkownika.
- Stack versions last verified: 2026-09-12; zakresy z manifestu, bez przypisywania wersji niezainstalowanym runnerom.
- AI-native tool references last verified: 2026-09-12; konkretnego modelu/narzędzia jeszcze nie wybrano.
- Źródła lokalne: `context/foundation/prd.md`, `context/foundation/roadmap.md`, `context/foundation/tech-stack.md`, `context/archive/2026-08-12-plan-revision-and-acceptance/plan.md`, `AGENTS.md`, `CLAUDE.md`, `package.json`, `.github/workflows/ci.yml`; wywiad i potwierdzony skan historii z 2026-09-12.
- `tech-stack.md` wskazuje historycznie Pages, instrukcje repo Workers; research zweryfikuje aktualny runtime przed konfiguracją testów.
- Uruchom `/10x-test-plan --refresh`, gdy pojawi się nowe ryzyko top-3, wpis `checked:` przekroczy trzy miesiące, zmieni się stack lub założenia §7.
- Orkiestrator aktualizuje §3 i datę nagłówka na podstawie artefaktów. Strategia pozostaje zamrożona poza refresh lub zaakceptowaną korektą §2 z research; archiwum pozostaje niezmienne.
