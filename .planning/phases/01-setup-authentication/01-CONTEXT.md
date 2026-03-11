# Phase 1: Setup & Authentication - Context

**Gathered:** 2026-03-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up Supabase backend with authentication (email/password + GitHub OAuth), user profiles with wizard onboarding, and auto-logout after 10 days of inactivity. Deliver working auth flow where users can sign up, log in, and have persistent sessions.

</domain>

<decisions>
## Implementation Decisions

### Auth Methods
- Both email/password AND GitHub OAuth supported
- Supabase Auth handles both methods

### Session Persistence
- 30-day session duration (cookie/token expiry)
- Auto-logout after 10 days of INACTIVITY
- User activity tracked in `user_activity` table

### Profile Creation
- Profile auto-created on signup via database trigger
- Wizard form for onboarding: username, avatar (optional), bio (optional)
- `is_onboarded` flag to track if wizard completed

### Database Schema
- `profiles` table: id (UUID), username, avatar_url, github_url, bio, is_onboarded, created_at, updated_at
- `submissions` table: id, user_id, problem_id, language, code, status, runtime_ms, memory_kb, created_at
- `user_activity` table: user_id, last_active, created_at
- RLS policies for security
- Auto-profile creation trigger on auth.users insert

</decisions>

<specifics>
## Specific Ideas

- SQL schema file saved to: `data/schema.sql` — ready to run in Supabase SQL Editor
- Wizard form: 3-step flow (username → avatar → bio)
- Auto-logout check: On each request, check if `last_active` > 10 days ago

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- Existing auth pages: `app/(auth)/login/page.tsx`, `app/(auth)/signup/page.tsx` — need Supabase integration
- `lib/mock-data.ts` — temporary data, will be replaced with Supabase queries

### Established Patterns
- Using localStorage for mock auth (needs replacement)
- UI components already exist (Button, Input, etc.)

### Integration Points
- Supabase client: Need `lib/supabase.ts` and `lib/supabase-server.ts`
- Auth pages need updating to use Supabase Auth
- Need to add Supabase provider to app layout

</code_context>

<deferred>
## Deferred Ideas

- Session refresh on activity (update last_active on each request)
- Remember device "trusted" option
- 2FA support — future phase

</deferred>

---

*Phase: 01-setup-authentication*
*Context gathered: 2026-03-11*
