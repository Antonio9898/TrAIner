# Notatki wykonania

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
