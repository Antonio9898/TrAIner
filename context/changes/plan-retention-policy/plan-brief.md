# Polityka retencji planów — Plan Brief

> Pełny plan: [plan.md](plan.md)
> Historia framingu: [frame.md](frame.md)
> Weryfikacja i wydanie: [implementation-notes.md](implementation-notes.md)

## What & Why

Skuteczny zapis ankiety trwale usuwa poprzednie plany użytkownika i powiązany feedback. Ankiety historyczne pozostają. Zapis ankiety i usunięcie danych są jedną transakcją; jej błąd zachowuje dotychczasowy stan.

Decyzja użytkownika z 2026-09-14 zastąpiła wcześniejszą retencję przy zapisie szkicu. Późniejszy błąd AI nie przywraca usuniętych planów.

## Desired End State

Formularz ankiety pokazuje stałe ostrzeżenie i po walidacji otwiera stylowany modal. Anuluj, Escape i krzyżyk zachowują wpisane dane bez zapisu; przycisk „Zapisz ankietę i usuń plany” dopuszcza zapis. Po nim użytkownik nie ma planu do czasu wygenerowania nowego szkicu.

Stara karta nie odtwarza usuniętego planu. Odczyt recovery odróżnia aktualną ankietę bez planu od starej lub brakującej. Tylko stan `ready` pozwala ręcznie ponowić generowanie.

## Key Decisions Made

| Decyzja                    | Wybór                                                         |
| -------------------------- | ------------------------------------------------------------- |
| Moment usunięcia           | Skuteczny zapis ankiety, przed AI                             |
| Zakres                     | Wszystkie plany właściciela i ich feedback; ankiety pozostają |
| Potwierdzenie              | Stylowany modal i stałe ostrzeżenie w formularzu              |
| Błąd transakcji ankiety    | Brak częściowego zapisu lub usunięcia                         |
| Błąd późniejszego AI       | Brak nowego planu; usunięte dane nie wracają                  |
| Stare żądanie              | Konflikt i odnośnik do aktualnego panelu                      |
| Niepewny zapis generowania | Sprawdzenie wyniku, bez automatycznego retry                  |

## Scope

W zakresie: RPC, wspólna blokada właściciela, retencja przy zapisie ankiety, ochrona ponowień, modal, testy bazy/API i krok CI.

Poza zakresem: usuwanie ankiet, kosz, jednorazowe czyszczenie produkcji, zmiana promptów i deployment. Bez JavaScript pozostaje stałe ostrzeżenie; modal wymaga interaktywnego formularza.

## Architecture / Approach

`save_training_intake` zapisuje ankietę i usuwa plany właściciela z kaskadą feedbacku w jednej transakcji. Zapis ankiety, generowanie oraz korekta przestrzegają wspólnej kolejności blokad. AI działa poza transakcją. `replace_training_plan` ponownie sprawdza aktualność i token ankiety; nadal atomowo usuwa ewentualną historię sprzed wdrożenia przy utworzeniu szkicu.

## Phases at a Glance

| Faza                       | Rezultat                                      | Commit    |
| -------------------------- | --------------------------------------------- | --------- |
| 1. Przygotowanie testów    | Izolowany runner bazy/API i mock AI           | `4bde972` |
| 2. Bezpieczne zastępowanie | RPC, blokady i pierwotna retencja przy szkicu | `c7b7181` |
| 3. API i interfejs         | Recovery, retencja przy ankiecie, modal i CI  | `e6b90df` |

## Verification and Status

35 testów retencji oraz istniejąca podróż E2E przeszły. Lint, typecheck i build przeszły dla implementacji retencji; po stylowaniu modala ponownie przeszły lint i kontrola typów oraz sprawdzenie wyglądu i anulowania w przeglądarce. Użytkownik zaakceptował testy manualne 3.5–3.7 dnia 2026-09-14. Status: `implemented`; kanoniczny postęp znajduje się wyłącznie w `plan.md#progress`.

## Deployment

Zastosować kolejno `20260914150000_enforce_plan_retention.sql` i `20260914170000_retire_plans_on_intake_save.sql` razem z kompletną aplikacją podczas krótkiego wstrzymania mutacji. Obie migracje są już zastosowane lokalnie; zdalnego wydania nie wykonano. Sam rollback kodu nie przywróci usuniętych danych ani poprzednich uprawnień. Szczegółowa procedura znajduje się w notatkach wykonania.
