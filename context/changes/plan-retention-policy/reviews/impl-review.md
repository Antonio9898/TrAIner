<!-- IMPL-REVIEW-REPORT -->

# Implementation Review: Polityka retencji planów

- **Plan**: context/changes/plan-retention-policy/plan.md
- **Scope**: Phases 1–3 of 3; Progress 15/15 complete
- **Date**: 2026-09-14
- **Verdict**: APPROVED
- **Findings**: 0 critical, 0 warnings, 1 observation

## Verdicts

| Dimension           | Verdict |
| ------------------- | ------- |
| Plan Adherence      | PASS    |
| Scope Discipline    | PASS    |
| Safety & Quality    | PASS    |
| Architecture        | PASS    |
| Pattern Consistency | PASS    |
| Success Criteria    | PASS    |

## Findings

### F1 — Test zachowania historii pomija drugą migrację

- **Severity**: ℹ️ OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Success Criteria
- **Location**: tests/integration/plan-retention/replacement.spec.ts:21
- **Detail**: Testing Strategy punkt 11 obejmuje zachowanie historii podczas instalacji obu migracji retencji. Test wykonuje tylko `20260914150000_enforce_plan_retention.sql`. Druga migracja (`20260914170000_retire_plans_on_intake_save.sql`) zawiera definicję funkcji i uprawnienia, bez wywołania czyszczenia podczas instalacji, co potwierdzono przeglądem. To luka w ochronie regresyjnej, nie stwierdzony błąd działania ani niezrealizowane kryterium funkcjonalne.
- **Fix**: W tej samej transakcji testowej wykonać również drugą migrację i ponownie porównać snapshot historii przed rollbackiem.
- **Decision**: FIXED — 2026-09-14, zgodnie z poleceniem użytkownika. Test wykonuje obie migracje w kolejności i porównuje historię po każdej z nich; transakcja jest wycofywana w finally.

## Scope and evidence

Review dotyczy commitów `4bde972`, `c7b7181`, `e6b90df`, `d834fad` (diff `4bde972^..d834fad`). Początkowy worktree był czysty. Zakres ustalono z commitów nazwanych zmianą, ponieważ plan nie ma daty w nazwie pliku. Sprawdzono 33 zmienione pliki; dodatkowe dokumenty framingu, briefu i wykonania są uzasadnionymi artefaktami workflow. Wszystkie planowane pliki implementacji istnieją. Brak `context/foundation/lessons.md`.

Uwzględniono zatwierdzoną zmianę zakresu: retencja przy zapisie ankiety, modal i dodatkowe zastępowanie historii podczas generowania. Historyczna faza 2 oraz niezmienny tytuł Progress 3.5 są wyjaśnione w planie, więc nie stanowią driftu. Dwa niezależne przeglądy zgodności i bezpieczeństwa nie znalazły istotnych odstępstw ani błędów bezpieczeństwa.

Potwierdzono atomowy zapis ankiety z DELETE planów i kaskadą feedbacku, izolację właściciela i uprawnienia RPC, wspólną kolejność blokad, dokładny token aktualności, odrzucanie starych żądań, idempotencję oraz zachowanie niepewnego wyniku. Mechanizmy sterowania testami pozostają w launcherze testowym. Brak zmian w archiwum i zdalnego deploymentu.

## Verification

| Command / evidence                          | Result                                                                        |
| ------------------------------------------- | ----------------------------------------------------------------------------- |
| `npm run lint`                              | PASS; istniejące komunikaty astro-eslint-parser o projectService              |
| `npm run typecheck`                         | PASS; 69 plików, 0 errors, 0 warnings, 4 istniejące hints konfiguracji ESLint |
| `npm run build`                             | PASS; istniejące ostrzeżenie sitemap o brakującym site                        |
| `npm run test:retention`                    | PASS; 35 passed (28.1s), 1 worker, zero retry                                 |
| Harness, replacement, concurrency, recovery | Wszystkie zestawy wymagane przez fazy 1–3 wykonane w pełnym przebiegu powyżej |
| `npm run test:e2e:plan`                     | PASS; 1 passed (7.9s)                                                         |
| `npx supabase migration up --local`         | PASS; Local database is up to date; bez nowych migracji do wykonania          |
| `git diff --check`                          | PASS przed zapisem raportu                                                    |

E2E początkowo nie uruchomił Chromium z powodu blokady sandboxa macOS (`MachPortRendezvous`, permission denied); ponowienie poza sandboxem przeszło. Nie był to błąd asercji aplikacji. Do uruchomień skierowano logi runtime i rejestr Miniflare do `/private/tmp`.

Dowody historycznego RED→GREEN znajdują się w `implementation-notes.md`: pozostawione stare plany, brak generationState i brak DELETE przy zapisie ankiety były obserwowanymi przyczynami RED. Review nie odtwarza historycznych wersji ani nie zmienia Progress.

Kryteria manualne 1.3 i 2.5 mają potwierdzenie w notatkach i odpowiadają odczytanemu kodowi. Dla 3.5–3.7 istnieje datowana akceptacja użytkownika (2026-09-14), opis inspekcji modala i anulowania oraz wsparcie w testach API/SQL. W tym review nie powtarzano wizualnego sprawdzenia modala na telefonie i desktopie; istniejący E2E nie obejmuje modala. Brak nieodhaczonych kryteriów manualnych.

## Triage

F1 naprawione. Rozszerzono wyłącznie test zachowania historii; kod aplikacji pozostaje bez zmian.

Weryfikacja poprawki: `npm run test:retention -- replacement.spec.ts --grep 'applying both retention migrations'` — 1 passed (6.9s). Automatyczne kontrole lint i typecheck również przeszły.
