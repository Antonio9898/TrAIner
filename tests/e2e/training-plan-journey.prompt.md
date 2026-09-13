# Scenariusz E2E: poprawiony plan po akceptacji

Ryzyko: `context/foundation/test-plan.md` §6.5 — przepływ logowanie → generowanie → poprawka → akceptacja nie zachowuje poprawionej wersji po ponownym odczycie SSR. To pojedynczy scenariusz, nie pełne pokrycie ryzyk #1–#6.

Punkty odniesienia: `src/pages/dashboard.astro`, `src/lib/services/training-plans.ts`, `tests/e2e/seed.spec.ts`, `tests/e2e/AGENTS.md`.

1. Przygotuj unikalnego użytkownika i wywiad w lokalnym Supabase.
2. Zaloguj się przez formularz (jawny zakres prośby użytkownika, wyjątek od storageState).
3. Wygeneruj plan zawierający przysiad do ławki i otwórz go linkiem „Zobacz aktualny plan (nowa karta)”.
4. Poproś o zastąpienie przysiadu mostem biodrowym. Otwórz aktualny plan tym samym linkiem; sprawdź nową treść i brak starego ćwiczenia.
5. Zaakceptuj plan. Otwórz czysty `/dashboard`, odśwież i sprawdź status oraz poprawiony trening.
6. Usuń użytkownika wraz z danymi także po niepowodzeniu testu.

Rzeczywiste granice: formularz logowania, sesja, routing, API, walidacja, RPC, baza i SSR. Administrator służy wyłącznie przygotowaniu i sprzątaniu osobnego użytkownika.

Mock: lokalny serwer HTTP OpenRouter, dwie odpowiedzi zgodne ze schematem. Rewizja wymaga przekazania prośby i aktualnego planu. Testowy launcher podmienia adres dostawcy oraz klucz/model w pamięci Vite. Nie modyfikuje plików produkcyjnych. Dedykowany port i brak reuseExistingServer zapobiegają użyciu prawdziwego LLM.

Uruchomienie: `npx playwright test --config playwright.plan.config.ts`. Wymaga działającego lokalnego Supabase i `.dev.vars` wskazującego `http://127.0.0.1:54321`. Klucz administracyjny pobierany jest z lokalnego `supabase status`; nie jest zapisywany w repozytorium.

Test wykrywa utratę poprawki lub statusu akceptacji po ponownym odczycie strony.

Weryfikacja 2026-09-13: scenariusz przeszedł w Chromium. Celowa zmiana `revise_training_plan.p_plan_content` na poprzednią treść planu spowodowała błąd asercji widoczności „Most biodrowy”, mimo sukcesu operacji i nagłówka zmienionego szkicu. Zmianę produkcyjną cofnięto. Przegląd pięciu antywzorców: konkretne asercje treści/statusu, dostępnościowe lokatory, osobny użytkownik, oczekiwanie na stan (w tym hydratację Astro), cleanup w `finally`.

`npm run test:e2e:plan` uruchamia sam scenariusz; `npm run test:e2e` uruchamia również istniejący test dostępu anonimowego.
