# Phase 2: Problems & Companies - Research

**Researched:** 2026-03-12
**Domain:** Frontend UI/UX for problem browsing, filtering, and company data display
**Confidence:** HIGH

## Summary

Phase 2 implements the core browsing experience for OpenPrep: problem listing with filters, company sidebar, and problem detail pages with markdown rendering. The key technical challenges are implementing a LeetCode-style company filter sidebar, recency filtering, and rich markdown rendering with syntax highlighting and LaTeX support. The existing codebase already has basic problem listing (ProblemList) and detail (ProblemDetail) components that need to be extended with the new features.

**Primary recommendation:** Extend the existing ProblemList component with a company sidebar (left panel), implement Supabase queries for filtering, and enhance ProblemDetail with react-markdown for rich content rendering.

---

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Company sidebar: Left panel with alphabetical A-Z list, company logos + names, search box with autocomplete, multiple selection with OR logic, top 20 shown initially
- Recency filters: 30d / 3mo / 6mo / 6mo+, default "All time", inside company sidebar
- Frequency badge: Progress bar badge with brand color, always visible
- Test cases: Below description, 2-3 examples, copy button, expected output hidden by default
- Markdown: React Markdown with remark/rehype plugins, syntax highlighting (Prism/Highlight.js), LaTeX support (KaTeX/MathJax), responsive images

### Claude's Discretion
- Implementation approach for company sidebar (expandable sections vs scrollable list)
- Exact filtering logic (client-side vs server-side)
- Test case expansion (show more examples)

### Deferred Ideas (OUT OF SCOPE)
- Code execution (Phase 3)
- Discussion forums
- Video explanations

</user_constraints>

---

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PROB-01 | User can view list of all problems with pagination | Existing ProblemList component with pagination |
| PROB-02 | User can filter problems by difficulty (Easy/Medium/Hard) | Already implemented in existing component |
| PROB-03 | User can filter problems by tags | Need to add category/tag filtering |
| PROB-04 | User can search problems by title | Already implemented (searchQuery state) |
| PROB-05 | User can view problem detail page with description | Existing ProblemDetail component |
| PROB-06 | User can view sample test cases for each problem | Need to enhance test case display with copy button |
| PROB-07 | Problem descriptions render as formatted markdown | Need react-markdown with syntax highlighting |
| COMP-01 | User can filter problems by company | Need company sidebar panel with checkboxes |
| COMP-02 | User can filter by recency period (30d/3mo/6mo/6mo+) | Need recency dropdown in sidebar |
| COMP-03 | User can see frequency score for company-problem combination | Need progress bar badge component |

</phase_requirements>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-markdown | ^9.0.0 | Markdown rendering | Standard React markdown library, supports plugins |
| remark-gfm | ^4.0.0 | GitHub Flavored Markdown | Tables, strikethrough, task lists |
| remark-math | ^7.0.0 | LaTeX math support | Math equations in problems |
| rehype-katex | ^7.0.0 | KaTeX rendering | Fast LaTeX rendering |
| rehype-highlight | ^7.0.0 | Syntax highlighting | Works with highlight.js |
| react-syntax-highlighter | ^15.0.0 | Code block highlighting | Better client-side highlighting option |
| @supabase/supabase-js | ^2.99.1 (existing) | Database queries | Already in project |
| lucide-react | ^0.564.0 (existing) | Icons | Already in project |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @radix-ui/react-checkbox | 1.3.3 (existing) | Checkbox for company selection | Multiple company selection |
| @radix-ui/react-progress | 1.1.8 (existing) | Progress bar for frequency | COMP-03 frequency badge |
| @radix-ui/react-scroll-area | 1.2.10 (existing) | Scrollable company list | Long company lists |
| @radix-ui/react-popover | 1.1.15 (existing) | Dropdowns/popovers | Recency filter dropdown |
| date-fns | 4.1.0 (existing) | Date utilities | Recency date calculations |
| katex | ^0.16.0 | LaTeX CSS styles | Must include for math rendering |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-markdown | remark + rehype directly | react-markdown is simpler wrapper |
| rehype-highlight | rehype-prism-plus | highlight.js more popular, prism needs more setup |
| KaTeX | MathJax | KaTeX is faster and lighter |
| react-syntax-highlighter | Prism directly | Easier API for React components |

**Installation:**
```bash
npm install react-markdown remark-gfm remark-math rehype-katex rehype-highlight react-syntax-highlighter katex
```

---

## Architecture Patterns

### Recommended Project Structure

```
components/
├── company-sidebar.tsx       # New: Company filter sidebar
├── recency-filter.tsx        # New: Recency dropdown (30d/3mo/etc)
├── frequency-badge.tsx       # New: Progress bar badge
├── test-case-list.tsx       # New: Test case display with copy
├── markdown-renderer.tsx     # New: Rich markdown component
└── problem-list.tsx         # Existing - needs extension

lib/
├── supabase/
│   ├── problems.ts          # Problem queries
│   └── companies.ts        # Company queries
└── mock-data.ts             # Existing - needs company data

app/problems/
├── page.tsx                 # Problem list page (update with sidebar)
└── [id]/
    └── page.tsx            # Problem detail (update with markdown)
```

### Pattern 1: Company Sidebar with Multi-Select

**What:** Left sidebar panel with alphabetical company list, search, and checkbox selection
**When to use:** When filtering problems by multiple companies (OR logic)
**Example:**
```tsx
// Source: Based on LeetCode company filter pattern
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface CompanySidebarProps {
  companies: Company[]
  selectedCompanies: string[]
  onSelectionChange: (ids: string[]) => void
  recencyFilter: string
  onRecencyChange: (period: string) => void
}

export function CompanySidebar({
  companies,
  selectedCompanies,
  onSelectionChange,
  recencyFilter,
  onRecencyChange
}: CompanySidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Group companies alphabetically
  const groupedCompanies = useMemo(() => {
    const filtered = companies.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return filtered.slice(0, 20) // Top 20 initially
  }, [companies, searchQuery])

  const handleToggle = (companyId: string) => {
    if (selectedCompanies.includes(companyId)) {
      onSelectionChange(selectedCompanies.filter(id => id !== companyId))
    } else {
      onSelectionChange([...selectedCompanies, companyId])
    }
  }

  return (
    <div className="w-72 border-r border-border h-full flex flex-col">
      {/* Recency Filter */}
      <div className="p-4 border-b border-border">
        <label className="text-sm font-medium mb-2 block">Recency</label>
        <Select value={recencyFilter} onValueChange={onRecencyChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="30d">Past Month</SelectItem>
            <SelectItem value="3mo">Past 3 Months</SelectItem>
            <SelectItem value="6mo">Past 6 Months</SelectItem>
            <SelectItem value="6mo+">6 Months+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Company Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Company List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {groupedCompanies.map((company) => (
            <div
              key={company.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-card cursor-pointer"
              onClick={() => handleToggle(company.id)}
            >
              <Checkbox checked={selectedCompanies.includes(company.id)} />
              <img src={company.logo} alt="" className="w-6 h-6 rounded" />
              <span className="flex-1 text-sm">{company.name}</span>
              <span className="text-xs text-muted-foreground">
                {company.problemCount}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
```

### Pattern 2: Markdown Renderer with Syntax Highlighting

**What:** Rich markdown component with code highlighting and math support
**When to use:** For rendering problem descriptions with code examples and formulas
**Example:**
```tsx
// Source: Based on react-markdown documentation
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            if (!inline && match) {
              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              )
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          img({ src, alt }) {
            return (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg"
                loading="lazy"
              />
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
```

### Pattern 3: Frequency Badge with Progress Bar

**What:** Progress bar showing company frequency for a problem
**When to use:** Display frequency score next to problem title in list/detail views
**Example:**
```tsx
// Source: Based on LeetCode frequency badge pattern
import { Progress } from '@/components/ui/progress'

interface FrequencyBadgeProps {
  frequency: number // 0-100
  maxFrequency: number
}

export function FrequencyBadge({ frequency, maxFrequency }: FrequencyBadgeProps) {
  const percentage = maxFrequency > 0 ? (frequency / maxFrequency) * 100 : 0
  
  return (
    <div className="flex items-center gap-2">
      <Progress 
        value={percentage} 
        className="w-16 h-2"
        indicatorClassName="bg-accent"
      />
      <span className="text-xs text-muted-foreground">
        {frequency}
      </span>
    </div>
  )
}
```

### Pattern 4: Test Cases with Copy Button

**What:** Expandable test case display with copy functionality
**When to use:** Showing sample input/output for problems
**Example:**
```tsx
// Source: Based on LeetCode test case layout
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check, Eye, EyeOff } from 'lucide-react'

interface TestCase {
  id: number
  input: string
  output: string
  explanation?: string
}

interface TestCaseListProps {
  testCases: TestCase[]
}

export function TestCaseList({ testCases }: TestCaseListProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [visibleOutputs, setVisibleOutputs] = useState<Set<number>>(new Set())

  const handleCopy = async (text: string, id: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleOutput = (id: number) => {
    const newVisible = new Set(visibleOutputs)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setVisibleOutputs(newVisible)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Test Cases</h3>
      {testCases.slice(0, 3).map((tc, idx) => (
        <div key={tc.id} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Example {idx + 1}</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(tc.input, tc.id)}
              >
                {copiedId === tc.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Input:</p>
              <pre className="bg-background p-2 rounded text-sm overflow-x-auto">
                {tc.input}
              </pre>
            </div>
            <div>
              <button
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => toggleOutput(tc.id)}
              >
                {visibleOutputs.has(tc.id) ? (
                  <EyeOff className="w-3 h-3" />
                ) : (
                  <Eye className="w-3 h-3" />
                )}
                Output: {visibleOutputs.has(tc.id) ? 'Click to hide' : 'Click to show'}
              </button>
              {visibleOutputs.has(tc.id) && (
                <pre className="bg-background p-2 rounded text-sm mt-1 overflow-x-auto">
                  {tc.output}
                </pre>
              )}
            </div>
            {tc.explanation && (
              <p className="text-xs text-muted-foreground">{tc.explanation}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Pattern 5: Supabase Filtering with Company and Recency

**What:** Query problems with company and recency filters
**When to use:** Fetching filtered problem data from Supabase
**Example:**
```tsx
// Source: Based on Supabase join documentation
import { supabase } from '@/lib/supabase'

interface FetchProblemsOptions {
  difficulty?: string
  tags?: string[]
  searchQuery?: string
  companyIds?: string[]
  recency?: '30d' | '3mo' | '6mo' | '6mo+' | 'all'
}

export async function fetchProblems(options: FetchProblemsOptions) {
  let query = supabase
    .from('problems')
    .select(`
      *,
      problem_tags(tag_id, tags(name)),
      problem_companies(company_id, companies(*), last_asked, frequency)
    `)

  // Difficulty filter
  if (options.difficulty && options.difficulty !== 'All') {
    query = query.eq('difficulty', options.difficulty)
  }

  // Search query
  if (options.searchQuery) {
    query = query.ilike('title', `%${options.searchQuery}%`)
  }

  // Company filter with recency
  if (options.companyIds && options.companyIds.length > 0) {
    const cutoffDate = getRecencyCutoff(options.recency)
    
    // Use RPC or view for complex filtering
    query = query.overlaps('company_ids', options.companyIds)
  }

  const { data, error } = await query
  
  if (error) throw error
  
  // Filter by recency on client if needed
  return data
}

function getRecencyCutoff(recency?: string): Date {
  const now = new Date()
  switch (recency) {
    case '30d':
      return new Date(now.setDate(now.getDate() - 30))
    case '3mo':
      return new Date(now.setMonth(now.getMonth() - 3))
    case '6mo':
      return new Date(now.setMonth(now.getMonth() - 6))
    case '6mo+':
      return new Date(now.setMonth(now.getMonth() - 6))
    default:
      return new Date(0)
  }
}
```

### Anti-Patterns to Avoid

- **Don't use client-side filtering for large datasets:** If there are 500+ problems, filter on the server side with Supabase queries rather than fetching all and filtering in React
- **Don't use generic code highlighting:** Use react-syntax-highlighter for better React integration rather than plain Prism.js
- **Don't skip LaTeX CSS:** Remember to import katex CSS or math rendering won't work: `import 'katex/dist/katex.min.css'`
- **Don't hide frequency completely:** Per requirements, it should be always visible as a progress bar, not a tooltip-only feature
- **Don't use dropdown for company selection:** Context explicitly says sidebar panel, not dropdown or modal

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown rendering | Custom parser | react-markdown | Handles edge cases, security, accessibility |
| Syntax highlighting | Custom regex | rehype-highlight or react-syntax-highlighter | Language detection, line numbers, themes |
| LaTeX math | MathJax only | remark-math + rehype-katex | Better integration, faster rendering |
| Checkbox groups | Custom state | @radix-ui/react-checkbox | Accessibility, keyboard nav |
| Progress bars | Custom CSS | @radix-ui/react-progress | Accessibility, animations |

**Key insight:** The markdown/syntax highlighting ecosystem is complex with many edge cases. Using established libraries handles security (XSS), accessibility, and cross-browser issues automatically.

---

## Common Pitfalls

### Pitfall 1: react-markdown v9 Breaking Changes
**What goes wrong:** Code that worked with react-markdown v8 fails with v9 due to API changes
**Why it happens:** v9 changed component prop names and removed some deprecated APIs
**How to avoid:** Pin to v8 or carefully read migration guide: components now receive `node` as first arg
**Warning signs:** `Cannot read property 'map' of undefined` errors

### Pitfall 2: Supabase Many-to-Many Filter Logic
**What goes wrong:** Company filter returns wrong results when multiple companies selected
**Why it happens:** Need to understand OR vs AND logic for multiple selections
**How to avoid:** Use `.overlaps()` or `.contains()` for array columns, not `.eq()`
**Warning signs:** Problems missing from results or duplicate results

### Pitfall 3: KaTeX Not Rendering
**What goes wrong:** Math formulas show raw LaTeX instead of rendered math
**Why it happens:** Missing CSS import or wrong plugin order
**How to avoid:** Add `import 'katex/dist/katex.min.css'` and ensure rehype-katex is in rehypePlugins array
**Warning signs:** `$$ math $$` displays as plain text

### Pitfall 4: Code Block Language Detection
**What goes wrong:** Code blocks not highlighting because language class not detected
**Why it happens:** react-markdown passes `language-js` but syntax highlighter expects `javascript`
**How to avoid:** Use regex to extract language: `/language-(\w+)/.exec(className || '')`
**Warning signs:** All code blocks look the same regardless of language

### Pitfall 5: Scrollable Sidebar Not Working
**What goes wrong:** Company list doesn't scroll, takes full height incorrectly
**Why it happens:** Missing proper height styling on parent containers
**How to avoid:** Ensure sidebar container has `h-full` and ScrollArea has `flex-1`
**Warning signs:** Sidebar extends below viewport or doesn't scroll

---

## Code Examples

### Combined Filter State Management
```tsx
// Source: Extending existing ProblemList with company filtering
'use client'
import { useState, useMemo, useCallback } from 'react'
import { ProblemList } from '@/components/problem-list'
import { CompanySidebar } from '@/components/company-sidebar'
import { fetchProblems } from '@/lib/supabase/problems'

interface FilterState {
  searchQuery: string
  difficulty: 'All' | 'Easy' | 'Medium' | 'Hard'
  category: string
  selectedCompanies: string[]
  recency: 'all' | '30d' | '3mo' | '6mo' | '6mo+'
}

export function ProblemsPage() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    difficulty: 'All',
    category: 'All',
    selectedCompanies: [],
    recency: 'all'
  })
  const [problems, setProblems] = useState<Problem[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch problems when filters change
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await fetchProblems({
          searchQuery: filters.searchQuery,
          difficulty: filters.difficulty,
          tags: filters.category !== 'All' ? [filters.category] : undefined,
          companyIds: filters.selectedCompanies,
          recency: filters.recency
        })
        setProblems(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [filters])

  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <CompanySidebar
        companies={companies}
        selectedCompanies={filters.selectedCompanies}
        onSelectionChange={(ids) => updateFilter('selectedCompanies', ids)}
        recencyFilter={filters.recency}
        onRecencyChange={(period) => updateFilter('recency', period)}
      />
      <div className="flex-1 overflow-auto">
        <ProblemList
          problems={problems}
          loading={loading}
          filters={filters}
          onFilterChange={updateFilter}
        />
      </div>
    </div>
  )
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom markdown parsing | react-markdown with remark/rehype | 2020+ | Better security, accessibility, plugin ecosystem |
| Prism.js client-only | rehype-highlight (SSR-friendly) | 2022+ | No layout shift, faster initial render |
| MathJax | KaTeX via rehype-katex | 2021+ | 10x faster rendering |
| Class-based components | Functional + Hooks | 2019+ | Standard React pattern |
| Enzyme testing | React Testing Library | 2020+ | Tests user behavior, not internals |

**Deprecated/outdated:**
- `remark-prism`: Use `rehype-highlight` or `react-syntax-highlighter` instead
- `react-markdown` v7 and below: Upgrade to v8+ for better security
- `enzyme`: Deprecated, use React Testing Library

---

## Open Questions

1. **Database Schema for Companies**
   - What we know: Need `companies` table with logo, name; `problem_companies` junction table with frequency and last_asked
   - What's unclear: Exact schema for recency filtering (stored date vs computed)
   - Recommendation: Store `last_asked` as timestamp, compute recency on query

2. **Client vs Server Filtering**
   - What we know: CONTEXT.md allows discretion on filtering approach
   - What's unclear: Dataset size will determine if client-side is acceptable
   - Recommendation: Start with client-side for < 500 problems, move to server if needed

3. **Initial Company List Loading**
   - What we know: Top 20 shown, scroll for more (per CONTEXT.md)
   - What's unclear: Load all and slice client-side, or paginate?
   - Recommendation: Load all (likely < 200 companies) for smooth UX, slice client-side

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest + React Testing Library |
| Config file | `vitest.config.ts` (to be created) |
| Quick run command | `vitest run --reporter=verbose` |
| Full suite command | `vitest run --coverage` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PROB-01 | View paginated problem list | unit | `vitest run src/components/problem-list.test.tsx` | ❌ |
| PROB-02 | Filter by difficulty | unit | `vitest run src/components/problem-list.test.tsx` | ❌ |
| PROB-03 | Filter by tags | unit | `vitest run src/components/problem-list.test.tsx` | ❌ |
| PROB-04 | Search by title | unit | `vitest run src/components/problem-list.test.tsx` | ❌ |
| PROB-05 | View problem detail | unit | `vitest run src/components/problem-detail.test.tsx` | ❌ |
| PROB-06 | View test cases with copy | unit | `vitest run src/components/test-case-list.test.tsx` | ❌ |
| PROB-07 | Markdown renders correctly | unit | `vitest run src/components/markdown-renderer.test.tsx` | ❌ |
| COMP-01 | Filter by company | unit | `vitest run src/components/company-sidebar.test.tsx` | ❌ |
| COMP-02 | Filter by recency | unit | `vitest run src/components/recency-filter.test.tsx` | ❌ |
| COMP-03 | See frequency badge | unit | `vitest run src/components/frequency-badge.test.tsx` | ❌ |

### Sampling Rate
- **Per task commit:** `vitest run --reporter=verbose` (runs changed tests)
- **Per wave merge:** `vitest run --coverage` (full suite)
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `vitest.config.ts` — Vitest configuration for Next.js/React
- [ ] `tests/setup.ts` — Test setup with jest-dom matchers
- [ ] `tests/components/problem-list.test.tsx` — Tests for PROB-01 to PROB-04
- [ ] `tests/components/problem-detail.test.tsx` — Tests for PROB-05
- [ ] `tests/components/markdown-renderer.test.tsx` — Tests for PROB-07
- [ ] `tests/components/company-sidebar.test.tsx` — Tests for COMP-01
- [ ] `tests/components/test-case-list.test.tsx` — Tests for PROB-06
- [ ] Install: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom` — Test dependencies

---

## Sources

### Primary (HIGH confidence)
- [react-markdown npm](https://www.npmjs.com/package/react-markdown) - Core markdown library documentation
- [Supabase JS Reference](https://supabase.com/docs/reference/javascript/select) - Database queries
- [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) - Code highlighting

### Secondary (MEDIUM confidence)
- [remark/rehype plugins guide](https://app.studyraid.com/en/read/11460/359233/using-remark-and-rehype-plugins-with-react-markdown) - Plugin integration
- [Supabase joins documentation](https://supabase.com/docs/guides/database/joins-and-nesting) - Complex queries

### Tertiary (LOW confidence)
- [WebSearch: React Testing Library + Vitest best practices](https://medium.com/@samueldeveloper/react-testing-library-vitest-the-mistakes-that-haunt-developers-and-how-to-fight-them-like-ca0a0cda2ef8) - Testing patterns

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - react-markdown ecosystem well-established, Supabase integration documented
- Architecture: HIGH - Patterns based on existing codebase + LeetCode reference
- Pitfalls: MEDIUM - Identified common issues from documentation, some unverified

**Research date:** 2026-03-12
**Valid until:** 2026-04-12 (30 days - stable ecosystem)
