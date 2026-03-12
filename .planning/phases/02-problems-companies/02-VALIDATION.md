---
phase: 2
slug: problems-companies
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-12
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + React Testing Library |
| **Config file** | `vitest.config.ts` (to be created in Wave 0) |
| **Quick run command** | `vitest run --reporter=verbose` |
| **Full suite command** | `vitest run --coverage` |
| **Estimated runtime** | ~60 seconds |

---

## Sampling Rate

- **After every task commit:** Run `vitest run --reporter=verbose`
- **After every plan wave:** Run `vitest run --coverage`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | PROB-06 | unit | `vitest run src/components/test-case-list.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | PROB-07 | unit | `vitest run src/components/markdown-renderer.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | COMP-03 | unit | `vitest run src/components/frequency-badge.test.tsx` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 2 | COMP-01 | unit | `vitest run src/components/company-sidebar.test.tsx` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 2 | COMP-02 | unit | `vitest run src/components/recency-filter.test.tsx` | ❌ W0 | ⬜ pending |
| 02-02-03 | 02 | 2 | PROB-01, PROB-02, PROB-03, PROB-04 | unit | `vitest run src/components/problem-list.test.tsx` | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 3 | PROB-05 | unit | `vitest run src/components/problem-detail.test.tsx` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom` — Test dependencies
- [ ] `vitest.config.ts` — Vitest configuration for Next.js/React
- [ ] `tests/setup.ts` — Test setup with jest-dom matchers
- [ ] `tests/components/problem-list.test.tsx` — Tests for PROB-01 to PROB-04
- [ ] `tests/components/problem-detail.test.tsx` — Tests for PROB-05
- [ ] `tests/components/markdown-renderer.test.tsx` — Tests for PROB-07
- [ ] `tests/components/company-sidebar.test.tsx` — Tests for COMP-01
- [ ] `tests/components/recency-filter.test.tsx` — Tests for COMP-02
- [ ] `tests/components/frequency-badge.test.tsx` — Tests for COMP-03
- [ ] `tests/components/test-case-list.test.tsx` — Tests for PROB-06

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual layout of company sidebar | COMP-01 | UI layout verification | Verify sidebar appears on left, companies listed alphabetically |
| Visual frequency badge placement | COMP-03 | UI placement verification | Verify progress bar badge appears next to problem title |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
