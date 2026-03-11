# Technology Stack

**Project:** OpenPrep (LeetCode Alternative)
**Researched:** March 2026
**Confidence:** HIGH

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 14.x (latest 14.2.x) | Full-stack framework with App Router | Server Components reduce JS bundle, App Router provides nested layouts, built-in API routes, and streaming. Industry standard for React in 2025. |
| React | 18.x | UI library | Next.js dependency. Use Server Components by default, 'use client' only for interactivity. |
| TypeScript | 5.x (5.4+) | Type safety | Required for maintainability. Next.js 14 has first-class TypeScript support. |

### Styling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | 3.4.x | Utility-first CSS | Already in project. Use @tailwindcss/typography for problem descriptions, clsx/tailwind-merge for conditional classes. |
| shadcn/ui | Latest | Component library | Built on Radix UI primitives, accessible, customizable. Copy components into project (not npm dependency). |
| Lucide React | Latest | Icons | Lightweight, consistent design system. |

### Code Editor

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Monaco Editor | 0.50+ | In-browser code editor | Powers VS Code. Excellent IntelliSense, multi-language support. Already in project. |
| @monaco-editor/react | 4.6+ | React wrapper | Official Monaco React binding. Lazy-load editor to improve initial page load. |

**Why Monaco over CodeMirror:** Monaco provides superior IntelliSense and debugging support out of the box. CodeMirror 6 requires more configuration for equivalent features. Monaco's 5-10MB bundle is acceptable for a coding platform where the editor is the core feature.

### Backend & Database

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Supabase | Latest | Backend-as-a-service | Already in project. Provides PostgreSQL, Auth, and auto-generated APIs. |
| PostgreSQL | Via Supabase | Primary database | Relational data fits problem → test case → submission model. JSONB for flexible problem metadata. |
| Drizzle ORM | 0.33+ | Type-safe database queries | Lighter than Prisma (80KB vs 15MB bundle). Native TypeScript support. Better cold starts than Prisma. |

**Why NOT MongoDB:** Coding platform data is highly relational (problems have companies, topics, test cases, submissions). PostgreSQL's JSONB handles flexible metadata while maintaining relational integrity. Supabase's ecosystem is PostgreSQL-first.

### Code Execution

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Judge0 | Latest | Code execution API | Already in project. Supports 14+ languages, free self-hosted option, CE (Community Edition) available. |
| Docker | 24+ | Container isolation | Run Judge0 in Docker containers. Use gVisor (runsc) for additional sandboxing in production. |

**Self-Hosted Judge0 Architecture:**
```
┌─────────────────────────────────────────────────┐
│                 Next.js App                      │
│  (problem list, editor, submission history)     │
└─────────────────┬───────────────────────────────┘
                  │ HTTP
                  ▼
┌─────────────────────────────────────────────────┐
│            Judge0 API Server                     │
│  - /submissions/{id} endpoint                   │
│  - Language detection                           │
│  - Output capture                               │
└─────────────────┬───────────────────────────────┘
                  │ Spawns
                  ▼
┌─────────────────────────────────────────────────┐
│         Docker Containers (isolated)            │
│  - Per-execution container or                   │
│  - Reused with cleanup                          │
│  - gVisor layer for production                  │
└─────────────────────────────────────────────────┘
```

### Authentication

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Supabase Auth | Via @supabase/ssr | User authentication | Already in project. Supports email + GitHub OAuth out of the box. Use @supabase/ssr for Next.js App Router compatibility. |

### State Management & Data Fetching

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| TanStack Query | 5.x | Server state management | Recommended over Redux. Automatic caching, background refetching, optimistic updates for submissions. |
| Zustand | 4.x | Client state | Lightweight (1KB). Use for UI state (sidebar toggle, theme, command palette open). |

**Why NOT Redux:** Overkill for this use case. Redux adds significant boilerplate. TanStack Query handles server state, Zustand handles client state—simpler combination.

### Testing

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vitest | 2.x | Unit testing | Fast, Vite-native, compatible with Jest APIs. Use for utility functions. |
| Playwright | 1.45+ | E2E testing | Best for complex flows (submit solution, verify results). |
| @testing-library/react | Latest | Component testing | For testing individual components. |

### Development Tools

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| ESLint | 9.x | Code linting | Next.js includes ESLint config. Use flat config style. |
| Prettier | 3.x | Code formatting | Standard. Integrate with ESLint using eslint-config-prettier. |
| Bun | 1.x (or Node 20+) | Package manager/runtime | Faster than npm. Use 1.1+ for Bun Lockfile compatibility. |

## Installation

```bash
# Core dependencies
npm install next@14.2 react@18 react-dom@18 typescript@5 @types/react @types/node

# Styling
npm install tailwindcss@3.4 postcss autoprefixer @tailwindcss/typography clsx tailwind-merge lucide-react

# UI Components (shadcn/ui pattern - copy into project)
# npm install @radix-ui/react-slot @radix-ui/react-dialog ...

# Code Editor
npm install @monaco-editor/react@4.6 monaco-editor@0.50

# Backend
npm install @supabase/supabase-js @supabase/ssr drizzle-orm

# State & Data
npm install @tanstack/react-query@5 zustand@4

# Dev dependencies
npm install -D vitest@2 @testing-library/react@latest playwright@1.45 eslint@9 prettier@3

# Database
npm install -D drizzle-kit
```

## Project Structure

```
openprep/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes (login, register)
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # Main app routes
│   │   ├── problems/
│   │   │   ├── page.tsx          # Problem list
│   │   │   └── [slug]/page.tsx    # Problem detail
│   │   ├── submissions/
│   │   └── layout.tsx
│   ├── api/                      # API routes
│   │   ├── problems/route.ts
│   │   └── execute/route.ts      # Judge0 integration
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── editor/
│   │   ├── CodeEditor.tsx        # Monaco wrapper
│   │   └── OutputPanel.tsx
│   ├── problems/
│   │   ├── ProblemList.tsx
│   │   ├── ProblemCard.tsx
│   │   └── TestCaseRunner.tsx
│   └── navigation/
│       ├── Navbar.tsx
│       └── Sidebar.tsx
├── lib/
│   ├── db/                       # Drizzle setup
│   │   ├── schema.ts
│   │   └── index.ts
│   ├── judge0.ts                 # Judge0 client
│   ├── supabase.ts               # Supabase client
│   └── utils.ts                  # clsx, helper functions
├── hooks/
│   ├── useProblems.ts            # TanStack Query hooks
│   ├── useSubmission.ts
│   └── useCodeExecution.ts
├── types/
│   └── index.ts                  # TypeScript interfaces
├── scripts/                      # Data import scripts
│   └── import-problems.ts
├── public/                       # Static assets
├── supabase/                     # Supabase config
│   └── migrations/
├── .env.local                    # Environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── drizzle.config.ts
└── package.json
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Judge0
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com (or self-hosted)
JUDGE0_API_KEY=your-api-key (if using hosted)

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Anti-Recommendations

| Category | Avoid | Why |
|----------|-------|-----|
| Routing | Pages Router | App Router is the standard in Next.js 14+. Server Components, streaming, and nested layouts are essential for coding platforms. |
| Editor | CodeMirror | More configuration needed for IntelliSense. Monaco provides VS Code experience out of the box. |
| Editor | Ace Editor | Outdated, less maintained. Monaco has better modern language support. |
| Database | MongoDB | Relational data (problems → test cases → submissions) fits PostgreSQL better. Supabase is PostgreSQL-first. |
| State | Redux | Overkill. TanStack Query + Zustand covers all use cases with less boilerplate. |
| Styling | Styled Components | Tailwind is faster, smaller bundle, consistent with project. |
| Testing | Jest | Vitest is faster, built for Vite/ESM. Jest still works but Vitest is 2025 default. |
| Package Manager | npm (slow) | Use Bun (fastest) or pnpm (good). npm is noticeably slower for CI/CD. |
| Auth | NextAuth.js | Use Supabase Auth directly. Less overhead, better Supabase integration. |

## Key Architecture Decisions

### 1. Server Components by Default
Next.js 14 App Router uses Server Components by default. This reduces JavaScript sent to client—critical for initial load performance.

```tsx
// Server Component (default) - for data fetching
async function ProblemList() {
  const problems = await db.query.problems.findMany();
  return <ProblemCard problems={problems} />;
}

// Client Component - only when needed
'use client';
function CodeEditor({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode);
  // Interactive logic
}
```

### 2. Drizzle ORM over Prisma
Drizzle is lighter (80KB vs 15MB), has faster cold starts, and generates SQL you can read. Prisma has better DX but overhead matters at scale.

```typescript
// drizzle/schema.ts
export const problems = pgTable('problems', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  difficulty: text('difficulty').notNull(),
  description: json('description'), // Markdown + examples
  companies: json('companies'), // Array of company names
  topics: json('topics'), // Array of topics
  testCases: json('test_cases'),
  starterCode: json('starter_code'), // Per-language
});

// Query
const problemList = await db.query.problems.findMany({
  where: eq(problems.difficulty, 'Easy'),
  orderBy: [desc(problems.id)],
  limit: 20,
});
```

### 3. Judge0 Integration Pattern
Execute code client-side submission to avoid server load, or proxy through API route for rate limiting.

```typescript
// lib/judge0.ts
export async function executeCode(code: string, language: string, input: string) {
  const response = await fetch(`${process.env.JUDGE0_API_URL}/submissions?base64=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': process.env.JUDGE0_API_KEY!,
    },
    body: JSON.stringify({
      source_code: Buffer.from(code).toString('base64'),
      language_id: LANGUAGE_IDS[language],
      stdin: Buffer.from(input).toString('base64'),
    }),
  });
  
  const { token } = await response.json();
  
  // Poll for result
  // Return stdout, stderr, execution time
}
```

### 4. Streaming for Problem Descriptions
Problem descriptions contain markdown. Use React Server Components with streaming to show content while loading related data.

```tsx
// app/problems/[slug]/page.tsx
export default async function ProblemPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<ProblemSkeleton />}>
      <ProblemDescription slug={params.slug} />
    </Suspense>
  );
}
```

## Sources

- [Next.js 14 App Router Documentation](https://nextjs.org/docs/app) - HIGH
- [Monaco Editor GitHub](https://github.com/microsoft/monaco-editor) - HIGH
- [Judge0 Documentation](https://judge0.com/) - HIGH
- [Drizzle ORM Documentation](https://orm.drizzle.team/) - HIGH
- [TanStack Query Documentation](https://tanstack.com/query/latest) - HIGH
- [Supabase Documentation](https://supabase.com/docs) - HIGH
- [WebSearch: CodeMirror vs Monaco 2025](https://stackshare.io/stackups/codemirror-vs-monaco-editor) - MEDIUM
- [WebSearch: PostgreSQL vs MongoDB 2025](https://dev.to/hamzakhan/postgresql-vs-mongodb-in-2025-which-database-should-power-your-next-project-2h97) - MEDIUM
