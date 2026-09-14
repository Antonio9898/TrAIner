# Frame Brief: Usuwanie poprzednich planów i feedbacku

## Reported Observation

„przy dodawaniu nowego planu, poprzedni nie jest usuwany”

## Initial Framing (preserved)

- **User's stated cause or approach**: użytkownik uznał pozostawienie poprzedniego planu za błąd; nie wskazał przyczyny technicznej.
- **User's proposed direction**: wyeliminowanie zachowania z użyciem workflow 10x.
- **Pre-dispatch narrowing**: „widze go w bazie danych”.
- **Dalsze doprecyzowanie**: rekordy mają różne `intake_id` („rozne”).
- **Potwierdzone wymaganie**: „chce zeby znikal wraz z powiazanym feedbackiem”.

## Dimension Map

1. **Kontrakt retencji** — wiele ankiet użytkownika może mieć osobne plany; oczekiwanie usunięcia nie było dotychczasowym wymaganiem.
2. **Tworzenie i wybór planu** — trzeba odróżnić powtórny zapis dla tej samej ankiety od utworzenia planu dla nowej ankiety.

## Hypothesis Investigation

| Hypothesis                                                       | Evidence                                                                                                                                                                                                   | Verdict                     |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Starsze plany różnych ankiet pozostają zgodnie z kontraktem      | `context/changes/minimal-planning-data-contract/plan.md:61`: wiele ankiet, jeden plan na ankietę; `src/lib/services/training-intakes.ts:133`: po powstaniu planu kolejny zapis tworzy nową ankietę         | STRONG                      |
| Generowanie tworzy niezamierzone duplikaty dla tej samej ankiety | `src/lib/services/training-plans.ts:396` zwraca istniejący plan; migracja `20260602233915_create_planning_contract.sql:52` wymusza unikalność `(user_id, intake_id)`; użytkownik potwierdził różne ankiety | NONE dla zgłoszonego objawu |

## Narrowing Signals

- Obserwacja dotyczy bazy; nie zgłoszono wyświetlania starego planu jako bieżącego.
- Rekordy dotyczą różnych ankiet.
- Użytkownik świadomie wybrał fizyczne usuwanie poprzednich planów wraz z feedbackiem.
- Nie sprawdzano żywej bazy; ustalenia o schemacie pochodzą z repozytorium.

## Cross-System Convention

Dotychczasowe dokumenty przewidują oddzielne plany dla różnych ankiet.
Dashboard wybiera najnowszą ankietę i przypisany plan (`src/pages/dashboard.astro:27`).
Generowanie wstawia nowy plan bez usuwania wcześniejszych (`src/lib/services/training-plans.ts:414`).
Usunięcie planu kaskadowo usuwa jego feedback (`supabase/migrations/20260602233915_create_planning_contract.sql:89`).
To potwierdza zgodność obserwacji z obecną implementacją, ale obecna reguła nie odpowiada już oczekiwaniu użytkownika.

## Reframed (or Confirmed) Problem Statement

> Po pomyślnym utworzeniu nowego planu dla użytkownika poprzednie plany tego użytkownika i ich feedback mają fizycznie zniknąć z bazy.

Jest to zmiana reguły retencji, a nie potwierdzony błąd duplikowania danych.
Moment zastąpienia interpretujemy jako skuteczne utworzenie nowego planu, bez oczekiwania na jego akceptację.
Nieudane generowanie lub zapis muszą pozostawić dotychczasowy plan i feedback.
Zakres nie obejmuje usuwania starszych ankiet ani jednorazowego czyszczenia danych produkcyjnych niezależnie od tworzenia nowego planu.

## Confidence

**HIGH** — dokumentacja, kod oraz doprecyzowania użytkownika są zgodne.
Pozostają techniczne ryzyka do rozstrzygnięcia w planowaniu, zwłaszcza równoległe generowanie i niepewny wynik zapisu.

## What Changes for /10x-plan

Zaplanuj bezpieczne zastępowanie planów użytkownika wraz z usunięciem powiązanego feedbacku.
Uwzględnij spójność operacji, izolację użytkowników, ponowienia i równoległe żądania oraz zachowanie poprzednich danych przy błędzie.
Test regresji powinien potwierdzić usunięcie poprzednich planów i feedbacku po sukcesie oraz ich zachowanie przy niepowodzeniu.
Dobór implementacji i etapów należy do `/10x-plan`.

Użytkownik wskazał `/10x-tdd` jako sposób realizacji. Plan powinien wyodrębnić fazy z obserwowalnymi rezultatami, możliwe do wykonania test-first. Nowego zachowania produkcyjnego nie należy implementować przed testem RED. Należy potwierdzić istniejącą infrastrukturę testową; jej ewentualne przygotowanie jest osobnym krokiem poprzedzającym TDD.

## References

- `context/changes/minimal-planning-data-contract/plan.md:61`
- `context/changes/goal-and-constraints-intake/plan.md:17`
- `src/lib/services/training-intakes.ts:133`
- `src/lib/services/training-plans.ts:396`
- `src/pages/dashboard.astro:27`
- `supabase/migrations/20260602233915_create_planning_contract.sql:52`
- `supabase/migrations/20260602233915_create_planning_contract.sql:89`
- Investigation tasks: `/root/plan_contract`, `/root/plan_runtime` (read-only; wykonane we wcześniejszej części rozmowy).
