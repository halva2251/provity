# Leistungsbeurteilung Modul 254 – Version 4
## Bug/Incident Handling bei der Dietike Austreiben AG

| Angabe | Wert |
|---|---|
| Klasse / Gruppe | Gruppe 6 |
| Teammitglieder | Maksym Kos, Yen Sauliak, Enis Shorra |
| Thema | Bug/Incident Handling |
| Unternehmen (fiktiv) | Dietike Austreiben AG |
| Datum | 18.06.2026 |

---

## Abgegebene Unterlagen

| Datei | Inhalt |
|---|---|
| `KosSauliakShorra_LB254_V4.md` | Diese Dokumentation (Hauptdokument) |
| `IST_Prozess.bpmn` | BPMN-Diagramm IST-Prozess (Aufgabe 2) |
| `SOLL_Prozess.bpmn` | BPMN-Diagramm SOLL-Prozess (Aufgabe 3) |
| `Kos_AJ_LB254_V4.md` | Arbeitsjournal Maksym Kos |
| `Sauliak_AJ_LB254_V4.md` | Arbeitsjournal Yen Sauliak |
| `Shorra_AJ_LB254_V4.md` | Arbeitsjournal Enis Shorra |
| `KosSauliakShorra_Video_LB254_V4` | Präsentationsvideo (via Teams abgegeben) |

---

## Aufgabe 1: Der Geschäftsprozess

### 1.1 Aufbauorganisation

Die **Dietike Austreiben AG** ist ein mittelständisches Software- und IT-Dienstleistungsunternehmen mit rund 80 Mitarbeitenden. Das Unternehmen entwickelt und betreibt Webanwendungen sowie cloudbasierte IT-Lösungen für externe Kunden.

```
Geschäftsleitung
├── CEO (Chief Executive Officer)
├── CTO (Chief Technology Officer)
└── CFO (Chief Financial Officer)
    │
    ├── Entwicklungsabteilung
    │   ├── Frontend-Entwicklung
    │   ├── Backend-Entwicklung
    │   └── Mobile-Entwicklung
    │
    ├── QA & Testing
    │   └── QA Engineers
    │
    ├── DevOps & Operations
    │   ├── CI/CD & Deployment
    │   └── Systemüberwachung
    │
    ├── IT-Security
    │
    ├── Projektmanagement
    │   └── Projektleitung / Scrum Master
    │
    └── Support & Helpdesk
        └── 1st/2nd Level Support
```

### 1.2 Prozessarchitektur – 3 Ebenen

Die Prozessarchitektur der Dietike Austreiben AG ist in drei Ebenen unterteilt:

| Ebene | Bezeichnung | Beschreibung | Beispiele |
|---|---|---|---|
| **Ebene 1** | Strategische Ebene | Übergeordnete Unternehmensprozesse. Richten sich nach der Unternehmensstrategie. | Kundenbeziehungsmanagement, Produktstrategie, Unternehmensführung |
| **Ebene 2** | Taktische Ebene (Kernprozesse) | Wesentliche Geschäftsprozesse, die den Kernauftrag des Unternehmens abbilden. | IT-Service-Management, Software-Entwicklung, Qualitätssicherung |
| **Ebene 3** | Operative Ebene (Subprozesse) | Detaillierte, ausführbare Prozesse. Hier findet die eigentliche Arbeit statt. | **Bug/Incident Handling**, Deployment-Prozess, Onboarding neuer Mitarbeitender |

Der ausgewählte Geschäftsprozess **Bug/Incident Handling** befindet sich auf der **operativen Ebene (Ebene 3)** als Teilprozess des IT-Service-Managements (Ebene 2).

### 1.3 Grundlegende Elemente des Geschäftsprozesses

**Prozessname:** Bug/Incident Handling

| Element | Beschreibung |
|---|---|
| **Auslöser (Trigger)** | Ein Entwickler entdeckt einen Fehler (Bug) in einer Anwendung oder einem System. |
| **Input** | Fehlerbeschreibung, Reproduktionsschritte, Umgebungsangaben |
| **Aktivitäten** | Erfassen → Klassifizieren → Zuweisen → Analysieren → Beheben → Testen → Deployen → Abschliessen |
| **Output** | Behobener Bug, abgeschlossenes GitHub Issue, Deployment auf Production |
| **Ressourcen** | Entwickler, Teamleiter, QA Engineer, DevOps Engineer, GitHub, CI/CD-Pipeline |
| **Stakeholder** | Entwicklungsteam (intern), Geschäftsleitung (intern), Endnutzer/Kunden (extern) |
| **Systemunterstützung** | GitHub Issues, Git, CI/CD-Pipeline, Monitoring-Tools |

**Prozessgrenzen:**
- **Start:** Der Entwickler entdeckt einen Bug und erfasst ihn als GitHub Issue.
- **Ende:** Das GitHub Issue ist geschlossen, der Bug ist auf Production deployt und (falls nötig) der Wartungsmodus wurde deaktiviert.

### 1.4 Ziele der BPM-Initiative

**Warum wird dieser Prozess dokumentiert?**

Das Bug/Incident Handling bei der Dietike Austreiben AG läuft bisher informell ab. Es gibt keine klare Prozessdefinition, und Verantwortlichkeiten sind nicht eindeutig geregelt. Dies führt zu Verwirrung, langen Reaktionszeiten und unvollständiger Dokumentation.

**Ziele der BPM-Initiative:**

| # | Ziel | Messgrösse |
|---|---|---|
| 1 | Klare Verantwortlichkeiten für jeden Prozessschritt definieren | Alle Schritte haben einen Verantwortlichen |
| 2 | Reaktionszeit bei kritischen Bugs reduzieren | Kritische Bugs innerhalb von 2 Stunden bearbeitet |
| 3 | Qualität und Nachvollziehbarkeit sichern | Alle Bugs dokumentiert und nachverfolgbar |
| 4 | Transparenz für alle Beteiligten schaffen | Alle Stakeholder über aktuellen Status informiert |
| 5 | Grundlage für spätere Prozessautomatisierung schaffen | SOLL-Prozess als Ziel definiert |

**Interessengruppen:**
- **Entwicklungsteam:** Klare Aufgaben, weniger Kommunikationsaufwand
- **Geschäftsleitung:** Kürzere Ausfallzeiten, höhere Kundenzufriedenheit
- **Kunden/Endnutzer:** Schnellere Fehlerbehebung, transparente Kommunikation

---

## Aufgabe 2: Prozessmodellierung

### 2.1 IST-Prozess

Das BPMN-Diagramm des IST-Prozesses befindet sich in der Datei: **`IST_Prozess.bpmn`**

Das Modell enthält:
- **1 Pool:** Dietike Austreiben AG
- **4 Lanes:** Entwickler, Teamleiter, QA Engineer, DevOps/Operations

**Kurzbeschreibung des IST-Prozesses:**

Ein Entwickler entdeckt einen Bug und erfasst ihn manuell als GitHub Issue. Der Teamleiter prüft und klassifiziert den Bug. Bei einem kritischen Bug setzt DevOps die Anwendung in den Wartungsmodus. Danach weist der Teamleiter den Bug einem Entwickler zu. Dieser analysiert und behebt den Fehler. Der QA Engineer testet die Lösung; schlägt der Test fehl, geht der Prozess zurück zur Analyse. Ist der Test erfolgreich, deployt DevOps auf Production. Falls der Wartungsmodus aktiv war, wird er danach deaktiviert. Zuletzt schliesst der Teamleiter das GitHub Issue.

### 2.2 Prozesskennzahlen (KPIs)

| KPI | Beschreibung | Zielwert |
|---|---|---|
| Durchlaufzeit (normaler Bug) | Zeit von Erfassung bis Issue-Schliessung | < 24 Stunden |
| Durchlaufzeit (kritischer Bug) | Zeit von Erfassung bis Wartungsmodus-Deaktivierung | < 4 Stunden |
| Test-Misserfolgsrate | Anteil Bugs, die beim ersten QA-Test fehlschlagen | < 20 % |
| Deployments pro Woche | Anzahl Bug-Fix-Deployments | abhängig von Projektphase |

### 2.3 Ausführungstests – Marken (Token-Tests)

#### Test 1: Happy Path (normaler Bug, kein Wartungsmodus)

| Schritt | Aktivität | Lane | Ergebnis |
|---|---|---|---|
| 1 | Startmarke: Bug entdeckt | Entwickler | Token aktiv |
| 2 | Bug in GitHub Issues erfassen | Entwickler | Issue #42 erstellt |
| 3 | Bug-Meldung prüfen & klassifizieren | Teamleiter | Priority: Normal |
| 4 | Gateway: Kritischer Bug? | Teamleiter | → **Nein** |
| 5 | Bug dem Entwickler zuweisen | Teamleiter | Assigned: Kos |
| 6 | Bug analysieren & reproduzieren | Entwickler | Ursache gefunden |
| 7 | Bug beheben & Commit erstellen | Entwickler | Commit abc123 |
| 8 | Lösung testen & verifizieren | QA Engineer | → **Test bestanden** |
| 9 | Deployment auf Production | DevOps | Deployed v1.2.1 |
| 10 | War Wartungsmodus aktiv? | Teamleiter | → **Nein** |
| 11 | GitHub Issue schliessen | Teamleiter | Issue #42 closed |
| 12 | Endmarke: Bug behoben & Issue geschlossen | – | Prozess endet |

#### Test 2: Alternativer Pfad (kritischer Bug + fehlgeschlagener Test)

| Schritt | Aktivität | Lane | Ergebnis |
|---|---|---|---|
| 1 | Startmarke: Bug entdeckt | Entwickler | Token aktiv |
| 2 | Bug in GitHub Issues erfassen | Entwickler | Issue #99 erstellt |
| 3 | Bug-Meldung prüfen & klassifizieren | Teamleiter | Priority: KRITISCH |
| 4 | Gateway: Kritischer Bug? | Teamleiter | → **Ja** |
| 5 | Anwendung in Wartungsmodus setzen | DevOps | Wartungsmodus aktiv |
| 6 | Bug dem Entwickler zuweisen | Teamleiter | Assigned: Sauliak |
| 7 | Bug analysieren & reproduzieren | Entwickler | Ursache teilweise unklar |
| 8 | Bug beheben & Commit erstellen | Entwickler | Commit def456 |
| 9 | Lösung testen & verifizieren | QA Engineer | → **Test fehlgeschlagen** |
| 10 | *(Schleife)* Bug analysieren & reproduzieren | Entwickler | Ursache vollständig klar |
| 11 | Bug beheben & Commit erstellen | Entwickler | Commit ghi789 |
| 12 | Lösung testen & verifizieren | QA Engineer | → **Test bestanden** |
| 13 | Deployment auf Production | DevOps | Deployed v1.2.2 |
| 14 | War Wartungsmodus aktiv? | Teamleiter | → **Ja** |
| 15 | Wartungsmodus deaktivieren | DevOps | Anwendung wieder online |
| 16 | GitHub Issue schliessen | Teamleiter | Issue #99 closed |
| 17 | Endmarke: Bug behoben & Issue geschlossen | – | Prozess endet |

---

## Aufgabe 3: Prozessanalyse

### 3.1 Identifizierte Schwachstellen im IST-Prozess

| # | Schwachstelle | Auswirkung |
|---|---|---|
| SW1 | **Manuelle Klassifizierung** durch Teamleiter: zeitaufwändig, subjektiv, verzögert den Start der Bearbeitung | Längere Reaktionszeit, Engpass beim Teamleiter |
| SW2 | **Keine automatische Zuweisung:** Der Teamleiter weist Bugs manuell zu, ohne Tool-Unterstützung | Keine Berücksichtigung von Verfügbarkeit oder Expertise |
| SW3 | **Kein SLA-Monitoring:** Es gibt keine definierten Fristen oder Eskalationsmechanismen | Kritische Bugs können unbemerkt lange offen bleiben |
| SW4 | **Manuelles Deployment** durch DevOps: Fehleranfällig, zeitintensiv, abhängig von einer Person | Risiko menschlicher Fehler, Flaschenhals |
| SW5 | **Manuelles Schliessen des Issues:** Der Teamleiter schliesst das Issue manuell nach dem Deployment | Vergessen möglich, fehlende automatische Verknüpfung |
| SW6 | **Keine automatische Benachrichtigung:** Beteiligte erfahren von Updates nur durch Nachfragen | Informationsdefizite, Zeitverlust |

### 3.2 Verbesserungsvorschläge und Prozessautomatisierung

| Schwachstelle | Verbesserungsvorschlag | IT-System / Automatisierung |
|---|---|---|
| SW1 | Automatische Bug-Klassifizierung anhand von Labels und Regeln | GitHub Labels + Automatisierungsregeln (z.B. GitHub Actions) |
| SW2 | Automatische Zuweisung via Round-Robin oder Expertise-Matching | GitHub Auto-Assign Action, JIRA Smart Assign |
| SW3 | SLA-Timer: Bei Überschreitung automatisch eskalieren | GitHub Actions Timer, Opsgenie / PagerDuty |
| SW4 | Vollautomatisches Deployment via CI/CD-Pipeline nach erfolgreichem Test | GitHub Actions, GitLab CI, Jenkins |
| SW5 | GitHub Issue wird automatisch via Commit-Referenz (`Fixes #99`) geschlossen | GitHub automatische Issue-Schliessung via Commit-Message |
| SW6 | Automatische Benachrichtigung über Slack/Teams bei Status-Änderungen | GitHub Webhooks + Slack/Teams-Integration |

### 3.3 SOLL-Prozess

Das BPMN-Diagramm des SOLL-Prozesses befindet sich in der Datei: **`SOLL_Prozess.bpmn`**

**Wesentliche Änderungen im SOLL gegenüber dem IST:**

| Bereich | IST | SOLL |
|---|---|---|
| Klassifizierung | Manuell durch Teamleiter | Automatisch via GitHub Actions |
| Zuweisung | Manuell durch Teamleiter | Automatisch via Auto-Assign |
| SLA-Überwachung | Nicht vorhanden | Timer-Zwischenereignis mit Eskalation |
| Testing | Manuell durch QA Engineer | Automatisiert via CI/CD-Pipeline |
| Deployment | Manuell durch DevOps | Vollautomatisch nach grünem Build |
| Issue-Abschluss | Manuell durch Teamleiter | Automatisch via Commit-Referenz |
| Benachrichtigungen | Keine | Automatisch via Slack/Teams |

**Ergebnis:** Im SOLL-Prozess entfallen mehrere manuelle Schritte. Der Teamleiter wird nur noch bei Eskalationen aktiv. Der Entwickler fokussiert sich auf das Analysieren und Beheben des Bugs. Die Durchlaufzeit reduziert sich deutlich.

---

## Aufgabe 4: Präsentation

### Verweis auf Präsentationsvideo

Das aufgenommene Präsentationsvideo befindet sich unter:

**Dateiname:** `KosSauliakShorra_Video_LB254_V4`

**Abgabe:** Via Microsoft Teams (Ordner: Gruppe 6)

**Dauer:** ca. 17 Minuten

### Inhalt der Präsentation

| Teil | Inhalt | Präsentiert von |
|---|---|---|
| 1 | Vorstellung des Unternehmens und Auswahl des Prozesses | Maksym Kos |
| 2 | IST-Prozess: BPMN-Diagramm, Token-Demonstration (Happy Path) | Yen Sauliak |
| 3 | Prozessanalyse: Schwachstellen & SOLL-Prozess | Enis Shorra |
| 4 | BPM-Lebenszyklus: Von der Prozessidentifikation bis zur Überwachung | alle |

### BPM-Lebenszyklus (mind. 1 Durchlauf)

| Phase | Beschreibung | Im Projekt |
|---|---|---|
| **1. Prozessidentifikation** | Welchen Prozess dokumentieren wir? | Bug/Incident Handling ausgewählt |
| **2. Prozesserhebung** | Wie läuft der Prozess heute ab? | IST-Prozess aufgenommen und beschrieben |
| **3. Prozessmodellierung** | BPMN-Diagramm des IST-Prozesses erstellen | IST-BPMN erstellt (s. IST_Prozess.bpmn) |
| **4. Prozessanalyse** | Schwachstellen identifizieren | 6 Schwachstellen identifiziert |
| **5. Prozessverbesserung** | SOLL-Prozess mit Verbesserungen entwerfen | SOLL-BPMN mit Automatisierung (s. SOLL_Prozess.bpmn) |
| **6. Prozessimplementierung** | SOLL-Prozess einführen (Planung) | Massnahmenplan definiert |
| **7. Prozessüberwachung** | KPIs messen, Prozess anpassen | KPIs definiert (Durchlaufzeiten, Fehlerrate) |

---

## Selbstständigkeitserklärung

Hiermit erklären wir, dass wir die vorliegende Arbeit selbstständig und ohne fremde Hilfe verfasst und keine anderen Hilfsmittel als die angegebenen verwendet haben.

Insbesondere versichern wir, dass wir alle wörtlichen und sinngemässen Übernahmen aus anderen Werken als solche kenntlich gemacht haben.

Die Nutzung von KI-Unterstützung (Claude) wurde für die strukturelle Ausarbeitung eingesetzt und ist hiermit deklariert.

________________________ (Ort, Datum)

________________________ Maksym Kos

________________________ Yen Sauliak

________________________ Enis Shorra
