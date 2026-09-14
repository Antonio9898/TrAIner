# Polityka retencji planów — Plan Brief

> Pełny plan: [plan.md](plan.md)
> Frame brief: [frame.md](frame.md)

## What & Why

Po pomyślnym utworzeniu nowego planu dla użytkownika poprzednie plany tego użytkownika i ich feedback mają fizycznie zniknąć z bazy.

To zmiana dotychczasowej reguły przechowywania osobnego planu dla każdej ankiety. Usunięcie następuje już przy zapisie szkicu.

## Starting Point

Generowanie obecnie dodaje plan, a unikalność zapobiega tylko duplikatom tej samej ankiety. Baza już usuwa feedback kaskadowo wraz z planem. Aplikacja ma obsługę niepewnego wyniku zapisu i testy Playwright, ale wymaga zestawu testów bazy/API.

## Desired End State

Nowy plan zastępuje wszystkie poprzednie plany i feedback właściciela w jednej transakcji. Nieudane generowanie lub wycofany zapis zachowują stare dane. Stara karta nie może usunąć nowszego planu przez ponowienie.

## Key Decisions Made

| Decyzja                | Wybór                                     | Dlaczego                              | Źródło             |
| ---------------------- | ----------------------------------------- | ------------------------------------- | ------------------ |
| Moment usunięcia       | Udany zapis szkicu                        | Bez oczekiwania na akceptację         | Frame              |
| Zakres usunięcia       | Wszystkie poprzednie plany i ich feedback | Zgodnie z wymaganiem użytkownika      | Frame              |
| Równoległe generowanie | Nowsza ankieta ma pierwszeństwo           | Spóźniony wynik A nie zastępuje B     | Plan — odpowiedź 1 |
| Stara karta            | Blokada i przejście do aktualnego panelu  | Bez odtwarzania usuniętego A          | Plan — odpowiedź 2 |
| B bez planu            | Sam zapis B blokuje wynik A               | Wynik ma odpowiadać aktualnym danym   | Plan — odpowiedź 3 |
| Informacja o usuwaniu  | Stały tekst przy generowaniu              | Skutek widoczny bez dodatkowego kroku | Plan — odpowiedź 4 |
| Realizacja             | Infrastruktura, potem TDD                 | Regresja RED przed nowym zachowaniem  | Frame              |

## Scope

**W zakresie:** atomowe RPC, synchronizacja zapisu ankiety i planu, ochrona ponowień, testy rzeczywistej bazy i API, komunikat w UI.

**Poza zakresem:** usuwanie ankiet, jednorazowe czyszczenie produkcji, kosz i odzyskiwanie historii, modal potwierdzenia, zmiana promptów, deployment.

## Architecture / Approach

AI generuje wynik poza transakcją. RPC uzyskuje blokadę użytkownika, sprawdza aktualność i wersję ankiety, zapisuje plan oraz usuwa poprzednie plany z kaskadą feedbacku. Zapis ankiety i korekta planu uczestniczą w tej samej kolejności blokowania. API odróżnia aktualną ankietę bez planu od nieaktualnego celu ponowienia.

## Phases at a Glance

| Faza                     | Rezultat                                        | Główne ryzyko                       |
| ------------------------ | ----------------------------------------------- | ----------------------------------- |
| 1. Przygotowanie testów  | Izolowany runner bazy/API i sterowany mock AI   | Testy muszą badać prawdziwą bazę    |
| 2. Zastępowanie w TDD    | Atomowy zapis, retencja i ochrona aktualności   | Wyścigi z zapisem ankiety i korektą |
| 3. API i interfejs w TDD | Bezpieczne sprawdzanie, stare karty i komunikat | Utrata odpowiedzi po udanym zapisie |

**Wymagania wstępne:** lokalny Supabase/Docker, poprawna lokalna konfiguracja i przegląd pełnego planu przed implementacją.

**Szacowany nakład:** około 3–5 sesji implementacyjnych, zależnie od testów współbieżności.

## Open Risks & Assumptions

- Uprawnienia i aplikacja wymagają skoordynowanego wydania z krótkim wstrzymaniem mutacji; sam rollback aplikacji nie wystarczy.
- Cofnięcie kodu nie odzyska planów i feedbacku usuniętych po udanym zastąpieniu.
- Timeout po rozpoczęciu zapisu oznacza wynik niepewny; aplikacja musi go sprawdzić.
- Historyczny pełny remis znaczników czasu jest konfliktem, nie podstawą do arbitralnego usuwania. Nowy zapis danych ustanawia jednoznacznie nowszą ankietę.

## Success Criteria (Summary)

- Po udanym nowym generowaniu pozostaje nowy plan, znikają poprzednie plany i feedback, ankiety pozostają.
- Błędy i stare żądania nie usuwają bieżących danych ani danych innego użytkownika.
- Informacja o retencji jest widoczna, a regresje przechodzą po udokumentowanym RED → GREEN.
