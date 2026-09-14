---
change_id: plan-retention-policy
title: Usuwanie poprzednich planów i feedbacku przy zapisie ankiety
status: implemented
created: 2026-09-14
updated: 2026-09-14
archived_at: null
---

## Notes

chce zeby znikal wraz z powiazanym feedbackiem

Użytkownik wymaga realizacji przez `/10x-tdd`: test regresji przed implementacją nowego zachowania, w cyklu RED → GREEN → REFACTOR, po przygotowaniu i przeglądzie planu.

Decyzja końcowa z 2026-09-14: zapis ankiety atomowo usuwa poprzednie plany i feedback, również jeśli późniejsze generowanie zawiedzie. Przed zapisem użytkownik otrzymuje stylowany modal potwierdzenia. Implementacja fazy 3: `e6b90df`. Użytkownik zaakceptował testy manualne 3.5–3.7 dnia 2026-09-14. Zmiana nie jest zarchiwizowana ani wdrożona zdalnie.
