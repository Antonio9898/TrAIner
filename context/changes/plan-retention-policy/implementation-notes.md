# Notatki wykonania

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
