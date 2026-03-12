---
phase: 02-problems-companies
plan: 02
subsystem: problems-companies
tags: [ui-components, sidebar, filters]
dependency_graph:
  requires:
    - 02-01
  provides:
    - company-sidebar-component
    - recency-filter-component
    - problems-page-integration
  affects:
    - problem-detail.tsx
tech_stack:
  added:
    - @radix-ui/react-checkbox
    - @radix-ui/react-scroll-area
  patterns:
    - Radix UI Checkbox for company selection
    - Client-side search filtering
    - Recency dropdown with day conversion
    - External problem filtering via props
key_files:
  created:
    - components/recency-filter.tsx
    - components/company-sidebar.tsx
  modified:
    - app/problems/page.tsx
    - components/problem-list.tsx
decisions:
  - Used OR logic for company selection (multiple companies filter)
  - Fallback to mock data when Supabase unavailable
  - Loading skeleton while fetching problems
  - Frequency badge only shown when data available
metrics:
  duration: ~3 minutes
  completed: 2026-03-12T18:04:43Z
  tasks_completed: 4/4
---

# Phase 2 Plan 2: Company Sidebar & Problem Integration Summary

## Overview

Created company sidebar with recency filter and integrated with problems page. ProblemList now accepts external problems and displays frequency badges.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create RecencyFilter | 59d3873 | components/recency-filter.tsx |
| 2 | Create CompanySidebar | 2d58150 | components/company-sidebar.tsx |
| 3 | Update Problems page | 4fd9cd4 | app/problems/page.tsx |
| 4 | Update ProblemList | 4fd9cd4 | components/problem-list.tsx |

## What Was Built

### 1. RecencyFilter Component
- Dropdown using @radix-ui/react-select
- Options: All time, Past Month, Past 3 Months, Past 6 Months, 6 Months+
- Exports RecencyOption type
- Helper function `recencyToDays()` for Supabase query

### 2. CompanySidebar Component
- Fixed width: w-72 (288px), border-r
- Top: RecencyFilter dropdown
- Middle: Search input with Search icon
- Bottom: Scrollable company list using @radix-ui/react-scroll-area
- Company rows: Checkbox + Logo + Name
- Shows top 20 companies initially
- Handles selection (OR logic)

### 3. Problems Page Integration
- Layout: flex h-[calc(100vh-64px)]
- Left: CompanySidebar with companies and filter callbacks
- Right: ProblemList with filtered problems
- State: selectedCompanies, recency, searchQuery, difficulty, category
- Fetches companies from Supabase on mount
- Refetches problems when any filter changes
- Falls back to mock data with client-side filtering if Supabase unavailable

### 4. ProblemList Updates
- Accepts external `problems` prop
- Accepts `filters` object: searchQuery, difficulty, category
- Accepts callbacks: onSearchChange, onDifficultyChange, onCategoryChange
- Added `isLoading` prop with skeleton UI
- Added frequency column with FrequencyBadge
- Frequency badge only shown when data available

## Verification

All tasks verified with `npm run build` - no errors.

## Requirements Satisfied

- PROB-01: User can see problem list
- PROB-02: User can search problems
- PROB-03: User can filter by difficulty
- PROB-04: User can filter by category
- COMP-01: User can see company list with logos in sidebar
- COMP-02: User can search and filter companies

## Deviations from Plan

None - plan executed exactly as written.

---

## Self-Check: PASSED

- [x] components/recency-filter.tsx created
- [x] components/company-sidebar.tsx created
- [x] app/problems/page.tsx updated
- [x] components/problem-list.tsx updated
- [x] All commits present
- [x] Build passes
