# IPA-Bericht — ProVity (Gerüst)

> **Zweck:** Struktur des finalen Projektberichts gemäss LB306 / Dokument
> «FArbeit». Deckt B-4 (Gliederung), B-6 (formale Vollständigkeit) und B-8
> (Darstellung) ab. Inhalte werden während des Projekts hierher zusammengeführt;
> die meisten Kapitel verweisen auf die bestehenden `docs/`-Dateien.
>
> **Für die Abgabe:** in ein Word-Dokument `SauliakYen_LB_M306_V1.docx`
> übertragen, mit Titelblatt, automatischem Inhaltsverzeichnis, Seitenzahlen und
> Kopf-/Fusszeile (Name + Druckdatum auf jeder Seite — B-6/B-8).
>
> **🔴 Vom Team selbst zu schreiben (nicht KI-generiert):** Kurzfassung,
> Reflexion/Schlusswort, Arbeitsjournal.

---

## Titelblatt

- Projekttitel: **ProVity — All-in-One Produktivitäts-App**
- Modul: 306 — Kleinprojekte im eigenen Berufsumfeld abwickeln
- Team: Yen Sauliak (Projektleitung), Maksym Kos, Enis Shorra, Sami Hegazy, Marko Carritiello
- Klasse / Experte / Datum: _[ausfüllen]_
- Abgabe: 22.06.2026

---

## Teil 1 — Obligatorische Kapitel

### 1. Kurzfassung (B-1) 🔴 *vom Team schreiben*

> Max. 1 A4-Seite, **nur Text, keine Grafik.** Drei Teile:
> **Ausgangssituation** → **Umsetzung** → **Ergebnis**. Richtet sich an
> fachlich kompetente Leser (Experte).

_[Hier 3 kurze Absätze einfügen — siehe Stichworte:_
_Ausgangslage = mehrere Apps für Produktivität, Kontextwechsel kostet Zeit;_
_Umsetzung = Next.js/Supabase-PWA mit Auth + 4 Modulen, IPERKA, Team von 5;_
_Ergebnis = live auf Vercel, Notizen/Todos/Pomodoro/Dashboard funktionsfähig.]_

### 2. Projektaufbauorganisation

| Rolle | Person |
|-------|--------|
| Projektleitung (rotiert pro Phase, SPOC zur Lehrperson) | _[Phasenleitung eintragen]_ |
| Auftraggeber / Begleitperson | _[Lehrername], BBB Baden_ |
| Teammitglieder | Yen Sauliak, Maksym Kos, Enis Shorra, Sami Hegazy, Marko Carritiello |

**IPERKA-Phasenleitung (Rotation — LB-Vorgabe):**

| Phase | Phasenleitung | Status |
|-------|---------------|--------|
| Informieren | _[Name]_ | |
| Planen | _[Name]_ | |
| Entscheiden | _[Name]_ | |
| Realisieren | _[Name]_ | |
| Kontrollieren | _[Name]_ | |
| Auswerten | _[Name]_ | |

### 3. Zeitplan (A-3)
→ siehe [`zeitplan.md`](./zeitplan.md) (Soll/Ist-Vergleich).

### 4. Arbeitsjournal (B-2) 🔴 *vom Team schreiben*
→ siehe [`arbeitsjournal.md`](./arbeitsjournal.md).

---

## Teil 2 — Projektdokumentation

### 5. Ausgangslage & Anforderungen (Informieren)
→ Quelle: `Projektantrag_ProVity.docx`. Ausgangslage, Ziele (messbar),
Abgrenzung (was es *nicht* soll).

### 6. Projektmanagement-Methode (A-1, A-10)
IPERKA gewählt und angewandt; Begründung der Methodenwahl, Bezug zur
Aufgabenstellung. Git/GitHub-Workflow (Feature-Branches → PR → Review → `main`).

### 7. Wissensbeschaffung & Quellen (A-2)
Genutzte Informationsquellen (offizielle Docs Next.js/Supabase, etc.), AI-Nutzung
→ siehe [`ai-log.md`](./ai-log.md). Quellenverzeichnis (Kapitel 13).

### 8. Entscheide (A-1, A-9)
→ siehe [`entscheidungen.md`](./entscheidungen.md) (Stack, Alternativen,
RLS-Policies, kein Docker, Branch-Modell).

### 9. Systemumfeld & Schnittstellen (A-5)
→ siehe [`architektur.md`](./architektur.md), Abschnitt Systemkontext.

### 10. Konzeptionelle Umsetzung & Architektur (A-4, B-9)
→ siehe [`architektur.md`](./architektur.md): Applikationsarchitektur,
ER-/DB-Schema, Benutzerfluss. Diagramme als Bilder einfügen + Legende.

### 11. Realisierung (A-9, A-12)
Pro Modul kurz: Auth, Notizen, Todos, Pomodoro, Dashboard — was wurde gebaut,
zentrale technische Entscheide, Screenshots (B-9). Bezug zu den Issues #5–#8.

### 12. Test (A-6, B-10)
- Testkonzept → siehe [`testkonzept.md`](./testkonzept.md)
- Testdurchführung/-protokoll → siehe [`testprotokoll.md`](./testprotokoll.md)

### 13. Quellenverzeichnis (B-6)
Alle Quellen mit Nachweis (offizielle Doku, AI-Log-Bezug). Referenzen gültig
und rekonstruierbar.

### 14. Glossar (B-6)
→ siehe [`glossar.md`](./glossar.md).

### 15. Reflexion & Schlusswort (B-3) 🔴 *vom Team schreiben*

> Vorgehen und Ergebnis kritisch hinterfragen, Lösungsvarianten vergleichen,
> nachvollziehbare Schlüsse, **persönliche Bilanz** pro Teammitglied.

_[Hier persönliche Reflexion einfügen.]_

### Anhang: Quellcode
GitHub-Repository: `halva2251/provity` (Branch-Historie, PRs als Nachweis A-11).

---

<!-- Formale Checkliste vor Abgabe (B-6/B-8):
[ ] Titelblatt vollständig
[ ] automatisches Inhaltsverzeichnis aktuell
[ ] Seitenzahlen + Kopf-/Fusszeile (Name + Druckdatum) auf allen Seiten
[ ] alle Diagramme als Bild + Bildunterschrift, kontrastreich auf A4
[ ] Quellenverzeichnis + Glossar vorhanden
[ ] Rechtschreibprüfung gelaufen (B-7)
[ ] Teil-1/Teil-2-Struktur erkennbar, Quellcode im Anhang
-->
