# Requirements: OpenPrep

**Defined:** 2026-03-11
**Core Value:** Free, no-paywall coding practice platform with comprehensive problem sets and real code execution.

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: User can sign up with email and password
- [ ] **AUTH-02**: User can log in and stay logged in across sessions
- [ ] **AUTH-03**: User can log out from any page
- [ ] **AUTH-04**: User can sign up/login via GitHub OAuth
- [ ] **AUTH-05**: User profile is created automatically on signup

### Problems

- [ ] **PROB-01**: User can view list of all problems with pagination
- [ ] **PROB-02**: User can filter problems by difficulty (Easy/Medium/Hard)
- [ ] **PROB-03**: User can filter problems by tags
- [ ] **PROB-04**: User can search problems by title
- [ ] **PROB-05**: User can view problem detail page with description
- [ ] **PROB-06**: User can view sample test cases for each problem
- [ ] **PROB-07**: Problem descriptions render as formatted markdown

### Companies

- [ ] **COMP-01**: User can filter problems by company
- [ ] **COMP-02**: User can filter by recency period (30d/3mo/6mo/6mo+)
- [ ] **COMP-03**: User can see frequency score for company-problem combination

### Code Execution

- [ ] **EXEC-01**: User can write code in Monaco editor
- [ ] **EXEC-02**: User can switch between supported languages
- [ ] **EXEC-03**: User can run code with custom input
- [ ] **EXEC-04**: User can submit code and see test results
- [ ] **EXEC-05**: User sees Accepted verdict when all tests pass
- [ ] **EXEC-06**: User sees wrong answer details when tests fail
- [ ] **EXEC-07**: Runtime and memory usage displayed after execution

### Dashboard

- [ ] **DASH-01**: User can view total problems solved count
- [ ] **DASH-02**: User can view solved count by difficulty
- [ ] **DASH-03**: User can view contribution heatmap (GitHub-style)
- [ ] **DASH-04**: User can view recent submissions
- [ ] **DASH-05**: User can see topic/mastery heatmap

### Daily Challenge

- [ ] **DAIL-01**: User can see daily challenge banner on problems page
- [ ] **DAIL-02**: User can access and solve daily challenge

### Developer Features

- [ ] **DEV-01**: Command palette opens with Cmd+K
- [ ] **DEV-02**: User can search problems via command palette
- [ ] **DEV-03**: Keyboard shortcuts work (CMD+Enter to run, CMD+Shift+Enter to submit)
- [ ] **DEV-04**: User can export progress as CSV/JSON

## v2 Requirements

### Social

- **SOCL-01**: User can view other users' profiles
- **SOCL-02**: User can see platform-wide submission statistics
- **SOCL-03**: User can follow other users

### Gamification

- **GAME-01**: User earns badges for achievements
- **GAME-02**: User sees streak counter for consecutive days
- **GAME-03**: Leaderboard displays top users

### Curated Lists

- **LIST-01**: User can access curated problem lists (Blind 75, NeetCode 150)
- **LIST-02**: User can create custom problem lists

## Out of Scope

| Feature | Reason |
|---------|--------|
| Discussion forums | High moderation overhead, link to external communities instead |
| Video explanations | High production cost, editorial solutions sufficient for v1 |
| Mobile native app | Web-first approach, responsive fallback for v1 |
| Real-time collaboration | Complex to implement, not core to practice value |
| Paid premium features | Contradicts free, no-paywall core value |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| AUTH-05 | Phase 1 | Pending |
| PROB-01 | Phase 2 | Pending |
| PROB-02 | Phase 2 | Pending |
| PROB-03 | Phase 2 | Pending |
| PROB-04 | Phase 2 | Pending |
| PROB-05 | Phase 2 | Pending |
| PROB-06 | Phase 2 | Pending |
| PROB-07 | Phase 2 | Pending |
| COMP-01 | Phase 2 | Pending |
| COMP-02 | Phase 2 | Pending |
| COMP-03 | Phase 2 | Pending |
| EXEC-01 | Phase 3 | Pending |
| EXEC-02 | Phase 3 | Pending |
| EXEC-03 | Phase 3 | Pending |
| EXEC-04 | Phase 3 | Pending |
| EXEC-05 | Phase 3 | Pending |
| EXEC-06 | Phase 3 | Pending |
| EXEC-07 | Phase 3 | Pending |
| DASH-01 | Phase 4 | Pending |
| DASH-02 | Phase 4 | Pending |
| DASH-03 | Phase 4 | Pending |
| DASH-04 | Phase 4 | Pending |
| DASH-05 | Phase 4 | Pending |
| DAIL-01 | Phase 4 | Pending |
| DAIL-02 | Phase 4 | Pending |
| DEV-01 | Phase 5 | Pending |
| DEV-02 | Phase 5 | Pending |
| DEV-03 | Phase 5 | Pending |
| DEV-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 32 total
- Mapped to phases: 32
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-11*
*Last updated: 2026-03-11 - Roadmap created*