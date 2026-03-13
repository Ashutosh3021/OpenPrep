# OpenPrep Roadmap

**Phases:** 5  
**Granularity:** Coarse  
**Total Requirements:** 32 v1 requirements mapped

---

## Phases

- [x] **Phase 1: Setup & Authentication** - Project scaffolding, database, auth system
- [x] **Phase 2: Problems & Companies** - Problem listing, filtering, descriptions
- [x] **Phase 3: Code Execution** - Monaco editor, Judge0 integration, submissions
- [ ] **Phase 4: Dashboard & Daily** - Progress tracking, heatmaps, daily challenge
- [ ] **Phase 5: Developer Features** - Command palette, shortcuts, export

---

## Phase Details

### Phase 1: Setup & Authentication

**Goal:** Project infrastructure ready, users can create accounts and log in

**Depends on:** Nothing (first phase)

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05

**Success Criteria** (what must be TRUE):

1. User can sign up with email and password
2. User can sign up/login via GitHub OAuth
3. User can log in and stay logged in across browser sessions
4. User can log out from any page
5. User profile is created automatically on signup

**Plans:** 1 plan

- [x] 01-01-PLAN.md — Set up Supabase authentication with email/password and GitHub OAuth

---

### Phase 2: Problems & Companies

**Goal:** Users can browse, search, filter problems and view company data

**Depends on:** Phase 1

**Requirements:** PROB-01, PROB-02, PROB-03, PROB-04, PROB-05, PROB-06, PROB-07, COMP-01, COMP-02, COMP-03

**Success Criteria** (what must be TRUE):

1. User can view paginated list of all problems
2. User can filter problems by difficulty (Easy/Medium/Hard)
3. User can filter problems by tags (topics)
4. User can search problems by title
5. User can view problem detail page with formatted markdown description
6. User can view sample test cases for each problem
7. User can filter problems by company
8. User can filter by recency period (30d/3mo/6mo/6mo+)
9. User can see frequency score for company-problem combination

**Plans:** 3/3 plans complete

- [x] 02-01-PLAN.md — Install dependencies and create core UI components (Complete)
- [x] 02-02-PLAN.md — Create company sidebar and integrate with problems page (Complete)
- [x] 02-03-PLAN.md — Update problem detail with markdown and test cases (Complete)

---

### Phase 3: Code Execution

**Goal:** Users can write and execute code with test results

**Depends on:** Phase 2

**Requirements:** EXEC-01, EXEC-02, EXEC-03, EXEC-04, EXEC-05, EXEC-06, EXEC-07

**Success Criteria** (what must be TRUE):

1. User can write code in Monaco editor
2. User can switch between supported programming languages
3. User can run code with custom input and see output
4. User can submit code and see test results
5. User sees "Accepted" verdict when all tests pass
6. User sees wrong answer details when tests fail
7. Runtime and memory usage displayed after execution

**Plans:** 3 plans

- [x] 03-01-PLAN.md — Backend API integration with Judge0 (Complete)
- [x] 03-02-PLAN.md — Run Code functionality with custom input and output panel (Complete)
- [ ] 03-03-PLAN.md — Submit Code functionality with side panel results

---

### Phase 4: Dashboard & Daily Challenge

**Goal:** Users can track progress and access daily challenges

**Depends on:** Phase 3

**Requirements:** DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DAIL-01, DAIL-02

**Success Criteria** (what must be TRUE):

1. User can view total problems solved count on dashboard
2. User can view solved count broken down by difficulty
3. User can view contribution heatmap (GitHub-style activity)
4. User can view recent submissions history
5. User can see topic/mastery heatmap
6. Daily challenge banner appears on problems page
7. User can access and solve the daily challenge

**Plans:** TBD

---

### Phase 5: Developer Features

**Goal:** Power users have productivity shortcuts and export capabilities

**Depends on:** Phase 4

**Requirements:** DEV-01, DEV-02, DEV-03, DEV-04

**Success Criteria** (what must be TRUE):

1. Command palette opens with Cmd+K (or Ctrl+K on Windows)
2. User can search problems via command palette
3. Keyboard shortcuts work (Cmd+Enter to run, Cmd+Shift+Enter to submit)
4. User can export progress as CSV or JSON

**Plans:** TBD

---

## Coverage

| Phase | Requirements | Status |
|-------|--------------|--------|
| 1 - Setup & Auth | 5 | Complete |
| 2 - Problems & Companies | 10 | Complete |
| 3 - Code Execution | 7 | In Progress (2/3) |
| 4 - Dashboard & Daily | 7 | Not started |
| 5 - Developer Features | 4 | Not started |

**Coverage:** 32/32 requirements mapped ✓

---

## Dependencies

```
Phase 1 (Setup & Auth)
    ↓
Phase 2 (Problems & Companies)
    ↓
Phase 3 (Code Execution)
    ↓
Phase 4 (Dashboard & Daily)
    ↓
Phase 5 (Developer Features)
```

---

*Roadmap created: 2026-03-11*
