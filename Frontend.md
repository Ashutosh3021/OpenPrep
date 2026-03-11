---------------- nav bar ----------------
DESIGN SYSTEM — apply to everything:

Build a top navigation bar for "OpenPrep" — a dark modern coding platform.

Tech stack: Next.js 14, Tailwind CSS, shadcn/ui, TypeScript.

Layout (left to right):
- LEFT: Logo mark (small orange square bracket icon `</>` in #f97316) + "OpenPrep" text in Inter bold
- CENTER: Nav links — Problems, Roadmap, Contests, Discuss (text-muted, hover turns text-primary)
- RIGHT: 
  - Streak counter (🔥 icon + "12 day streak" in orange)
  - Notification bell icon (with orange dot indicator)
  - "Sign In" ghost button
  - "Get Started" filled orange button

Specs:
- Height: 56px
- Background: #0d1117 with border-bottom: 1px solid #30363d
- Sticky, backdrop-blur on scroll
- Active nav link: orange underline, text-primary
- Mobile: hamburger menu collapses center links
- All buttons: rounded-md, 150ms hover transition
- No logo text shadow, no gradients on navbar

------------------ problem list ------------------
DESIGN SYSTEM — apply to everything:
[paste design system block above]

Build a full problem list page for "OpenPrep" coding platform.

Tech stack: Next.js 14, Tailwind CSS, shadcn/ui, TypeScript.

PAGE LAYOUT:
- Full width, min-height 100vh, bg #0d1117
- Top: filter bar (full width)
- Below: problem table (full width, no sidebar)

FILTER BAR (horizontal, sticky below navbar):
- Background: #161b22, border-bottom: 1px solid #30363d, padding: 12px 24px
- Filters in one row (wrap on mobile):
  1. Search input — placeholder "Search problems...", icon left, bg #0d1117, border #30363d
  2. Difficulty dropdown — All / Easy / Medium / Hard
  3. Tags multiselect dropdown — Array, DP, Graph, Tree, String, etc.
  4. Company dropdown — searchable, shows company name list (e.g. Google, Meta, Amazon)
  5. Recency chips — "30d" "3mo" "6mo" "6mo+" "All" as toggle buttons, active = orange filled
  6. Status filter — All / Solved / Attempted / Unsolved
- All dropdowns: bg #161b22, border #30363d, options hover bg #1c2128

PROBLEM TABLE:
- Columns: Status | # | Title | Acceptance | Difficulty | Frequency | Tags
- Status column: green checkmark (solved), orange dot (attempted), empty circle (unsolved)
- # column: problem number, text-muted, monospace font
- Title column: problem name, text-primary, hover turns orange, bold
- Acceptance column: percentage, text-muted, monospace
- Difficulty column: pill badge
  - Easy: bg rgba(63,185,80,0.1), text #3fb950, border rgba(63,185,80,0.2)
  - Medium: bg rgba(210,153,34,0.1), text #d29922, border rgba(210,153,34,0.2)
  - Hard: bg rgba(248,81,73,0.1), text #f85149, border rgba(248,81,73,0.2)
- Frequency column: thin horizontal bar
  - Container: full width of cell, height 6px, bg #21262d, rounded-full
  - Fill: #f97316, width = frequency% (e.g. 87% width)
  - Show percentage number on hover as tooltip
- Tags column: small chip pills, bg #21262d, text-muted, max 2 tags shown + "+N more"
- Row hover: bg #1c2128, left border 2px solid #f97316
- Table header: text-muted, uppercase, font-size 11px, letter-spacing 0.5px, border-bottom #30363d

DAILY CHALLENGE BANNER (above table):
- bg #161b22, border #30363d, border-left 3px solid #f97316, border-radius 8px
- Left: "🔥 Daily Challenge" label in orange + problem title + difficulty badge
- Right: countdown timer "Resets in 14:23:01" in monospace + "Solve Today →" orange button
- Compact, single row, margin-bottom 16px

PAGINATION:
- Bottom of table: "Showing 1-50 of 2347 problems"
- Previous / Next buttons, ghost style, disabled state when at limits

------------------ problem detail ------------------

DESIGN SYSTEM — apply to everything:
[paste design system block above]

Build a problem detail page for "OpenPrep" coding platform.

Tech stack: Next.js 14, Tailwind CSS, shadcn/ui, TypeScript. Use @monaco-editor/react for the code editor.

PAGE LAYOUT:
- Full width, full height (no scroll on outer container)
- Split panel: LEFT 45% | RIGHT 55%
- Thin drag handle in center (bg #30363d, hover bg #f97316)
- Both panels independently scrollable

LEFT PANEL — Problem Description:
Top header row:
- Problem number (text-muted monospace) + Problem title (text-primary, font-bold, Inter)
- Difficulty badge (same pill style as problem list)
- Acceptance rate (text-muted, small)

Company tags row (below header):
- Label "Asked by:" text-muted
- Company chips: border #30363d, text-muted, rounded-md, px-2 py-1, text-xs
- Recency chip next to each company: "30d" in orange, "3mo" in yellow, "6mo" in muted
- Example: [Google 🟠 30d] [Meta 🟡 3mo] [Amazon]

Tab bar:
- Tabs: Description | Solutions | Discuss | Submissions
- Active tab: text-primary + border-bottom 2px solid #f97316
- Inactive: text-muted, hover text-primary

Description tab content:
- Problem statement in markdown, text-primary, line-height 1.7
- Code snippets: bg #0d1117, border #30363d, rounded-md, JetBrains Mono, orange keyword highlights
- Examples section: each example in a box (bg #161b22, border #30363d, rounded-md)
  - "Input:" label in orange, value in monospace
  - "Output:" label in green, value in monospace  
  - "Explanation:" label in text-muted
- Constraints section: bullet list, text-muted, monospace for values
- Topics section at bottom: same tag pills as problem list

RIGHT PANEL — Code Editor:
Top toolbar:
- Language selector dropdown (Python3, JavaScript, Java, C++, Go, Rust, TypeScript, C#, Kotlin, Swift)
  - bg #161b22, border #30363d, shows language icon + name
- Right side: Reset icon button, Fullscreen icon button (ghost, icon only)

Monaco Editor:
- Theme: vs-dark
- Font: JetBrains Mono, size 14px
- Line height: 1.6
- Cursor color: #f97316
- Orange syntax highlights for keywords
- Show line numbers
- Word wrap off
- Minimap off
- Takes remaining height of panel

Bottom test case panel (fixed height 200px, border-top #30363d):
- Tab bar: "Testcase" | "Test Result"
- Testcase tab: shows 2-3 sample inputs as clickable tabs (Case 1, Case 2, Case 3)
  - Input field: bg #0d1117, border #30363d, monospace, read-only
- Test Result tab (after running):
  - Each case row: green ✓ or red ✗ + "Case 1" label + runtime
  - Input / Expected Output / Your Output in labeled sections

Bottom action bar (fixed, border-top #30363d, bg #161b22):
- Left: "Console" toggle button (ghost)
- Right: 
  - "Run Code" button: bg #21262d, border #30363d, text-primary, hover bg #2d333b
  - "Submit" button: bg #f97316, text white, font-bold, hover bg #ea6c0a
  - Both buttons: rounded-md, px-4 py-2, 150ms transition

VERDICT OVERLAY (shown after submit):
- Slide up from bottom, height ~120px
- ACCEPTED: bg rgba(63,185,80,0.1), border-top 2px solid #3fb950
  - Large "Accepted ✓" in green, runtime percentile, memory percentile
- WRONG ANSWER: bg rgba(248,81,73,0.1), border-top 2px solid #f85149
  - Large "Wrong Answer ✗" in red, which test case failed, expected vs got

------------------ use dashboard/profile ------------------

DESIGN SYSTEM — apply to everything:
[paste design system block above]

Build a user dashboard/profile page for "OpenPrep" coding platform.

Tech stack: Next.js 14, Tailwind CSS, shadcn/ui, TypeScript. Use recharts for all charts.

PAGE LAYOUT:
- Max-width 1200px, centered, padding 32px 24px
- Single column flow, sections stacked vertically with 32px gap

SECTION 1 — Profile Header:
- Horizontal layout: avatar (64px circle) + info + right side stats
- Avatar: rounded-full, border 2px solid #30363d
- Info: username (Syne font, bold, 24px) + join date (text-muted) + GitHub link (orange, icon + text)
- Right: current streak "🔥 47 day streak" in large orange number + "Best: 89 days" text-muted below
- Border-bottom #30363d, padding-bottom 24px

SECTION 2 — Solved Stats Row:
- 4 cards in a row (equal width)
- Each card: bg #161b22, border #30363d, rounded-xl, padding 20px, text-center
- Card 1 — Total: large number (e.g. 347) in white, "Solved" label muted, small donut chart (Easy/Med/Hard split in green/yellow/red)
- Card 2 — Easy: number in #3fb950, "Easy" label, "/ 800 total" in muted
- Card 3 — Medium: number in #d29922, "Medium" label, "/ 1200 total" in muted  
- Card 4 — Hard: number in #f85149, "Hard" label, "/ 400 total" in muted
- Below the 4 cards: "Top 8% of all users" in orange, centered, small text

SECTION 3 — Contribution Heatmap:
- Card: bg #161b22, border #30363d, rounded-xl, padding 24px
- Title: "Submission Activity" text-primary font-semibold + "347 submissions in the last year" text-muted
- 52 columns × 7 rows grid of small squares (10px × 10px, gap 3px)
- Color scale:
  - 0 problems: #161b22
  - 1-2 problems: #431407
  - 3-5 problems: #9a3412
  - 6-9 problems: #f97316
  - 10+ problems: #fb923c
- Month labels above grid (Jan Feb Mar... in text-muted, 11px)
- Day labels left of grid (Mon Wed Fri in text-muted, 11px)
- Tooltip on hover: "3 problems solved · Jan 15, 2025"
- Legend bottom-right: "Less" + 5 color squares + "More"

SECTION 4 — Topic Frequency Heatmap:
- Card: bg #161b22, border #30363d, rounded-xl, padding 24px
- Title: "Topic Mastery" text-primary font-semibold
- Grid of topic cards (4 columns, auto rows):
  - Topics: Array, String, DP, Graph, Tree, Binary Search, Greedy, Backtracking, Sliding Window, Two Pointers, Stack, Queue, Heap, Math, Bit Manipulation, Trie, Union Find, Sorting
  - Each topic card: bg #0d1117, border #30363d, rounded-lg, padding 12px
  - Topic name: text-primary, 13px
  - Problems solved count: orange number, bold, 20px
  - Mastery badge: 
    - < 5: "Beginner" bg rgba(139,148,158,0.1) text #8b949e
    - 5-20: "Intermediate" bg rgba(210,153,34,0.1) text #d29922
    - 20+: "Advanced" bg rgba(249,115,22,0.1) text #f97316
  - Bottom mini bar: orange fill showing progress within mastery level

SECTION 5 — Recent Submissions:
- Card: bg #161b22, border #30363d, rounded-xl, padding 24px
- Title: "Recent Submissions" + "View All →" orange link right-aligned
- Table rows (last 10 submissions):
  - Problem title (orange hover link) | Verdict badge | Language chip | Runtime | Date
  - Verdict: "Accepted" green pill | "Wrong Answer" red pill | "TLE" yellow pill
  - Language: small monospace chip bg #21262d
  - Runtime: monospace text-muted
  - Row hover: bg #1c2128
  - Divider: 1px solid #21262d between rows

SECTION 6 — Badges Row:
- Title: "Achievements"
- Horizontal scroll row of badge cards
- Each badge: bg #161b22, border #30363d, rounded-xl, padding 16px, text-center, width 120px
- Earned badges: full color, border-color orange on hover
- Locked badges: grayscale opacity-40, "🔒" overlay
- Badge examples:
  - 🔥 "On Fire" — 7 day streak
  - 💯 "Century" — 100 problems
  - ⚡ "Speed Demon" — top 10% runtime
  - 🌍 "Polyglot" — 5+ languages
  - 🎯 "Sharp Shooter" — 10 problems in one day
  - 🏆 "Contest Winner" — top 10 in contest

SECTION 7 — Developer Tools Row:
- 2 cards side by side (50/50)

LEFT CARD — GitHub Sync:
- bg #161b22, border #30363d, rounded-xl, padding 24px
- GitHub icon + "GitHub Sync" title
- Status: green dot + "Connected — github.com/username/openprep" 
- "47 solutions synced" text-muted
- "View Repository →" orange ghost button

RIGHT CARD — API Access:
- bg #161b22, border #30363d, rounded-xl, padding 24px
- "</> API Access" title
- API key field: monospace, masked (•••••••••f3a9), copy icon button right
- Usage bar: "847 / 1000 requests today" with orange fill progress bar
- "View API Docs →" orange ghost button

------------------ command palette ------------------

DESIGN SYSTEM — apply to everything:
[paste design system block above]

Build a command palette modal for "OpenPrep" coding platform. Triggered by CMD+K or CTRL+K.

Tech stack: Next.js 14, Tailwind CSS, shadcn/ui, TypeScript.

OVERLAY:
- Fixed fullscreen overlay: bg rgba(0,0,0,0.7), backdrop-blur-sm
- Click outside to close

MODAL:
- Position: top 20% centered horizontally
- Width: 600px max, full width on mobile
- bg #161b22, border #30363d, rounded-xl
- Box shadow: 0 25px 50px rgba(0,0,0,0.5)

SEARCH INPUT (top):
- Height 52px, border-bottom #30363d
- Left: search icon #8b949e
- Input: bg transparent, text-primary, placeholder "Search problems, topics, companies...", font-size 16px
- Right: "ESC" key badge (bg #21262d, border #30363d, text-muted, rounded, text-xs)
- No border-radius on top (flows into modal corners)

RESULTS LIST:
- Max height 400px, overflow-y auto
- Grouped sections with section labels:
  - "PROBLEMS" — list of matching problems
  - "TOPICS" — list of matching topics  
  - "COMPANIES" — list of matching companies
  - "ACTIONS" — quick actions
- Section label: text-muted, uppercase, font-size 11px, letter-spacing 1px, padding 8px 16px

RESULT ITEM:
- Height 44px, padding 0 16px
- Horizontal layout: left icon + main text + right meta
- Icon: rounded-md, 28px, bg #21262d, centered emoji or letter
- Main text: text-primary, 14px
- Meta text: text-muted, 12px, right aligned (e.g. "Easy", "Array · DP", "47 problems")
- Hover/selected: bg #1c2128, left border 2px solid #f97316
- Keyboard navigable (arrow up/down highlights item)

EXAMPLE RESULTS (show as default state):
Problems: "Two Sum #1 · Easy", "Maximum Subarray #53 · Medium"
Topics: "Dynamic Programming · 234 problems", "Graph · 156 problems"  
Companies: "Google · 320 problems", "Meta · 280 problems"
Actions: "→ Go to Daily Challenge", "→ View My Submissions", "→ Random Problem"

FOOTER:
- Border-top #30363d, padding 8px 16px
- Keyboard hints: "↑↓ navigate" "↵ select" "ESC close" in small text-muted
- Right: "OpenPrep" logo small

------------------ auth page ------------------

DESIGN SYSTEM — apply to everything:
[paste design system block above]

Build login and signup pages for "OpenPrep" coding platform.

Tech stack: Next.js 14, Tailwind CSS, shadcn/ui, TypeScript.

PAGE LAYOUT:
- Full height centered layout
- bg #0d1117 with subtle grid pattern (1px lines rgba(249,115,22,0.03), 60px spacing)
- Card centered: bg #161b22, border #30363d, rounded-xl, padding 40px, width 400px

CARD CONTENT (Login):
- Top: OpenPrep logo mark (orange `</>` + "OpenPrep" text, centered)
- Title: "Welcome back" Inter bold 24px
- Subtitle: "Continue your interview prep journey" text-muted 14px
- 24px gap

- GitHub OAuth button (full width):
  - bg #21262d, border #30363d, GitHub icon left, "Continue with GitHub" text
  - Hover: bg #2d333b, border #8b949e
  - Height 44px, rounded-md

- Divider: line — "or" — line (text-muted, lines bg #30363d)

- Email input: label "Email", bg #0d1117, border #30363d, rounded-md, height 40px
- Password input: label "Password", same style + show/hide toggle right icon
- "Forgot password?" link right-aligned, orange, 13px

- Submit button: full width, bg #f97316, "Sign In" white bold, height 44px, hover bg #ea6c0a, rounded-md

- Bottom: "Don't have an account? Sign up →" text-muted + orange link

CARD CONTENT (Signup):
- Same layout as login but:
- Title: "Create your account"
- Subtitle: "Free forever. No credit card required."
- Fields: Username + Email + Password
- Username field: show availability check (green ✓ or red ✗ icon on right while typing)
- Submit: "Create Account"
- Bottom: "Already have an account? Sign in →"
- Below card: "By signing up you agree to our Terms of Service" text-muted, 12px, centered
