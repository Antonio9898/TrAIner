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

## Odbiór fazy 3 — macierz i przekazanie do rollout jakości

Data: 2026-09-13. Kod aplikacji: `c977c53d8513e1a1497f6adb7db90d162c505be3`.
Faza 3 nie zmienia kodu aplikacji. Poniższy odbiór łączy wcześniejsze dowody
faz 1–2 z uzupełniającą diagnostyką HTTP fazy 3; nie przedstawia wcześniejszych
obserwacji UI jako ponownie wykonanych.

### Środowisko i odtwarzalność

- Node 22.14.0, Astro 7.3.2/workerd, kopia `/private/tmp/trainer-phase1-aTAygN`,
  aplikacja `http://127.0.0.1:4324`, proxy zależności `http://127.0.0.1:54330`,
  rzeczywisty lokalny Supabase `http://127.0.0.1:54321`.
- `diff -qr src /private/tmp/trainer-phase1-aTAygN/src` wykazał wyłącznie zmianę
  adresu OpenRouter na lokalne proxy. Timery, walidacja, endpointy i RPC są rzeczywiste.
- Nowe syntetyczne konta i ankiety; cookie właściciela i obcego użytkownika.
  Uprawnienia administracyjne użyto tylko do przygotowania danych i niezależnych
  odczytów kontrolnych. Nie kasowano istniejących danych.
- AI w fazie 3 jest kontrolowaną odpowiedzią proxy. Nie wywoływano rzeczywistego
  dostawcy. Etykieta `live-revise` odziedziczona w skrypcie oznacza w tym przebiegu
  tryb `stub`, a nie rzeczywiste AI.
- Diagnostyka korzysta z istniejącego skryptu odbioru, dostosowanego poza repo:
  `verify-phase3.mjs`, `proxy-phase3.mjs`, `atomic-phase3.mjs` w katalogu kopii.
  Wyniki robocze: `/private/tmp/trainer-phase3-results.jsonl`.
  Pliki tymczasowe nie są trwałą infrastrukturą testową; dowody podsumowano tutaj.
- Pierwsze uruchomienie zatrzymało się przed scenariuszami na HTTP 500 logowania:
  nieaktualny cache optymalizatora Vite wskazywał nieistniejący moduł. Restart
  lokalnego serwera kopii przywrócił działanie. Nie zmieniano kodu produktu.
- Czas HTTP obejmuje od wysłania do odczytu całego body. Obserwacje UI z fazy 2
  obejmują również narzut obserwacji DOM; nie są gwarancją precyzji renderu.

### Macierz pokrycia Testing Strategy

| Punkt planu | Generowanie | Poprawka | Dowód i ograniczenie |
| --- | --- | --- | --- |
| 1. Happy path, draft, akceptacja | Fazy 1–2; HTTP ponowione w fazie 3 | Fazy 1–2; HTTP ponowione w fazie 3 | Rzeczywiste insert/RPC i niezależny odczyt statusu. AI kontrolowane w fazach 2–3. |
| 2. Opóźnione auth i read | Faza 1: 10,057 / 10,142 s | Faza 1: 10,067 / 10,131 s | Proxy opóźniało transport o 12 s; po dodatkowych 2,5 s zero write i brak zmiany bazy. |
| 2. Opóźnione nagłówki i body AI | Faza 1: 70,134 / 70,182 s | Uzupełnienie fazy 3 poniżej | Odpowiedź po 72 s; po dodatkowych 2,5 s sprawdzenie braku późniejszego write. |
| 3. Błędny JSON dostawcy | Faza 1 | Faza 1 | HTTP 502/not-saved, zero write. |
| 3. Truncation, JSON treści, schemat | Faza 3 | Faza 3 | Kontrolowane odpowiedzi HTTP 200 dostawcy; API musi odrzucić treść bez zapisu. |
| 4. Utrata odpowiedzi po zapisie | Fazy 1–3 | Fazy 1–3 | HTTP unknown mimo potwierdzonego zapisu w bazie. Stan UI i blokada POST: faza 2. |
| 5. Odczyt istniejącego/nieistniejącego planu, token, awaria, sesja | Fazy 1–2 | Fazy 1–2 | Brak automatycznego POST. Niezmieniony odczyt nie dowodzi zakończenia poprzedniej próby. |
| 6. Równoległy i spóźniony zapis | Fazy 1 i 3 | Fazy 1 i 3 | Rzeczywista unikalność i RPC; dodatkowe wyniki poniżej. |
| 7. Podwójny submit, późne body, historia, wznowienie, HTML | Faza 2 | Faza 2 | Poszczególne warianty rozdzielono między formularze zgodnie z tabelą fazy 2; nie każdy wariant był wykonany osobno dla obu. |
| 7. Wolny dashboard po sukcesie | Sukces bez nawigacji: faza 2 | Sukces bez nawigacji: faza 2 | Nie wymuszano osobno opóźnienia dashboardu; to luka odbioru, nie zaliczony scenariusz. |
| 8. Origin, sesja, własność, no-store | Fazy 1 i 3 | Fazy 1 i 3 | W fazie 3 brak Origin/brak sesji dla generate, obcy Origin dla revise; wcześniejsze rozszerzenie opisane w fazie 1. |
| 8. Prywatność logów | Faza 1 | Faza 1 | Przegląd logów opisany wyżej; nie jest dowodem dla wszystkich możliwych błędów SDK. |
| 9. Klawiatura, komunikaty, tekst, fallback | Faza 2 | Faza 2 | DOM role/fokus i klawiatura; bez czytnika ekranu. Fallback bez JS wykonany dla obu. |

### Uzupełniające wyniki HTTP i bazy fazy 3

**44/44 kontrole HTTP zakończone powodzeniem**, dodatkowo oddzielna kontrola
spójności dwóch konkurujących zestawów danych. Żadnej z poniższych prób nie należy
traktować jako ponownego testu renderowania formularzy.

| Scenariusz | Generate | Revise | Wynik bazy / interpretacja |
| --- | --- | --- | --- |
| Kontrolowany happy path | 200/saved, 0,077 s | 200/saved, 0,072 s | Draft; poprawka zmienia token i zwiększa revision_count o 1. |
| Truncation (`finish_reason: length`) | 502/not-saved, 0,045 s | 502/not-saved, 0,042 s | Zero write; stan przed i po identyczny. |
| Niepoprawny JSON treści w poprawnej kopercie | 502/not-saved, 0,044 s | 502/not-saved, 0,038 s | Zero write; stan przed i po identyczny. |
| Niepoprawny schemat planu (`planContent: {}`) | 502/not-saved, 0,044 s | 502/not-saved, 0,038 s | Zero write; stan przed i po identyczny. |
| Zerwana odpowiedź po zakończonym write | 503/unknown, 0,056 s | 503/unknown, 0,044 s | Zapis istnieje; current po przywróceniu transportu zgodny z bazą. |
| Body write zatrzymane na 12 s | 504/unknown, 10,053 s | 504/unknown, 10,066 s | Zapis istnieje; current odpowiednio 0,079 / 0,066 s. |
| Nagłówki AI opóźnione o 72 s | Dowód fazy 1 | 504/not-saved, 70,058 s | Po dodatkowych 2,5 s zero write i niezmieniony rekord. |
| Body AI opóźnione o 72 s | Dowód fazy 1 | 504/not-saved, 70,096 s | Po dodatkowych 2,5 s zero write i niezmieniony rekord. |
| Write opóźnione przed przekazaniem do bazy o 12 s | 504/unknown, 10,092 s | 504/unknown, 10,087 s | Próba nadal może dotrzeć do bazy mimo zakończenia oczekiwania aplikacji. |
| Odczyt podczas powyższego opóźnienia | Brak planu, 0,093 s | Stary token, 0,075 s | Odczyt nie oznacza zakończenia poprzedniego write. |
| Ręczny retry po tym odczycie | 200, 0,078 s | 200, 0,065 s | Po kolejnych 2,5 s jeden plan dla intake / przyrost rewizji dokładnie 1. Pierwotny token zachowany. |
| Równoległe POST | 200 i 200, ten sam planId | 409 i 200, przyrost rewizji 1 | Rzeczywista unikalność/RPC; czas tej pary nie był rejestrowany. |
| Akceptacja po poprawkach | Wspólny plan | 302 | Stan accepted potwierdzony niezależnym odczytem bazy; czas nie był rejestrowany. |

`current` z auth opóźnionym o 12 s zakończył się 504 po 10,027 s, bez read/write/AI.
Ponownie sprawdzono prywatność metadanych, walidację, fallback 303 i zachowanie
pierwotnego intakeId po utworzeniu nowszej ankiety; szczegółowe zakresy macierzy
pozostają opisane wyżej.

Metoda późnego write: proxy zachowuje żądanie przez 12 s i przekazuje je do lokalnej
bazy także po abort klienta. Po otrzymaniu timeoutu przełączono przyszłe żądania na
zwykły transport, wykonano current i ponowienie z tą samą tożsamością/tokenem.
Po minięciu opóźnienia sprawdzono liczbę rekordów i rewizji. To dowód dla kolejności
„retry wygrywa przed spóźnionym write”; nie gwarancja rollbacku przy anulowaniu.

Oddzielna próba spójności wysłała jednocześnie dwie poprawki z różnymi syntetycznymi
wartościami ograniczeń i notatki (`Synthetic-A` / `Synthetic-B`), tym samym tokenem
oraz kontrolowanym planem AI. Obie odpowiedzi otrzymano po 0,051 s. Sprawdzono statusy 200/409, przyrost rewizji o 1
oraz zgodność `last_revision_note` i `health_constraints` z żądaniem zwycięzcy.
To obserwacja rzeczywistej bazy; wymuszenie błędu w środku transakcji nadal pozostaje
poza wykonanym odbiorem.

### Przekazanie do testów integration + interaction

Nie zmieniono `context/foundation/test-plan.md` ani statusu zmiany
`testing-generation-error-handling`. Poniższe kontrakty są wejściem do jej researchu
oraz wdrożenia runnera, a nie nową strategią jakości.

| Ryzyko | Kontrakt przyszłego testu | Granica kontrolowania zależności |
| --- | --- | --- |
| #1: nieograniczone oczekiwanie | W obu POST: auth/read ≤10 s, AI ≤70 s i pozostały budżet minus 10 s, operacja ≤85 s. Opóźnić również body oraz zależność ignorującą abort; po deadline nie może ruszyć write. | Transport auth/bazy/AI; wykonywać prawdziwe middleware i serwisy, nie kopię algorytmu timeoutu. |
| #1: UI nie kończy oczekiwania | Oba formularze: 90 s także dla body, unknown, zachowanie pól, fokus, brak późnej zmiany stanu, blokada podwójnego submitu; historia/BFCache i wznowienie. | HTTP w interakcji z rzeczywistym hookiem i komponentami. Kontrolowany zegar tylko w przyszłym runnerze; osobny smoke rzeczywistego czasu. |
| #1: niepewny zapis | Zerwać odpowiedź po insert/RPC; unknown, bez automatycznego retry. GET ≤10 s serwer/15 s UI, awaria nie odblokowuje POST. | Transport odpowiedzi, rzeczywista baza jako źródło wyniku zapisu. |
| #1: odczyt i retry | Generate zachowuje intakeId; revise zachowuje pierwotny expectedUpdatedAt. Niezmieniony token pozwala ręcznie ponowić; zmieniony blokuje starą poprawkę. | Odpowiedź GET kontrolowana na granicy HTTP; bez mockowania decyzji hooka. |
| #5: pozorny sukces | Błędna koperta JSON, JSON treści, truncation, schema, HTML, redirect i niepełny DTO nie dają saved ani nieuprawnionego zapisu. | Wyłącznie dostawca/transport; rzeczywiste parsowanie, walidacja i mapowanie odpowiedzi. |
| #2: nadpisanie/częściowy zapis | Dwa różne zestawy plan/ograniczenia z tym samym tokenem: najwyżej jedna rewizja, wszystkie dane zwycięzcy spójne; również spóźniony write i retry. Dodatkowo wymusić błąd transakcji po aktualizacji intake i sprawdzić rollback. | Rzeczywisty PostgreSQL/RPC i role. Mock bazy nie dowodzi atomowości. Wstrzyknięcie błędu transakcji tylko w izolowanej bazie testowej. |
| #4: prywatność | Brak/obcy Origin, brak/wygasła sesja, obcy plan/intake dla obu POST i GET; no-store, brak danych w logach. | Rzeczywiste konta/RLS; kontrola transportu tylko dla niedostępnego auth. |

### Pozostałe ograniczenia odbioru

Wyniki nie potwierdzają przyczyny pierwotnego incydentu ani medycznego bezpieczeństwa
planu. W fazie 3 nie uruchamiano scenariuszy przeglądarkowych; wcześniejsze obserwacje
UI mają zakres opisany w fazie 2. Do pełnego rozszerzenia odbioru pozostają: osobno
spowolniony dashboard, każdy wariant cyklu życia/niepoprawnego transportu dla obu
formularzy, rzeczywisty BFCache, czytnik ekranu i fizyczne uśpienie urządzenia.
Nie wymuszano rollbacku transakcji po częściowej pracy RPC; sprawdzenie spójności
zwycięzcy wyścigu nie zastępuje takiej próby. Produkcja i jej commit pozostają
niezweryfikowane. Nie wykonano deploymentu ani awarii na produkcji.

Użytkownik potwierdził odbiór wyników i opisanych ograniczeń 2026-09-13
(„potwierdzam”). Pozycje manualne 3.3–3.5 oznaczono jako odebrane; potwierdzenie
nie zmienia zakresu wykonanych prób ani nie zalicza niewykonanych scenariuszy.

### Końcowe kontrole automatyczne

- `npx astro sync`: PASS.
- `npx astro check`: PASS, 52 pliki, 0 errors, 0 warnings, 4 hints o przestarzałym
  `tseslint.config` w istniejącej konfiguracji ESLint.
- `npm run lint`: PASS. Parser Astro informuje o użyciu `project: true` zamiast
  nieobsługiwanego `projectService`.
- `npm run build`: PASS. Pierwszy przebieg zbudował aplikację, ale sandbox odmówił
  zapisu diagnostycznego logu Wrangler poza workspace. Powtórzono z
  `WRANGLER_LOG_PATH=/private/tmp/trainer-phase3-build.log`; build przeszedł bez tego
  błędu. Pozostaje istniejące ostrzeżenie sitemap o braku `site`.
- `git diff --check`: PASS.
- `test -s context/changes/plan-generation-hang/verification.md`: PASS.
