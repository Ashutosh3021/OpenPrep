# Phase 2: Problems & Companies - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can browse, search, filter problems by difficulty/tags/companies and view company data with recency/frequency. Includes problem detail page with markdown rendering and sample test cases. Code execution is Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Company Filtering
- Sidebar panel (left side) - not dropdown or modal
- Alphabetical A-Z list with checkboxes
- Company logos + names
- Top 20 shown initially, scroll for more
- Search box with autocomplete
- Multiple companies can be selected (OR logic)
- Problem count shown next to each company name

### Recency Filters
- Located inside company sidebar
- Applies to company problems only (when they were asked)
- Default: All time (no filter)
- Periods: 30d / 3mo / 6mo / 6mo+

### Frequency Scores
- Progress bar badge next to problem title
- Brand color (accent) for the progress bar
- Always visible, not tooltip-only

### Test Cases Display
- Below problem description in detail page
- Show 2-3 examples initially
- Copy button on each test case
- Expected output hidden by default until user runs code

### Markdown Rendering
- React Markdown with remark/rehype plugins
- Syntax highlighting for code blocks (Prism or Highlight.js)
- LaTeX math support (KaTeX or MathJax)
- Responsive images that scale to container

</decisions>

<specifics>
## Specific Ideas

- Company sidebar similar to LeetCode's company filter
- Frequency badge should be subtle but visible
- Test case layout similar to LeetCode examples

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- Existing `ProblemList` component with search, difficulty filter, category filter
- Existing `ProblemDetail` component with code editor
- Mock data in `lib/mock-data.ts` - needs Supabase integration
- UI components: Button, Input already exist

### Established Patterns
- Tailwind CSS for styling
- Supabase client already set up (Phase 1)
- UI components use shadcn/ui patterns

### Integration Points
- Problems data from Supabase `problems` table
- Company data from Supabase `companies` table
- Need to add company sidebar to problems page
- Need to add recency dropdown in sidebar

</code_context>

<deferred>
## Deferred Ideas

- Code execution (Phase 3)
- Discussion forums (out of scope)
- Video explanations (out of scope)

</deferred>

---

*Phase: 02-problems-companies*
*Context gathered: 2026-03-12*
