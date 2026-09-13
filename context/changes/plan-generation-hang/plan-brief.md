# Generowanie i poprawka bez zawieszonego formularza — Plan Brief

> Full plan: [plan.md](plan.md)
> Research: [research.md](research.md)

## What & Why

Generowanie i poprawka mają kończyć oczekiwanie czytelnym wynikiem w ciągu 90 sekund w aktywnym UI. Zgłoszenie dotyczy poprawki na localhost i produkcji; użytkownik wybrał zabezpieczenie obu przepływów oraz diagnostykę etapów mimo niepotwierdzonej przyczyny incydentu.

## Starting Point

AI ma już timeout 90 s, ale auth i baza są poza nim. Formularze wysyłają natywny POST, a pokazanie błędu zależy od ponownego odczytu dashboardu. Atomowe RPC i kontrola wersji chronią zapis poprawki przed nadpisaniem nowszej wersji.

## Desired End State

Użytkownik widzi sukces albo komunikat przy formularzu; wpisane pola pozostają dostępne. Po niepewnym wyniku sprawdza aktualny plan przed ręcznym ponowieniem. Sukces pokazuje link do aktualnego panelu i nie wymaga automatycznej nawigacji.

## Key Decisions Made

| Decision | Choice | Why | Source |
| --- | --- | --- | --- |
| Zakres | Generowanie i poprawka + czasy etapów | Oba przepływy mają te same luki oczekiwania. | Research + Plan / użytkownik |
| Limit | UI 90 s, serwer 85 s, AI maks. 70 s | Zostawia margines dla auth, bazy i odpowiedzi. | Plan / użytkownik: 90 s; pozostałe: projekt techniczny |
| Błąd | Przy formularzu, zachowane pola | Nie zależy od ponownego ładowania panelu. | Plan / użytkownik |
| Niepewny zapis | Ręczny odczyt przed ponowieniem | Utrata odpowiedzi nie dowodzi braku zapisu. | Research + Plan / użytkownik |
| Konflikty | Zachowanie pierwotnego tokenu wersji | Spóźniona próba i ponowienie nie zapiszą dwóch rewizji tej samej wersji. | Research + Plan |
| Sukces | Potwierdzenie i link do panelu | Wolny dashboard nie blokuje informacji o zapisie. | Plan |
| Architektura | JSON POST + osobny odczyt, native fallback | Wspiera kontrolowane UI bez trwałych zadań. | Plan |

## Scope

**In scope:** deadline obejmujący auth, AI i bazę; formularze; odczyt aktualnej wersji; klasyfikacja wyniku; logi bez treści użytkownika; manualna macierz awarii.

**Out of scope:** jobs, streaming, automatyczny retry, zmiany bazy/RLS/promptów, runner testów, CI i deployment.

## Architecture / Approach

Interaktywne formularze wywołują istniejące endpointy w trybie JSON. Kontekst żądania w middleware obejmuje całą operację limitem czasu, a timer klienta kończy oczekiwanie także przy awarii sieci. Osobny uwierzytelniony GET sprawdza aktualny plan. Dotychczasowe RPC i unikalność generowanego planu pozostają granicą ochrony zapisu.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. API, limity i diagnostyka | Ograniczony czas i wiarygodne odpowiedzi | Timeout po zapisie ma nieznany wynik. |
| 2. Formularze i odzyskiwanie | Komunikat do 90 s, zachowane pola, sprawdzenie | Późna odpowiedź nie może zmieniać zakończonego stanu. |
| 3. Weryfikacja | Dowody dla obu przepływów i przekazanie do testów | Rzeczywistej atomowości nie dowodzi mock bazy. |

**Prerequisites:** lokalny backend z istniejącymi migracjami, syntetyczne konto/dane i możliwość kontrolowania awarii zależności. Runner wdraża osobna zmiana jakości.

**Estimated effort:** orientacyjnie 2–3 sesje implementacyjne plus manualny odbiór; czas diagnozy konkretnego incydentu nie jest oszacowany.

## Open Risks & Assumptions

- Nie potwierdzono przyczyny incydentu ani wdrożonego commitu produkcji.
- Krótszy budżet AI może częściej kończyć się kontrolowanym timeoutem.
- Abort nie cofa pewnie zapisu; niezmieniona wersja po odczycie nie dowodzi zakończenia starego żądania.
- Limit renderu dotyczy aktywnego UI z JS; po wznowieniu uśpionej karty sprawdzany jest upływ czasu.
- Pola pozostają w formularzu, nie w trwałym magazynie; przegląd planu po niepewnym wyniku otwiera się w osobnej karcie.

## Success Criteria (Summary)

- Oba formularze kończą oczekiwanie czytelnym wynikiem bez przeładowania dashboardu.
- Niepewny zapis nie daje fałszywego zapewnienia o rollbacku ani automatycznego ponowienia.
- Odbiór potwierdza zachowanie pól, brak duplikatów/nadpisania oraz działanie generowania, poprawki i akceptacji.
