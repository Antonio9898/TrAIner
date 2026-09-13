# TrAIner

AI training app.

## Testy E2E (Playwright)

Po `npm install` zainstaluj przeglądarkę: `npx playwright install chromium`.

- `npm run test:e2e` — uruchom testy w Chromium bez okna przeglądarki.
- `npm run test:e2e:ui` — interaktywny panel do uruchamiania i analizowania testów.
- `npm run test:e2e:headed` — uruchom testy z widoczną przeglądarką.
- `npm run test:e2e -- tests/e2e/seed.spec.ts` — uruchom tylko pierwszy test.
- `npm run test:e2e:report` — otwórz raport ostatniego uruchomienia.

### Test planu w CI

Workflow [Training plan E2E](.github/workflows/e2e.yml) uruchamia się wyłącznie ręcznie
przez GitHub Actions → Training plan E2E → Run workflow. Push nie uruchamia testu.
Wykonuje `npm run test:e2e:plan`: logowanie → generowanie → poprawka → akceptacja i ponowny odczyt planu.
Runner uruchamia lokalny Supabase z migracjami oraz mock HTTP dostawcy LLM; nie wymaga sekretów produkcyjnych.
Raport Playwright i ślady nieudanych prób są dostępne w artefakcie `training-plan-playwright` przez 7 dni.

### Konfiguracja lokalna

Playwright sam uruchamia aplikację na `http://127.0.0.1:4322` i zamyka ją po testach.
Jeśli serwer już działa pod tym adresem, lokalnie korzysta z niego ponownie.
Konfiguracja: `playwright.config.ts`. Testy: `tests/e2e/`.

Pierwszy test (`seed.spec.ts`) otwiera `/dashboard` bez sesji i sprawdza
przekierowanie do `/auth/signin` oraz widoczność formularza logowania.
`page.goto` otwiera stronę, `getByRole`/`getByLabel` znajdują elementy po roli
i nazwie, a `expect` czeka na oczekiwany stan i zgłasza błąd, jeśli nie nastąpi.
Test nie wymaga konta, nie zapisuje danych i nie wywołuje AI. Jest testem
przeglądarkowym przekierowania, nie pełnym dowodem izolacji danych (RLS/API).

Po błędzie raport zawiera zrzut ekranu i ślad wykonania (trace).
Wzorzec konfiguracji: [Playwright — webServer](https://playwright.dev/docs/test-webserver).
