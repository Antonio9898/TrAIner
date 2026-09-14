---
change_id: intake-confirmation-save-error
title: Warunek potwierdzenia ankiety i błąd zapisu
status: preparing
created: 2026-09-14
updated: 2026-09-14
archived_at: null
---

## Notes

Zgłoszenie: popup bez aktywnego planu, po potwierdzeniu błąd zapisu.

Użytkownik potwierdził, że błąd występuje na wdrożonej stronie.

2026-09-14: zastosowano w powiązanym zdalnym Supabase migracje
20260912120000, 20260914150000 i 20260914170000. Ponowny odczyt listy
migracji potwierdził zgodność z repozytorium. Instalacja nie wykonuje
usuwania danych użytkowników.

Poprawka warunku popupu gotowa lokalnie. Lint, typecheck, build,
trzy testy integracyjne zapisu oraz dry-run wdrożenia przeszły.
Po ponownym zalogowaniu użytkownik wskazał wdrożenie przez push na main.
Potwierdzono integrację Workers Builds na GitHub. Ręczną publikację
przerwano po uploadzie; poprawka zostanie opublikowana przez tę integrację.
Produkcja: /auth/signin zwraca 200, /dashboard/intake bez sesji zwraca 302
do logowania. Nie wykonano zapisu na koncie użytkownika produkcyjnego.
