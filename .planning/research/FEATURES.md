# Feature Landscape: Coding Practice Platforms

**Domain:** LeetCode-style coding practice platform
**Researched:** 2026-03-11
**Confidence:** MEDIUM-HIGH

---

## Executive Summary

Coding practice platforms occupy a crowded market dominated by LeetCode. The research reveals that **table stakes** are well-defined and relatively modest: problems with difficulty, topics, in-browser code execution, and basic progress tracking. **Differentiation** comes from curated content (company tags, frequency data, curated lists), learning support (video explanations, editorial solutions, mentor feedback), and engagement mechanics (gamification, real-time battles, roadmaps). Platforms that deviate from core expectations or add unnecessary complexity risk user abandonment.

For OpenPrep specifically, the key insight is that **company tags and frequency data are the primary differentiators** that can attract users away from LeetCode's paywall. Everything else should focus on executing table-stakes features flawlessly.

---

## Table Stakes

Features that users expect as baseline requirements. Missing any of these makes the platform feel incomplete or illegitimate. These are the cost of entry.

### Core Problem Experience

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Problem Database** | Users need problems to solve | High | Minimum 500+ problems for legitimacy; 2000+ signals seriousness |
| **Difficulty Levels** | Users need to calibrate effort | Low | Standard: Easy / Medium / Hard. Critical for interview prep |
| **Problem Descriptions** | Users need to understand the task | Low | Must include description, examples, constraints |
| **Topic/Category Tags** | Users need to organize by skill | Low | Arrays, Strings, Trees, DP, Graphs, etc. |
| **Visible Test Cases** | Users need to validate understanding | Low | 2-5 input/output examples per problem |
| **In-Browser Code Editor** | Users need to write and run code | High | Monaco Editor or CodeMirror. Must support multiple languages |
| **Code Execution** | Users need to verify solutions | High | Run code + Submit. Requires Judge0 or similar infrastructure |
| **Acceptance Rate Display** | Users need difficulty context | Low | Shows what % of submissions solved the problem |

### User Management

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **User Authentication** | Users need to save progress | Medium | Email + OAuth (GitHub/Google). Supabase Auth handles this |
| **Progress Tracking** | Users need to see what they've done | Medium | Problems solved, completion rate by difficulty |
| **Submission History** | Users need to review past work | Medium | All submissions with status, runtime, memory |
| **Code Draft Auto-Save** | Users expect their code to persist | Low | localStorage for anonymous; server for authenticated |

### Navigation & Discovery

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Problem List/Grid View** | Users need to browse problems | Low | Table with columns: #, Title, Difficulty, Acceptance, Status |
| **Basic Search** | Users need to find specific problems | Low | Search by title, topic, or ID |
| **Filtering by Difficulty** | Users need to scope practice | Low | Easy/Medium/Hard filter buttons |
| **Pagination** | Users need to navigate large lists | Low | 20-50 problems per page |

---

## Differentiators

Features that attract users and provide competitive advantage. These are what make users choose Platform X over LeetCode.

### Content Differentiation

| Feature | Value Proposition | Complexity | Notes |
|---------|------------------|------------|-------|
| **Company Tags** | Practice problems actually asked by target companies | Medium | Google, Meta, Amazon, etc. This is a major LeetCode Premium feature to replicate |
| **Frequency Scores** | Know which problems matter most for interviews | Low | Percentage showing how often problem appears in real interviews |
| **Curated Problem Lists** | Structured study paths instead of random practice | Medium | Blind 75, NeetCode 150, Grind 75 - organized by pattern |
| **Video Explanations** | Learn from expert walkthroughs | High | YouTube integration or hosted videos. High production effort |
| **Editorial Solutions** | Multiple solution approaches with explanations | Medium | Official solutions showing time/space complexity trade-offs |
| **User Solutions Gallery** | See how others solved the problem | Medium | Community-submitted solutions sorted by quality/votes |

### Learning Support

| Feature | Value Proposition | Complexity | Notes |
|---------|------------------|------------|-------|
| **Discussion Forums** | Ask questions, get community help | High | LeetCode's most underappreciated feature. Requires moderation |
| **Hints System** | Progressive hints without spoiling solution | Medium | 2-3 hints per problem, user-controlled reveal |
| **AI-Powered Assistance** | Real-time help without leaving the editor | High | GPT integration for hints, code review, explanation |
| **Mentor Feedback** | Human review of solutions (like Exercism) | Very High | Volunteer or paid mentors. High operational complexity |
| **Study Roadmaps** | Day-by-day plans for interview prep | Low | Pre-defined sequences (8-week, 12-week plans) |
| **Pattern Recognition** | Teach underlying patterns, not just solutions | Medium | Categories like "Two Pointers," "Sliding Window" |

### Engagement & Gamification

| Feature | Value Proposition | Complexity | Notes |
|---------|------------------|------------|-------|
| **Daily Streaks** | Motivate consistent practice | Low | Calendar tracking, streak counters |
| **Leaderboards** | Social competition | Medium | Global, by company, by university |
| **Badges/Achievements** | Milestone recognition | Low | "First Hard Problem," "100 Days Streak," "Python Master" |
| **Real-Time 1v1 Battles** | Competitive practice against others | Very High | AlgoArena, CodeArena style. Requires WebSocket infrastructure |
| **Contests/Challenges** | Timed competitive events | High | Weekly contests, themed challenges |
| **Points/Reputation System** | Quantified progress | Medium | XP, reputation, leveling |

### Platform Experience

| Feature | Value Proposition | Complexity | Notes |
|---------|------------------|------------|-------|
| **Multiple Language Support** | Practice in preferred language | Medium | Python, JavaScript, Java, C++, Go, Rust, etc. |
| **Dark/Light Theme** | Visual preference | Low | Monaco supports themes; Tailwind handles UI |
| **Keyboard Shortcuts** | Power user efficiency | Low | Vim bindings, command palette |
| **Mobile Experience** | Practice on phones | Very High | Monaco doesn't work well on mobile; need responsive fallback |
| **Command Palette** | Quick navigation and actions | Low | Cmd+K to jump to problems, search, actions |
| **API Access** | Power user automation | Medium | Export data, integrate with external tools |

### Data & Insights

| Feature | Value Proposition | Complexity | Notes |
|---------|------------------|------------|-------|
| **Performance Analytics** | Understand strengths/weaknesses | Medium | Radar chart by topic, time spent, accuracy |
| **Weakness Identification** | Know what to focus on | Medium | Highlight topics where user struggles |
| **Time Tracking** | Understand practice habits | Low | Time per problem, daily/weekly totals |
| **Company-Specific Prep** | Targeted interview prep | Medium | Filter by target company, see frequency |

---

## Anti-Features

Features to explicitly NOT build or features that should be avoided. These either add no value, alienate users, or create negative experiences.

### Features That Damage Credibility

| Anti-Feature | Why Avoid | What To Do Instead |
|--------------|-----------|-------------------|
| **Paywall for Basic Problems** | LeetCode's paid model creates friction | Keep all problems free. Differentiate on free access |
| **Login Required to View Problems** | Creates friction for casual visitors | Allow anonymous browsing; require login only for progress |
| **Aggressive Ads** | Interrupts practice flow, damages trust | If monetization needed, use unobtrusive sponsorship or Pro tier |
| **Limited Daily Submissions** | Feels restrictive, like a free-to-play game | Unlimited submissions (compute costs manageable) |
| **Broken/Flaky Code Execution** | Core feature must work | Invest heavily in Judge0 reliability |

### Features That Add Unnecessary Complexity

| Anti-Feature | Why Avoid | What To Do Instead |
|--------------|-----------|-------------------|
| **Complex Onboarding** | Users want to solve problems, not learn a platform | Instant access: land on problem → solve → submit |
| **Forums Without Moderation** | Trolls and spam destroy value | Invest in moderation or disable initially |
| **Excessive Social Features** | Not a social network | Focus on practice, not sharing |
| **Mandatory Profile Completion** | Friction for first-time users | Optional fields, progressive disclosure |
| **Mobile App (Initial)** | High maintenance, distracts from web | Responsive web is sufficient for v1 |

### Features Outside Initial Scope

| Anti-Feature | Why Avoid | What To Do Instead |
|--------------|-----------|-------------------|
| **Real-Time Collaboration** | Not a collaborative learning platform | Keep focus on individual practice |
| **Live Interview Practice** | Different product category | Partner with or reference specialized tools |
| **Employer Dashboard** | B2B feature, not core to v1 | Phase 2 or later if demand exists |
| **Certificate Generation** | No value for interview prep | Users care about skills, not certificates |
| **Blog/Content Marketing Site** | Distracts from core product | Minimal landing page, link to external resources |

---

## Feature Dependencies

Understanding what features require other features to function:

```
Problem Database → Topic Tags, Difficulty Levels, Test Cases
Code Editor → Code Execution, Multiple Language Support
Code Execution → Test Cases, Submission History
User Authentication → Progress Tracking, Submission History, Draft Auto-Save
Company Tags → Frequency Scores (complementary)
Curated Lists → Problem Database, Topic Tags
Progress Tracking → Submission History, Problem Database
Streaks → User Authentication (requires login to track)
Leaderboards → User Authentication, Submission History
Study Roadmaps → Curated Lists, Problem Database
Discussion Forums → User Authentication, Problem Database
Hints → Problem Database (needs problem-level hint storage)
```

---

## MVP Recommendation

For OpenPrep v1, prioritize in this order:

### Phase 1: Core Table Stakes (Must Have)
1. **Problem Database** — 2000+ problems loaded
2. **Problem Descriptions** — Title, difficulty, description, examples, constraints
3. **Topic Tags** — Categories for filtering
4. **Code Editor** — Monaco with syntax highlighting
5. **Code Execution** — Judge0 integration for Run + Submit
6. **Problem List** — Browsable with difficulty filter
7. **User Auth** — Supabase Auth with GitHub

### Phase 2: Key Differentiators (Should Have)
1. **Company Tags** — The primary LeetCode Premium feature to replicate
2. **Frequency Scores** — Complementary to company tags
3. **Curated Lists** — Blind 75, NeetCode 150 pre-built
4. **Progress Tracking** — Problems solved, by difficulty
5. **Submission History** — All attempts saved

### Phase 3: Enhanced Differentiators (Nice to Have)
1. **Editorial Solutions** — 2-3 approaches per problem
2. **Daily Streaks** — Gamification lite
3. **Study Roadmaps** — Pre-built study plans
4. **Search Enhancement** — Search by company, pattern

### Phase 4: Advanced Features (Later)
1. **Discussion Forums** — Community Q&A
2. **User Solutions Gallery** — Community solutions
3. **Leaderboards** — Social features
4. **Hints System** — Progressive hints

---

## Feature Confidence Assessment

| Feature Category | Confidence | Reason |
|------------------|------------|--------|
| Table Stakes Requirements | HIGH | Well-established across all platforms |
| Company Tags/Frequency | HIGH | Clear differentiation from LeetCode paywall |
| Curated Lists | HIGH | Blind 75, NeetCode 150 are community standards |
| Video Explanations | MEDIUM | High production effort, unclear if needed for v1 |
| Discussion Forums | MEDIUM | High operational overhead, moderation required |
| Real-Time Battles | LOW | High infrastructure complexity, niche audience |
| Mentor Feedback | LOW | Exercism model requires significant volunteer coordination |

---

## Sources

- **Platform Research:** LeetCode, NeetCode, HackerRank, Exercism, AlgoArena, CodeArena, HackerEarth — direct observation of platform features
- **Curated Lists:** Blind 75 (Blind community), NeetCode 150 (NeetCode.io), Grind 75 — community-validated problem sets
- **Company Tags/Frequency:** LeetCode Premium feature analysis, LeetCode Wizard frequency data — competitive research
- **Exercism Mentorship Model:** exercism.org/docs/using/feedback/mentor — mentor feedback system reference
- **Competitive Features:** AlgoArena, CodeArena — real-time battle platform research
- **User Expectations:** Reddit r/LeetCode, r/cscareerquestions — community discussions on platform expectations

---

## Open Questions

1. **Discussion Forums:** Should OpenPrep build forums or link to existing communities? Forums require ongoing moderation; external links don't build engagement.

2. **Video Content:** Is there demand for video explanations, or are editorial solutions sufficient? Video has high production cost.

3. **Mobile Strategy:** Monaco Editor doesn't work well on mobile. Is responsive design with degraded mobile experience sufficient, or is a native app needed later?

4. **Community Content:** Should user-submitted solutions be a feature? Requires voting/moderation system to surface quality content.
