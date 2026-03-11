# OpenPrep — Build Plan
> For OpenCode "Get Shit Done" Plugin — Claude Sonnet 4.5
> Stack: Next.js 14 (App Router) + Supabase + Judge0 + Monaco Editor + Tailwind CSS
> Design: Already generated via v0 — wire up components, don't redesign anything

---

## CONTEXT

OpenPrep is a free LeetCode alternative with:
- 2000+ problems with difficulty, tags, company-wise filters
- 470+ companies each with 4 recency tiers (30d, 3mo, 6mo, 6mo+)
- Frequency scores per problem per company (0-100)
- Free problem descriptions ready, paid ones LLM-generated
- Sample test cases for every problem
- Judge0 for code execution
- No paywalls, no ads, fully open source

UI components are already built via v0. Your job is to wire everything together.

---

## PHASE 0 — Project Setup

### Task 0.1 — Initialize Next.js Project
- Create Next.js 14 app with App Router
- Install dependencies: `@supabase/supabase-js`, `@monaco-editor/react`, `tailwindcss`, `shadcn/ui`, `axios`, `react-query`, `zustand`, `date-fns`, `recharts`
- Setup `.env.local` with placeholder keys:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `JUDGE0_API_URL`
  - `JUDGE0_API_KEY`
- Setup folder structure:
```
app/
  (auth)/login/page.tsx
  (auth)/signup/page.tsx
  problems/page.tsx
  problems/[slug]/page.tsx
  dashboard/page.tsx
  api/
    execute/route.ts
    submit/route.ts
components/
  ui/ (from v0/shadcn)
  editor/
  problems/
  dashboard/
lib/
  supabase.ts
  judge0.ts
  utils.ts
types/
  index.ts
```

### Task 0.2 — Supabase Project Setup
- Create Supabase project
- Enable Row Level Security on all tables
- Enable Auth (email + GitHub OAuth)

---

## PHASE 1 — Database Schema

### Task 1.1 — Create Tables in Supabase

Run the following SQL exactly:

```sql
-- Problems table
CREATE TABLE problems (
  id SERIAL PRIMARY KEY,
  leetcode_id INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) NOT NULL,
  is_paid BOOLEAN DEFAULT false,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  acceptance_rate FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test cases table
CREATE TABLE test_cases (
  id SERIAL PRIMARY KEY,
  problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  is_sample BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Companies table
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company problem mappings
CREATE TABLE company_problems (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
  frequency FLOAT DEFAULT 0,
  acceptance_rate FLOAT,
  time_period TEXT CHECK (time_period IN ('30d', '3mo', '6mo', '6mo+', 'all')) NOT NULL,
  UNIQUE(company_id, problem_id, time_period)
);

-- Users profile (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  github_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions table
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  status TEXT CHECK (status IN ('Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compile Error')) NOT NULL,
  runtime_ms INTEGER,
  memory_kb INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily challenge table
CREATE TABLE daily_challenges (
  id SERIAL PRIMARY KEY,
  problem_id INTEGER REFERENCES problems(id),
  challenge_date DATE UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_tags ON problems USING GIN(tags);
CREATE INDEX idx_company_problems_company ON company_problems(company_id);
CREATE INDEX idx_company_problems_period ON company_problems(time_period);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_problem ON submissions(problem_id);
```

### Task 1.2 — Row Level Security Policies

```sql
-- Profiles: users can only update their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Submissions: users can only see their own
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own submissions" ON submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own submissions" ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Problems: public read
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Problems are publicly readable" ON problems FOR SELECT USING (true);

-- Company problems: public read
ALTER TABLE company_problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Company problems are publicly readable" ON company_problems FOR SELECT USING (true);
```

---

## PHASE 2 — Data Pipeline

### Task 2.1 — Write Python Import Script for Problems

Create `scripts/import_problems.py`:
- Read main problems CSV (columns: id, title, slug, difficulty, is_paid, tags, url, description)
- Clean tags: split comma-separated string into array
- Skip rows where description is NaN and is_paid is True (handled separately)
- Upsert into Supabase `problems` table using `leetcode_id` as unique key
- Log progress every 100 rows
- Use `supabase-py` library

### Task 2.2 — Write Python Import Script for Companies

Create `scripts/import_companies.py`:
- Walk through `/data/companies/` directory
- Each folder name = company name
- Generate slug from company name (lowercase, hyphens)
- Insert into `companies` table
- For each CSV file in the folder (1-5):
  - Map filename to time_period: "1. Thirty Days.csv" → "30d", "2. Three Months.csv" → "3mo", "3. Six Months.csv" → "6mo", "4. More Than Six Months.csv" → "6mo+", "5. All.csv" → "all"
  - Read CSV columns: Difficulty, Title, Frequency, Acceptance Rate, Link, Topics
  - Match problem by title to get problem_id from problems table
  - Upsert into `company_problems` table
- Log companies processed and any unmatched problems

### Task 2.3 — Write Python Script for LLM Description Generation

Create `scripts/generate_descriptions.py`:
- Query Supabase for all problems where description IS NULL and is_paid = true
- For each problem, call local Ollama API:
  ```
  POST http://localhost:11434/api/generate
  model: llama3.2:latest
  prompt: "Generate a LeetCode-style problem description for: {title}. Include: problem statement, constraints, 2 examples with input/output/explanation. Format in markdown. Be precise and technical."
  ```
- Parse response, clean markdown
- Update problem description in Supabase
- Add 1 second delay between calls to avoid overwhelming Ollama
- Log progress and failures

### Task 2.4 — Write Python Script for Test Case Generation

Create `scripts/generate_testcases.py`:
- Query problems that have no test cases in `test_cases` table
- For each problem call Ollama:
  ```
  prompt: "Generate exactly 3 test cases for this coding problem: {title} - {description}. Return ONLY valid JSON array: [{input: string, output: string}, ...]. No explanation."
  ```
- Parse JSON response carefully with try/catch
- Insert into `test_cases` table with is_sample = true
- Skip and log any problems where JSON parsing fails

---

## PHASE 3 — Backend API Routes

### Task 3.1 — Supabase Client Setup

Create `lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

Create `lib/supabase-server.ts` for server components using `createServerClient` from `@supabase/ssr`.

### Task 3.2 — Judge0 Integration

Create `lib/judge0.ts`:
- `executeCode(code, languageId, stdin)` — POST to Judge0 `/submissions?wait=true`
- `getLanguageId(language: string)` — map language name to Judge0 language ID:
  ```
  Python3 → 71, JavaScript → 63, Java → 62, C++ → 54,
  C → 50, Go → 60, Rust → 73, TypeScript → 74,
  Kotlin → 78, Swift → 83, C# → 51, Ruby → 72,
  Scala → 81, PHP → 68
  ```
- Return: `{ stdout, stderr, status, time, memory }`
- Handle errors gracefully, return meaningful error messages

### Task 3.3 — Execute API Route

Create `app/api/execute/route.ts`:
- Accept POST: `{ code, language, problemId, input }`
- Call Judge0 with provided input (run mode — not submission)
- Return stdout, stderr, runtime, memory
- No auth required for running code
- Rate limit: 10 requests per minute per IP using simple in-memory store

### Task 3.4 — Submit API Route

Create `app/api/submit/route.ts`:
- Accept POST: `{ code, language, problemId }`
- Require auth — check Supabase session
- Fetch all sample test cases for problemId from Supabase
- Run code against each test case via Judge0 sequentially
- Compare output (trim whitespace before comparing)
- If all pass → status = "Accepted"
- If any fail → status = "Wrong Answer", return which test case failed
- Save submission to `submissions` table
- Return: `{ status, passedCases, totalCases, runtime, memory, submissionId }`

### Task 3.5 — Problems API Route

Create `app/api/problems/route.ts`:
- Accept GET with query params: `difficulty`, `tags`, `company`, `period`, `status`, `search`, `page`, `limit`
- Build dynamic Supabase query based on filters
- Join with `company_problems` when company filter is active
- Join with user submissions when status filter is active (requires auth)
- Return paginated results with total count
- Default: page=1, limit=50

---

## PHASE 4 — Core Pages

### Task 4.1 — Problem List Page

File: `app/problems/page.tsx`

- Server component — fetch initial problems server side
- Render v0-generated ProblemList component
- Wire filter state using URL search params (not useState) so filters are shareable/bookmarkable
- Filters: difficulty, tags (multiselect), company (dropdown with search), period (30d/3mo/6mo/6mo+/all), status
- Each filter change updates URL params and refetches
- Frequency bar: render as `<div>` with orange width % based on frequency value
- Solved status: check user's submissions for green checkmark
- Pagination: load more button (not infinite scroll for V1)
- Daily challenge banner at top — fetch today's challenge from `daily_challenges` table

### Task 4.2 — Problem Detail Page

File: `app/problems/[slug]/page.tsx`

- Fetch problem by slug server side
- Fetch company tags for this problem (which companies asked it, with periods)
- Fetch sample test cases
- Left panel: render description as markdown using `react-markdown` with `remark-gfm`
- Right panel: Monaco editor
  - Default language: Python3
  - Theme: vs-dark with orange cursor (`#f97316`)
  - Font: JetBrains Mono 14px
  - Show boilerplate code based on language selected
- Language switcher: dropdown, changing language resets editor to boilerplate for that language
- Run button: calls `/api/execute` with current code + first sample test case input
- Submit button: calls `/api/submit`, shows result overlay
- Test case panel: tabs for each test case, shows input/expected/actual output
- Verdict display: large ACCEPTED (green) or WRONG ANSWER (red) with test case breakdown

### Task 4.3 — Auth Pages

File: `app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx`

- Use Supabase Auth UI or build custom form
- Support: email/password + GitHub OAuth
- On signup: create profile row in `profiles` table via database trigger:
  ```sql
  CREATE OR REPLACE FUNCTION handle_new_user()
  RETURNS trigger AS $$
  BEGIN
    INSERT INTO profiles (id, username, avatar_url)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'avatar_url');
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  ```
- Redirect to `/problems` after login

### Task 4.4 — User Dashboard Page

File: `app/dashboard/page.tsx`

Requires auth. Fetch all data server side:

**Stats Section:**
- Query: count submissions by status per difficulty for current user
- Show: Total Solved, Easy Solved, Medium Solved, Hard Solved
- Donut chart using recharts — orange/green/yellow/red theme

**Contribution Heatmap:**
- Query: count submissions per day for last 52 weeks grouped by date
- Render 52×7 grid of divs
- Color scale based on count:
  - 0: `#161b22`
  - 1-2: `#431407`
  - 3-5: `#c2410c`
  - 6-9: `#f97316`
  - 10+: `#fb923c`
- Tooltip on hover: "X problems solved on {date}"
- Month labels above, day labels (Mon/Wed/Fri) on left

**Topic Frequency Heatmap:**
- Query: count accepted submissions per tag for current user
- Group by DSA topic: Arrays, Strings, DP, Graphs, Trees, Greedy, Binary Search, etc.
- Render as grid of topic cards with orange intensity fill
- Show mastery badge: <5=Beginner, 5-20=Intermediate, 20+=Advanced

**Total Solved Panel:**
- Large number, comparison to platform average (calculate percentile from all users)
- Weekly goal: default 7 problems/week, show orange progress bar

**Recent Submissions Table:**
- Last 20 submissions: problem title, verdict badge, language, runtime, date
- Click problem title → goes to problem page

**Badges Section:**
- Check conditions and award badges:
  - "First Blood" — first accepted submission
  - "On Fire" — 7 day streak
  - "Century" — 100 problems solved
  - "Speed Demon" — runtime in top 10%
  - "Polyglot" — submitted in 5+ languages

---

## PHASE 5 — Developer Features

### Task 5.1 — Command Palette (CMD+K)

Create `components/CommandPalette.tsx`:
- Trigger: `Cmd+K` / `Ctrl+K` global keyboard shortcut
- Modal overlay with search input
- Search across: problems (by title/ID), topics, companies
- Keyboard navigable (arrow keys + enter)
- Actions: "Go to problem", "Filter by company", "Switch language"
- Use `cmdk` library for this

### Task 5.2 — GitHub Sync Feature (UI Only for V1)

- Show GitHub integration card on dashboard
- "Connect GitHub" button → OAuth flow (implement in V2)
- For V1: show as connected if GitHub OAuth was used to sign in
- Display: "Auto-sync enabled — solutions pushed to github.com/{username}/openprep"
- Show as coming soon if not connected

### Task 5.3 — REST API Access Card

Create component `components/ApiAccessCard.tsx`:
- Show on dashboard
- Display user's API key (generate on profile creation, store in profiles table — add `api_key` column)
- Copy to clipboard button
- Show usage stats: requests today / requests this month (hardcode limits: 1000/day, 10000/month for V1)
- Link to API docs page (create `app/api-docs/page.tsx` with basic endpoint documentation)

### Task 5.4 — Export Progress

- Button on dashboard: Export dropdown → CSV / JSON
- CSV export: all submissions with columns: problem_title, difficulty, status, language, runtime, date
- JSON export: full profile stats + submissions array
- Generate client-side using Blob API, trigger download

### Task 5.5 — Keyboard Shortcuts

- `?` key → opens shortcuts modal
- Shortcuts to implement:
  - `CMD+K` → Command palette
  - `CMD+Enter` → Run code (on problem page)
  - `CMD+Shift+Enter` → Submit code
  - `CMD+/` → Toggle comment in editor
  - `?` → Show shortcuts
  - `ESC` → Close any modal

---

## PHASE 6 — Polish & Performance

### Task 6.1 — Loading States
- Skeleton screens for problem list rows
- Skeleton for dashboard stats
- Spinner overlay for code execution (show "Running..." with animated dots)

### Task 6.2 — Error States
- Empty state for no problems found (with filter reset button)
- Error boundary for editor crashes
- Toast notifications for: submission result, copy to clipboard, export complete

### Task 6.3 — SEO & Metadata
- Dynamic metadata for each problem page: `{title} - OpenPrep`
- OG image generation for problem pages using Next.js `ImageResponse`
- Sitemap generation for all problem slugs

### Task 6.4 — Performance
- Problems list: implement virtual scrolling if list exceeds 200 rows
- Problem descriptions: cache in Redis or Supabase edge cache (V2)
- Images: use Next.js `<Image>` for all images
- Bundle: analyze with `@next/bundle-analyzer`, keep under 200kb initial JS

---

## ENVIRONMENT VARIABLES NEEDED

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Judge0
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## LAUNCH CHECKLIST

- [ ] All 2000+ problems imported with descriptions
- [ ] All 470 companies imported with mappings
- [ ] Test cases exist for minimum 500 problems
- [ ] Judge0 executes all 14 languages correctly
- [ ] Auth flow works (email + GitHub)
- [ ] Problem list filters all work correctly
- [ ] Frequency bars display correctly
- [ ] Code execution returns correct verdicts
- [ ] Dashboard heatmaps render correctly
- [ ] Mobile responsive (test on 375px width)
- [ ] ENV variables set for production
- [ ] Supabase RLS tested and confirmed
- [ ] Deploy to Vercel

---

## NOTES FOR AI AGENT

- Always use TypeScript, never plain JS
- Use `async/await`, never `.then()` chains
- All Supabase queries must handle errors explicitly
- Never store sensitive data in localStorage
- Judge0 calls must always be server-side (never expose API key to client)
- Use `zustand` for global state (editor language, theme preference)
- Use `react-query` for all data fetching with proper cache keys
- Component files: PascalCase. Utility files: camelCase
- All UI comes from v0-generated components — do not redesign, only wire up
- When in doubt about UI, check the v0 output first