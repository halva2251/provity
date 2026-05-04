# ProVity — Project Plan
> Module 306 | LB306-V1 | Deadline: 22.06.2025

---

## What We're Building

**ProVity** is a web-based productivity app (Next.js PWA) that brings together the tools you actually use daily — in one clean interface.

**Confirmed features:**
- Pomodoro Timer (start/pause/reset, custom durations, session counter)
- Notes (create/edit/delete, markdown support, tags)
- Todo List (tasks, due dates, priorities, mark complete)
- Dashboard (unified home: active timer + recent notes + pending todos)
- User Authentication (login/register via Supabase Auth)

**Out of scope (documented):**
- Native mobile app (we ship a PWA — installable on mobile via browser)
- Collaborative/shared workspaces
- Calendar integration
- Offline sync

---

## Tech Stack

| Layer | Tool | Why |
|-------|------|-----|
| Frontend | Next.js 14+ (App Router) + TypeScript | Learn Next.js, strong ecosystem |
| Styling | Tailwind CSS | Fast, consistent UI |
| Backend | Next.js API Routes | No separate server needed |
| Database | Supabase (PostgreSQL) | Free tier, built-in auth, easy setup |
| Hosting | Vercel | Free, auto-deploys from GitHub |
| Versioning | Git + GitHub | Required for A-11 |
| Mobile | PWA (Progressive Web App) | One codebase, works on mobile |

**Rejected alternatives (documented for Entscheiden phase):**
- Firebase — vendor lock-in, less SQL control vs Supabase
- React Native / Expo — two codebases, too complex for our timeline
- Express.js backend — unnecessary overhead when Next.js API routes cover our needs

---

## Team

> Fill in names. Leader rotates after each IPERKA phase.

| # | Name | IPERKA Phase Lead | Strengths |
|---|------|-------------------|-----------|
| 1 | | Informieren | |
| 2 | | Planen + Entscheiden | |
| 3 | | Realisieren (weeks 3–4) | |
| 4 | | Realisieren (weeks 5–6) | |
| 5 | | Kontrollieren | |
| All | | Auswerten | shared |

---

## IPERKA Timeline

| Phase | Week | Dates | Deliverable |
|-------|------|-------|-------------|
| **I** Informieren | 1 | May 5–9 | Situation analysis, requirements, research log |
| **P** Planen | 2 | May 12–16 | Zeitplan, task breakdown, team org chart |
| **E** Entscheiden | 2 | May 14–16 | Stack decision, feature scope, alternatives compared |
| **R** Realisieren | 3–6 | May 19 – Jun 13 | Working app, daily journal, commits |
| **K** Kontrollieren | 7 | Jun 16–20 | Test protocol, results, deviations |
| **A** Auswerten | 8 | Jun 22 | Reflexion, Schlusswort, final submission |

---

## Scoring Targets (114 pts total)

### Part A — Technical Competence (×2 weight, 72 pts)

| # | Criterion | How we hit it |
|---|-----------|---------------|
| A-1 | PM & Planning | IPERKA method named + applied throughout, visible in report |
| A-2 | Knowledge acquisition | All research logged in journal, sources listed, AI queries logged |
| A-3 | Time plan | Zeitplan with real dates, 1-2h blocks, Soll/Ist updated weekly |
| A-4 | Conceptual implementation | UML/diagrams for architecture, DB schema, user flows |
| A-5 | System boundaries | Context diagram, list what's in/out of scope, all APIs documented |
| A-6 | Test concept | Written before building: test cases, expected results, what NOT tested |
| A-7 | Performance | Work consistently, stay on schedule, go beyond requirements |
| A-8 | Independent work | Research done ourselves, alternatives shown, problems solved in team |
| A-9 | Technical knowledge | Use TypeScript correctly, explain decisions in doc |
| A-10 | Work methodology | Apply IPERKA correctly, use Git properly, follow scrum-like workflow |
| A-11 | Work organisation | GitHub repo, daily commits, branching strategy, documented in report |
| A-12 | IPA completion | Deliver all core features, professional quality |

### Part B — Documentation (×1 weight, 30 pts)

| # | Criterion | How we hit it |
|---|-----------|---------------|
| B-1 | Executive summary | 1 A4 page, text only: situation → implementation → result |
| B-2 | Work journal | Daily entries: what we did, problems, help received, Soll/Ist |
| B-3 | Reflection | Compare alternatives, question our choices, personal conclusion |
| B-4 | Structure | Clear chapters, logical order, proper headings |
| B-5 | Conciseness | No filler text, no copy-paste walls, everything serves a purpose |
| B-6 | Formal completeness | Part1/Part2 structure, ToC, glossary, header/footer, source list |
| B-7 | Language & style | Technical language, full sentences, spell-checked |
| B-8 | Layout | Page numbers, no orphan headings, clean formatting |
| B-9 | Graphics & diagrams | Architecture diagram, DB schema, screenshots, all labeled |
| B-10 | Test execution | Test protocol filled, deviations noted, conclusions per test case |

### Part C — Presentation (×1 weight, 12 pts)

| # | Criterion | How we hit it |
|---|-----------|---------------|
| C-1 | Structure & timing | Intro → content → critical reflection, 15–20 min |
| C-2 | Media usage | Slides tested, live demo ready as backup if app fails |
| C-3 | Presentation technique | Eye contact, clear speech, technical vocabulary |
| C-4 | Demo | Live app showing all core features, ~10 min |

---

## Repository Structure

```
provity/
├── PLAN.md                  ← this file
├── README.md
├── docs/
│   ├── zeitplan.md          ← time plan with Soll/Ist
│   ├── testkonzept.md       ← test concept (A-6, B-10)
│   ├── ai-log.md            ← all AI queries logged (required by LB)
│   └── entscheidungen.md    ← decision log (stack, features, alternatives)
└── app/                     ← Next.js app (created later)
```

---

## Git Workflow

- `main` — stable, only merged code
- `dev` — active development branch
- Feature branches: `feature/pomodoro`, `feature/notes`, `feature/auth`, etc.
- Commit every day (required for A-11)
- Commit messages: `feat: add pomodoro timer`, `fix: reset bug on timer`, etc.

---

## AI Query Log (required by LB)

> All AI queries must be documented. Log them in `docs/ai-log.md`.

| Date | Tool | Prompt summary | Used in |
|------|------|----------------|---------|
| 2025-05-04 | Claude | Analyse LB306 doc, explain criteria, recommend stack and features | Planning phase |

---

## Open Questions

- [ ] Fill in team member names and skill levels
- [ ] Confirm IPERKA phase leader assignments
- [ ] Confirm: is the documentation language German?
- [ ] Does anyone already have a Supabase or Vercel account?
- [ ] Do we need a separate GitHub org or use halva2251's account?
