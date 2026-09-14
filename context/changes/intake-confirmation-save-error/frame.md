# Frame Brief: Potwierdzenie ankiety i zapis

## Reported Observation

„popup powinien wyswietlac sie tylko w sytuacji gdy user ma aktywny plan. Po kliknieciu przycisku na popopie o tworzeniu planu, nastepuje blad i nie ma mozliwosci przejscia dalej”

## Initial Framing (preserved)

- Przyczyna nie została podana.
- Oczekiwane zachowanie: popup tylko przy aktywnym planie i możliwość kontynuowania.
- Doprecyzowanie użytkownika: „Nie udało się zapisać danych. Spróbuj ponownie”.

## Dimension Map and Hypothesis Investigation

| Hipoteza                       | Dowody                                                                                                                                       | Ocena                        |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Popup nie uwzględnia planu     | Formularz otwierał dialog przy każdym poprawnym submit; strona nie przekazywała stanu planu.                                                 | STRONG                       |
| Przycisk blokuje wysłanie      | Komunikat pochodzi z catch zapisu w API po parsowaniu formularza; requestSubmit dochodzi do serwera.                                         | NONE                         |
| Brak RPC w bazie               | Lista migracji zdalnego projektu nie zawiera 20260912120000, 20260914150000, 20260914170000; dwie ostatnie dostarczają save_training_intake. | STRONG dla zdalnego projektu |
| Lokalny schemat jest niezgodny | Lokalna baza ma komplet migracji, zgodną definicję RPC, typy, uprawnienia i konfigurację. Testy zapisu i rollbacku przeszły.                 | NONE                         |

## Narrowing Signals and Cross-System Check

Dashboard traktuje jako bieżący plan przypisany do najnowszej ankiety, zarówno draft, jak i accepted. Popup powinien używać tej samej definicji.
Niezależna analiza formularza i bazy rozdzieliła błąd UI od błędu persystencji.
Odczyt konfiguracji wykazał, że pliki lokalne wskazują lokalną bazę; brak zdalnych migracji nie dowodzi przyczyny błędu na localhost.

## Confirmed Problem Statement

Formularz wymuszał ostrzeżenie bez bieżącego planu. Zgłoszony błąd występuje osobno w warstwie zapisu; zdalny projekt nie ma migracji wymaganych przez kod, natomiast lokalny zapis działa w testach integracyjnych.

## Confidence

HIGH dla warunku popupu i stanu migracji. Przyczyna konkretnego zgłoszenia zależy od środowiska, w którym użytkownik widzi błąd.

## References

- src/components/intake/GoalAndConstraintsForm.tsx
- src/pages/dashboard/intake.astro
- src/pages/api/training-intakes.ts
- src/lib/services/training-intakes.ts
- supabase/migrations/20260914150000_enforce_plan_retention.sql
- supabase/migrations/20260914170000_retire_plans_on_intake_save.sql
- tests/integration/plan-retention/intake-retention.spec.ts
- Analizy agentów: popup_condition, save_failure.
