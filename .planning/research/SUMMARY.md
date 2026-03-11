# OpenPrep Research Summary

**Project:** OpenPrep (LeetCode Alternative)  
**Synthesized:** March 2026  
**Confidence:** HIGH

---

## Executive Summary

OpenPrep is a LeetCode-style coding practice platform that aims to provide free access to curated coding problems with company tags and frequency data as primary differentiators. The research concludes that the platform should use Next.js 14 with App Router for the frontend, Supabase for backend-as-a-service (PostgreSQL + Auth), Drizzle ORM for type-safe queries, Monaco Editor for code editing, and Judge0 for code execution. The architecture follows an event-driven pattern with queue-based processing for code execution, separating the user-facing interface from the computationally intensive judging process.

The key insight from the features research is that **company tags and frequency data are the primary differentiators** that can attract users away from LeetCode's paywall. The platform should focus on executing table-stakes features flawlessly first—problems with difficulty levels, topics, in-browser code execution, and basic progress tracking—before adding advanced features like discussion forums or real-time battles.

Critical pitfalls identified include Judge0 sandbox escape vulnerabilities (CVE-2024-29021 and others in versions <= 1.13.0), inadequate test case storage strategy leading to database bloat, and Monaco Editor state synchronization issues. These must be addressed during the appropriate phases to ensure a secure and usable platform.

---

## Key Findings

### Technology Stack (STACK.md)

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x (14.2.x) | Full-stack framework with App Router, Server Components |
| React | 18.x | UI library, use Server Components by default |
| TypeScript | 5.x (5.4+) | Type safety, required for maintainability |
| Tailwind CSS | 3.4.x | Utility-first CSS with @tailwindcss/typography |
| shadcn/ui | Latest | Component library built on Radix UI primitives |
| Monaco Editor | 0.50+ | In-browser code editor with IntelliSense |
| @monaco-editor/react | 4.6+ | React wrapper, lazy-load for performance |
| Supabase | Latest | Backend-as-a-service: PostgreSQL, Auth, auto-generated APIs |
| Drizzle ORM | 0.33+ | Type-safe database queries, lighter than Prisma (80KB vs 15MB) |
| Judge0 | Latest | Code execution API, supports 14+ languages, self-hosted CE |
| Docker | 24+ | Container isolation for Judge0, use gVisor in production |
| TanStack Query | 5.x | Server state management, automatic caching |
| Zustand | 4.x | Client state, lightweight (1KB) |
| Vitest | 2.x | Unit testing, Vite-native |
| Playwright | 1.45+ | E2E testing for complex flows |

**Anti-Recommendations:** Avoid Pages Router (use App Router), CodeMirror/Ace (Monaco is superior), MongoDB (relational data fits PostgreSQL), Redux (overkill), styled components, Jest (use Vitest), npm (use Bun), NextAuth.js (use Supabase Auth directly).

### Feature Landscape (FEATURES.md)

**Table Stakes (Must Have):**
- Problem Database (500+ minimum, 2000+ for legitimacy)
- Difficulty Levels (Easy/Medium/Hard)
- Problem Descriptions with examples and constraints
- Topic/Category Tags
- Visible Test Cases (2-5 examples)
- In-Browser Code Editor (Monaco)
- Code Execution (Run + Submit via Judge0)
- Acceptance Rate Display
- User Authentication (Supabase Auth + GitHub OAuth)
- Progress Tracking
- Submission History
- Code Draft Auto-Save (localStorage for anonymous, server for authenticated)
- Problem List with filtering and pagination
- Basic Search

**Differentiators (Should Have - Priority Order):**
1. Company Tags — Major LeetCode Premium feature to replicate
2. Frequency Scores — Shows problem appearance in real interviews
3. Curated Problem Lists (Blind 75, NeetCode 150)
4. Editorial Solutions (multiple approaches)
5. Daily Streaks
6. Study Roadmaps

**Anti-Features (Avoid):**
- Paywall for basic problems
- Login required to view problems
- Aggressive ads
- Limited daily submissions
- Broken/flaky code execution
- Complex onboarding
- Forums without moderation
- Mobile app initially (responsive web sufficient)

### Architecture Patterns (ARCHITECTURE.md)

**High-Level Components:**
1. **Client Layer** — Next.js web app, Monaco Editor
2. **API Gateway Layer** — Rate limiting, authentication, routing
3. **Presentation Layer** — Problem Service, Submission Service, User Service
4. **Execution Layer** — Message Queue (Redis/RabbitMQ), Worker Pool (Docker sandbox)
5. **Data Layer** — PostgreSQL (problems, users, submissions), Redis (cache, sessions)

**Key Data Flow - Submission Process:**
1. Client submits code via POST /api/submissions
2. API Gateway validates auth, applies rate limiting
3. Submission Service creates record (status: PENDING), enqueues job
4. Worker pulls job, executes in isolated Docker container
5. Results stored, client polls or receives WebSocket notification

**Security Architecture:**
- Docker containers for isolation (medium security, high performance)
- gVisor for production (high security, medium performance)
- Resource limits: CPU time (1-5 seconds), memory (256MB-1GB)
- No network access from sandboxed code
- Input validation, parameterized queries, XSS prevention

**Build Order (20 weeks):**
- Phase 1 (Weeks 1-4): Foundation — Database, Auth, Problem Service, Frontend
- Phase 2 (Weeks 5-8): Basic Execution — Queue, Worker, Submit flow
- Phase 3 (Weeks 9-12): Enhanced Features — Test cases, Progress, Search, Caching
- Phase 4 (Weeks 13-16): Contest Infrastructure (optional for v1)
- Phase 5 (Weeks 17-20): Scale and Polish
- Phase 6 (Weeks 21+): Advanced Features (AI, collaboration)

### Domain Pitfalls (PITFALLS.md)

**Critical (Must Avoid):**
1. **Judge0 Sandbox Escape** — CVE-2024-29021 in <=1.13.0 allows root access. Prevention: Use >=1.13.1, disable network (`ENABLE_NETWORK=false`), isolate Judge0 network segment.
2. **Test Case Storage Bloat** — 10MB+ payloads slow submissions. Prevention: Separate visible/hidden test cases, compress with TOAST, lazy load.
3. **Monaco Editor State Bugs** — Rapid changes cause state sync issues. Prevention: Use `useRef`, debounced auto-save, proper cleanup on unmount.

**Moderate:**
4. **Supabase RLS Misconfiguration** — Users see others' data. Prevention: Enable RLS from Day 1, default-deny approach.
5. **Submission Race Conditions** — Out-of-order results. Prevention: UUID per submission, debounce button.
6. **Inefficient Problem Queries** — Full table scans. Prevention: Add indexes on difficulty, company_id, topic_id; use cursor pagination.
7. **Poor Time Limit Feedback** — Users confused by TLE. Prevention: Show "Running..." state, differentiate error types.
8. **Data Import Without Validation** — Duplicates, missing fields. Prevention: Validate before import, upsert logic.

**Minor:**
9. **Missing Progress Persistence** — Auto-save to localStorage + server sync.
10. **Monolithic Problem Data** — Normalize, use Markdown storage.
11. **Mobile Experience Ignored** — Monaco unusable on mobile. Prevention: Detect and warn, suggest desktop.

---

## Implications for Roadmap

### Recommended Phase Structure

**Phase 1: Foundation (Weeks 1-4)**
- Database schema with PostgreSQL, Drizzle ORM
- Supabase Auth setup with RLS from Day 1
- Basic Problem Service (CRUD, listing)
- Indexes on difficulty, company_id, topic_id (prevent Pitfall 6)
- Frontend: Problem list page with filters

**Phase 2: Core Execution (Weeks 5-8)**
- Judge0 integration (SECURITY CRITICAL: Use >=1.13.1, disable network)
- Worker pool with Docker sandbox
- Code Editor integration (Monaco with Pitfall 3 prevention)
- Submission Service with status tracking
- Test case structure (separate visible/hidden, Pitfall 2 prevention)
- Frontend: Problem detail with editor, Run + Submit

**Phase 3: Progress & Discovery (Weeks 9-12)**
- Progress tracking (problems solved by difficulty)
- Submission history
- Curated lists (Blind 75, NeetCode 150)
- Company tags + frequency scores (PRIMARY DIFFERENTIATOR)
- Problem search and filtering
- Auto-save to localStorage (Pitfall 9 prevention)

**Phase 4: Polish & Engagement (Weeks 13-16)**
- Editorial solutions
- Daily streaks
- Study roadmaps
- Enhanced search (by company, pattern)
- Code draft sync for authenticated users

**Phase 5+: Community & Scale (Weeks 17+)**
- Discussion forums (requires moderation plan)
- User solutions gallery
- Leaderboards
- Hints system
- AI-powered assistance

### Research Flags

| Phase | Needs Research | Standard Patterns |
|-------|----------------|-------------------|
| Phase 1 | RLS policy design | Database schema is well-documented |
| Phase 2 | Judge0 production hardening | Self-hosted Judge0 has clear docs |
| Phase 3 | Data import automation | Curated lists are community standards |
| Phase 4 | Gamification mechanics | Streaks/achievements have known patterns |
| Phase 5 | Forum moderation strategy | High operational complexity |

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Next.js 14, Supabase, Drizzle, Monaco, Judge0 are well-documented, industry-standard choices |
| Features | MEDIUM-HIGH | Table stakes are established; differentiation priorities clear; some advanced features (forums) uncertain |
| Architecture | HIGH | Event-driven patterns, queue-based execution, sandbox isolation are proven patterns |
| Pitfalls | MEDIUM-HIGH | Security pitfalls well-documented; some implementation pitfalls have workarounds |

### Gaps to Address

1. **Forum Strategy:** Should OpenPrep build forums or link to existing communities? Requires operational commitment.
2. **Mobile Strategy:** Monaco doesn't work on mobile. Is responsive design with degraded experience sufficient?
3. **Video Content:** Is there demand for video explanations, or are editorial solutions enough?
4. **Community Content:** User-submitted solutions need voting/moderation system.

---

## Sources

- STACK.md: Next.js 14 App Router docs, Monaco Editor GitHub, Judge0 docs, Drizzle ORM docs, TanStack Query docs, Supabase docs
- FEATURES.md: LeetCode, NeetCode, HackerRank, Exercism, AlgoArena competitive analysis; Reddit r/LeetCode community expectations
- ARCHITECTURE.md: System Design Handbook, AlgoMaster.io, Northflank, TianPan.co, Microsoft Monaco docs
- PITFALLS.md: CVE-2024-29021, CVE-2024-28185, CVE-2024-28189, Judge0 GitHub issues, Monaco React integration issues, Supabase RLS documentation
