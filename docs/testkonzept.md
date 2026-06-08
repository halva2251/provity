# Testkonzept — ProVity

> A-6: muss VOR der Realisierung der jeweiligen Funktion geschrieben werden.
> Beschreibt das zu testende System, die Testfälle inkl. erwarteter Ergebnisse,
> was bewusst NICHT getestet wird, die Testmittel und die Testmethode(n).

## Zu testendes System

ProVity — Next.js 16 PWA mit Supabase (Auth, Postgres, RLS). Web-App, getestet
auf Desktop (Chrome, Firefox) und Mobile (Smartphone, als installierte PWA).

## Testmethode(n)

- Manuelle funktionale Tests (Klickpfad pro Feature, Positiv- und Negativfälle)
- Manuelle Tests der Datenisolation (zwei Testkonten, gegenseitige Sichtprüfung)
- Manuelle Responsive-/PWA-Installationstests auf Mobile

## Testmittel

- Browser: Chrome, Firefox (Desktop); Chrome/Safari (Mobile)
- Zwei Supabase-Testkonten (User A, User B)
- Lokale Dev-Umgebung + deployte Vercel-Instanz

## Testfälle

| ID | Feature | Testfall | Erwartetes Ergebnis | Status |
|----|---------|----------|---------------------|--------|
| T-01 | Auth | Registrierung mit gültiger E-Mail/Passwort | Konto wird erstellt, Login möglich | offen |
| T-02 | Auth | Login mit falschem Passwort | Fehlermeldung, kein Zugriff | offen |
| T-03 | Auth | Datenisolation | User A sieht keine Daten von User B | offen |
| T-04 | Notizen | Erstellen/Bearbeiten/Löschen | Änderungen werden persistiert und korrekt angezeigt | offen |
| T-05 | Todos | Erstellen, Priorität setzen, als erledigt markieren | Status/Priorität korrekt gespeichert und angezeigt | offen |
| T-06 | Pomodoro | Start/Pause/Reset, Session-Zähler | Timer läuft korrekt, Zähler erhöht sich nach Intervall | offen |
| T-07 | Dashboard | Aggregierte Anzeige (Timer, Notizen, Todos) | Aktuelle Daten aus allen Modulen sichtbar | offen |
| T-08 | PWA | Installation auf Smartphone | App lässt sich installieren und startet eigenständig | offen |
| T-09 | Responsive | Layout auf Mobile/Desktop | Keine Überlappungen, Bedienung möglich | offen |

## Was bewusst NICHT getestet wird (und warum)

- Lasttests / Performance unter hoher Last — out of scope laut Projektantrag (kein produktiver Mehrbenutzerbetrieb in grossem Massstab)
- Offline-Synchronisation — explizit aus dem Projektumfang ausgeschlossen
- Browser-Kompatibilität ausserhalb Chrome/Firefox/Safari — Ressourcenbeschränkung im Schulumfeld
- Penetrationstests / Security-Audits — über den Rahmen eines Modul-306-Projekts hinaus; RLS-Policies werden funktional, nicht adversarial getestet

<!-- Anleitung (vor Abgabe entfernen): Status-Spalte während Kontrollieren-Phase
ausfüllen (bestanden/fehlgeschlagen) -> wandert ins docs/testprotokoll.md -->
