# Testy retencji: baza i HTTP

Uruchom `npm run test:retention -- harness.spec.ts` z katalogu projektu. Wymagane są lokalny Supabase z migracjami repozytorium oraz `.dev.vars` wskazujący jego `API_URL` i `ANON_KEY`. Runner odrzuca zdalne adresy i sprzeczne ustawienia środowiska przed zapisem. Nie resetuje bazy ani nie stosuje migracji.

Jeśli główna lokalna baza ma inny schemat, uruchom osobny projekt Supabase z własnym `project_id`, wolnymi portami i kopią migracji repozytorium. Przekaż jego katalog przez `RETENTION_SUPABASE_WORKDIR=/pełna/ścieżka npm run test:retention -- harness.spec.ts`. W tym trybie launcher wstrzykuje konfigurację wyłącznie tego lokalnego projektu do testowej aplikacji, więc nie trzeba zmieniać `.dev.vars`. Każde utworzenie fixture porównuje odcisk konfiguracji z działającym launcherem, zanim utworzy użytkownika. Bramki i konfiguracja nie są częścią produkcyjnego buildu.

Aplikacja testowa używa portu 4324, launcher portu 4325; oba muszą być wolne. Nie są potrzebne przeglądarki. Runner ma jednego workera i zero ponowień; współbieżność jest sterowana żądaniami i odrębnymi sesjami SQL wewnątrz testu.

## Fixture

`test` z `fixtures.ts` udostępnia `local` oraz `user`. Użytkownik ma sesję aplikacji `api` i zwykłego klienta Supabase `client`. Dodatkowych użytkowników twórz przez `withTestUser(local, callback)`. Blok `finally` sprząta dokładny identyfikator zwrócony przez utworzenie użytkownika, również po błędzie callbacka. Usunięcie użytkownika usuwa jego rekordy przez istniejące FK; nie ma zbiorczego DELETE ani wyszukiwania użytkowników do usunięcia po prefiksie.

`withSqlSession(local.DB_URL, role, callback)` otwiera osobne połączenie i transakcję. Role to `{ userId }`, `anon` lub `admin`. Operacje biznesowe testuj jako użytkownik; administracja służy przygotowaniu, obserwacji i weryfikacji danych. Bez jawnego `commit` zamknięcie połączenia wycofuje transakcję. `waitForBlock(observer, waiter.pid, holder.pid)` czeka na rzeczywistą relację z `pg_blocking_pids`, z ograniczonym czasem. Znaczniki czasu odczytuj jako `updated_at::text`, aby zachować mikrosekundy.

## Bramki HTTP

Przed rozpoczęciem żądania wywołaj `armGate(user.id, ...)`. Następnie uruchom żądanie bez oczekiwania na jego wynik, poczekaj na `gate.waitUntilReached()`, wykonaj zaplanowany przeplot i zwolnij bramkę przez `gate.release()` w `finally`. Na końcu odbierz wynik żądania.

- `{ kind: "ai", mode: "success" | "error" | "invalid" }`: zatrzymuje odpowiedź AI. Nieuzbrojone wywołanie otrzymuje błąd; launcher nigdy nie wywołuje dostawcy AI.
- `{ kind: "rpc", path: "/rest/v1/rpc/revise_training_plan", mode: "pass" | "drop" }`: najpierw przekazuje żądanie do rzeczywistego Supabase i odbiera całą odpowiedź. Dopiero wtedy `waitUntilReached()` kończy oczekiwanie. Można sprawdzić commit lub rollback osobną sesją SQL; `state().upstreamStatus` udostępnia wyłącznie status HTTP. `drop` zrywa połączenie po zwolnieniu bramki.
- Bramki są przypisane do użytkownika i zużywane w kolejności uzbrojenia. `aiCallCount(user.id)` pozwala wykryć niepożądane ponowienie. Bramki wygasają po 15 sekundach; testy powinny zwalniać je przed produkcyjnym limitem etapu zapisu (10 sekund).

Podmiana granic HTTP odbywa się wyłącznie w `server.ts`, przez plugin launchera wzorowany na istniejącym launcherze E2E. Kontrola wymaga losowego tokena przekazywanego przez konfigurację runnera. Nie zapisuj kluczy, cookies ani treści ankiet w logach i załącznikach; trace jest wyłączony.
