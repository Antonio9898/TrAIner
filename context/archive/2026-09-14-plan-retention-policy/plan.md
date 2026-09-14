# Polityka retencji planów — Implementation Plan

## Overview

Po pomyślnym zapisaniu ankiety poprzednie plany użytkownika i ich feedback fizycznie znikają z bazy. Przed zapisem formularz wyświetla stylowany modal potwierdzenia.

Usunięcie następuje w tej samej transakcji co zapis ankiety, przed generowaniem szkicu. Wycofanie transakcji zachowuje poprzednie dane; późniejszy błąd AI nie odtwarza usuniętych planów. Realizacja: przygotowanie infrastruktury testowej, następnie `/10x-tdd` w cyklu RED → GREEN → REFACTOR.

Aktualizacja zakresu z 2026-09-14: użytkownik zatwierdził retencję przy zapisie ankiety i modal, zastępując pierwotną decyzję o retencji przy zapisie szkicu. Faza 2 opisuje historyczny etap implementacji; faza 3 zawiera zmianę reguły. Tytuły w Progress pozostają niezmienione dla zachowania historii workflow.

## Current State Analysis

Poniższa analiza opisuje stan przed rozpoczęciem implementacji.

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

- Zapis ankiety i usunięcie wszystkich planów właściciela z feedbackiem stanowią jedną transakcję.
- Po zapisie ankiety użytkownik nie ma planu, dopóki nie wygeneruje nowego szkicu. Wdrożenie migracji samo nie usuwa historii. RPC generowania zachowuje dodatkowo atomowe zastępowanie historii, która pozostała sprzed wdrożenia.
- Zapis nowszej ankiety B blokuje wynik generowania A, również gdy B nie ma jeszcze planu lub jego generowanie się nie udało.
- Ponowienie ze starej karty nie odtwarza A. Użytkownik dostaje komunikat i odnośnik do aktualnego panelu.
- Ponowienie dla aktualnej ankiety z istniejącym planem zwraca ten sam plan, bez nadpisania, usuwania feedbacku ani porządkowania historycznych danych.
- Stała informacja w formularzu ankiety i stylowany modal przed wysłaniem uprzedzają o trwałym usunięciu planów i feedbacku, również przy późniejszym błędzie AI. Anulowanie zachowuje wpisane dane. Tekst przy generowaniu wyjaśnia, że usunięcie nastąpiło przy zapisie ankiety.
- Potwierdzony brak zapisu i niepewny wynik po utracie odpowiedzi pozostają odrębnymi stanami.

## What We're NOT Doing

- Usuwanie starszych ankiet, jednorazowe czyszczenie produkcji lub czyszczenie przy samej migracji.
- Historia wersji, kosz, przywracanie usuniętych planów lub feedbacku.
- Przywracanie dawnych założeń ze starej karty; wymaga nowej ankiety.
- Oczekiwanie na akceptację planu przed usunięciem poprzednich danych.
- Zmiana promptów AI, przebudowa dashboardu lub historii feedbacku.
- Nowe testy przeglądarkowe w tej zmianie; istniejący test podróży pozostaje kontrolą regresji, a nowe testy automatyczne obejmują bazę i API.
- Wdrożenie produkcyjne w ramach przygotowania lub wykonania lokalnego planu; instrukcja wdrożenia jest częścią handoffu.
- Zmiany w `context/archive/`.

## Implementation Approach

Przenieść zastępowanie planu oraz zapis ankiety do uwierzytelnionych RPC. Operacje korzystają z tej samej transakcyjnej blokady użytkownika, a aktualność ankiety sprawdzają ponownie po jej uzyskaniu. Zapis ankiety usuwa wszystkie plany właściciela w tej samej transakcji. Wywołanie AI pozostaje poza transakcją. Usunięcie planów korzysta z istniejącej kaskady feedbacku.

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

Historyczny etap zakończony w `c7b7181`; docelowy moment usuwania został następnie zmieniony w fazie 3. Punkt 2.3 w Progress dokumentuje wynik tej wcześniejszej fazy.

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

Uzupełnić odczyt po niepewnym zapisie i zachowanie starej karty, przenieść retencję do zapisu ankiety i dodać stylowany modal potwierdzenia.

Interpretacja niezmienionego tytułu Progress 3.5 po decyzji użytkownika: zweryfikować ostrzeżenie i modal przy zapisie ankiety na telefonie i desktopie, anulowanie bez zapisu oraz usunięcie planów i feedbacku przy skutecznym zapisie ankiety. Użytkownik zaakceptował testy manualne 3.5–3.7 dnia 2026-09-14.

### Changes Required

#### 1. Stan aktualności podczas sprawdzania

**File:** `src/pages/api/training-plans/current.ts`, `src/types.ts`, `tests/integration/plan-retention/recovery.spec.ts` (nowy).

**Intent:** Odróżniać brak jeszcze niewygenerowanego planu od nieaktualnego celu ponowienia.

**Contract:** Dla zapytania `intakeId` dodać wymagany stan `generationState: ready | planned | stale | missing`. `ready` oznacza aktualną, jednoznaczną ankietę bez planu; `planned` aktualną ankietę z planem; `stale` starszą lub niejednoznaczną; `missing` brak własnej ankiety. Metadane planu w odpowiedzi nadal odnoszą się tylko do żądanego celu, bez podstawiania innego ID. Zapytania `planId` zachowują kontrakt odczytu korekty. Stan jest wskazówką do UI, nie upoważnieniem do zapisu: RPC zawsze ponownie sprawdza aktualność.

#### 2. Stara karta i ostrzeżenie o retencji

**File:** `src/components/hooks/usePlanOperation.ts`, `src/components/intake/GoalAndConstraintsForm.tsx`, `src/components/plans/PlanGenerationForm.tsx`, `src/components/plans/PlanOperationStatus.tsx`, `src/pages/dashboard.astro`.

**Intent:** Zablokować nieaktualne ponowienie i uprzedzić o skutku zapisania ankiety.

**Contract:** `stale-intake` z potwierdzonym `not-saved` prowadzi do stanu bez możliwości submit, z tekstem: „Te dane są już nieaktualne. Otwórz aktualny panel, aby kontynuować.” i istniejącym odnośnikiem do `/dashboard`. Taki sam rezultat daje `generationState: stale`; `missing` również nie pozwala ponawiać. `ready` pozwala tylko na ręczne ponowienie, `planned` kieruje do panelu. Starsza odpowiedź bez nowego pola nie odblokowuje ponowienia. Niepewny wynik nadal wymaga sprawdzenia i nigdy nie zapewnia, że stare dane ocalały.

Stała informacja przy zapisie ankiety ostrzega o trwałym usunięciu wszystkich poprzednich planów i feedbacku, również jeśli późniejsze generowanie zawiedzie. Tekst jest widoczny bez JavaScript. Po walidacji interaktywny formularz otwiera stylowany `<dialog>` z przyciskami „Anuluj” i „Zapisz ankietę i usuń plany”. Anuluj, Escape i krzyżyk zamykają modal bez wysłania formularza. Początkowy fokus trafia na Anuluj; potwierdzenie dopuszcza pojedynczy zapis. Przy generowaniu widnieje zgodne objaśnienie retencji przy zapisie ankiety. Dodać bezpieczny komunikat `stale-intake` dla natywnego redirectu dashboardu. Brak nowego planu B oznacza przejście do aktualnego panelu z ankietą B, bez obietnicy istnienia planu B.

#### 3. Retencja przy zapisie ankiety

**File:** `supabase/migrations/20260914170000_retire_plans_on_intake_save.sql`, `tests/integration/plan-retention/intake-retention.spec.ts`, `tests/integration/plan-retention/concurrency.spec.ts`, `tests/integration/plan-retention/replacement.spec.ts`.

**Contract:** Rozszerzyć `save_training_intake` o DELETE wszystkich planów właściciela po zapisie ankiety, przed końcem tej samej transakcji. Zachować blokadę właściciela, walidację, kaskadę feedbacku i historyczne ankiety. Błąd DELETE wycofuje również zapis ankiety. Błąd późniejszego generowania nie odtwarza usuniętych danych. Nowa migracja jest forward-only i nie wykonuje czyszczenia przy instalacji. Test-first wykazać usuwanie przed AI i rollback; przeploty korekty, akceptacji oraz feedbacku weryfikować względem zapisu ankiety.

#### 4. Weryfikacja i handoff

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

- Ostrzeżenie i modal są widoczne przy zapisie ankiety na telefonie i desktopie; anulowanie zachowuje formularz, a skuteczny zapis usuwa stare plany i feedback, pozostawiając ankiety.
- Stara karta blokuje ponowienie i prowadzi do aktualnego panelu; sprawdzenie po niepewnym zapisie nie odblokowuje starszej ankiety.
- Akcje korekty, akceptacji i feedbacku dla usuniętego planu kończą się istniejącym komunikatem konfliktu lub niedostępności, bez odtworzenia danych.

**Implementation Note:** Logikę API prowadzić przez `/10x-tdd`; statyczny tekst zweryfikować przeglądem i manualnie. Po testach automatycznych potwierdzić powyższe kryteria manualne przed oznaczeniem zmiany jako zakończonej.

## Testing Strategy

### Testy integracyjne bazy i API

1. Skuteczny zapis ankiety usuwa plany i feedback przed AI; późniejszy błąd AI nie odtwarza danych. Dodatkowo generowanie dla historii sprzed wdrożenia pozostawia wyłącznie nowy szkic, zachowując ankiety i dane drugiego użytkownika.
2. Błąd zapisu ankiety lub DELETE wycofuje całą transakcję, zachowując ankietę, plany i feedback. Błąd AI lub SQL generowania nie zmienia stanu zastanego po zapisie ankiety; nie przywraca już usuniętych danych. Test rollbacku wymusza błąd usuwania po INSERT, aby wykazać brak częściowego zastąpienia; izolowany mechanizm testowy jest usuwany w `finally`.
3. Dwie próby tej samej ankiety: jeden rekord i ten sam zwracany identyfikator. Ponowienie po akceptacji lub dodaniu feedbacku niczego nie resetuje.
4. A oczekuje na AI, zapis B kończy się, następnie kończy się A: wynik A jest odrzucony zarówno z gotowym planem B, jak i bez niego.
5. Ten sam identyfikator ankiety, ale zmiana danych podczas AI: stary token zostaje odrzucony; ponowienie odczytuje aktualne dane.
6. Zapis ankiety i zastąpienie planu w obu kolejnościach uzyskania blokady: spójny wynik odpowiada kolejności commit, bez przerwy między sprawdzeniem aktualności a zapisem.
7. Zapis ankiety z usuwaniem planów współbieżny z korektą, akceptacją i feedbackiem: poprawny commit albo kontrolowany konflikt, brak osieroconego feedbacku i odtworzenia usuniętego planu. Bramki lub obserwacja blokad zastępują przypadkowe opóźnienia.
8. Po B ponowienie A zwraca konflikt, nie wywołuje AI i nie zmienia B. Przypadek historycznego A nadal istniejącego przed pierwszym zastąpieniem również nie omija sprawdzenia aktualności.
9. Odebrana odpowiedź RPC po commit: API zgłasza niepewność; sprawdzenie odnajduje plan lub wykrywa nieaktualną ankietę. Utrata odpowiedzi nie powoduje automatycznego ponowienia.
10. Brak/obca ankieta, anonimowy klient, sfałszowany właściciel oraz próby bezpośrednich zapisów nie obchodzą granicy RPC i nie ujawniają cudzych rekordów.
11. Żadna z obu migracji retencji nie usuwa istniejących planów podczas instalacji. Samo zwrócenie istniejącego planu nie uruchamia retencji. Pełny remis historycznych znaczników czasu blokuje destrukcyjne generowanie; kolejne zapisanie danych tworzy jednoznacznie nowszą ankietę.

### Testy jednostkowe i UI

Nie dodawać osobnego frameworka jednostkowego tylko dla tej zmiany. Krytyczne gwarancje wymagają prawdziwych transakcji i API. Nowe testy przeglądarkowe nie są wymagane; istniejący E2E uruchomić bez modyfikacji. Jeśli późniejszy przegląd wykaże potrzebę nowego testu przeglądarkowego, prowadzić go osobno przez `/10x-e2e`.

## Performance Considerations

Blokada obejmuje krótkie operacje SQL jednego użytkownika, nigdy oczekiwanie na AI. Korzystać z indeksów właściciela planu i feedbacku; dodać indeks najnowszej ankiety `(user_id, created_at DESC, updated_at DESC)`. Nie pobierać pełnej historii do aplikacji w celu usuwania. Pierwsze zastąpienie może usunąć wiele historycznych rekordów; przekroczenie istniejącego limitu operacji zachowuje obsługę niepewności i wymaga sprawdzenia wyniku, nie osobnego sprzątania.

## Migration Notes

Migracje `20260914150000_enforce_plan_retention.sql` i `20260914170000_retire_plans_on_intake_save.sql` są forward-only i muszą zostać zastosowane w tej kolejności; wcześniejsze migracje pozostają niezmienione. Na lokalnej bazie stosować migracje bez resetowania danych. Weryfikacja od zera może użyć wyłącznie osobnego, przeznaczonego do testów środowiska.

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

- [x] 2.1 Zarejestrowany RED testu zastąpienia potwierdza pozostawienie starego planu i feedbacku przed implementacją. — c7b7181
- [x] 2.2 `npm run test:retention -- replacement.spec.ts concurrency.spec.ts` przechodzi, włącznie z rollbackiem, izolacją i kontrolowanymi przeplotami. — c7b7181
- [x] 2.3 Nowa migracja stosuje się lokalnie przez `npx supabase migration up --local`; istniejące historyczne plany i feedback pozostają do nowego skutecznego utworzenia planu. — c7b7181
- [x] 2.4 `npm run lint`, `npm run typecheck` i `npm run build` przechodzą. — c7b7181

#### Manual

- [x] 2.5 Przegląd migracji potwierdza wspólną kolejność blokad, uprawnienia RPC i brak czyszczenia historii podczas wdrażania schematu. — c7b7181

### Phase 3: API i interfejs w TDD

#### Automated

- [x] 3.1 RED → GREEN testów `npm run test:retention -- recovery.spec.ts` obejmuje starą kartę oraz utratę odpowiedzi po commit i rollbacku. — e6b90df
- [x] 3.2 `npm run test:retention` przechodzi w całości. — e6b90df
- [x] 3.3 `npm run test:e2e:plan` przechodzi dla istniejącej podróży generowanie → korekta → akceptacja. — e6b90df
- [x] 3.4 `npm run lint`, `npm run typecheck` i `npm run build` przechodzą dla końcowego stanu. — e6b90df

#### Manual

- [x] 3.5 Ostrzeżenie jest widoczne przy generowaniu na telefonie i desktopie; nowy plan usuwa stare plany i ich feedback, pozostawiając ankiety. — e6b90df
- [x] 3.6 Stara karta blokuje ponowienie i prowadzi do aktualnego panelu; sprawdzenie po niepewnym zapisie nie odblokowuje starszej ankiety. — e6b90df
- [x] 3.7 Akcje korekty, akceptacji i feedbacku dla usuniętego planu kończą się istniejącym komunikatem konfliktu lub niedostępności, bez odtworzenia danych. — e6b90df
