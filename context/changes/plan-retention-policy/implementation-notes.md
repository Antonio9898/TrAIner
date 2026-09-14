# Notatki wykonania

## Zmiana decyzji użytkownika — popup i retencja przy zapisie ankiety

Na kolejną prośbę użytkownika systemowy `confirm` zastąpiono stylowanym modalem `<dialog>`: ciemna karta, rozmyte tło, ikona usuwania, wyróżnione ostrzeżenie i jawny przycisk „Zapisz ankietę i usuń plany”. Dialog obsługuje Escape, zamknięcie krzyżykiem i Anuluj, ustawia początkowy fokus na Anuluj i blokuje ponowny zapis podczas wysyłania. W przeglądarce localhost:4321 sprawdzono wygląd i anulowanie: dialog znika, wpisane dane pozostają, fokus wraca do przycisku zapisu. Lint i automatyczna kontrola typów przechodzą. Podczas tego sprawdzenia nie zapisano ankiety ani nie usunięto danych.

2026-09-14 użytkownik potwierdził: „Tak, usuń po zapisaniu ankiety”, również gdy późniejsze generowanie nowego planu zawiedzie. Ta decyzja zastępuje wcześniejsze założenie planu o usuwaniu dopiero przy zapisie szkicu i wyłączeniu modala z zakresu.

Formularz ankiety po poprawnej walidacji otwiera natywny popup potwierdzenia. Anulowanie blokuje submit; potwierdzenie dopuszcza zapis. Ostrzeżenie jest też stale widoczne w HTML formularza, a komunikat przy generowaniu opisuje nowy moment usuwania. Migracja `20260914170000_retire_plans_on_intake_save.sql` dodaje usuwanie wszystkich planów właściciela z kaskadą feedbacku do tej samej transakcji i blokady właściciela co zapis ankiety. Ankiety historyczne pozostają. Migracja nie czyści danych podczas instalacji.

TDD: dwa nowe testy `intake-retention.spec.ts` najpierw zawiodły — stary plan pozostawał, a trigger odrzucający DELETE nie blokował zapisu ankiety. Po migracji oba przechodzą: usuwanie następuje przed AI, błąd AI nie odtwarza planu, a błąd DELETE wycofuje zapis ankiety. Scenariusze współbieżności korekty, akceptacji i feedbacku dostosowano do konkurencji z zapisem ankiety. Pełny zestaw retencji: **35 PASS**. Migracja zastosowana w izolowanej bazie i głównym lokalnym projekcie przez `supabase migration up --local`; brak zdalnego deploymentu.

Sprawdzenie przeglądarki na localhost:4321 potwierdziło widoczne ostrzeżenie oraz otwarcie natywnego dialogu `confirm`. Wysłano anulowanie; dalszą inspekcję formularza ograniczył timeout połączenia z przeglądarką. Ręcznie potwierdzić: Anuluj zachowuje formularz i plan, OK zapisuje ankietę i usuwa plan z feedbackiem. Wcześniejsze kryteria manualne 3.5–3.7 należy interpretować według nowej decyzji użytkownika o momencie usuwania.

## Faza 3 — 2026-09-14

RED: trzy nowe testy `recovery.spec.ts` otrzymały poprawne odpowiedzi HTTP i zawiodły na braku `generationState`: `stale` dla starej ankiety, `planned` po utracie odpowiedzi po commit oraz `ready` po utracie odpowiedzi po rollbacku. Utratę odpowiedzi kontroluje istniejący launcher, po zakończeniu rzeczywistego RPC. Rollback wymusza unikalny trigger ograniczony do właściciela fixture, usuwany w `finally`.

GREEN: te same trzy testy przechodzą po rozszerzeniu endpointu `current`. Odczyt korzysta ze wspólnego sprawdzania aktualności i remisu znaczników czasu; metadane dotyczą wyłącznie żądanego celu. Odczyt `planId` zachowuje dotychczasowy kontrakt. Hook blokuje submit dla `stale` i `missing`, pozostawia niepewność dla starszej odpowiedzi bez pola i pozwala wyłącznie na ręczne ponowienie przy `ready`. Stałe ostrzeżenie jest renderowane przez SSR w formularzu. Odnośnik dla starej ankiety mówi o aktualnym panelu, bez obietnicy istnienia nowego planu.

Weryfikacja: `npm run test:retention` — 33 PASS na izolowanym projekcie z faz 1–2; `npm run lint`, `npm run typecheck` — PASS (4 istniejące wskazówki ESLint); `npm run build` — PASS (istniejące ostrzeżenie sitemap bez `site`). Pierwsza równoległa próba testów i builda kolidowała we wspólnym cache Vite; końcowe przebiegi wykonano kolejno. Chromium wymaga uruchomienia poza sandboxem macOS z powodu odmowy MachPortRendezvous.

### Instrukcja skoordynowanego wydania

1. Przygotować kompletną aplikację obejmującą fazy 2 i 3 oraz migrację `20260914150000_enforce_plan_retention.sql`. Potwierdzić testy i poniższe kryteria manualne przed wydaniem.
2. Wstrzymać mutacje ankiet, generowanie, korekty, akceptacje i feedback; poczekać na zakończenie trwających generowań i zapisów.
3. Zastosować migrację forward-only, bez resetu bazy i bez jednorazowego czyszczenia historii. Wdrożyć kompletną aplikację podczas tego samego okna wstrzymania zapisów.
4. Wykonać smoke test na przeznaczonym do tego koncie: nowy szkic usuwa poprzednie plany i feedback, zachowuje ankiety; stara karta jest blokowana; aktualny plan daje się poprawić i zaakceptować. Sprawdzić komunikat retencji oraz odzyskiwanie po niepewnym wyniku.
5. Wznowić mutacje po poprawnym smoke teście. Rollback samego kodu jest niewystarczający: wymaga skoordynowanego przywrócenia poprzednich uprawnień i zgodności schematu. Nie odzyskuje danych usuniętych przez skuteczne zastąpienie.

`npm run test:e2e:plan` — FAIL środowiska: po uruchomieniu Chromium poza sandboxem test dochodzi do generowania, lecz aplikacja zgłasza niepewny zapis. Odczyt `pg_proc` głównego lokalnego Supabase potwierdził brak obu RPC `replace_training_plan` i `save_training_intake`; historia migracji kończy się na pozarepozytoryjnej `20260914120000`, bez `20260914150000`. Test i launcher są przypięte do głównego projektu (port 54321), podczas gdy retencja działa na izolowanym projekcie (55321). Nie zmieniano schematu głównej bazy ani istniejącego testu E2E. Punkt 3.3 pozostaje otwarty; potrzebna decyzja o dostosowaniu konfiguracji E2E do izolowanego środowiska lub uzgodnieniu migracji głównej bazy.

Po poleceniu użytkownika „wyrownaj lokalna baze” wyrównano główny lokalny projekt (54321) bez resetu. W jednej transakcji z blokadą tabel usunięto zastąpione RPC `save_generated_training_plan(uuid,jsonb,text)`, przywrócono politykę INSERT zgodną z migracją granicy lifecycle, wykonano dokładny SQL `20260914150000_enforce_plan_retention.sql` i zastąpiono pozarepozytoryjny wpis historii `20260914120000` wpisem zastosowanej migracji. Uprawnienie bezpośredniego INSERT pozostaje odebrane. Porównanie skrótów kompletnych rekordów przed i po potwierdziło zachowanie wszystkich 38 ankiet, 22 planów i 0 wpisów feedbacku. Historia migracji odpowiada plikom repozytorium; funkcje, ACL funkcji, polityki, indeksy i triggery są identyczne z izolowaną bazą testową. Wysłano odświeżenie cache schematu PostgREST.

Końcowe `npm run test:e2e:plan` — **1 PASS**, istniejący test bez modyfikacji: generowanie → korekta → akceptacja → odświeżenie SSR. Punkt 3.3 został zakończony. Usunięta starsza funkcja nie zawierała danych; jej definicja pozostaje w zapisie diagnostycznym sesji, a zastępuje ją RPC z repozytorium.

W tej sesji nie wykonywano zdalnej migracji ani deploymentu. Potwierdzenie manualne 3.5–3.7 i commit pozostają do wykonania.

## Faza 2 — 2026-09-14

Pierwszy RED: `replacement.spec.ts` wywołał istniejący endpoint, otrzymał HTTP 200 i potwierdził zapis nowego szkicu. Asercje wykazały 3 plany zamiast 1 i 2 wpisy feedbacku zamiast 0. Ankiety i dane drugiego użytkownika pozostały poprawne. Po dodaniu transakcyjnego RPC i podłączeniu generowania ten sam test przeszedł (1 PASS).

Wykorzystano wznowiony izolowany projekt `/private/tmp/trainer-retention.3PwlJW`; główna lokalna baza pozostaje bez zmian.

Kolejne cykle RED → GREEN:

- Historyczny retry: HTTP 200 zamiast 409; zmiana ankiety podczas AI: HTTP 503 zamiast kontrolowanego konfliktu. Po sprawdzaniu aktualności przed istniejącym planem i mapowaniu wyniku RPC oba testy przechodzą.
- Zapis ankiety i zastąpienie: początkowo brak `save_training_intake` (SQLSTATE 42883). Po dodaniu RPC oba porządki commit przechodzą z obserwacją rzeczywistych blokad.
- Korekta omijała blokadę właściciela. Po dodaniu jej przed blokadami planu i ankiety test przechodzi; kontrola NOWAIT planu wykonywana jest przez obserwatora administracyjnego, bo zwykły użytkownik nie ma UPDATE potrzebnego do SELECT FOR UPDATE.
- Bezpośredni INSERT planu był dozwolony. Po odebraniu uprawnień testy bezpośredniego INSERT planu oraz INSERT/UPDATE/DELETE ankiety przechodzą.

Weryfikacja końcowa:

- `npm run test:retention`: **30 PASS**, bez skipów i retry: 23 nowe testy retencji/współbieżności oraz 7 testów infrastruktury z fazy 1. Obejmuje utrzymanie historii po błędach AI, rollback po INSERT i błędzie DELETE, izolację, idempotencję po akceptacji i feedbacku, remis i zmianę tokenu, spóźnione A z B posiadającym plan i bez planu oraz oba porządki współbieżnych operacji korekty, akceptacji i feedbacku.
- `npx supabase migration up --local --workdir /private/tmp/trainer-retention.3PwlJW`: PASS. Pierwszą wersję nowej migracji zastosowano przez CLI; kolejne iteracje funkcji wykonywano jawnie w transakcjach SQL wyłącznie w tej bazie. Końcowy plik skopiowano do izolowanego projektu, CLI potwierdza aktualny stan. Test ponownego wykonania całego końcowego pliku migracji w transakcji potwierdza zachowanie wszystkich historycznych rekordów (transakcja testu jest wycofywana).
- `npm run lint`: PASS; `npm run typecheck`: PASS (0 błędów, 4 dotychczasowe wskazówki ESLint); `npm run build`: PASS (dotychczasowe ostrzeżenie o braku `site` dla sitemap).
- `git diff --check`: PASS. Po testach: 0 użytkowników, 0 ankiet, 0 planów, 0 wpisów feedbacku w izolowanej bazie.

Ograniczenie środowiska: bezpośrednie wywołanie funkcji bez EXECUTE jako `anon` powoduje SIGSEGV lokalnego procesu PostgreSQL i recovery całej izolowanej bazy (potwierdzone również dla zapytania bez parametrów). Test sprawdza więc efektywne uprawnienie `has_function_privilege` jako `anon`, zamiast uruchamiać ten awaryjny kod silnika. Wywołania jako uwierzytelniony obcy użytkownik, brak ankiety i próba podania sfałszowanego właściciela są wykonywane. Nie zweryfikowano poprawnej odpowiedzi błędu samego anonimowego wywołania RPC na tym obrazie bazy. Sześciu użytkowników testowych pozostawionych przez recovery usunięto po dokładnych ID; fixture raportuje teraz status błędu sprzątania bez ujawniania danych.

Minimalny wpis komunikatu `stale-intake` w hooku jest wymagany przez typowany słownik błędów. Blokowanie UI i rozszerzony odczyt recovery pozostają w fazie 3. Nie wdrażano aplikacji ani migracji zdalnie. Użytkownik potwierdził przegląd manualny 2.5 dnia 2026-09-14. Commit fazy oczekuje na zatwierdzenie treści.

## Faza 1 — 2026-09-14

Dodano osobny runner testów HTTP/SQL, zależności `pg` i `@types/pg`, fixture użytkowników oraz launcher z kontrolowanymi bramkami AI i odpowiedzi RPC. Kod produkcyjny i migracje pozostają bez zmian.

Weryfikacja:

- `npm run lint`: PASS.
- `npm run typecheck`: PASS (0 błędów, 4 istniejące wskazówki o przestarzałym API konfiguracji ESLint).
- Uruchomienie runnera z nielokalnym `SUPABASE_URL`: poprawna odmowa przed startem aplikacji i tworzeniem użytkowników.
- `npm run test:retention -- harness.spec.ts`: 7 PASS na osobnym lokalnym Supabase ze schematem repozytorium, bez zmian kodu produkcyjnego.
- Po testach osobna baza zawierała 0 użytkowników, 0 ankiet, 0 planów i 0 rekordów feedbacku. Lista zastosowanych migracji odpowiadała dokładnie plikom repozytorium.

Rozbieżność środowiska: główna lokalna baza zawiera migrację `20260914120000_replace_previous_training_plans`, nieobecną w `supabase/migrations/`. Odczyt uprawnień potwierdził brak INSERT dla `authenticated` na `public.training_plans`. Pierwsze uruchomienie dało 5 PASS i 2 FAIL (HTTP 503 podczas bezpośredniego INSERT przez obecny kod). Nie zmieniano schematu ani uprawnień tej bazy; wszyscy użytkownicy pierwszego uruchomienia zostali posprzątani.

Użytkownik zatwierdził osobne środowisko testowe. Utworzono projekt `trainer-retention-3pwljw` w `/private/tmp/trainer-retention.3PwlJW`, z portami API 55321 i PostgreSQL 55322, migracjami skopiowanymi z repozytorium i wyłączonym seedem. Tryb `RETENTION_SUPABASE_WORKDIR` przypina konfigurację testowej aplikacji do wskazanego lokalnego projektu bez edycji `.dev.vars`. Fixture porównują odcisk konfiguracji z launcherem przed utworzeniem użytkownika. Punkt 1.1 został zweryfikowany; użytkownik potwierdził przegląd manualny 1.3 dnia 2026-09-14.

W sandboxie uruchomienie serwera wymagało skierowania pomocniczych plików runtime do katalogów tymczasowych:

```sh
RETENTION_SUPABASE_WORKDIR=/private/tmp/trainer-retention.3PwlJW WRANGLER_LOG_PATH=/private/tmp/trainer-retention-wrangler-logs MINIFLARE_REGISTRY_PATH=/private/tmp/trainer-retention-registry npm run test:retention -- harness.spec.ts
```

Po weryfikacji osobny projekt zatrzymano, zachowując lokalne wolumeny. Dopóki katalog tymczasowy istnieje, można go wznowić przez:

```sh
node_modules/.bin/supabase start --workdir /private/tmp/trainer-retention.3PwlJW --exclude realtime,storage-api,imgproxy,mailpit,postgres-meta,studio,edge-runtime,logflare,vector,supavisor
```

Przed fazą 2 należy skopiować nowe migracje do tego osobnego projektu i stosować je tam jawnie. Sam runner nigdy nie resetuje ani nie migruje bazy.
