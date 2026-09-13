---
date: 2026-09-12T21:22:18+02:00
researcher: Codex
git_commit: a9abbe827a9e63574d7545e2ee9d902b22d8798e
branch: main
repository: TrAIner
topic: "Generowanie/poprawka zawiesza się bez komunikatu"
tags: [research, codebase, training-plans, openrouter, error-handling]
status: complete
last_updated: 2026-09-12
last_updated_by: Codex
---

# Research: Generowanie/poprawka zawiesza się bez komunikatu

**Date**: 2026-09-12T21:22:18+02:00\
**Researcher**: Codex\
**Git Commit**: a9abbe827a9e63574d7545e2ee9d902b22d8798e\
**Branch**: main\
**Repository**: TrAIner

## Research Question

Generowanie/poprawka zawiesza się bez komunikatu.

Zakres: aktualny przepływ formularz → API → AI/baza → dashboard, obsługa oczekiwania i błędów oraz wcześniejsza poprawka. Badanie statyczne z trzema równoległymi agentami (UI, backend, historia). Nie odtwarzano bieżącego incydentu, nie wywoływano AI ani nie zmieniano danych użytkownika.

## Summary

W obecnym kodzie OpenRouter ma już limit 90 sekund obejmujący również odczyt odpowiedzi. Oba endpointy mapują timeout na komunikat dashboardu. Nie jest więc prawdą, że aktualna implementacja nie ma timeoutu AI ani komunikatów błędu.

Potwierdzono trzy luki: brak aplikacyjnego limitu całego przepływu (auth i baza są poza limitem AI), zależność pokazania błędu od kolejnego odczytu dashboardu oraz brak resetu stanu oczekiwania formularzy po nieukończonej nawigacji. Są to mechanizmy mogące wyjaśnić objaw, ale nie dowód przyczyny konkretnego zgłoszenia.

Wcześniej odtworzony błąd poprawki dotyczył ucięcia odpowiedzi przy 3000 tokenów. Zwiększono budżet poprawki do 8000; pierwsze generowanie nadal ma 3000. Poprzedni dokument nie potwierdza wdrożenia tej poprawki na produkcję.

## Detailed Findings

### 1. Formularze i cykl nawigacji

- Generowanie wysyła natywny POST. Skrypt blokuje przycisk i zmienia jego napis na „Generowanie...”; nie ma timera ani obsługi zakończenia błędem po stronie klienta: [src/pages/dashboard.astro:548](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/pages/dashboard.astro#L548), [src/pages/dashboard.astro:589](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/pages/dashboard.astro#L589).
- Poprawka po walidacji ustawia `isSubmitting=true` i pozwala wykonać natywny POST: [src/components/plans/PlanRevisionForm.tsx:56](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/components/plans/PlanRevisionForm.tsx#L56). Pokazuje status „Może to potrwać do 90 sekund” oraz spinner: [src/components/plans/PlanRevisionForm.tsx:146](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/components/plans/PlanRevisionForm.tsx#L146).
- W obu ścieżkach brak resetu przycisku po zatrzymanej nawigacji. Formularz poprawki nie ustawia ponownie `isSubmitting=false`. Scenariusz zatrzymania lub powrotu z historii wymaga sprawdzenia w przeglądarce; samo istnienie luki jest widoczne w kodzie.
- Brak osobnego statusu oczekiwania przy pierwszym generowaniu, podczas gdy poprawka taki status ma. Hydratacja poprawki następuje przez `client:load`: [src/pages/dashboard.astro:251](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/pages/dashboard.astro#L251). Awaria hydratacji pozostaje dodatkową, niepotwierdzoną hipotezą.

### 2. Limit AI nie jest limitem całej operacji

[src/lib/openrouter.ts:71](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/lib/openrouter.ts#L71) tworzy AbortController, uruchamia timer 90 s i podłącza sygnał do fetch. Timer pozostaje aktywny do zakończenia `response.json()` i jest czyszczony w finally ([src/lib/openrouter.ts:101](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/lib/openrouter.ts#L101)). Nie ma potrzeby ponownie implementować timeoutu body.

| Etap | Generowanie | Poprawka | Jawny limit aplikacyjny |
| --- | --- | --- | --- |
| Uwierzytelnienie | Middleware, ewentualny fallback API | Tak samo | Brak |
| Odczyty przed AI | Intake, edytowalność, istniejący plan | Plan, intake | Brak |
| OpenRouter | 3000 tokenów | 8000 tokenów | 90 s wraz z body |
| Zapis po AI | Insert, możliwy odczyt po konflikcie | RPC revise_training_plan | Brak |
| Powrót na dashboard | Auth, odczyty intake/planu | Tak samo | Brak |

Łańcuch generowania: [src/pages/api/training-plans/generate.ts:38](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/pages/api/training-plans/generate.ts#L38), [src/pages/api/training-plans/generate.ts:47](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/pages/api/training-plans/generate.ts#L47), [src/lib/services/training-plans.ts:386](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/lib/services/training-plans.ts#L386), [src/lib/services/training-plans.ts:400](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/lib/services/training-plans.ts#L400).

Łańcuch poprawki: [src/pages/api/training-plans/revise.ts:40](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/pages/api/training-plans/revise.ts#L40), [src/pages/api/training-plans/revise.ts:47](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/pages/api/training-plans/revise.ts#L47), [src/lib/services/training-plans.ts:434](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/lib/services/training-plans.ts#L434), [src/lib/services/training-plans.ts:451](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/lib/services/training-plans.ts#L451), [src/lib/services/training-plans.ts:466](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/lib/services/training-plans.ts#L466).

Klient Supabase konfiguruje cookies, bez własnego fetch z deadline: [src/lib/supabase.ts:9](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/lib/supabase.ts#L9). Istotne wywołania bazy nie dołączają abortSignal. Brak limitu w aplikacji nie oznacza, że infrastruktura lub dostawca nie mają własnych limitów.

### 3. Dostarczenie błędu może samo czekać

Timeout jest prawidłowo mapowany: [src/pages/api/training-plans/generate.ts:89](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/pages/api/training-plans/generate.ts#L89), [src/pages/api/training-plans/revise.ts:85](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/pages/api/training-plans/revise.ts#L85). Endpoint zwraca redirect do dashboardu z `planError`.

Dashboard najpierw czeka na auth middleware ([src/middleware.ts:12](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/middleware.ts#L12)) i odczyty bazy ([src/pages/dashboard.astro:24](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/pages/dashboard.astro#L24)), a dopiero potem ustala i renderuje komunikat ([src/pages/dashboard.astro:57](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/pages/dashboard.astro#L57), [src/pages/dashboard.astro:164](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/pages/dashboard.astro#L164)). Nawet już rozpoznany timeout AI może zatem nie dotrzeć szybko do użytkownika.

Auth middleware i fallback auth w endpointach nie są objęte blokami mapowania błędów planu. Nieoczekiwany wyjątek auth może ominąć redirect z `planError`. Odpowiedź błędu infrastruktury nie jest równoważna obsłużonemu błędowi formularza.

### 4. Budżet odpowiedzi i diagnostyka

- `finish_reason: length` powoduje kontrolowany błąd generowania: [src/lib/openrouter.ts:115](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/lib/openrouter.ts#L115). Powinien skończyć się `invalid-generation` lub `invalid-revision`, jeśli dalsza nawigacja działa.
- Pierwszy plan ma budżet 3000 tokenów ([src/lib/services/training-plans.ts:396](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/lib/services/training-plans.ts#L396)), poprawka 8000 ([src/lib/services/training-plans.ts:462](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/lib/services/training-plans.ts#L462)). Historyczne ucięcie poprawki nie dowodzi ucinania pierwszego planu.
- Logowane są wybrane metadane błędów HTTP, truncation i walidacji, ale brak skorelowanych czasów rozpoczęcia/zakończenia etapów auth, AI, bazy i dashboardu. Sam spinner nie pozwala zlokalizować oczekiwania.

## Code References

Kluczowe odnośniki znajdują się w ustaleniach powyżej. Punkty rozpoczęcia implementacji:

- [src/components/plans/PlanRevisionForm.tsx:56](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/components/plans/PlanRevisionForm.tsx#L56) — stan oczekiwania poprawki.
- [src/pages/dashboard.astro:589](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/pages/dashboard.astro#L589) — stan oczekiwania generowania.
- [src/lib/openrouter.ts:71](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/lib/openrouter.ts#L71) — istniejący deadline AI.
- [src/lib/supabase.ts:9](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/lib/supabase.ts#L9) — wspólny klient bazy/auth.
- [src/pages/dashboard.astro:24](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/src/pages/dashboard.astro#L24) — odczyty opóźniające komunikat.

## Architecture Insights

Aplikacja używa synchronicznego POST → redirect → SSR. OpenRouter działa bez streamingu. Stan oczekiwania istnieje lokalnie w formularzu, bez trwałego identyfikatora operacji ani odczytu jej statusu.

Planowanie następnej zmiany powinno rozstrzygnąć limit całego oczekiwania, sposób dostarczenia komunikatu niezależnie od ponownego odczytu dashboardu i odzyskiwanie stanu UI. Samo zwiększenie 90 s nie rozwiązuje pozostałych etapów.

Trzeba zachować rozróżnienie: timeout AI przed zapisem oznacza, że ta próba nie dotarła do zapisu; timeout/utrata połączenia podczas zapisu może oznaczać nieznany wynik. Automatyczne ponowienie lub komunikat „plan nie został zmieniony” dla każdego timeoutu wymagałoby dodatkowego rozstrzygnięcia stanu. Obecna poprawka sprawdza wersję planu i zapisuje przez RPC po wygenerowaniu treści.

## Historical Context (from prior changes)

- [context/changes/revision-loading-timeout/frame.md:58](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/context/changes/revision-loading-timeout/frame.md#L58) opisuje wcześniejsze lokalne odtworzenie: poprawka „napisz go po polsku” zakończyła się po 33 644 ms z `finish_reason: length`. Po zmianie 3000 → 8000 tokenów zapisano sukces po 46 633 ms. To zapis historyczny, nie wynik obecnego badania.
- Commit `a9edf5fadbbb5d39de9a8fa0ac9654c6483a753e` zawiera istniejącą obsługę timeoutu i truncation. Wcześniejsze stwierdzenia tego frame o braku deadline są zastąpione jego końcową sekcją.
- [context/changes/revision-loading-timeout/frame.md:81](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/context/changes/revision-loading-timeout/frame.md#L81) mówi, że nie wykonano wdrożenia produkcyjnego. Aktualnego wdrożonego commitu nie sprawdzono.
- [context/changes/first-explained-training-plan/plan.md:40](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/context/changes/first-explained-training-plan/plan.md#L40) dokumentuje pierwotne ograniczenie zakresu bez streamingu, polling i jobs.
- [context/archive/2026-08-12-plan-revision-and-acceptance/plan.md:51](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/context/archive/2026-08-12-plan-revision-and-acceptance/plan.md#L51) oddziela generowanie od blokad bazy. Archiwum odczytano bez zmian.
- [context/foundation/prd.md:68](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/context/foundation/prd.md#L68) wymaga generowania i poprawek, ale nie definiuje liczbowego czasu odpowiedzi.
- `context/foundation/lessons.md` nie istnieje.

## Related Research

[context/changes/first-explained-training-plan/research.md:22](https://github.com/Antonio9898/TrAIner/blob/a9abbe827a9e63574d7545e2ee9d902b22d8798e/context/changes/first-explained-training-plan/research.md#L22) opisuje pierwotny projekt integracji. Jego opis braku implementacji dotyczy historycznego commitu.

Nowy zakres zapisano w `context/changes/plan-generation-hang/`, ponieważ zgłoszenie obejmuje oba przepływy i nie wskazuje istniejącego change-id. Poprzednia zmiana `revision-loading-timeout` zachowuje status implemented.

## Open Questions

1. Czy objaw dotyczy localhost czy produkcji i jakiego commitu? Czy występuje po ponad 90 sekundach?
2. Czy czeka POST, przekierowany GET dashboardu, czy tylko stary formularz po anulowaniu nawigacji?
3. Który etap auth/baza/AI/zapis trwa najdłużej? Potrzebne czasy etapów i korelacja żądań bez treści promptów, danych zdrowotnych ani sekretów.
4. Czy pierwsze generowanie kończy się truncation przy 3000 tokenów? Potrzebne metadane konkretnego błędu.
5. Jak UI ma rozstrzygać nieznany wynik zapisu przed ponowieniem?

Research zakończony na poziomie kodu i historii. Nie potwierdzono bieżącej przyczyny runtime; nie zmieniano implementacji ani nie uruchamiano testów aplikacji.
