# OpenPrep

## What This Is

A free, open-source LeetCode alternative with 2000+ problems, company-wise filters, frequency scores, and integrated code execution via Judge0. Built on Next.js 14 with Supabase backend.

## Core Value

Free, no-paywall coding practice platform with comprehensive problem sets and real code execution.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Phase 0 — Project Setup (Next.js 14 + dependencies + env setup)
- [ ] Phase 1 — Database Schema (Supabase tables + RLS policies)
- [ ] Phase 2 — Data Pipeline (Python import scripts for problems, companies, descriptions, test cases)
- [ ] Phase 3 — Backend API Routes (Supabase client, Judge0 integration, execute/submit/problems endpoints)
- [ ] Phase 4 — Core Pages (problem list, problem detail, auth, dashboard)
- [ ] Phase 5 — Developer Features (command palette, GitHub sync UI, API access, export, keyboard shortcuts)
- [ ] Phase 6 — Polish & Performance (loading states, error handling, SEO, performance optimization)

### Out of Scope

- Real-time collaboration features
- Mobile native app
- Paid premium features
- Community discussion forums

## Context

- **Stack:** Next.js 14 (App Router) + Supabase + Judge0 + Monaco Editor + Tailwind CSS
- **Existing code:** UI components already generated via v0, needs wiring
- **Data:** 2000+ problems ready, 470+ companies with frequency data, sample test cases available
- **Authentication:** Supabase Auth with email + GitHub OAuth

## Constraints

- **Tech Stack**: Next.js 14, Supabase, Judge0 — fixed
- **No Paywalls**: All features free forever
- **Open Source**: Full codebase public

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Judge0 for code execution | Free, supports 14+ languages | — Pending |
| Use Supabase for backend | Auth + database + easy setup | — Pending |
| Coarse phase structure | 6 phases as defined in plan | — Pending |

---
*Last updated: 2026-03-11 after initialization*