# Generowanie i poprawka bez zawieszonego formularza — Implementation Plan

## Overview

Zapewnić ograniczone oczekiwanie i czytelny wynik generowania oraz poprawki planu. Użytkownik zgłasza zawieszanie poprawki na localhost i produkcji. Zakres obejmuje oba przepływy oraz diagnostykę etapów; nie zakłada potwierdzonej przyczyny konkretnego incydentu.

Uzgodnione: maksymalnie 90 s oczekiwania w aktywnym UI od wysłania, błąd przy formularzu, zachowanie wpisanych pól i ręczne sprawdzenie aktualnego planu przed ponowieniem po niepewnym zapisie. Zatwierdzono trzy fazy poniżej.

## Current State Analysis

Research dotyczy aktualnego punktu bazowego `a9abbe827a9e63574d7545e2ee9d902b22d8798e`. Nie odtworzono bieżącego incydentu i nie potwierdzono wersji produkcyjnej. `frame.md` tej zmiany i `context/foundation/lessons.md` nie istnieją.

- Oba formularze wykonują natywny POST, a API przekierowuje na SSR dashboard. Błąd może oczekiwać na dodatkowe auth i odczyty bazy.
- OpenRouter ma już timeout 90 s obejmujący body. Brak wspólnego deadline dla całej operacji i resetu formularzy po przerwanym oczekiwaniu.
- Poprawka używa 8000 tokenów, generowanie 3000. Historyczne ucięcie poprawki nie dowodzi problemu budżetu pierwszego planu.
- Zapis poprawki jest atomowym RPC z kontrolą wersji. Timeout transportu po wysłaniu zapisu może oznaczać zapis zakończony mimo braku odpowiedzi.
- Manifest wskazuje Astro 7, choć instrukcje repo opisują Astro 6. Weryfikować względem zainstalowanych zależności. Brak runnera testów; jego wdrożenie należy do osobnej zmiany strategii jakości.

## Desired End State

Generowanie i poprawka pokazują stan oczekiwania od wysłania oraz sukces albo czytelny błąd najpóźniej przy osiągnięciu 90 s w aktywnej karcie. Błąd nie wymaga odczytu dashboardu. Pola poprawki pozostają w pamięci formularza. Niepewny wynik uruchamia ścieżkę sprawdzenia bieżącego planu, bez automatycznego POST.

### Key Discoveries

- `src/lib/openrouter.ts:71` — istniejący timer obejmuje fetch i odczyt body; należy go zintegrować z budżetem, nie dublować bez koordynacji.
- `src/middleware.ts:6` — auth zaczyna się przed endpointem, więc deadline ustawiony dopiero w POST pominąłby ten etap.
- `src/pages/dashboard.astro:24` — odczyty poprzedzają renderowanie błędu; `:589` — wspólny skrypt obsługuje także akceptację.
- `src/components/plans/PlanRevisionForm.tsx:56` — brak odzyskania stanu po wysłaniu natywnego formularza.
- `src/lib/services/training-plans.ts:436` i `:469` — ten sam token wersji przed AI i w RPC; zachować obie kontrole.
- `supabase/migrations/20260812235500_add_training_plan_revision_summary.sql:77` — blokada i kontrola wersji poprzedzają atomową aktualizację planu i ograniczeń.

## What We're NOT Doing

- Jobs, kolejki, streaming, polling w tle i trwały rejestr operacji.
- Automatyczne ponawianie generowania/poprawki ani automatyczne przenoszenie starej poprawki na nową wersję.
- Zmiana promptów, modelu, budżetów tokenów, schematu planu, RLS lub RPC.
- Przebudowa akceptacji, feedbacku i całego dashboardu.
- Nowy runner, test code, konfiguracja MCP, hooks lub CI YAML; należą do osobnego rollout jakości.
- Deployment i deklaracja usunięcia potwierdzonej przyczyny incydentu bez reprodukcji.

## Implementation Approach

Rozszerzyć istniejące endpointy o jawnie wybierane odpowiedzi JSON dla interaktywnych formularzy. Zachować natywny POST jako fallback z przekierowaniem 303. Formularze przejmują wysyłanie dopiero po inicjalizacji obsługi JS; ich własny deadline zapewnia komunikat także przy niedostępnym serwerze.

Budżet serwera zaczyna się w middleware wyłącznie dla generate/revise i nowego odczytu sprawdzającego wynik. Dedykowany kontekst operacji przenosi deadline, sygnał anulowania, identyfikator korelacji i informację o rozpoczęciu zapisu. Zależności otrzymują ograniczenia czasu bez globalnej zmiany zachowania wszystkich klientów Supabase.

## Critical Implementation Details

### Timing & lifecycle

UI ma 90 s od rozpoczęcia wysyłania, łącznie z odczytem body; serwer ma 85 s od wejścia do middleware. Auth i pojedynczy odczyt/zapis mają limit 10 s, AI najwyżej 70 s i nie więcej niż pozostały budżet serwera minus 10 s na zapis. Wszystkie limity są przycinane do wspólnego deadline; brak czasu oznacza zakończenie przed rozpoczęciem kolejnego etapu. Marginesy są decyzją planu, nie zmierzonym SLA dostawców. Timer przeglądarki nie gwarantuje punktualnego renderu podczas uśpienia urządzenia; po wznowieniu sprawdzić upływ czasu przed dalszym działaniem.

### State sequencing

Oznaczyć rozpoczęcie próby zapisu przed wysłaniem insert/RPC. Po tym punkcie brak potwierdzenia oznacza nieznany wynik, także gdy mapowanie zwróconego rekordu zawiedzie. Samo przerwanie fetch lub rozstrzygnięcie Promise.race nie dowodzi rollbacku; kod po spóźnionym odczycie/AI musi sprawdzić deadline i nie rozpoczynać nowego zapisu.

### User experience spec

Sprawdzenie niezmienionej wersji nie dowodzi zakończenia starego żądania. Ręczne ponowienie poprawki zachowuje pierwotny `expectedUpdatedAt`; nie wolno podmienić go po cichu na aktualny. Gdy wersja się zmieniła, użytkownik przegląda aktualny plan i świadomie rozpoczyna nową poprawkę.

## Phase 1: API, limity i diagnostyka

### Overview

Zapewnić ograniczone czasowo odpowiedzi i wiarygodną klasyfikację wyniku dla interaktywnego klienta, zachowując istniejące zabezpieczenia zapisu.

### Changes Required

#### 1. Kontekst operacji i ograniczone wywołania

**Files:** `src/lib/plan-operation.ts` (nowy), `src/middleware.ts`, `src/env.d.ts`, `src/lib/supabase.ts`, `src/lib/openrouter.ts`, `src/lib/services/training-plans.ts`.

**Intent:** Objąć auth, odczyty, AI, zapis i odczyt odpowiedzi wspólnym budżetem. Kończyć oczekiwanie także wtedy, gdy zależność ignoruje anulowanie.

**Contract:** Request-scoped kontekst z czasem startu, deadline, sygnałem, identyfikatorem i stanem zapisu; opcjonalny dla pozostałych wywołań. Ograniczony klient Supabase musi obejmować również auth i helpery intake, uwzględniać istniejące sygnały oraz czyścić zasoby. Zewnętrzny limit oczekiwania nie może zostawić kontynuacji rozpoczynającej zapis po deadline. Zachować timeout body OpenRouter, walidację i atomowe RPC; błędy anulowania nie mogą zostać zagubione przez ogólne catch helperów.

#### 2. Odpowiedzi operacji i tożsamość generowania

**Files:** `src/pages/api/training-plans/generate.ts`, `src/pages/api/training-plans/revise.ts`, `src/types.ts`, `src/lib/plan-operation.ts`.

**Intent:** Zwracać wynik bez potrzeby ładowania dashboardu i przypiąć ponowienie generowania do pierwotnych danych.

**Contract:** Jawny `Accept: application/json` wybiera JSON bez redirectów; standardowy POST zachowuje fallback 303. Wspólny DTO: sukces z `outcome: saved`, `planId`, `intakeId`, `updatedAt` i `requestId`; błąd z kodem i `outcome: not-saved | unknown`, opcjonalnym requestId. Statusy: 200 sukces, 400 walidacja, 401 brak sesji, 403 origin, 409 konflikt, 504 deadline, 502 błędna odpowiedź AI, 503 zależność/konfiguracja. Odpowiedzi mają `Cache-Control: no-store` i nie ujawniają surowych wyjątków.

Interaktywny generate przekazuje zwalidowany `intakeId` z formularza; endpoint sprawdza właściciela, edytowalność i istniejący plan dla tego intake. Ponowienie nie wybiera przypadkowo nowej najnowszej ankiety. Legacy POST bez identyfikatora zachowuje dotychczasowy wybór. Konflikt unikalności nadal odczytuje istniejący plan. Revision zachowuje oryginalną tożsamość i wersję. Błąd przed próbą zapisu może być `not-saved`; transport/body/mapowanie po rozpoczęciu zapisu to konserwatywnie `unknown`, chyba że wynik został jednoznacznie potwierdzony.

Middleware musi dla wybranych tras mapować timeout i błąd auth zgodnie z trybem JSON zamiast wypuszczać nieobsłużony wyjątek lub stronę logowania. Brak sesji jest odrębny od niedostępnego auth. Zachować kontrolę Origin, walidację zod, sesję użytkownika i RLS.

#### 3. Sprawdzenie bieżącego planu

**File:** `src/pages/api/training-plans/current.ts` (nowy), `src/types.ts`.

**Intent:** Pozwolić użytkownikowi sprawdzić wynik bez ponownego wywołania AI i bez opuszczania formularza.

**Contract:** Uwierzytelniony GET JSON przyjmuje dokładnie jeden identyfikator: `planId` dla rewizji albo `intakeId` dla generowania. Zwraca wyłącznie właścicielowi bieżące metadane `id`, `intakeId`, `updatedAt`, `revisionCount`, `status` albo brak planu; bez treści zdrowotnych. Dla obcych/nieistniejących celów jednolita odpowiedź bez ujawniania istnienia. Brak cache, zod, `prerender = false`, wspólny limit 10 s całego serwerowego sprawdzenia, obejmujący auth. Odczyt nie nazywa wyniku statusem zakończonego zadania.

#### 4. Diagnostyka i komunikaty fallback

**Files:** `src/lib/plan-operation.ts`, `src/pages/dashboard.astro`, endpointy powyżej.

**Intent:** Pozwalać wskazać etap oczekiwania i usunąć fałszywe zapewnienie o braku zapisu.

**Contract:** Logować start/koniec etapów auth, read, ai, write i operacji, duration, kontrolowany kod wyniku oraz losowy requestId generowany przez serwer. Bez promptów, odpowiedzi AI, formularzy, cookies, kluczy i identyfikatorów użytkownika. DTO zwraca korelację, jeśli serwer odpowiedział. Dashboard rozpoznaje nowe kody fallback; ogólny błąd zapisu nie mówi „plan nie został zmieniony”. Logi dashboardu nie są warunkiem dostarczenia błędu interaktywnego POST.

### Success Criteria

#### Automated Verification

- Kontrole statyczne i build przechodzą: `npx astro sync`, `npx astro check`, `npm run lint`, `npm run build`.

#### Manual Verification

- JSON i fallback zachowują auth, Origin i walidację; JSON nie przekierowuje, a kontrolowane błędy mają poprawny status i outcome.
- Opóźnienie przed zapisem kończy operację bez rozpoczęcia zapisu; utrata odpowiedzi po wysłaniu zapisu daje unknown, z korelacją etapów bez danych użytkownika.
- Sprawdzenie planu jest ograniczone czasowo, nie wywołuje AI i nie ujawnia cudzych danych.

**Implementation Note:** Po automatycznych kontrolach uzyskać potwierdzenie manualnych kryteriów tej fazy przed przejściem dalej. Checkboxy wyłącznie w Progress.

## Phase 2: Formularze i odzyskiwanie po błędzie

### Overview

Wprowadzić jednakowe zakończenie oczekiwania w obu formularzach oraz ręczną ścieżkę sprawdzania wyniku.

### Changes Required

#### 1. Obsługa wysyłania i stanów

**Files:** `src/components/plans/PlanGenerationForm.tsx` (nowy), `src/components/plans/PlanRevisionForm.tsx`, `src/components/hooks/usePlanOperation.ts` (nowy), `src/pages/dashboard.astro`.

**Intent:** Użyć interaktywnej wyspy dla generowania i wspólnego hooka do wysyłania, limitów i odzyskiwania obu formularzy.

**Contract:** Stany idle, pending, saved, error, unknown, checking oraz wynik sprawdzenia. Wysyłanie FormData z JSON Accept i sesją same-origin, blokada wielokrotnego submitu, deadline 90 s również dla body. Odrzucić HTML, nieoczekiwany redirect i niepoprawny DTO; bez potwierdzenia traktować wynik jako unknown. Tylko aktywna próba może zmieniać stan; ignorować późne odpowiedzi po deadline i czyścić timery/listenery przy unmount. Obsłużyć powrót z historii i wznowienie karty przez weryfikację czasu i unieważnienie nieaktualnej próby.

Pola poprawki pozostają w pamięci, bez localStorage/sessionStorage i bez umieszczania ich w URL; zamrozić edycję podczas pending, po błędzie ją przywrócić. Nowy komponent generation otrzymuje intakeId. Usunąć wyłącznie generation ze wspólnego skryptu natywnych formularzy; zachować akceptację. Przed hydratacją pozostaje natywny fallback, dla którego nie obiecujemy limitu UI podczas awarii nawigacji; limit serwera nadal obowiązuje.

#### 2. Informacja o wyniku i ponowienie

**Files:** oba formularze, wspólny hook, opcjonalny współdzielony komponent komunikatu w `src/components/plans/`.

**Intent:** Dać użytkownikowi jasny następny krok bez utraty tekstu i fałszywego sukcesu.

**Contract:** Pending używa role=status i zapowiada do 90 s. Błąd używa role=alert z dostępnym przeniesieniem fokusu na komunikat. Not-saved pozwala ręcznie ponowić po usunięciu przeszkody. Unknown: „Nie udało się potwierdzić wyniku. Plan mógł zostać zapisany. Sprawdź aktualny plan przed ponowieniem.” Pokazać przycisk „Sprawdź aktualny plan”; kolejny POST zablokowany do udanego sprawdzenia.

Sprawdzenie ma własny limit UI 15 s (serwer 10 s); jego awaria zachowuje unknown i umożliwia ponowienie odczytu. Dla generowania istniejący plan oznacza link do panelu, brak planu umożliwia ręczny POST dla tego samego intake. Dla rewizji niezmieniona wersja umożliwia ręczny POST z pierwotnym tokenem; komunikat nie twierdzi, że stara próba na pewno się zakończyła. Zmieniona wersja blokuje powtórzenie starej poprawki i udostępnia przegląd aktualnego planu w nowej karcie, co zachowuje wpisane pola w starej. Nową poprawkę użytkownik rozpoczyna świadomie z aktualnego panelu.

Sukces POST kończy spinner natychmiast i pokazuje potwierdzenie zapisu z linkiem „Zobacz aktualny plan”. Bez automatycznej nawigacji: nawet opóźniony GET dashboardu nie ukryje potwierdzenia. Formularz zakończonej operacji nie pozwala ponownie zastosować tej samej poprawki. Wygaśnięta sesja pokazuje link logowania, bez automatycznego ponowienia.

### Success Criteria

#### Automated Verification

- Kontrole statyczne i build przechodzą: `npx astro sync`, `npx astro check`, `npm run lint`, `npm run build`.

#### Manual Verification

- Oba formularze kończą oczekiwanie po osiągnięciu 90 s w aktywnej karcie, pokazują dostępny komunikat i zachowują pola poprawki.
- Unknown wymaga udanego odczytu przed ponowieniem; zmieniona wersja nie otrzymuje automatycznie starej poprawki, a awaria odczytu nie odblokowuje POST.
- Sukces jest widoczny bez nawigacji; wielokrotny submit, późna odpowiedź, powrót z historii i natywny fallback nie powodują regresji akceptacji.

**Implementation Note:** Po automatycznych kontrolach uzyskać potwierdzenie manualnych kryteriów tej fazy przed przejściem dalej.

## Phase 3: Weryfikacja obu przepływów

### Overview

Udokumentować dowody zakończenia oczekiwania i zachowania danych w scenariuszach awarii, bez wdrażania oddzielnej infrastruktury testowej.

### Changes Required

#### 1. Macierz odbioru i dowody

**File:** `context/changes/plan-generation-hang/verification.md` (nowy podczas implementacji).

**Intent:** Zapisać środowisko, commit, scenariusz, obserwowany czas i wynik UI/bazy, aby oddzielić sprawdzone zachowanie od założeń.

**Contract:** Wykonać macierz Testing Strategy dla generowania i poprawki. Używać syntetycznych danych i kontrolowanych awarii lokalnie; nie wprowadzać awarii na produkcji. Zanotować metodę wymuszenia każdej awarii i ograniczenia pomiaru. Weryfikacja produkcji wymaga dostępnej wdrożonej wersji; jej brak oznacza niewykonany odbiór produkcyjny, nie blokuje lokalnej poprawki i nie upoważnia do deployu.

#### 2. Przekazanie scenariuszy do rollout jakości

**File:** `context/changes/plan-generation-hang/verification.md`.

**Intent:** Przekazać kontrakty do przyszłych testów integration + interaction przewidzianych w `context/foundation/test-plan.md`.

**Contract:** Wskazać scenariusze i granice mockowania (dostawca/transport), bez testowania kopii logiki aplikacji. Nie zmieniać zamrożonej strategii ani statusów osobnej zmiany `testing-generation-error-handling`; jej katalog nie istniał podczas planowania, mimo wpisu „change opened” w strategii.

### Success Criteria

#### Automated Verification

- Końcowe kontrole przechodzą: `npx astro sync`, `npx astro check`, `npm run lint`, `npm run build`, `git diff --check`.
- Dokument odbioru istnieje: `test -s context/changes/plan-generation-hang/verification.md`.

#### Manual Verification

- Macierz awarii obu przepływów ma zapisane wyniki, czasy i obserwacje bazy; brak fałszywych zapewnień o rollbacku.
- Równoległa lub spóźniona poprawka z tym samym tokenem zapisuje najwyżej jedną rewizję, a generowanie dla jednego intake nie tworzy duplikatów.
- Happy path poprawki i generowania oraz akceptacja nadal działają; ograniczenia weryfikacji produkcyjnej są jawnie zapisane.

**Implementation Note:** Po kontrolach automatycznych uzyskać potwierdzenie odbioru manualnego. Nie oznaczać nieprzeprowadzonych scenariuszy jako wykonanych.

## Testing Strategy

### Unit / Integration Handoff

Runner i test code pozostają poza tą zmianą zgodnie z zaakceptowanym podziałem i granicami lekcji. Przyszłe testy powinny weryfikować deadline, klasyfikację wyniku, propagację auth, brak kontynuacji zapisu po deadline oraz zachowanie UI na granicy transportu. Faktycznej atomowości RPC nie dowodzi mock bazy.

### Manual Testing Steps

1. Na syntetycznym koncie wygenerować plan i wykonać poprawkę; potwierdzić zapis, stan draft oraz poprawną akceptację.
2. Dla obu POST wymusić opóźnienie auth, odczytu przed AI, nagłówków AI i body AI. Potwierdzić ograniczone oczekiwanie i brak późniejszego zapisu po zakończeniu przed write.
3. Wymusić błędny JSON AI, truncation i błąd schematu. Potwierdzić błąd zamiast sukcesu, bez zapisu.
4. Odłączyć sieć lub utracić odpowiedź po wysłaniu zapisu; sprawdzić unknown, zachowane pola i blokadę ponownego POST do odczytu.
5. Sprawdzić wynik: istniejący/nieistniejący plan, zmieniony/niezmieniony token, niedostępny odczyt i wygaśnięta sesja. Nie przypisywać niezmienionemu odczytowi gwarancji zakończenia poprzedniej próby.
6. Puścić późny zapis i ręczne ponowienie z tą samą wersją. Zweryfikować w bazie liczbę rewizji oraz atomowość ograniczeń/planu. Oddzielnie sprawdzić wyścig generowania dla tego samego intake.
7. Sprawdzić podwójny submit, późną odpowiedź po 90 s, powrót z historii, uśpienie/wznowienie karty, HTML zamiast JSON i wolny dashboard po sukcesie.
8. Sprawdzić brak/obcy Origin, brak sesji, obcy plan/intake, brak cache odpowiedzi i brak treści użytkownika w logach.
9. Sprawdzić klawiaturę, ogłaszanie komunikatów, zachowanie tekstu oraz fallback bez JS. Zanotować, że limit renderu UI dotyczy uruchomionej obsługi JS w aktywnej karcie.

## Performance Considerations

Limit 90 s jest granicą oczekiwania, nie gwarancją wygenerowania planu. Skrócenie budżetu AI do maksymalnie 70 s może zwiększyć liczbę kontrolowanych timeoutów. Pomiary etapów pozwolą ocenić ten koszt bez zmiany uzgodnionego limitu. Ręczne sprawdzenie dodaje pojedynczy odczyt; brak cyklicznego polling. Ponowienia mogą zużyć dodatkowe AI, choć dotychczasowe mechanizmy zapisu chronią przed duplikacją danych.

## Migration Notes

Bez migracji bazy i nowych sekretów. Wymagane istniejące migracje planów/RPC w środowisku odbioru. Rollback kodu nie zmienia zapisanych planów. Endpointy i UI wdrażać razem; zachowany fallback ułatwia przejście, ale nie ustanawia gwarancji 90 s bez JS. W tej zmianie nie wykonywać deploymentu.

## Open Risks & Assumptions

- Przyczyna zgłoszonego runtime hang i commit produkcyjny są niepotwierdzone; plan świadomie usuwa potwierdzone luki, zgodnie z wyborem użytkownika.
- Anulowanie transportu nie zatrzymuje pewnie już rozpoczętej transakcji; konserwatywny outcome i kontrola wersji są wymagane.
- Do manualnego odbioru potrzebne są lokalny backend, syntetyczne dane i możliwość kontrolowania odpowiedzi zależności. Niedostępny scenariusz pozostaje niewykonany.
- Pola zachowujemy w istniejącym formularzu, nie po zamknięciu/reloadzie strony; przegląd aktualnego planu otwiera się osobno.

## References

- `context/changes/plan-generation-hang/research.md` — baseline i historia.
- `context/foundation/test-plan.md` — ryzyka #1/#5 i osobny rollout runnera.
- `src/lib/services/training-plans.ts:386`, `:414`, `:436`, `:469`, `:490` — unikalność, token i niepewny wynik zapisu.
- `supabase/migrations/20260812235500_add_training_plan_revision_summary.sql:77` — atomowość rewizji.
- `supabase/migrations/20260912120000_enforce_training_plan_lifecycle_boundary.sql:4` — istniejąca granica uprawnień.

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: API, limity i diagnostyka

#### Automated

- [x] 1.1 Kontrole statyczne i build przechodzą: `npx astro sync`, `npx astro check`, `npm run lint`, `npm run build`. — 067c883

#### Manual

- [x] 1.2 JSON i fallback zachowują auth, Origin i walidację; JSON nie przekierowuje, a kontrolowane błędy mają poprawny status i outcome. — 067c883
- [x] 1.3 Opóźnienie przed zapisem kończy operację bez rozpoczęcia zapisu; utrata odpowiedzi po wysłaniu zapisu daje unknown, z korelacją etapów bez danych użytkownika. — 067c883
- [x] 1.4 Sprawdzenie planu jest ograniczone czasowo, nie wywołuje AI i nie ujawnia cudzych danych. — 067c883

### Phase 2: Formularze i odzyskiwanie po błędzie

#### Automated

- [x] 2.1 Kontrole statyczne i build przechodzą: `npx astro sync`, `npx astro check`, `npm run lint`, `npm run build`. — c977c53

#### Manual

- [x] 2.2 Oba formularze kończą oczekiwanie po osiągnięciu 90 s w aktywnej karcie, pokazują dostępny komunikat i zachowują pola poprawki. — c977c53
- [x] 2.3 Unknown wymaga udanego odczytu przed ponowieniem; zmieniona wersja nie otrzymuje automatycznie starej poprawki, a awaria odczytu nie odblokowuje POST. — c977c53
- [x] 2.4 Sukces jest widoczny bez nawigacji; wielokrotny submit, późna odpowiedź, powrót z historii i natywny fallback nie powodują regresji akceptacji. — c977c53

### Phase 3: Weryfikacja obu przepływów

#### Automated

- [x] 3.1 Końcowe kontrole przechodzą: `npx astro sync`, `npx astro check`, `npm run lint`, `npm run build`, `git diff --check`.
- [x] 3.2 Dokument odbioru istnieje: `test -s context/changes/plan-generation-hang/verification.md`.

#### Manual

- [x] 3.3 Macierz awarii obu przepływów ma zapisane wyniki, czasy i obserwacje bazy; brak fałszywych zapewnień o rollbacku.
- [x] 3.4 Równoległa lub spóźniona poprawka z tym samym tokenem zapisuje najwyżej jedną rewizję, a generowanie dla jednego intake nie tworzy duplikatów.
- [x] 3.5 Happy path poprawki i generowania oraz akceptacja nadal działają; ograniczenia weryfikacji produkcyjnej są jawnie zapisane.
