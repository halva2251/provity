# Architektur & Diagramme — ProVity

> Deckt A-4 (Konzeptionelle Umsetzung), A-5 (Systemgrenzen/Schnittstellen)
> und B-9 (Grafiken/Diagramme) ab. Diagramme als Mermaid — auf GitHub direkt
> lesbar und für den Word-Bericht als PNG exportierbar (z.B. mermaid.live oder
> VS-Code-Extension "Markdown Preview Mermaid Support").

---

## 1. Systemkontext / Systemgrenzen (A-5)

Grenzt ab, was Teil von ProVity ist und was "aussen" liegt (externe Dienste,
mit denen über definierte Schnittstellen kommuniziert wird).

```mermaid
graph TB
    User["👤 Benutzer<br/>(Browser / installierte PWA)"]

    subgraph ProVity["ProVity (eigenes System)"]
        Next["Next.js 16 App<br/>(UI + Server Actions)"]
    end

    subgraph Extern["Externe Dienste (Schnittstellen)"]
        SupaAuth["Supabase Auth<br/>(Registrierung, Login, Session)"]
        SupaDB["Supabase PostgreSQL<br/>(Daten + Row Level Security)"]
        Mail["Supabase E-Mail<br/>(Bestätigungslink)"]
        Vercel["Vercel<br/>(Hosting / Deployment)"]
    end

    User -->|HTTPS| Next
    Next -->|"@supabase/ssr (HTTPS)"| SupaAuth
    Next -->|"SQL über Supabase-Client (HTTPS)"| SupaDB
    SupaAuth -->|Bestätigungsmail| Mail
    Mail -->|Link| User
    Vercel -.->|hostet| Next

    classDef sys fill:#1e3a5f,stroke:#4a90d9,color:#fff
    classDef ext fill:#3a3a3a,stroke:#888,color:#fff
    class Next sys
    class SupaAuth,SupaDB,Mail,Vercel ext
```

**Schnittstellen im Detail:**

| Schnittstelle | Richtung | Protokoll | Zweck |
|---------------|----------|-----------|-------|
| Browser ↔ Next.js | bidirektional | HTTPS | Auslieferung der UI, Server Actions |
| Next.js ↔ Supabase Auth | bidirektional | HTTPS (`@supabase/ssr`) | Registrierung, Login, Session-Cookies |
| Next.js ↔ Supabase DB | bidirektional | HTTPS / PostgREST | Lesen/Schreiben der Nutzerdaten, RLS-gefiltert |
| Supabase ↔ Benutzer | ausgehend | E-Mail | Bestätigungslink bei Registrierung |
| GitHub → Vercel | ausgehend | Webhook | Automatisches Deployment pro Push/PR |

**Bewusst ausserhalb der Systemgrenze (laut Projektantrag):** native Mobile-Apps,
Zusammenarbeit zwischen Benutzern, Kalender-Integration, Offline-Synchronisation.

---

## 2. Applikationsarchitektur (A-4)

Zeigt die Schichten der Next.js-App und das verbindliche Muster
(Server Components/Actions nutzen den Server-Client, Browser nie direkt
schreibend).

```mermaid
graph TD
    subgraph Browser
        Pages["Server Components<br/>(page.tsx — laden Daten)"]
        ClientCmp["Client Components<br/>(z.B. Pomodoro Timer.tsx)"]
    end

    subgraph Server["Next.js Server (Vercel)"]
        Actions["Server Actions<br/>(actions.ts — &quot;use server&quot;)"]
        Proxy["proxy.ts<br/>(Session-Refresh / Routenschutz)"]
        SrvClient["lib/supabase/server.ts<br/>createClient()"]
    end

    subgraph SupabasePlatform["Supabase"]
        Auth["Auth"]
        DB[("PostgreSQL<br/>+ RLS")]
    end

    Pages -->|"createClient() (read)"| SrvClient
    ClientCmp -->|Form / Action-Aufruf| Actions
    Actions -->|"createClient() (write)"| SrvClient
    SrvClient --> Auth
    SrvClient --> DB
    Proxy --> Auth

    classDef srv fill:#1e3a5f,stroke:#4a90d9,color:#fff
    class Actions,Proxy,SrvClient srv
```

**Verbindliches Muster (siehe Issues #5–#8):**

- Lesen passiert in **Server Components** (`page.tsx`) via `createClient()` aus
  `@/lib/supabase/server`.
- Schreiben passiert ausschliesslich in **Server Actions** (`actions.ts`,
  `"use server"`) — nie als clientseitiger `fetch` gegen Supabase.
- Der **Browser-Client** (`lib/supabase/client.ts`) wird nur dort verwendet, wo
  echte Interaktivität im Browser nötig ist (z.B. Timer-Zustand).

---

## 3. Datenbankschema / ER-Diagramm (A-4, B-9)

Alle fachlichen Tabellen hängen an `auth.users` (von Supabase verwaltet) und
sind über `user_id` + RLS pro Nutzer isoliert.

```mermaid
erDiagram
    users ||--o{ notes : "besitzt"
    users ||--o{ todos : "besitzt"
    users ||--o{ pomodoro_sessions : "besitzt"

    users {
        uuid id PK "von Supabase Auth verwaltet"
        text email
    }
    notes {
        uuid id PK
        uuid user_id FK
        text title
        text content
        timestamptz created_at
        timestamptz updated_at
    }
    todos {
        uuid id PK
        uuid user_id FK
        text title
        enum priority "niedrig|mittel|hoch"
        boolean is_done
        timestamptz created_at
    }
    pomodoro_sessions {
        uuid id PK
        uuid user_id FK
        integer duration_minutes
        timestamptz completed_at
    }
```

**Datenisolation (RLS):** Jede Tabelle hat `row level security` aktiviert; die
Policies erlauben Zeilenzugriff nur, wenn `auth.uid() = user_id`. Dadurch sieht
jeder Nutzer ausschliesslich seine eigenen Daten — auch das Dashboard, das nur
lesend aus den drei Tabellen aggregiert, profitiert automatisch von diesen
Policies (RLS gilt für jede Query, nicht nur für das ursprüngliche Modul).

**Designentscheid `pomodoro_sessions`:** kein Update/Delete — abgeschlossene
Sessions sind unveränderliche Historie (begründet in `entscheidungen.md`).

---

## 4. Benutzerfluss (A-4)

```mermaid
flowchart LR
    Start([Aufruf der App]) --> Auth{Eingeloggt?}
    Auth -->|nein| Login[Login / Registrierung]
    Login --> Dash
    Auth -->|ja| Dash[Dashboard]
    Dash --> Notes[Notizen]
    Dash --> Todos[Todos]
    Dash --> Pomo[Pomodoro]
    Notes --> Dash
    Todos --> Dash
    Pomo --> Dash
```

<!-- Anleitung: Diagramme bei Schemaänderungen nachführen. Für den finalen
Word-Bericht als PNG exportieren und mit Bildunterschrift/Legende einfügen. -->
