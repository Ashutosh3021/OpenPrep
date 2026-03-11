# Domain Pitfalls: Coding Practice Platforms

**Domain:** LeetCode-style coding practice platform
**Researched:** 2026-03-11
**Confidence:** MEDIUM-HIGH

---

## Critical Pitfalls

### Pitfall 1: Judge0 Sandbox Escape Vulnerabilities

**What Goes Wrong:**
Judge0 (the code execution engine) has critical sandbox escape vulnerabilities (CVE-2024-29021, CVE-2024-28185, CVE-2024-28189, GHSA-h9g2-45c8-89cf) affecting versions <= 1.13.0. These allow attackers with API access to escape the sandbox and gain root access on the host machine. Additionally, the default configuration enables network access which can lead to SSRF attacks.

**Why It Happens:**
- Using outdated Judge0 versions without security patches
- Default configuration leaves `enable_network` enabled
- Not following security hardening guidelines for production deployment

**Consequences:**
- Complete server compromise
- Data breach
- Resource abuse (cryptomining, botnets)
- Liability for any malicious activity launched from your servers

**Prevention:**
1. **Always use Judge0 >= 1.13.1** — the patched version
2. **Disable network access** in production: set `ENABLE_NETWORK=false`
3. **Isolate Judge0** in a separate network segment from other services
4. **Rate limit API endpoints** to prevent abuse
5. **Monitor for unusual patterns** — excessive submissions, unusual execution times

**Warning Signs:**
- Unusual server resource consumption
- Unexpected outbound network connections
- Submissions completing much faster than expected (potential bypass)
- Users reporting they can access external services from code

**Phase to Address:**
- Phase 2 (Data Pipeline) — Security should be addressed during backend setup
- Phase 3 (Backend API) — Judge0 integration must use patched version

---

### Pitfall 2: Inadequate Test Case Storage Strategy

**What Goes Wrong:**
Storing large test case payloads (10MB+) in the database leads to:
- Slow submission processing
- Database bloat
- Increased API response times
- Higher storage costs

**Why It Happens:**
- Naive approach of storing full test case data with each submission
- Not separating visible vs. hidden test cases
- No compression or reference-based storage

**Consequences:**
- Submissions take 10-30 seconds to process
- Database grows uncontrollably
- Poor user experience
- Increased Supabase costs

**Prevention:**
1. **Separate visible and hidden test cases** — store only input/output references for hidden tests
2. **Compress test case storage** — use TOAST compression in PostgreSQL
3. **Lazy load test cases** — fetch only when needed for display
4. **Limit visible test cases** — typically 3-5 examples per problem

**Warning Signs:**
- Submission API takes > 5 seconds
- Database size growing > 100MB/month
- Users complaining about slow "Run Code" feature

**Phase to Address:**
- Phase 2 (Data Pipeline) — Test case structure must be designed correctly
- Phase 3 (Backend API) — Submission handling must implement efficient patterns

---

### Pitfall 3: Code Editor State Synchronization Issues

**What Goes Wrong:**
Monaco Editor React integration suffers from state synchronization bugs:
- `onChange` doesn't reflect actual editor contents after rapid changes
- Language switching breaks existing content
- Props don't re-render after state changes
- Memory leaks when navigating between problems

**Why It Happens:**
- React state updates lag behind Monaco's internal state
- Component lifecycle conflicts with editor initialization
- Not properly cleaning up editor instances on unmount

**Consequences:**
- Users lose code when switching languages
- Typing appears to work but code isn't saved
- Browser memory usage grows over time
- Navigation between problems loses code

**Prevention:**
1. **Use `useRef` for editor instance** — maintain stable reference
2. **Implement debounced auto-save** — save to localStorage frequently
3. **Handle language switching carefully** — preserve content or warn user
4. **Proper cleanup in `useEffect`** — dispose editor on unmount
5. **Use `key` prop strategy** — force remount when problem changes

**Warning Signs:**
- Users reporting lost code after language switch
- Memory usage increases while using the platform
- "Run Code" uses stale content

**Phase to Address:**
- Phase 4 (Core Pages) — Problem detail page with editor

---

## Moderate Pitfalls

### Pitfall 4: Supabase RLS Misconfiguration

**What Goes Wrong:**
Row Level Security policies allow unintended data access:
- Users can see other users' submissions
- Submissions can be modified by other users
- Problem data accessible to unauthenticated users

**Why It Happens:**
- Default permissive settings
- Testing with RLS disabled then forgetting to enable
- Complex policy conditions not properly tested

**Prevention:**
1. **Enable RLS from Day 1** — don't add it later
2. **Test policies with multiple users** — use service role vs. anon key
3. **Default-deny approach** — explicitly grant access per operation
4. **Audit policies regularly** — check for bypass opportunities

**Phase to Address:**
- Phase 1 (Database Schema) — RLS policies must be defined with tables

---

### Pitfall 5: Submission Race Conditions

**What Goes Wrong:**
Multiple rapid submissions cause:
- Out-of-order execution results
- User sees wrong submission results
- Duplicate submissions processed

**Why It Happens:**
- No submission idempotency keys
- Frontend allows rapid clicking
- Backend doesn't track submission state

**Prevention:**
1. **Generate UUID per submission** — client-side before sending
2. **Debounce submit button** — disable for 2-3 seconds
3. **Track submission status** — pending/processing/completed
4. **Use optimistic UI carefully** — confirm before showing success

**Phase to Address:**
- Phase 3 (Backend API) — Submit endpoint design

---

### Pitfall 6: Inefficient Problem Filtering Queries

**What Goes Wrong:**
Problem list with filters (company, difficulty, topic) causes slow page loads:
- Full table scan on each filter change
- N+1 queries for metadata
- No pagination or cursor-based loading

**Why It Happens:**
- Missing database indexes on filter columns
- Not using Supabase's query capabilities efficiently
- Loading all metadata upfront

**Prevention:**
1. **Add indexes** on difficulty, company_id, topic_id
2. **Use Supabase's filter chaining** — single query with multiple conditions
3. **Implement cursor pagination** — don't use OFFSET for large datasets
4. **Cache frequently accessed data** — Redis or stale-while-revalidate

**Warning Signs:**
- Problem list takes > 2 seconds to load
- Filter changes cause noticeable delay
- Database CPU spikes during peak usage

**Phase to Address:**
- Phase 1 (Database Schema) — Indexes defined with schema
- Phase 4 (Core Pages) — Query optimization in frontend

---

### Pitfall 7: Time Limit Handling Without Clear Feedback

**What Goes Wrong:**
Users don't understand why their code "hangs" or gets TLE:
- No visual feedback during execution
- Confusing timeout vs. TLE vs. runtime error messages
- Long waits without progress indication

**Why It Happens:**
- Judge0 returns generic timeout errors
- Frontend doesn't communicate execution state
- No estimated time remaining

**Prevention:**
1. **Show execution state clearly** — "Running your code..." with spinner
2. **Set reasonable timeouts** — 2-5 seconds for typical problems
3. **Differentiate error types** — TLE, runtime error, syntax error
4. **Provide partial output** — show stdout even on failure (when safe)

**Phase to Address:**
- Phase 3 (Backend API) — Execution handling and error mapping
- Phase 4 (Core Pages) — UI feedback during execution

---

### Pitfall 8: Data Import Without Validation

**What Goes Wrong:**
Importing 2000+ problems leads to:
- Inconsistent data quality
- Missing required fields
- Broken test case references
- Duplicate problems

**Why It Happens:**
- No schema validation during import
- Source data has edge cases not handled
- No idempotent import (running twice creates duplicates)

**Prevention:**
1. **Validate before import** — check required fields exist
2. **Use import ID mapping** — track source IDs to internal IDs
3. **Log import statistics** — problems imported, skipped, errors
4. **Support re-running** — upsert logic, not just insert

**Phase to Address:**
- Phase 2 (Data Pipeline) — Import scripts must be robust

---

## Minor Pitfalls

### Pitfall 9: Missing Progress Persistence

**What Goes Wrong:**
Users lose progress when:
- Browser cache cleared
- Switching devices
- Accidentally closing tab

**Prevention:**
1. **Auto-save to localStorage** — code drafts every few seconds
2. **Sync to server on submit** — submission = persistent record
3. **Clear "draft" indicator** — show when code is saved locally

**Phase to Address:**
- Phase 4 (Core Pages) — Auto-save implementation

---

### Pitfall 10: Monolithic Problem Data Structure

**What Goes Wrong:**
Storing problem descriptions as huge HTML/JSON blobs makes:
- Searching/filtering impossible
- Caching difficult
- Partial updates impossible

**Prevention:**
1. **Normalize problem data** — separate title, description, constraints, examples
2. **Use Markdown storage** — render to HTML on display
3. **Separate test case references** — don't embed in description

**Phase to Address:**
- Phase 1 (Database Schema) — Proper table structure

---

### Pitfall 11: Ignoring Mobile Experience

**What Goes Wrong:**
Code editor unusable on tablets/phones:
- Monaco requires minimum screen width
- No responsive alternative

**Prevention:**
1. **Detect mobile and show warning** — "Best viewed on desktop"
2. **Don't block mobile** — show problem, suggest desktop for coding
3. **Future: Basic mobile editor** — simple textarea fallback

**Phase to Address:**
- Phase 4 (Core Pages) — Mobile handling in problem view
- Phase 6 (Polish) — Responsive considerations

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Phase 1: Database | RLS misconfiguration, missing indexes | Define policies upfront, add indexes on filter columns |
| Phase 2: Data Import | Import failures, data inconsistency | Validate early, use upsert logic, log errors |
| Phase 3: Backend | Judge0 security, timeout handling | Use patched Judge0, proper error mapping |
| Phase 4: Frontend | Editor state bugs, missing auto-save | Use ref pattern, debounced localStorage |
| Phase 5: Dev Features | API rate limiting, GitHub token security | Implement throttling, encrypt tokens |
| Phase 6: Polish | Performance regressions | Load test, monitor DB query times |

---

## Sources

- **Judge0 Security:** CVE-2024-29021, CVE-2024-28185, CVE-2024-28189 (GHSA-h9g2-45c8-89cf, GHSA-q7vg-26pg-v5hr) — Critical vulnerabilities in <= 1.13.0
- **Large Test Cases:** Judge0 Issue #348 — Handling 10MB+ test cases
- **Monaco Editor:** GitHub Issues #402, #555, #4779 — React state synchronization problems
- **Database:** Supabase RLS documentation, migration best practices
- **System Design:** Various system design resources for online judge architecture patterns
