# Polityka retencji planów — Implementation Plan

## Overview

Po pomyślnym utworzeniu nowego planu dla użytkownika poprzednie plany tego użytkownika i ich feedback mają fizycznie zniknąć z bazy.

Zastąpienie następuje przy zapisie szkicu, bez oczekiwania na akceptację. Nieudane generowanie lub wycofana transakcja pozostawiają dotychczasowe dane. Realizacja: przygotowanie infrastruktury testowej, następnie `/10x-tdd` w cyklu RED → GREEN → REFACTOR.

## Current State Analysis

**Reported Observation:** „przy dodawaniu nowego planu, poprzedni nie jest usuwany”. Użytkownik widzi rekordy w bazie, dotyczące różnych `intake_id`, i chce usunięcia również feedbacku.

Ustalenia z `frame.md`:

| Hipoteza                                                                   | Dowód                                                                                            | Werdykt                     |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------- |
| Starsze plany różnych ankiet pozostają zgodnie z dotychczasowym kontraktem | Jeden plan na ankietę; nowy zapis po powstaniu planu tworzy kolejną ankietę                      | STRONG                      |
| Generowanie tworzy duplikaty dla tej samej ankiety                         | Odczyt istniejącego planu i unikalność `(user_id, intake_id)`; zgłoszenie dotyczy różnych ankiet | NONE dla zgłoszonego objawu |

Nie zgłoszono błędnego wyboru planu w interfejsie. Nie sprawdzano żywej bazy; podstawą są migracje i kod repozytorium. Fizyczne usuwanie to zaakceptowana zmiana retencji, a nie naprawa potwierdzonego duplikowania.

### Key Discoveries

- Generowanie wykonuje samodzielny INSERT i rozwiązuje kolizję tej samej ankiety: `src/lib/services/training-plans.ts:396`, `:414`.
- Feedback ma FK z `ON DELETE CASCADE`: `supabase/migrations/20260602233915_create_planning_contract.sql:89`.
- Zapis ankiety osobno sprawdza edytowalność i wykonuje zapis: `src/lib/services/training-intakes.ts:133`. Musi uczestniczyć w synchronizacji z zastępowaniem planu.
- Dashboard wybiera najnowszą ankietę: `src/pages/dashboard.astro:27`. Kolejność to `created_at DESC, updated_at DESC`: `src/lib/services/training-intakes.ts:170`.
- Jawne `intakeId` umożliwia dziś ponowienia historycznej ankiety: `src/pages/api/training-plans/generate.ts:51`.
- Brak planu po sprawdzeniu odblokowuje ponowienie generowania: `src/components/hooks/usePlanOperation.ts:262`. Po usunięciu planu takie rozumowanie nie wystarcza.
- Projekt ma Playwright i lokalny mock HTTP dostawcy AI, ale nie ma osobnego zestawu testów bazy/API: `package.json`, `tests/e2e/training-plan-journey.spec.ts`, `tests/e2e/support/llm-server.ts`.
- Wzorzec zabezpieczonych RPC istnieje w `supabase/migrations/20260912120000_enforce_training_plan_lifecycle_boundary.sql`.

## Desired End State

- Nowy plan zapisuje się razem z usunięciem wszystkich innych planów właściciela i ich feedbacku w jednej transakcji.
- Po takim zapisie użytkownik ma jeden plan. Wcześniejsze rekordy istniejące przed wdrożeniem pozostają do następnego skutecznego utworzenia nowego planu.
- Zapis nowszej ankiety B blokuje wynik generowania A, również gdy B nie ma jeszcze planu lub jego generowanie się nie udało.
- Ponowienie ze starej karty nie odtwarza A. Użytkownik dostaje komunikat i odnośnik do aktualnego panelu.
- Ponowienie dla aktualnej ankiety z istniejącym planem zwraca ten sam plan, bez nadpisania, usuwania feedbacku ani porządkowania historycznych danych.
- Stała informacja przy przycisku generowania uprzedza o fizycznym usuwaniu poprzednich planów i feedbacku.
- Potwierdzony brak zapisu i niepewny wynik po utracie odpowiedzi pozostają odrębnymi stanami.

## What We're NOT Doing

- Usuwanie starszych ankiet, jednorazowe czyszczenie produkcji lub czyszczenie przy samej migracji.
- Historia wersji, kosz, przywracanie usuniętych planów lub feedbacku.
- Przywracanie dawnych założeń ze starej karty; wymaga nowej ankiety.
- Oczekiwanie na akceptację planu przed usunięciem poprzednich danych.
- Nowy modal potwierdzenia, zmiana promptów AI, przebudowa dashboardu lub historii feedbacku.
- Nowe testy przeglądarkowe w tej zmianie; istniejący test podróży pozostaje kontrolą regresji, a nowe testy automatyczne obejmują bazę i API.
- Wdrożenie produkcyjne w ramach przygotowania lub wykonania lokalnego planu; instrukcja wdrożenia jest częścią handoffu.
- Zmiany w `context/archive/`.

## Implementation Approach

Przenieść zastępowanie planu oraz zapis ankiety do uwierzytelnionych RPC. Operacje korzystają z tej samej transakcyjnej blokady użytkownika, a aktualność ankiety sprawdzają ponownie po jej uzyskaniu. Wywołanie AI pozostaje poza transakcją. Usunięcie planów korzysta z istniejącej kaskady feedbacku.

Wykorzystać zainstalowany runner Playwright do testów API bez przeglądarki. Dodać osobną konfigurację oraz klienta `pg` do kontrolowanych testów transakcji. Testy wykonują operacje biznesowe jako użytkownik; uprawnienia administracyjne służą wyłącznie przygotowaniu izolowanych danych, obserwacji i sprzątaniu.

## Critical Implementation Details

### Kolejność blokad

Blokada transakcyjna właściciela musi poprzedzać blokady rekordów w zapisie ankiety, zastąpieniu planu i istniejącym `revise_training_plan`, który aktualizuje też ankietę. Akceptacja i feedback mogą zachować blokowanie planu, ponieważ nie żądają następnie blokady właściciela. Blokowanie wyłącznie istniejącego planu nie chroni pierwszego generowania, a blokowanie pojedynczej ankiety nie chroni różnych ankiet tego samego użytkownika.

### Aktualność i czas

RPC porównuje identyfikator najnowszej ankiety oraz jej `updated_at` z dokładnym tokenem odczytanym przed AI, bez konwersji przez JavaScript `Date`. Nowe ankiety zapisane pod blokadą otrzymują `created_at` większe od maksimum właściciela; aktualizacja ankiety zwiększa jej token czasu co najmniej o mikrosekundę. Zachować dotychczasowe sortowanie przy odczycie danych historycznych; przy pełnym remisie obu pól nie wybierać arbitralnie po UUID, lecz zablokować generowanie jako konflikt. Zapis nowych danych może wtedy utworzyć jednoznacznie nowszą ankietę, bez modyfikowania remisujących rekordów.

### Niepewny wynik

Timeout po rozpoczęciu wywołania zapisującego nie dowodzi wycofania transakcji. Zachować `outcome: unknown`; tylko jednoznaczna odpowiedź RPC potwierdzająca brak zmian pozwala wyczyścić `writeStarted`. Sam brak planu dla starego `intakeId` nie jest zgodą na ponowienie.

## Phase 1: Przygotowanie testów

### Overview

Przygotować działające testy bazy i API bez zmiany zachowania produkcyjnego.

### Changes Required

#### 1. Runner i konfiguracja

**File:** `package.json`, `package-lock.json`, `playwright.retention.config.ts` (nowy).

**Intent:** Uruchamiać testy retencji niezależnie od przeglądarkowych testów E2E.

**Contract:** Dodać `test:retention` uruchamiający dedykowaną konfigurację dla `tests/integration/plan-retention/`; użyć istniejącego `@playwright/test`, dodać deweloperskie `pg` i typy. Nie importować konfiguracji z projektami przeglądarek. Osobny port serwera, brak ponowień maskujących błędy współbieżności, brak rzeczywistych wywołań AI.

#### 2. Izolowane fixture i sterowanie zależnościami

**File:** `tests/integration/plan-retention/support/` (nowy), `tests/integration/plan-retention/harness.spec.ts` (nowy).

**Intent:** Udostępnić rzeczywistą lokalną bazę, sesje użytkowników oraz kontrolowane sukcesy, błędy i opóźnienia HTTP.

**Contract:** Sprawdzić lokalny adres Supabase i zgodność konfiguracji aplikacji przed zapisem. Każdy test tworzy własnego użytkownika i sprząta w `finally`. Wykorzystać wzorzec istniejącego launchera AI, z bramkami sterowanymi przez test zamiast stałych opóźnień. Umożliwić wstrzymanie odpowiedzi AI i utratę odpowiedzi RPC po rzeczywistym commit; mechanizmy wyłącznie w launcherze testowym. Klient SQL obsługuje odrębne sesje, role i obserwację oczekujących blokad z ograniczonym czasem. Nigdy nie wypisywać kluczy ani treści prywatnych danych.

### Success Criteria

#### Automated Verification

- `npm run test:retention -- harness.spec.ts` przechodzi na dotychczasowym kodzie i odmawia pracy z nielokalną bazą.
- `npm run lint` oraz `npm run typecheck` przechodzą po dodaniu infrastruktury.

#### Manual Verification

- Przegląd potwierdza, że fixture sprzątają tylko własne dane, a infrastruktura nie zmienia zachowania aplikacji produkcyjnej.

**Implementation Note:** Ta faza przygotowawcza należy do `/10x-implement`. Po jej weryfikacji fazy 2–3 prowadzić przez `/10x-tdd`. Potwierdzenie manualne dotyczy wyłącznie wymienionego kryterium.

## Phase 2: Bezpieczne zastępowanie planu w TDD

### Overview

Najpierw test regresji przez istniejący endpoint: nowy plan powstaje, ale stary plan i feedback nadal istnieją. RED ma wynikać z tej różnicy zachowania, nie z brakującego importu lub niedziałającej bazy. Następnie wdrożyć transakcyjną retencję i jej podłączenie do serwisów.

### Changes Required

#### 1. Regresje bazy i generowania

**File:** `tests/integration/plan-retention/replacement.spec.ts`, `tests/integration/plan-retention/concurrency.spec.ts` (nowe).

**Intent:** Dowieść usuwania po sukcesie oraz zachowania danych przy błędzie, konflikcie i równoległych żądaniach.

**Contract:** Testy weryfikują rzeczywiste rekordy planów, feedbacku i ankiet, w tym drugiego użytkownika. Scenariusze i wymagane przeploty wymieniono w Testing Strategy. Zapisać dowód RED przed zmianami produkcyjnymi, potem GREEN i REFACTOR.

#### 2. Atomowe RPC i granica uprawnień

**File:** nowa migracja `supabase/migrations/YYYYMMDDHHmmss_enforce_plan_retention.sql`.

**Intent:** Zapisywać nowy plan i usuwać poprzednie dane jako jedną operację, odporną na zmiany ankiety i współbieżność.

**Contract:** Dodać `replace_training_plan(p_intake_id uuid, p_expected_intake_updated_at timestamptz, p_plan_content jsonb, p_explanation text)`. Zwraca kontrolowany wynik `created`, `existing`, `stale` lub `missing`, wraz z pełnym rekordem planu wyłącznie dla dwóch pierwszych wyników. Właściciel pochodzi wyłącznie z `auth.uid()`.

Po blokadzie właściciela funkcja sprawdza właściciela ankiety, najnowszą ankietę i token wersji. Wynik `existing` zwraca istniejący plan bez zmian. Dla `created` waliduje dane, wstawia szkic z początkowymi metadanymi, usuwa wszystkie inne plany właściciela i zwraca nowy rekord. Każdy nieoczekiwany błąd wycofuje całą transakcję, również kaskadę. Zachować unikalność `(user_id, intake_id)`; nie dodawać globalnej unikalności `user_id`, która wymagałaby czyszczenia historii.

Dodać `save_training_intake(p_goal text, p_experience_level text, p_health_constraints text, p_notes text)`, zwracające zapisany rekord. Pod tą samą blokadą atomowo zachować regułę edycji najnowszej ankiety bez planu lub utworzenia nowej po powstaniu planu. Uaktualnić siedmioargumentowe `revise_training_plan`, zachowując kontrakt i dodając blokadę właściciela przed blokadami rekordów. Specjalny trigger ankiety zapewnia rosnący token czasu; nie zmieniać wspólnego triggera planów i feedbacku.

RPC używają `SECURITY DEFINER`, pustego `search_path`, kwalifikowanych nazw i jawnej walidacji właściciela oraz wejścia. EXECUTE tylko dla `authenticated`, bez domyślnego PUBLIC. Odebrać bezpośredni INSERT planów i bezpośrednie INSERT/UPDATE/DELETE ankiet zwykłemu klientowi; nie ma aplikacyjnego przepływu usuwania ankiet, a usunięcie najnowszej mogłoby ponownie dopuścić stare żądanie. Zachować RLS i odczyt właściciela. Administracyjne operacje poza aplikacją nie należą do gwarancji współbieżności.

#### 3. Serwisy i podstawowy kontrakt konfliktu

**File:** `src/lib/services/training-intakes.ts`, `src/lib/services/training-plans.ts`, `src/pages/api/training-plans/generate.ts`, `src/types.ts`, `src/lib/plan-operation.ts`.

**Intent:** Kierować zapisy przez RPC i odrzucać historyczne żądania przed kosztownym generowaniem oraz ponownie przy zapisie.

**Contract:** `saveTrainingIntake` zachowuje sygnaturę, korzystając z RPC. Generowanie sprawdza aktualność przed zwróceniem istniejącego planu; nie wolno pozostawić wcześniejszego skrótu dla historycznego `intakeId`. AI korzysta z odczytanej ankiety, a RPC dostaje jej dokładny token. Mapować `stale` na nowy kod `stale-intake` i HTTP 409, `missing` na istniejący bezpieczny błąd braku danych. Sukces zachowuje obecny format odpowiedzi. Nie stosować osobnego DELETE ani automatycznie powtarzać niepewnego zapisu. Odczyty najnowszej ankiety i RPC muszą stosować ten sam porządek oraz wykrywanie niejednoznaczności.

### Success Criteria

#### Automated Verification

- Zarejestrowany RED testu zastąpienia potwierdza pozostawienie starego planu i feedbacku przed implementacją.
- `npm run test:retention -- replacement.spec.ts concurrency.spec.ts` przechodzi, włącznie z rollbackiem, izolacją i kontrolowanymi przeplotami.
- Nowa migracja stosuje się lokalnie przez `npx supabase migration up --local`; istniejące historyczne plany i feedback pozostają do nowego skutecznego utworzenia planu.
- `npm run lint`, `npm run typecheck` i `npm run build` przechodzą.

#### Manual Verification

- Przegląd migracji potwierdza wspólną kolejność blokad, uprawnienia RPC i brak czyszczenia historii podczas wdrażania schematu.

**Implementation Note:** RED → GREEN → REFACTOR prowadzić na małych scenariuszach przez `/10x-tdd`. Nie wdrażać samej fazy 2 na produkcję; aplikacja i zmienione uprawnienia wymagają skoordynowanego wydania po fazie 3.

## Phase 3: API i interfejs w TDD

### Overview

Uzupełnić odczyt po niepewnym zapisie i zachowanie starej karty, następnie dodać zaakceptowaną informację przy generowaniu.

### Changes Required

#### 1. Stan aktualności podczas sprawdzania

**File:** `src/pages/api/training-plans/current.ts`, `src/types.ts`, `tests/integration/plan-retention/recovery.spec.ts` (nowy).

**Intent:** Odróżniać brak jeszcze niewygenerowanego planu od nieaktualnego celu ponowienia.

**Contract:** Dla zapytania `intakeId` dodać wymagany stan `generationState: ready | planned | stale | missing`. `ready` oznacza aktualną, jednoznaczną ankietę bez planu; `planned` aktualną ankietę z planem; `stale` starszą lub niejednoznaczną; `missing` brak własnej ankiety. Metadane planu w odpowiedzi nadal odnoszą się tylko do żądanego celu, bez podstawiania innego ID. Zapytania `planId` zachowują kontrakt odczytu korekty. Stan jest wskazówką do UI, nie upoważnieniem do zapisu: RPC zawsze ponownie sprawdza aktualność.

#### 2. Stara karta i ostrzeżenie o retencji

**File:** `src/components/hooks/usePlanOperation.ts`, `src/components/plans/PlanGenerationForm.tsx`, `src/components/plans/PlanOperationStatus.tsx`, `src/pages/dashboard.astro`.

**Intent:** Zablokować nieaktualne ponowienie i wyjaśnić użytkownikowi dalszą drogę oraz skutek generowania.

**Contract:** `stale-intake` z potwierdzonym `not-saved` prowadzi do stanu bez możliwości submit, z tekstem: „Te dane są już nieaktualne. Otwórz aktualny panel, aby kontynuować.” i istniejącym odnośnikiem do `/dashboard`. Taki sam rezultat daje `generationState: stale`; `missing` również nie pozwala ponawiać. `ready` pozwala tylko na ręczne ponowienie, `planned` kieruje do panelu. Starsza odpowiedź bez nowego pola nie odblokowuje ponowienia. Niepewny wynik nadal wymaga sprawdzenia i nigdy nie zapewnia, że stare dane ocalały.

Stała informacja przy przycisku: „Po zapisaniu nowego planu poprzednie plany i wszystkie powiązane z nimi opinie po treningach (feedback) zostaną trwale usunięte. Jeśli nowy plan nie zostanie zapisany, dotychczasowe dane pozostaną.” Tekst jest widoczny również bez JavaScript i nie wymaga dodatkowego potwierdzenia. Dodać bezpieczny komunikat `stale-intake` dla natywnego redirectu dashboardu. Brak nowego planu B oznacza przejście do aktualnego panelu z ankietą B, bez obietnicy istnienia planu B.

#### 3. Weryfikacja i handoff

**File:** `.github/workflows/e2e.yml`, `context/changes/plan-retention-policy/plan.md`.

**Intent:** Uruchamiać regresje retencji z istniejącym lokalnym środowiskiem CI i zapisać sposób wydania.

**Contract:** Do istniejącego ręcznie uruchamianego workflow dodać `npm run test:retention` po konfiguracji lokalnego Supabase, przed istniejącą podróżą E2E. Nie zmieniać triggerów workflow. W Progress zapisywać wyniki etapów, a dowody RED/GREEN i instrukcję wydania w notatkach wykonania tej zmiany.

### Success Criteria

#### Automated Verification

- RED → GREEN testów `npm run test:retention -- recovery.spec.ts` obejmuje starą kartę oraz utratę odpowiedzi po commit i rollbacku.
- `npm run test:retention` przechodzi w całości.
- `npm run test:e2e:plan` przechodzi dla istniejącej podróży generowanie → korekta → akceptacja.
- `npm run lint`, `npm run typecheck` i `npm run build` przechodzą dla końcowego stanu.

#### Manual Verification

- Ostrzeżenie jest widoczne przy generowaniu na telefonie i desktopie; nowy plan usuwa stare plany i ich feedback, pozostawiając ankiety.
- Stara karta blokuje ponowienie i prowadzi do aktualnego panelu; sprawdzenie po niepewnym zapisie nie odblokowuje starszej ankiety.
- Akcje korekty, akceptacji i feedbacku dla usuniętego planu kończą się istniejącym komunikatem konfliktu lub niedostępności, bez odtworzenia danych.

**Implementation Note:** Logikę API prowadzić przez `/10x-tdd`; statyczny tekst zweryfikować przeglądem i manualnie. Po testach automatycznych potwierdzić powyższe kryteria manualne przed oznaczeniem zmiany jako zakończonej.

## Testing Strategy

### Testy integracyjne bazy i API

1. Dwa historyczne plany użytkownika z feedbackiem; nowa ankieta i skuteczne generowanie: pozostaje wyłącznie nowy szkic, znika cały stary feedback, pozostają wszystkie ankiety i dane drugiego użytkownika.
2. Błąd AI, niepoprawna odpowiedź AI i błąd SQL: stare rekordy pozostają identyczne. Test rollbacku wymusza błąd usuwania po INSERT, aby wykazać brak częściowego zastąpienia; izolowany mechanizm testowy jest usuwany w `finally`.
3. Dwie próby tej samej ankiety: jeden rekord i ten sam zwracany identyfikator. Ponowienie po akceptacji lub dodaniu feedbacku niczego nie resetuje.
4. A oczekuje na AI, zapis B kończy się, następnie kończy się A: wynik A jest odrzucony zarówno z gotowym planem B, jak i bez niego.
5. Ten sam identyfikator ankiety, ale zmiana danych podczas AI: stary token zostaje odrzucony; ponowienie odczytuje aktualne dane.
6. Zapis ankiety i zastąpienie planu w obu kolejnościach uzyskania blokady: spójny wynik odpowiada kolejności commit, bez przerwy między sprawdzeniem aktualności a zapisem.
7. Zastąpienie współbieżne z korektą, akceptacją i feedbackiem: poprawny commit albo kontrolowany konflikt, brak osieroconego feedbacku i odtworzenia usuniętego planu. Bramki lub obserwacja blokad zastępują przypadkowe opóźnienia.
8. Po B ponowienie A zwraca konflikt, nie wywołuje AI i nie zmienia B. Przypadek historycznego A nadal istniejącego przed pierwszym zastąpieniem również nie omija sprawdzenia aktualności.
9. Odebrana odpowiedź RPC po commit: API zgłasza niepewność; sprawdzenie odnajduje plan lub wykrywa nieaktualną ankietę. Utrata odpowiedzi nie powoduje automatycznego ponowienia.
10. Brak/obca ankieta, anonimowy klient, sfałszowany właściciel oraz próby bezpośrednich zapisów nie obchodzą granicy RPC i nie ujawniają cudzych rekordów.
11. Migracja nie usuwa istniejących planów. Samo zwrócenie istniejącego planu nie uruchamia retencji. Pełny remis historycznych znaczników czasu blokuje destrukcyjne generowanie; kolejne zapisanie danych tworzy jednoznacznie nowszą ankietę.

### Testy jednostkowe i UI

Nie dodawać osobnego frameworka jednostkowego tylko dla tej zmiany. Krytyczne gwarancje wymagają prawdziwych transakcji i API. Nowe testy przeglądarkowe nie są wymagane; istniejący E2E uruchomić bez modyfikacji. Jeśli późniejszy przegląd wykaże potrzebę nowego testu przeglądarkowego, prowadzić go osobno przez `/10x-e2e`.

## Performance Considerations

Blokada obejmuje krótkie operacje SQL jednego użytkownika, nigdy oczekiwanie na AI. Korzystać z indeksów właściciela planu i feedbacku; dodać indeks najnowszej ankiety `(user_id, created_at DESC, updated_at DESC)`. Nie pobierać pełnej historii do aplikacji w celu usuwania. Pierwsze zastąpienie może usunąć wiele historycznych rekordów; przekroczenie istniejącego limitu operacji zachowuje obsługę niepewności i wymaga sprawdzenia wyniku, nie osobnego sprzątania.

## Migration Notes

Nowa migracja jest forward-only; istniejące migracje pozostają niezmienione. Na lokalnej bazie stosować migracje bez resetowania danych. Weryfikacja od zera może użyć wyłącznie osobnego, przeznaczonego do testów środowiska.

Odebranie bezpośrednich uprawnień nie jest zgodne ze starą wersją aplikacji. Wydanie wymaga krótkiego wstrzymania mutacji, zakończenia trwających generowań, zastosowania migracji, wdrożenia kompletnej aplikacji z fazy 3 oraz smoke testu przed wznowieniem zapisów. Nie wdrażać części planu niezależnie. Rollback kodu wymaga skoordynowanego przywrócenia poprzednich uprawnień; nie przywraca danych już usuniętych przez udane zastąpienie. Ten plan nie wykonuje zdalnych migracji ani deploymentu.

## References

- Framing i zakres: `context/changes/plan-retention-policy/frame.md`.
- Tożsamość zmiany i wymóg TDD: `context/changes/plan-retention-policy/change.md`.
- Dotychczasowy kontrakt: `context/changes/minimal-planning-data-contract/plan.md`.
- Obsługa niepewnego wyniku: `src/lib/plan-operation.ts`.
- Wzorzec zabezpieczeń: `supabase/migrations/20260912120000_enforce_training_plan_lifecycle_boundary.sql`.
- Projekt wykorzystuje transakcyjne blokady i jednolitą kolejność ich pobierania: [PostgreSQL — Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html).
- Uprawnienia funkcji i pusty search path: [Supabase — Database Functions](https://supabase.com/docs/guides/database/functions).
- Testy HTTP bez przeglądarki: [Playwright — API testing](https://playwright.dev/docs/api-testing).

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Przygotowanie testów

#### Automated

- [x] 1.1 `npm run test:retention -- harness.spec.ts` przechodzi na dotychczasowym kodzie i odmawia pracy z nielokalną bazą. — 4bde972
- [x] 1.2 `npm run lint` oraz `npm run typecheck` przechodzą po dodaniu infrastruktury. — 4bde972

#### Manual

- [x] 1.3 Przegląd potwierdza, że fixture sprzątają tylko własne dane, a infrastruktura nie zmienia zachowania aplikacji produkcyjnej. — 4bde972

### Phase 2: Bezpieczne zastępowanie planu w TDD

#### Automated

- [x] 2.1 Zarejestrowany RED testu zastąpienia potwierdza pozostawienie starego planu i feedbacku przed implementacją.
- [x] 2.2 `npm run test:retention -- replacement.spec.ts concurrency.spec.ts` przechodzi, włącznie z rollbackiem, izolacją i kontrolowanymi przeplotami.
- [x] 2.3 Nowa migracja stosuje się lokalnie przez `npx supabase migration up --local`; istniejące historyczne plany i feedback pozostają do nowego skutecznego utworzenia planu.
- [x] 2.4 `npm run lint`, `npm run typecheck` i `npm run build` przechodzą.

#### Manual

- [x] 2.5 Przegląd migracji potwierdza wspólną kolejność blokad, uprawnienia RPC i brak czyszczenia historii podczas wdrażania schematu.

### Phase 3: API i interfejs w TDD

#### Automated

- [ ] 3.1 RED → GREEN testów `npm run test:retention -- recovery.spec.ts` obejmuje starą kartę oraz utratę odpowiedzi po commit i rollbacku.
- [ ] 3.2 `npm run test:retention` przechodzi w całości.
- [ ] 3.3 `npm run test:e2e:plan` przechodzi dla istniejącej podróży generowanie → korekta → akceptacja.
- [ ] 3.4 `npm run lint`, `npm run typecheck` i `npm run build` przechodzą dla końcowego stanu.

#### Manual

- [ ] 3.5 Ostrzeżenie jest widoczne przy generowaniu na telefonie i desktopie; nowy plan usuwa stare plany i ich feedback, pozostawiając ankiety.
- [ ] 3.6 Stara karta blokuje ponowienie i prowadzi do aktualnego panelu; sprawdzenie po niepewnym zapisie nie odblokowuje starszej ankiety.
- [ ] 3.7 Akcje korekty, akceptacji i feedbacku dla usuniętego planu kończą się istniejącym komunikatem konfliktu lub niedostępności, bez odtworzenia danych.
