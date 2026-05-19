---
project: TrAIner
context_type: greenfield
created: 2026-05-20
updated: 2026-05-20
checkpoint:
  current_phase: 8
  phases_completed: [1, 2, 3, 4, 5, 6, 7]
  gray_areas_resolved:
    - topic: "context type"
      decision: "Greenfield: nowa aplikacja budowana od zera."
    - topic: "primary persona"
      decision: "Poczatkujacy uzytkownik silowni lub osoba zaczynajaca trening."
    - topic: "pain category"
      decision: "Ryzyko decyzyjne: uzytkownik nie wie, ktory plan jest bezpieczny i dopasowany."
    - topic: "product insight"
      decision: "Wartosc produktu wynika z uwzglednienia kontekstu zdrowotnego przed wygenerowaniem planu."
    - topic: "access model"
      decision: "Login z plaskim modelem roli uzytkownika."
    - topic: "MVP flow"
      decision: "Pelny flow zostaje w MVP, lacznie z prostym feedbackiem po treningu."
    - topic: "timeline"
      decision: "MVP: 3 tygodnie pracy po godzinach."
    - topic: "product type"
      decision: "Web app."
    - topic: "target scale"
      decision: "Maly pilot: kilka osob."
    - topic: "deadline"
      decision: "Twardy deadline MVP: 2026-07-05."
    - topic: "non-goal"
      decision: "Brak porad medycznych: aplikacja nie diagnozuje kontuzji i nie zastepuje specjalisty."
  frs_drafted: 8
  quality_check_status: accepted
---

## Vision & Problem Statement

Osoba trenujaca lub zaczynajaca trening na silowni chce ulozyc plan pod konkretny cel, na przyklad wycisniecie 100 kg na lawce plaskiej, ale nie ma pewnosci, czy gotowy plan z internetu albo samodzielnie przygotowany plan jest bezpieczny dla jej poziomu i ograniczen zdrowotnych. Zly plan moze poglebic kontuzje, a niewystarczajacy opis cwiczen zwieksza ryzyko nieprawidlowego wykonania.

Insight produktu: wartosc TrAIner nie polega na samym wygenerowaniu listy cwiczen, tylko na dopasowaniu planu do celu, poziomu zaawansowania, ograniczen zdrowotnych i prostego feedbacku po treningu.

## User & Persona

Primary persona: poczatkujacy uzytkownik silowni albo osoba zaczynajaca uporzadkowany trening silowy, ktora chce osiagnac konkretny cel, ale nie potrafi samodzielnie ocenic, czy plan jest dla niej bezpieczny i dobrze dobrany.

Uzytkownik siega po produkt w momencie, gdy chce zaczac realizowac cel treningowy i potrzebuje planu, ktory bierze pod uwage jego doswiadczenie, kontuzje oraz ograniczenia zdrowotne.

## Success Criteria

### Primary

- Uzytkownik loguje sie, wpisuje cel treningowy, odpowiada na pytania LLM, otrzymuje dopasowany plan, nanosi ewentualne poprawki we wspolpracy z LLM, akceptuje finalny plan i moze przekazac prosty feedback po treningu.

### Secondary

- Uzytkownik rozumie, dlaczego otrzymal taki dobor cwiczen, progresji i ograniczen.

### Guardrails

- Plan nie ignoruje zgloszonych kontuzji ani ograniczen zdrowotnych.
- Dane zdrowotne uzytkownika nie sa ujawniane innym uzytkownikom.

## User Stories

### US-01: Uzytkownik otrzymuje dopasowany plan treningowy

- **Given** zalogowany uzytkownik chce ulozyc plan pod konkretny cel treningowy
- **When** wpisuje cel i odpowiada na pytania o poziom zaawansowania oraz ograniczenia zdrowotne
- **Then** otrzymuje wyjasniony plan treningowy dopasowany do celu, poziomu i ograniczen zdrowotnych

#### Acceptance Criteria

- Plan odnosi sie do celu wpisanego przez uzytkownika.
- Plan uwzglednia poziom zaawansowania i informacje o kontuzjach lub ograniczeniach zdrowotnych.
- Uzytkownik widzi wyjasnienie, dlaczego plan zostal ulozony w taki sposob.
- Uzytkownik moze poprosic LLM o poprawki, zaakceptowac finalna wersje i przekazac prosty feedback po treningu.

## Functional Requirements

- FR-001: Uzytkownik moze zalozyc konto i zalogowac sie. Priority: must-have
  > Socrates: Counter-argument considered: sesja tymczasowa moglaby wystarczyc do pierwszego wygenerowania planu. Resolution: kept; konto jest potrzebne, zeby zachowac cel, odpowiedzi, ograniczenia zdrowotne, plan i feedback miedzy sesjami.
- FR-002: Uzytkownik moze wpisac cel treningowy. Priority: must-have
  > Socrates: Counter-argument considered: cel wpisany dowolnym tekstem moze byc zbyt swobodny i trudny do walidacji. Resolution: kept; cel pozostaje elementem MVP, ale PRD powinien pilnowac, zeby aplikacja ograniczala ryzykowne lub niejasne interpretacje celu.
- FR-003: Uzytkownik moze odpowiedziec na pytania doprecyzowujace poziom zaawansowania i kontuzje. Priority: must-have
  > Socrates: Counter-argument considered: pytania o kontuzje moga sugerowac diagnoze lub porade medyczna. Resolution: kept; pytania sluza dopasowaniu planu i musza jasno komunikowac, ze aplikacja nie diagnozuje kontuzji.
- FR-004: Uzytkownik moze otrzymac plan treningowy dopasowany do celu, poziomu i kontuzji. Priority: must-have
  > Socrates: Counter-argument considered: bledna rekomendacja moze brzmiec autorytatywnie i zaszkodzic uzytkownikowi. Resolution: kept; bezpieczne granice i nieuwzglednianie kontuzji sa guardrailem produktu.
- FR-005: Uzytkownik moze poprosic LLM o poprawki w planie. Priority: must-have
  > Socrates: Counter-argument considered: kolejne poprawki moga obchodzic wczesniejsze ograniczenia bezpieczenstwa. Resolution: kept; poprawki nie moga ignorowac ograniczen zdrowotnych zebranych w ankiecie.
- FR-006: Uzytkownik moze zaakceptowac finalny plan. Priority: must-have
  > Socrates: Counter-argument considered: no counter-argument; it stands as written. Resolution: kept; akceptacja zamyka wersje planu, ktora uzytkownik bedzie realizowal.
- FR-007: Uzytkownik moze przekazac prosty feedback po treningu, zeby aplikacja sledzila postepy. Priority: must-have
  > Socrates: Counter-argument considered: no counter-argument; it stands as written. Resolution: kept; prosty feedback jest czescia pelnego MVP.
- FR-008: Uzytkownik moze zobaczyc wyjasnienie, dlaczego plan zostal ulozony w taki sposob. Priority: must-have
  > Socrates: Counter-argument considered: wyjasnienie moze brzmiec zbyt pewnie i sugerowac ekspercka gwarancje bezpieczenstwa. Resolution: kept; wyjasnienie musi pokazywac ograniczenia rekomendacji i nie udawac diagnozy medycznej.

## Non-Functional Requirements

- Aplikacja jasno komunikuje, ze nie diagnozuje kontuzji i nie zastepuje lekarza, fizjoterapeuty ani trenera medycznego.
- MVP jest uzywalne na telefonie i desktopie w aktualnych glownych przegladarkach.
- Dane o kontuzjach i ograniczeniach zdrowotnych uzytkownika nie sa ujawniane innym uzytkownikom.

## Business Logic

Aplikacja dobiera plan treningowy na podstawie celu, poziomu zaawansowania, ograniczen zdrowotnych uzytkownika oraz prostego feedbacku po kazdym treningu, tak aby uzytkownik efektywnie dazyl do wybranego przez siebie celu.

Regula zuzywa informacje podane przez uzytkownika: cel treningowy, odpowiedzi o poziomie zaawansowania, informacje o kontuzjach lub ograniczeniach zdrowotnych oraz prosty feedback po wykonanych treningach.

Wynikiem reguly jest plan treningowy oraz jego pozniejsze korekty. Uzytkownik spotyka te decyzje w wygenerowanym planie, w wyjasnieniu doboru cwiczen oraz w zmianach wynikajacych z feedbacku.

## Access Control

MVP wymaga loginu. Model uprawnien jest plaski: istnieje tylko zwykly zalogowany uzytkownik.

Kazdy uzytkownik ma dostep wylacznie do wlasnego celu, odpowiedzi ankietowych, informacji o kontuzjach, planow treningowych i feedbacku po treningu. W MVP nie ma roli trenera, panelu admina ani wspoldzielenia planow.

## Non-Goals

- Aplikacja nie diagnozuje kontuzji i nie zastepuje lekarza, fizjoterapeuty ani trenera medycznego; ograniczenia zdrowotne sluza do bezpieczniejszego dopasowania planu, nie do diagnozy.

## Open Questions

Brak otwartych pytan po zakonczeniu soft-gate.

## Forward: product framing

- Rodzaj produktu: web app.
- Skala uzytkownikow: small, kilka osob w pilocie MVP.
- Budzet czasowy: 3 tygodnie pracy po godzinach.
- Twardy deadline: 2026-07-05.
- Przy 100x wiekszej skali regula doboru planu pozostaje taka sama; skala wplywa na pozniejsze decyzje operacyjne poza PRD.

## Quality cross-check

- Access Control: present.
- Business Logic: present.
- Project artifacts: present.
- Timeline-cost ack: present; MVP budget is 3 weeks, so no long-timeline acknowledgment is required.
- Non-Goals: present.
- Preserved behavior: n/a, greenfield.
