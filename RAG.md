# RAG — MantraSkill Technical Reference

> **v2.0** | 2026-03-18 | AI agent reads this FIRST. Product spec → [`PRD.md`](./PRD.md). Architecture overview → [`MASTER_BLUEPRINT.md`](./MASTER_BLUEPRINT.md).

---

## 1. Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  React 18 + TypeScript + Vite 5 + Tailwind CSS 3    │
│                                                     │
│  State: AuthContext (user, profile, subscription)    │
│  Guard: SubscriptionGuard (route) + useInactivity   │
│  Lazy: All pages except Index + NotFound             │
├─────────────────────────────────────────────────────┤
│                 BACKEND (Lovable Cloud)               │
│                                                     │
│  Auth: Email + Password (email verification ON)      │
│  DB: 6 tables, all with RLS                          │
│  Edge Functions: 8 Deno endpoints                    │
│  AI: Lovable AI Gateway (Gemini models, no API key)  │
└─────────────────────────────────────────────────────┘
```

### Route Table

| Route | Component | Guard | Lazy |
|-------|-----------|-------|------|
| `/` | Index | — | No |
| `/dashboard` | Dashboard | Auth | Yes |
| `/dashboard/cv-builder` | CVBuilder | SubscriptionGuard | Yes |
| `/dashboard/cv-checker` | MemberCVChecker | SubscriptionGuard | Yes |
| `/dashboard/module/:id` | ModuleReader | SubscriptionGuard | Yes |
| `/dashboard/linkedin-optimizer` | LinkedInOptimizer | SubscriptionGuard | Yes |
| `/dashboard/cover-letter` | CoverLetterGenerator | SubscriptionGuard | Yes |
| `/dashboard/prompt-library` | PromptLibrary | SubscriptionGuard | Yes |
| `/admin` | Admin | Self-check (role) | Yes |
| `/reset-password` | ResetPassword | — | Yes |
| `/gratis/cek-cv` | FreeCVChecker | — | Yes |
| `/privacy-policy` | PrivacyPolicy | — | Yes |
| `/karir` | CareerHub | — | Yes |
| `/karir/:slug` | SatelliteArticle | — | Yes |
| `/seo/keywords` | KeywordIndex | — | Yes |
| `/tips/*` | 4 tip pages | — | Yes |

---

## 2. File Map

### Core

| File | Purpose |
|------|---------|
| `src/App.tsx` | Route definitions + provider tree (QueryClient, Tooltip, Auth, Suspense) |
| `src/contexts/AuthContext.tsx` | Global state: user, session, profile, isSubscriptionActive, isAdmin, daysRemaining. Auto-refresh every 5min + on tab visibility. |
| `src/components/auth/AuthModal.tsx` | Login/Register/Forgot tabs. Register requires license key. |
| `src/components/auth/SubscriptionGuard.tsx` | Route wrapper: auth check + refreshIfStale + subscription check. Admin bypasses. |
| `src/components/auth/LogoutConfirmDialog.tsx` | Confirmation before logout |

### Pages

| File | Purpose |
|------|---------|
| `src/pages/Index.tsx` | Landing — composes 13+ components from `src/components/landing/` |
| `src/pages/Dashboard.tsx` | Member dashboard — progress, modules, CTAs, countdown |
| `src/pages/ModuleReader.tsx` | Module viewer — content fetch, reading tracker, quiz, section progression |
| `src/pages/CVBuilder.tsx` | 6-step wizard, draft picker (max 3), auto-save |
| `src/pages/MemberCVChecker.tsx` | Full CV analysis — upload PDF/DOCX, AI report, JD scan, radar chart |
| `src/pages/FreeCVChecker.tsx` | Free CV check — upload, regex + limited AI, blurred results, upsell |
| `src/pages/LinkedInOptimizer.tsx` | 4 prompt templates with user input interpolation |
| `src/pages/CoverLetterGenerator.tsx` | 3 prompt templates |
| `src/pages/PromptLibrary.tsx` | 55+ prompts, search + category filter |
| `src/pages/Admin.tsx` | Admin panel — user list, license CRUD, bulk key generator, user activation |

### Hooks

| File | Purpose |
|------|---------|
| `src/hooks/useInactivityLogout.ts` | 8hr auto-logout. Listens: mousemove, keydown, scroll, touchstart, click. Dispatches `session-expired` event. |
| `src/hooks/useSwipeBack.ts` | iOS-style edge swipe-back. 30% threshold. Skips non-standalone Safari. |
| `src/hooks/use-mobile.tsx` | Mobile breakpoint detection |
| `src/hooks/use-toast.ts` | Toast state management |
| `src/components/modules/useSpeechToText.ts` | Web Speech API wrapper, `id-ID` locale, auto-restart |
| `src/components/modules/ReadingTracker.tsx` | `useReadingTracker` hook + `ReadingIndicator` UI. Anti-cheat: scroll ≥90%, min time, speed detection. |

### Libraries

| File | Purpose |
|------|---------|
| `src/lib/word-intelligence.ts` | Offline CV text enhancer. Maps weak→strong phrases. ATS score 0–100. Functions: `enhanceDescription()`, `splitToBullets()`, `enhanceBullets()`. |
| `src/lib/skill-suggestions.ts` | Offline keyword→skill mapper. 20+ categories. Function: `suggestSkills(texts[])`. |
| `src/lib/links.ts` | Base64-obfuscated URLs. Functions: `openCheckout()`, `openWhatsApp()`, `getCheckoutUrl()`, `getWaUrl()`. |
| `src/lib/utils.ts` | `cn()` — clsx + tailwind-merge |

### Data

| File | Purpose |
|------|---------|
| `src/data/module-5-content.ts` | 17 interview questions (4 categories) with keywords, red flags, feedback |
| `src/data/module-1-content.ts` | Legacy types only (content in database) |
| `src/data/satellite-pages.ts` | 26+ satellite SEO page data (4 categories) |

### CV Builder Components

| File | Step |
|------|------|
| `src/components/cv-builder/StepPersonal.tsx` | 1: Personal info (name locked) |
| `src/components/cv-builder/StepSummary.tsx` | 2: Summary + target + years |
| `src/components/cv-builder/StepExperience.tsx` | 3: Experience CRUD + AI enhance |
| `src/components/cv-builder/StepEducation.tsx` | 4: Education CRUD |
| `src/components/cv-builder/StepSkills.tsx` | 5: Skills, certs, languages |
| `src/components/cv-builder/StepReview.tsx` | 6: Preview + AI + export |
| `src/components/cv-builder/CVPreview.tsx` | Print-ready CV layout |
| `src/components/cv-builder/ScoreCard.tsx` | 10-category radar visualization |
| `src/components/cv-builder/BeforeAfterCard.tsx` | AI rewrite comparison |
| `src/components/cv-builder/types.ts` | CVData types + emptyCV template |

---

## 3. Database Schema

### Enum & Function

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
END; $$;
```

### Tables

#### profiles

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| id | uuid PK | gen_random_uuid() | |
| user_id | uuid UNIQUE NOT NULL | | References auth.users (no FK) |
| full_name | text | '' | |
| license_key | text | NULL | Set on activation |
| license_expires_at | timestamptz | NULL | Set on activation |
| module_progress | jsonb | `{"1":false,...,"5":false}` | |
| phone | text | NULL | |
| failed_login_attempts | int | 0 | |
| locked_until | timestamptz | NULL | |
| created_at, updated_at | timestamptz | now() | |

**RLS:** Own-row SELECT/INSERT/UPDATE. Admin SELECT all. No DELETE.

#### license_keys

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| id | uuid PK | gen_random_uuid() | |
| key | text UNIQUE NOT NULL | | Format: `MNTR-XXXX-XXXX` |
| status | text | 'active' | active / used / inactive |
| validity_days | int | 90 | |
| used_by | uuid | NULL | |
| created_at | timestamptz | now() | |

**RLS:** Admin ALL. User SELECT own (used_by = auth.uid()).

#### user_roles

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid NOT NULL | |
| role | app_role NOT NULL | |

**RLS:** Own-row SELECT. Admin SELECT ALL + manage ALL.

#### cv_data

| Column | Type | Default |
|--------|------|---------|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid NOT NULL | |
| cv_name | text | NULL |
| target_position | text | '' |
| years_experience | int | 0 |
| personal_info | jsonb | '{}' |
| summary | text | '' |
| experiences | jsonb | '[]' |
| education | jsonb | '[]' |
| skills | jsonb | `{"hard_skills":[],"soft_skills":[]}` |
| certifications | jsonb | '[]' |
| languages | jsonb | '[]' |
| ai_analysis | jsonb | NULL |
| created_at, updated_at | timestamptz | now() |

**RLS:** Own-row SELECT/INSERT/UPDATE/DELETE. Admin SELECT all.

#### module_content

| Column | Type | Default |
|--------|------|---------|
| id | uuid PK | gen_random_uuid() |
| module_id | text UNIQUE NOT NULL | '1' to '5' |
| title | text NOT NULL | |
| thesis | text NOT NULL | |
| sections | jsonb | '[]' |
| created_at | timestamptz | now() |

**RLS:** Admin ALL only. Users access via edge function.

**Sections JSONB structure:**
```json
[{
  "id": "1.1",
  "title": "Section Title",
  "content": "<h3>HTML</h3><p>...</p>",
  "quiz": [{
    "question": "Question?",
    "options": ["A","B","C","D"],
    "correctIndex": 2
  }]
}]
```
> **LOCKED:** `correctIndex` is NEVER sent to client. Stripped by `get-module-content`.

#### prompts

| Column | Type | Default |
|--------|------|---------|
| id | uuid PK | gen_random_uuid() |
| title | text NOT NULL | |
| category | text NOT NULL | |
| prompt_text | text NOT NULL | |
| sort_order | int | 0 |
| created_at | timestamptz | now() |

**RLS:** Admin ALL only. Users access via edge function.

---

## 4. Edge Functions

All functions: `verify_jwt = false` in config.toml (manual JWT validation for granular control).

**AI Gateway:** `https://ai.gateway.lovable.dev/v1/chat/completions` — Bearer `LOVABLE_API_KEY` (auto-set).

**Shared modules:**
- `_shared/cors.ts` — CORS with origin whitelist
- `_shared/rate-limit.ts` — In-memory IP-based rate limiter

### 4.1 validate-license

| Aspect | Detail |
|--------|--------|
| Method | POST |
| Auth | JWT (manual getUser) |
| Body | `{ license_key, user_id }` |
| Anti-impersonation | `user.id === body.user_id` |
| Logic | Find active key → mark used → set profile.license_expires_at |
| DB client | Service role |
| Response | `{ valid, expires_at }` or `{ valid: false, error }` |

### 4.2 get-module-content

| Aspect | Detail |
|--------|--------|
| Method | GET |
| Auth | JWT (getClaims) |
| Params | `module_id` |
| Logic | Verify JWT → check subscription → fetch module → **strip correctIndex** |
| Response | `{ id, title, thesis, sections }` (sanitized) |

### 4.3 validate-quiz

| Aspect | Detail |
|--------|--------|
| Method | POST |
| Auth | JWT (getClaims) |
| Body | `{ module_id, section_index, answers: number[] }` |
| Logic | Fetch module → compare answers[i] vs quiz[i].correctIndex |
| Response | `{ correct, results: [{correct}] }` |

### 4.4 analyze-cv

| Aspect | Detail |
|--------|--------|
| Method | POST |
| Auth | JWT (getUser) |
| Body | `{ mode, cv_data, ... }` |
| Pattern | OpenAI function calling (tools + tool_choice) |
| Timeout | 25s (AbortController) |
| Errors | 429 → rate limit, 402 → credits exhausted |

**6 Modes:**

| Mode | Model | Input → Output |
|------|-------|----------------|
| `analyze` | gemini-2.5-flash | cv_data, cv_id → scores (10 cats), recommendations |
| `enhance-bullet` | gemini-2.5-flash-lite | text, target_position → enhanced string |
| `generate-summary` | gemini-2.5-flash-lite | cv_data → summary string |
| `rewrite` | gemini-2.5-flash | cv_data → summary + experiences[] |
| `jd-scan` | gemini-2.5-flash-lite | cv_data, job_description → match_score, keywords |
| `text-analyze` | gemini-2.5-flash | raw_text → scores (10 cats), recommendations |

### 4.5 get-prompts

| Aspect | Detail |
|--------|--------|
| Method | POST |
| Auth | JWT (getClaims) |
| Body | `{ category? }` |
| Logic | Verify JWT → check subscription (admin bypass) → query prompts |
| Response | `{ prompts: [{id, category, title, prompt_text, sort_order}] }` |

### 4.6 free-cv-check

| Aspect | Detail |
|--------|--------|
| Method | POST |
| Auth | **None** (public endpoint) |
| Rate limit | 3 requests/day per IP |
| Body | `{ cv_text }` (min 50 chars, max 2000 words) |
| Model | gemini-2.5-flash-lite |
| Pattern | Function calling → 3 insights array |
| Response | `{ insights: [string, string, string] }` |

### 4.7 activate-user

| Aspect | Detail |
|--------|--------|
| Method | POST |
| Auth | JWT → must be admin (checked via user_roles) |
| Rate limit | 3 requests/min |
| Body | `{ user_id }` |
| Logic | Find available key → mark used → update profile (license_key + expires_at) |
| Rollback | If profile update fails, key reverted to active |
| Response | `{ success, key, expires_at, validity_days }` |

### 4.8 (Implicit) Auth Triggers

Profile creation handled by Supabase auth trigger — creates profile row on signup.

---

## 5. Key Architecture Patterns

### 5a. AuthContext

```
Mount:
  1. onAuthStateChange → set session/user
     - Guard: initialSessionHandled flag
     - If true → fetchProfile (subsequent events only)
     - If false → skip (handled by getSession)
  2. getSession → set session/user → set flag → fetchProfile (once)

fetchProfile(userId):
  Promise.all([profiles query, user_roles query])
  → set profile, isAdmin, lastFetchedAt

isSubscriptionActive = !!profile.license_key && daysRemaining > 0

refreshIfStale():
  if (now - lastFetchedAt > 5min) → fetchProfile

Auto-refresh: setInterval(5min) + visibilitychange listener
```

### 5b. SubscriptionGuard

```
1. Loading → spinner
2. !user → navigate('/')
3. refreshIfStale() → ensure fresh data
4. !isSubscriptionActive && !isAdmin → toast + navigate('/dashboard')
5. Else → render children
```

### 5c. Quiz Validation

```
Client: answers[] → invoke 'validate-quiz' → { correct, results }
  Pass → onPass() → next section
  Fail → show errors → "Baca Ulang" → reset to reading phase

Server: fetch module → compare answers[i] === quiz[i].correctIndex
Security: correctIndex ONLY in database, NEVER in client response
```

### 5d. Interview Simulator (client-only)

```
Question selection: 1 per category (4) + 1 random = 5
Scoring (analyzeAnswer):
  wordCount ≥100→+2, ≥50→+1 | keywords ratio→0-5 | bonus→0-2
  STAR detected→+1 | red flags→-1 each | clamp 1-10
Pass: avg ≥ 7 → mark module 5 complete
Fail: retry with new random questions
```

### 5e. AI Function Calling Pattern

```
System prompt → tools[{function schema}] → tool_choice{function name}
Response: choices[0].message.tool_calls[0].function.arguments (JSON string)
Model: flash for heavy tasks, flash-lite for light tasks
```

### 5f. Link Obfuscation

```
All checkout CTAs use openCheckout() from src/lib/links.ts
URLs Base64-encoded (split segments), onClick only (no href)
Prevents: source exposure, status bar hover, crawler detection
```

---

## 6. Design System Reference

### CSS Variables (`src/index.css`)

```css
:root {
  --background: 43 50% 93%;       /* Ivory */
  --foreground: 240 24% 14%;      /* Dark */
  --neo-lime: 84 100% 62%;        /* Primary CTA */
  --neo-pink: 340 100% 71%;       /* Accent */
  --neo-cyan: 195 100% 61%;       /* Info */
  --neo-violet: 258 90% 66%;      /* Premium */
  --neo-black: 240 24% 14%;       /* Same as foreground */
  --card: 0 0% 100%;              /* White */
  --radius: 0px;                  /* Neo-brutalist */
}
```

### Tailwind Custom (`tailwind.config.ts`)

```ts
colors: {
  neoLime: "hsl(var(--neo-lime))",
  neoPink: "hsl(var(--neo-pink))",
  neoCyan: "hsl(var(--neo-cyan))",
  neoViolet: "hsl(var(--neo-violet))",
  neoBlack: "hsl(var(--neo-black))",
  ivory: "hsl(var(--ivory))",
}
```

### Shadows
- `.shadow-neoSm` → `2px 2px 0 0 rgba(0,0,0,1)`
- `.shadow-neo` → `4px 4px 0 0 rgba(0,0,0,1)`
- `.shadow-neoLg` → `8px 8px 0 0 rgba(0,0,0,1)`

### Typography
- `.font-display` → Archivo Black (headings, buttons — always uppercase)
- `.font-body` → Space Grotesk 300–700 (body text)

### Neo-Brutalist Rules
- Borders: `border-4 border-foreground` (primary), `border-2` (secondary)
- Radius: 0px everywhere
- Hover: `shadow-neo → hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]`
- Selection: black bg + neoLime text

---

## 7. Architectural Decisions (LOCKED)

These decisions are final. Do NOT change without explicit user request.

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Interview scoring is 100% client-side, rule-based | No LLM cost, instant feedback, works offline |
| 2 | Quiz correctIndex stripped server-side | Anti-cheat — answers never reach client |
| 3 | Subscription checked BOTH client + server | Client guard = UX, server check = security |
| 4 | No FK to auth.users | Supabase restriction — use user_id UUID match instead |
| 5 | Edge functions use manual JWT validation | Granular control over auth + subscription checks |
| 6 | CV file parsing is client-side only | Zero storage cost, privacy (files never uploaded) |
| 7 | Link URLs are Base64-obfuscated | Prevent scraping, no plaintext URLs in source |
| 8 | Module content stored in DB, not files | Admin can edit via panel, no redeployment needed |
| 9 | No framer-motion — CSS-only animations | Smaller bundle, neo-brutalist doesn't need complex motion |
| 10 | Profile fetch deduplication via initialSessionHandled | Prevents double-fetch on init (onAuthStateChange + getSession race) |

---

## 8. Extension Cookbook

### Recipe 1: Add New Premium Page

```tsx
// 1. Create src/pages/NewPage.tsx
// 2. In App.tsx — add lazy import + route:
const NewPage = React.lazy(() => import("./pages/NewPage"));
// In Routes:
<Route path="/dashboard/new-page" element={<SubscriptionGuard><NewPage /></SubscriptionGuard>} />
// 3. Add CTA card in Dashboard.tsx
```

### Recipe 2: Add New Edge Function

```
1. Create supabase/functions/my-function/index.ts
2. Import cors: import { getCorsHeaders } from "../_shared/cors.ts";
3. Handle OPTIONS preflight
4. Validate JWT manually:
   const supabaseUser = createClient(URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
   const { data: { user } } = await supabaseUser.auth.getUser();
5. Check subscription if premium:
   const { data: profile } = await supabaseAdmin.from('profiles').select('license_expires_at').eq('user_id', user.id).single();
   if (new Date(profile.license_expires_at) <= new Date()) return 403;
6. Add to config.toml: [functions.my-function] verify_jwt = false
7. Edge function auto-deploys on push
```

### Recipe 3: Add New AI Mode to analyze-cv

```ts
// In supabase/functions/analyze-cv/index.ts:
// 1. Add new if (mode === "my-mode") block
// 2. Define system prompt + tools schema + tool_choice
// 3. Call AI gateway with appropriate model (flash or flash-lite)
// 4. Parse tool_calls response
// 5. Return structured JSON
```

### Recipe 4: Add New Database Table

```sql
-- 1. CREATE TABLE with defaults and NOT NULL constraints
CREATE TABLE public.my_table (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  -- columns...
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. ALWAYS enable RLS
ALTER TABLE public.my_table ENABLE ROW LEVEL SECURITY;

-- 3. Add policies (user owns rows)
CREATE POLICY "Users can view own" ON public.my_table
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own" ON public.my_table
  FOR INSERT WITH CHECK (auth.uid() = user_id);
-- 4. Admin policy if needed
CREATE POLICY "Admins can view all" ON public.my_table
  FOR SELECT USING (has_role(auth.uid(), 'admin'));
```

### Recipe 5: Add Satellite SEO Page

```ts
// 1. Add object to src/data/satellite-pages.ts:
{ slug: "new-slug", title: "...", category: "posisi"|"lokasi"|"istilah"|"gaji",
  metaDescription: "...", content: { intro, sections[], tips[], cta },
  relatedSlugs: ["existing-slug-1"] }
// 2. Update relatedSlugs in related pages to link back
// 3. Add URL to public/sitemap.xml
```

### Recipe 6: Add Prompt Category

```
1. INSERT prompts into DB with new category name
2. In src/pages/PromptLibrary.tsx:
   - Add category to CATEGORIES array
   - Add color to CATEGORY_COLORS map
```

### Recipe 7: Modify Design Colors

```
1. Update CSS variable in src/index.css (:root block)
2. Update tailwind.config.ts if adding new color token
3. NEVER hardcode colors in components — always use tokens
```

### Recipe 8: Add Module Content

```sql
INSERT INTO module_content (module_id, title, thesis, sections) VALUES (
  '6', 'Module Title', 'Thesis text',
  '[{"id":"6.1","title":"Section","content":"<p>HTML</p>","quiz":[{"question":"Q?","options":["A","B","C","D"],"correctIndex":0}]}]'
);
-- Update profiles.module_progress default if adding beyond 5
```

---

## 9. Common Pitfalls

| # | Pitfall | Prevention |
|---|---------|------------|
| 1 | Double profile fetch on init | `initialSessionHandled` guard in AuthContext |
| 2 | RLS PERMISSIVE confusion | Supabase evaluates same-command policies as OR. Admin + User SELECT both PERMISSIVE = either matches. |
| 3 | CV draft limit bypass | Enforce max 3 BOTH client-side (UX) AND before INSERT (count existing) |
| 4 | Speech-to-text browser support | Web Speech API: Chrome + Edge only. Gracefully degrade to text input. |
| 5 | Module content subscription check | `get-module-content` checks via user token. `get-prompts` checks via service role. Be consistent. |
| 6 | Hardcoded colors | Always use CSS variables / Tailwind tokens. Never `text-white`, `bg-black`. |
| 7 | Missing correctIndex in quiz | Module content MUST have correctIndex in DB. get-module-content strips it. validate-quiz reads it. |
| 8 | Supabase 1000-row default limit | When debugging missing data, check if hitting this limit first. |

---

## 10. Build Order (New Platform from Scratch)

| Phase | What | Why |
|-------|------|-----|
| 1 | Database: tables + RLS + enum + functions | Foundation |
| 2 | Auth: AuthContext + AuthModal + email verify | Access control |
| 3 | Edge Functions: validate-license, get-module-content, validate-quiz | Core backend |
| 4 | Landing Page: 13 funnel components | Acquisition |
| 5 | Dashboard: progress + countdown | Member home |
| 6 | Module Reader: reading tracker + quiz + progression | Core learning |
| 7 | Interview Simulator: questions + scoring | Module 5 |
| 8 | CV Builder: 6-step wizard + drafts | Core tool |
| 9 | AI Integration: analyze-cv (6 modes) | Enhancement |
| 10 | CV Checker: free + member versions | Conversion funnel |
| 11 | Prompt Library, LinkedIn, Cover Letter | Secondary tools |
| 12 | Admin Panel: user + license management | Operations |
| 13 | SEO: satellite pages + tips + sitemap | Growth |
| 14 | Polish: lazy loading, dedup, error handling, inactivity logout | Production |

---

## 11. Anti-Patterns (DO NOT)

1. ❌ Send correctIndex to client
2. ❌ Use LLM for interview scoring
3. ❌ Fetch profile in individual components (use `useAuth()`)
4. ❌ Skip subscription check in edge functions
5. ❌ Hardcode colors in components
6. ❌ Create tables without RLS
7. ❌ Store checkout URLs as plaintext
8. ❌ Use FK reference to auth.users table
9. ❌ Edit auto-generated files: `client.ts`, `types.ts`, `.env`, `config.toml`
