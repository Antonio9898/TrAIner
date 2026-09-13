# Odbiór fazy 1 — API, limity i diagnostyka

Data: 2026-09-13. Odbiór wykonał Codex na bezpośrednie polecenie użytkownika „zrob to za mnie”.

## Środowisko i zakres

- Bazowy commit: `a9abbe8` plus niezacommitowana implementacja fazy 1.
- Osobna kopia aplikacji: `/private/tmp/trainer-phase1-aTAygN`, Astro 7.3.2 / workerd, Node 22.14.0, adres `http://127.0.0.1:4324`.
- Rzeczywisty lokalny Supabase: auth, PostgreSQL, PostgREST i istniejące RLS/RPC. Utworzono odrębne syntetyczne konta właściciela i obcego użytkownika. Klucz administracyjny służył wyłącznie do przygotowania danych i niezależnego odczytu stanu bazy; żądania aplikacji używały zwykłych sesji cookie.
- Lokalna baza miała migracje do `20260821180722`. Przed odbiorem zastosowano istniejącą migrację `20260912120000_enforce_training_plan_lifecycle_boundary.sql` i odnotowano ją jako zastosowaną w lokalnej historii migracji.
- Nie zmieniano zdalnego Supabase ani produkcyjnego wdrożenia. Trzy wywołania rzeczywistego OpenRouter zawierały wyłącznie syntetyczny kontekst.
- Porównanie `src/` z kopią potwierdziło jedną różnicę: adres transportu OpenRouter skierowano do lokalnego proxy. Pozostały kod aplikacji był identyczny. Supabase URL/klucze zmieniono tylko w środowisku kopii.
- Proxy na porcie 54330 przekazywało żądania do lokalnego Supabase. W trybie live przekazywało AI do rzeczywistego dostawcy; w pozostałych trybach zwracało kontrolowaną odpowiedź lub wymuszało awarię transportu. Nie zmieniano logiki endpointów, timeoutów, walidacji ani RPC.

## Wynik

Końcowa sesja diagnostyczna: **42/42 kontrole zakończone powodzeniem**. Dodatkowo wykonano pierwsze generowanie z rzeczywistym AI, zaobserwowano prawidłowo obsłużony timeout rzeczywistej poprawki i sprawdzono dashboard oraz natywną poprawkę w Chrome.

Czas mierzono od rozpoczęcia HTTP do odczytania body odpowiedzi. Obejmuje lokalny narzut transportu, dlatego wartości mogą nieznacznie przekraczać nominalny limit.

| Scenariusz                                                  | Przepływ                    | Obserwowany wynik                                           | Czas              |
| ----------------------------------------------------------- | --------------------------- | ----------------------------------------------------------- | ----------------- |
| Rzeczywiste AI: generowanie                                 | generate                    | 200 / saved; draft zapisany i widoczny na dashboardzie      | 13,785 s          |
| Rzeczywiste AI: poprawka pierwszego, dłuższego planu        | revise                      | 504 / operation-timeout / not-saved; brak nowej rewizji     | 70,127 s          |
| Rzeczywiste AI: poprawka krótszego planu                    | revise                      | 200 / saved; nowy token i revision_count +1                 | 26,817 s          |
| Kontrolowana poprawna odpowiedź AI                          | generate                    | 200 / saved; rzeczywisty zapis draft                        | 0,123 s           |
| Brak sesji                                                  | generate                    | 401 / signin-required / not-saved; JSON bez redirectu       | 0,057 s           |
| Brak lub obcy Origin                                        | generate / revise           | 403 / request-not-allowed / not-saved                       | 0,049–0,062 s     |
| Niepoprawne dane                                            | generate / revise / current | 400 / invalid-request; bez redirectu                        | 0,074–0,089 s     |
| Obca ankieta / obcy plan                                    | generate / revise           | 400 missing-intake / 409 plan-conflict; bez zapisu          | 0,074–0,078 s     |
| Odczyt własnego planu                                       | current                     | 200; tylko id, intakeId, updatedAt, revisionCount, status   | 0,131 s           |
| Obcy plan, obca ankieta, nieistniejący plan                 | current                     | We wszystkich przypadkach 200 i plan: null; brak wywołań AI | 0,079–0,086 s     |
| Natywna walidacja                                           | revise                      | 303 do dashboardu z invalid-request; no-store               | —                 |
| Natywne generowanie bez intakeId                            | generate                    | 303; zapis dla najnowszej ankiety                           | —                 |
| Ponowienie ze starym intakeId po utworzeniu nowszej ankiety | generate                    | Ten sam plan, bez dodatkowego AI                            | —                 |
| Auth opóźnione o 12 s                                       | generate / revise           | 504 / not-saved; zero AI i zapisów                          | 10,057 / 10,067 s |
| Odczyt opóźniony o 12 s                                     | generate / revise           | 504 / not-saved; zero AI i zapisów                          | 10,142 / 10,131 s |
| Niepoprawny JSON odpowiedzi dostawcy                        | generate / revise           | 502 / not-saved; zero zapisów                               | 0,131 / 0,087 s   |
| Niedostępny auth (503)                                      | generate / revise           | 503 / not-saved, odróżnione od braku sesji                  | 0,047 / 0,049 s   |
| Niedostępny odczyt (503)                                    | generate / revise           | 503 / not-saved; także po retry SDK bez zapisów             | 7,100 / 7,163 s   |
| Zerwanie odpowiedzi po zakończonym zapisie                  | generate / revise           | 503 / unknown; zapis rzeczywiście istnieje                  | 0,134 / 0,099 s   |
| Zatrzymanie body odpowiedzi po zakończonym zapisie          | generate / revise           | 504 / unknown; zapis rzeczywiście istnieje                  | 10,091 / 10,095 s |
| Odczyt wyniku po powyższych awariach                        | current                     | 200; metadane zgodne z niezależnym odczytem bazy            | 0,075–0,123 s     |
| Nagłówki AI opóźnione o 72 s                                | generate                    | 504 / not-saved; brak późnego zapisu                        | 70,134 s          |
| Nagłówki AI dostępne, body opóźnione o 72 s                 | generate                    | 504 / not-saved; brak późnego zapisu                        | 70,182 s          |
| Auth opóźnione podczas sprawdzania wyniku                   | current                     | Wspólny limit 10 s obejmuje auth; 504, zero AI              | 10,056 s          |
| Dwie równoległe poprawki z tym samym tokenem                | revise                      | Statusy 200 i 409; revision_count zwiększony dokładnie o 1  | —                 |
| Dwa równoległe generowania dla tego samego intake           | generate                    | Dwa sukcesy wskazują ten sam plan                           | —                 |
| Akceptacja po poprawkach                                    | accept                      | Dotychczasowe 302; stan accepted potwierdzony w bazie       | —                 |

W kontrolach błędów JSON sprawdzono także `Cache-Control: no-store` i brak przekierowania.

## Metoda wymuszania awarii i dowody zapisu

1. Opóźnienia auth/odczytu wprowadzano na granicy HTTP przed przekazaniem do lokalnej usługi. Po timeoutach odczekiwano dodatkowe 2,5 s, aż minie opóźnienie 12 s. Stan planu był identyczny jak przed próbą, a licznik żądań write w proxy wynosił zero.
2. Przy utracie odpowiedzi proxy najpierw czekało na zakończenie prawdziwego insert/RPC i odczyt jego odpowiedzi, po czym zrywało połączenie z aplikacją. Przy zatrzymaniu body przekazywało nagłówki i pierwszy bajt, a resztę dopiero po 12 s. Niezależny odczyt PostgreSQL przez lokalny Supabase potwierdzał zapis mimo wyniku unknown.
3. Dla timeoutów AI proxy kończyło odpowiedź dopiero po 72 s. Po zakończeniu oczekiwania aplikacji odczekiwano 2,5 s i sprawdzano brak planu oraz zero prób write. To potwierdza brak kontynuacji do zapisu po spóźnionej odpowiedzi w tych scenariuszach.
4. Równoległe żądania używały rzeczywistego RPC i ograniczenia unikalności w lokalnym PostgreSQL. Ich atomowości nie oceniano na mocku bazy.
5. Skorelowane logi zawierały requestId, etap, start/end, czas i kontrolowany kod. Przejrzane logi nie zawierały syntetycznych pól formularzy, treści planu ani tokenów. Diagnostyka dostawcy i SDK może dodatkowo zawierać komunikaty błędów bez wartości credentials.

## Sprawdzenie w przeglądarce

Chrome, osobna karta kopii lokalnej:

- Zalogowano się na syntetyczne konto i potwierdzono wyrenderowanie planu utworzonego przez rzeczywiste AI.
- Rozwinięto formularz poprawki, wpisano syntetyczną prośbę i wysłano zwykły formularz.
- Potwierdzono przejście do `/dashboard?planAction=revised`, komunikat „Plan został zmieniony”, nagłówek „Zmieniony szkic planu”, jedną rewizję oraz podsumowanie zmiany. Ten dodatkowy przebieg używał kontrolowanej odpowiedzi AI i rzeczywistego zapisu.

## Ograniczenia i dalsze fazy

- Pierwsza próba poprawki z rzeczywistym AI nie zakończyła się sukcesem dostawcy; poprawnie zadziałał limit 70 s. Kolejna próba na krótszym planie zakończyła się sukcesem. Nie jest to potwierdzenie usunięcia przyczyny pierwotnego incydentu.
- To odbiór fazy 1. Nie sprawdzono jeszcze przyszłego interaktywnego UI z fazy 2: limitu 90 s przy formularzu, zachowania pól po błędzie, blokady ponowienia po unknown, wznowienia karty ani historii nawigacji.
- Kontrolowane timeouty nagłówków/body AI wykonano dla generate; revise przeszło rzeczywisty timeout AI oraz kontrolowane timeouty auth/odczytu/zapisu. Pełna macierz fazy 3 pozostaje osobnym odbiorem.
- Nie wymuszano osobno truncation, błędu schematu wewnętrznego JSON planu ani błędu mapowania rekordu po zapisie. Nie wykonywano oceny semantyki lub medycznego bezpieczeństwa treści AI.
- Nie wykonano deploymentu ani odbioru wersji produkcyjnej.
- Tymczasowe skrypty diagnostyczne są poza repozytorium; nie dodano runnera ani stałego zestawu testów. Docelowe testy powinny mockować granicę transportu AI i używać rzeczywistej lokalnej bazy do RLS, RPC oraz unikalności.
- Lokalne syntetyczne dane zachowano. Nie resetowano ani nie usuwano istniejących danych lokalnych.

## Odbiór fazy 2 — formularze i odzyskiwanie

Data: 2026-09-13. Codex wykonał odbiór na polecenie użytkownika „do manual verification for me”. Baza kodu: `75189ac` plus robocza implementacja fazy 2, w tym poprawka historii opisana poniżej.

### Środowisko i metoda

- Przeglądarka Codex In-app Browser (Chromium), sterowanie przez CUA, rzeczywiste formularze React/Astro. Sprawdzono także DOM, role dostępności, fokus i widok komunikatu sukcesu.
- Izolowana kopia `/private/tmp/trainer-phase1-aTAygN`, Astro/workerd na `127.0.0.1:4324`, proxy transportu UI na `127.0.0.1:4325`, proxy zależności na `127.0.0.1:54330` i rzeczywisty lokalny Supabase na `127.0.0.1:54321`. Uruchomiono istniejące zatrzymane kontenery bazy, auth, REST i Kong, bez resetowania danych.
- Nowe syntetyczne konto i trzy ankiety. AI zwracało kontrolowany syntetyczny plan; w tym odbiorze nie wywoływano rzeczywistego dostawcy ani produkcji. Zapisy insert/RPC i odczyty kontrolne wykonywała rzeczywista lokalna baza.
- Porównanie `src/` z kopią: jedyna różnica poza identyczną implementacją to adres OpenRouter kierujący do lokalnego proxy. Nie skracano timerów ani nie zastępowano logiki hooka. Proxy przekazywało cookies i mapowało lokalny Origin do portu aplikacji.
- Opóźnienia mierzono zegarem ściennym. Czas od przyjęcia HTTP przez lokalne proxy do obserwacji zmiany DOM obejmuje planowanie zadań JS i narzut obserwacji; nie jest ścisłym SLA renderowania przeglądarki.

### Wyniki

| Scenariusz | Wynik / dowód |
| --- | --- |
| Generowanie bez odpowiedzi HTTP | Po około 91 s (90,987 s od przyjęcia przez proxy do obserwacji DOM) ostrzeżenie unknown, role=alert, fokus na komunikacie, brak spinnera; POST zablokowany. |
| Sprawdzenie bez odpowiedzi | Po 15,002 s ostrzeżenie o nieudanym sprawdzeniu, ponowny odczyt dostępny, POST nadal zablokowany. |
| Generowanie: brak planu po udanym odczycie | Ręczny retry odblokowany; komunikat nie zapewnia, że poprzednia próba się zakończyła. |
| Generowanie: sukces po ręcznym retry | Komunikat zapisu i link w tej samej stronie bez nawigacji; submit wyłączony; w bazie jeden draft. |
| Poprawka: zapis zakończony, body odpowiedzi zatrzymane na 95 s | Ostrzeżenie unknown po 90,007 s; oba pola zachowane i ponownie edytowalne; fokus na role=alert; przycisk wysyłania zablokowany. Baza potwierdziła revision_count +1 mimo unknown. |
| Późne zakończenie body poprawki | Po ponad 95 s nadal unknown; późna odpowiedź nie zmieniła stanu na saved. |
| Zamrożenie edycji w pending | Oba textarea miały readOnly=true, submit disabled; po błędzie readOnly=false, identyczna treść. |
| Wygaśnięta sesja podczas odczytu | Kontrolowane 401 daje link logowania w nowej karcie; tekst zachowany, POST zablokowany, wymagane ponowne sprawdzenie. |
| Poprawka: zmieniona wersja | Udany rzeczywisty odczyt wykrył nową wersję; stara poprawka pozostała zablokowana. Link otworzył osobną kartę z aktualnym planem; w starej pozostał wpisany tekst. |
| Poprawka: niezmieniona wersja | Po HTML zamiast JSON udany rzeczywisty odczyt pozwolił ręcznie ponowić z pierwotną wersją; retry zapisał dokładnie jedną rewizję. |
| HTML, niepełny DTO sukcesu, przekierowanie 303 | HTML sprawdzono w poprawce; niepełny JSON i redirect w generowaniu. Każdy wynik był unknown; brak automatycznej nawigacji i ponowienia. |
| Podwójny submit | Dblclick w poprawce i generowaniu dał po jednym POST w proxy; podwójne kliknięcie udanej poprawki zwiększyło revision_count o 1. |
| Potwierdzony błąd przed zapisem | Niepoprawna odpowiedź dostawcy w generowaniu dała komunikat błędu przy formularzu i dostępny ręczny retry, bez obowiązku odczytu. |
| Utrata odpowiedzi generowania po zapisie | Zerwano transport po rzeczywistym zapisie; UI pokazało unknown. Późniejszy odczyt znalazł plan, udostępnił link i nie odblokował POST. |
| Zawieszenie/wznowienie karty | Przez CDP zamrożono kartę z pending na 101,352 s. Po przywróceniu stanu active od razu ostrzeżenie, pola zachowane, POST zablokowany. To test cyklu życia karty, nie fizycznego uśpienia komputera. |
| Powrót z historii | Wykryto i poprawiono lukę rehydratacji opisanej niżej. Końcowy rzeczywisty back/forward z nową wersją hooka wymaga odczytu i blokuje wysłanie. |
| Obsługa klawiatury | Enter uruchamia sprawdzenie i późniejsze wysłanie poprawki; końcowy zapis potwierdzony w UI i bazie. |
| Natywny fallback bez JS | Lokalny proxy dodał CSP script-src 'none'. Generowanie zakończyło się przekierowaniem z planAction=generated; poprawka z planAction=revised i zmianą accepted → draft; treść i licznik potwierdzone w panelu. |
| Akceptacja | Po interaktywnej poprawce odczytano aktualny panel i zaakceptowano draft. Widoczny komunikat, status ACCEPTED i linki zapisu treningów. |

### Znaleziony i poprawiony problem

Powrót z historii nie zawsze przywraca żywy dokument przez BFCache. Przeglądarka może ponownie hydratować HTML; wtedy zdarzenie pageshow wystąpi przed inicjalizacją hooka. Początkowy kod pozostawiał formularz idle i odblokowany. Hook teraz dodatkowo odczytuje `PerformanceNavigationTiming.type` podczas montowania i dla `back_forward` wymaga sprawdzenia planu.

Pierwszy retest był niemiarodajny: dev server nadal serwował starą wersję modułu, a brak przekazywania WebSocket przez proxy powodował automatyczne przeładowania. Dodano przekazywanie WebSocket w tymczasowym proxy, zrestartowano izolowany dev server, potwierdzono obecność poprawki w serwowanym module i ponowiono nawigację. Końcowy formularz po powrocie pokazał unknown i zablokowany submit. Po udanym odczycie i ręcznym wysłaniu klawiaturą zapis działał poprawnie.

### Zakres potwierdzenia i ograniczenia

- Odbiór dotyczy fazy 2; nie zamyka pełnej macierzy awarii dostawcy, prywatności i współbieżności fazy 3. Nie dodano runnera ani stałych testów do repozytorium.
- Nie przeprowadzono fizycznego usypiania urządzenia, testu z czytnikiem ekranu ani odbioru produkcyjnego. Role status/alert, fokus i klawiaturę sprawdzono w DOM i przeglądarce.
- Powrót z historii w badanej przeglądarce odtwarzał dokument z ponowną hydratacją; rzeczywistego przywrócenia BFCache nie wymuszano. Pola są zachowywane w istniejącym formularzu; pełne przeładowanie dokumentu nadal może je utracić zgodnie z granicą planu.
- Timery działają według rzeczywistego czasu JS; niewielkie opóźnienie planowania/obserwacji nie oznacza, że oczekiwanie trwa do zakończenia transportu. Nie zmieniano nominalnych limitów 90 s i 15 s.
- Nie wykonano deploymentu. Syntetyczne dane pozostawiono w lokalnej bazie.
