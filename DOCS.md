# MantraSkill — Technical Documentation

> **v2.1** | Updated: 2026-05-07 | Single source of truth. Consolidated from PRD, RAG, and MASTER_BLUEPRINT.

---

## 1. Product Summary

| Key | Value |
|-----|-------|
| Product | MantraSkill — 7-day career sprint platform |
| URL | `https://mantraskill.web.id` |
| Target | Indonesian job seekers 22-30, fresh grads, career switchers |
| Price | IDR 148,000 / 90 days (configurable per license key) |
| Core Value | Structured learning + AI-powered CV tools + interview prep |

### User Journey

```
Landing Page → Buy License Key (external checkout) → Register (email + key)
→ Verify Email → Login → Dashboard
→ Module 1 (auto-unlock) → Read → Quiz → Pass → Module 2 unlocks → ...
→ Module 5 (Interview Simulator) → Score ≥ 7/10 → Complete
→ Access: CV Builder, CV Checker, LinkedIn Optimizer, Cover Letter Generator, Prompt Library
```

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | React | 18.3.1 |
| Bundler | Vite | 5.4.19 |
| Language | TypeScript | 5.8.3 |
| Styling | Tailwind CSS | 3.4.17 |
| UI Primitives | Radix UI | Various (1.x–2.x) |
| Routing | react-router-dom | 6.30.1 |
| Server State | @tanstack/react-query | 5.83.0 |
| Backend | Custom Node.js & Express API | — |
| Database | JSON File Storage | — |
| Charts | Recharts | 2.15.4 |
| Forms | react-hook-form + zod | 7.61.1 / 3.25.76 |
| Icons | lucide-react | 0.462.0 |
| PDF Parsing | pdfjs-dist | 4.9.155 |
| DOCX Parsing | mammoth | 1.8.0 |
| DOCX Generation | docx | 9.5.3 |
| AI Gateway | Lovable AI (google/gemini-2.5-flash) | — |

---

## 3. Architecture & Routes

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  React 18 + TypeScript + Vite 5 + Tailwind CSS 3    │
│  State: AuthContext (user, profile)                 │
│  Guard: SubscriptionGuard (route) + useInactivity   │
│  Lazy: All pages except Index + NotFound             │
├─────────────────────────────────────────────────────┤
│                 BACKEND (Node.js/Express)            │
│  Auth: JWT & Bcrypt (Custom Logic)                   │
│  DB: Local JSON Storage (database.json)              │
│  API: RESTful Endpoints on port 5001                 │
│  AI: Direct API requests to AI Gateway               │
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

### Folder Structure

```text
├── src/
│   ├── main.tsx / App.tsx        # Entry + routes + provider tree
│   ├── contexts/AuthContext.tsx   # Global auth/session/subscription state
│   ├── hooks/                    # useInactivityLogout, useSwipeBack, use-toast, use-mobile
│   ├── lib/                      # document-pipeline, word-intelligence, skill-suggestions, links, utils
│   ├── components/
│   │   ├── auth/                 # AuthModal, SubscriptionGuard, LogoutConfirmDialog
│   │   ├── landing/              # 13 sales funnel components
│   │   ├── cv-builder/           # 6-step wizard components + CVPreview + ScoreCard
│   │   ├── modules/              # InterviewSimulator, ModuleQuiz, ReadingTracker, useSpeechToText
│   │   ├── seo/                  # SEOHead, ArticleLayout, SatellitePage
│   │   └── ui/                   # 40+ shadcn/ui primitives
│   ├── pages/                    # One component per route
│   └── data/                     # module-5-content, satellite-pages
├── server/
│   ├── server.js                 # Express App Entrypoint
│   ├── db.js                     # Local JSON database connector
│   ├── database.json             # Actual database file
│   ├── middleware/               # Custom Express middlewares (e.g., authMiddleware)
│   └── routes/                   # API Route handlers (auth.js, profile.js)
```

---

## 4. Features

### 4.1 Landing Page (`/`)

13 sequential sales funnel components: Header, Hero, Marquee, Storytelling, Features, DenialTimer, VSL, Timeline, ValueStack, PricingCTA, Testimonials, CompanyLogos, FAQ.

### 4.2 Dashboard (`/dashboard`)

- Welcome header + subscription countdown (green → yellow → red)
- Sprint progress (X/5 modules)
- CTA cards: Prompt Library, CV Builder, CV Checker, LinkedIn Optimizer, Cover Letter Generator
- Module list with lock/unlock/complete status
- Module lock logic: Module 1 always unlocked; Module N requires N-1 completed

### 4.3 Module Reader (`/dashboard/module/:id`)

**Anti-cheat reading requirements:** Scroll ≥90%, min read time (180 WPM), speed scroll detection, tab visibility tracking, admin bypass.

**Quiz:** Server-side validation via `validate-quiz` edge function. `correctIndex` NEVER sent to client.

### 4.4 Interview Simulator (Module 5)

5 random questions (1 per category + 1 random). Text or speech-to-text input. 100% client-side rule-based scoring (NO LLM). Pass: avg ≥ 7/10.

### 4.5 CV Builder (`/dashboard/cv-builder`)

6-step wizard: Personal → Summary → Experience → Education → Skills → Review. Max 3 drafts per user. Auto-save. DOCX export. 6 AI modes: analyze, enhance-bullet, generate-summary, rewrite, jd-scan, text-analyze.

### 4.6 CV Checker

| Aspect | Free (`/gratis/cek-cv`) | Member (`/dashboard/cv-checker`) |
|--------|-------------------------|----------------------------------|
| Auth | No | Yes + subscription |
| AI analysis | 1 insight free + 2 blurred | Full unblurred 10-category report |
| JD scan | No | Yes |
| Rate limit | 3/day per IP | Unlimited |

### 4.7 LinkedIn Optimizer

4 copy-paste prompt generators: Headline, About Section, Post Content, Connection Request.

### 4.8 Cover Letter Generator

3 prompt generators: Full Letter, Opening Hook, Company Research Integration.

### 4.9 Prompt Library

55+ prompts from database, 7 categories, search + filter, one-click copy.

### 4.10 Admin Panel

User list, license CRUD, bulk key generator (1–500, format `MNTR-XXXX-XXXX`), CSV export, user activation.

### 4.11 SEO Satellite Pages

26+ pages at `/karir/:slug`, 4 tip articles at `/tips/*`, keyword index at `/seo/keywords`.

---

## 5. Database Schema

### Enum & Helper Function

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
| created_at, updated_at | timestamptz | now() | |

**RLS:** Own-row SELECT/INSERT/UPDATE. Admin SELECT all.

#### license_keys

| Column | Type | Default |
|--------|------|---------|
| id | uuid PK | gen_random_uuid() |
| key | text UNIQUE NOT NULL | Format: `MNTR-XXXX-XXXX` |
| status | text | 'active' (active/used/inactive) |
| validity_days | int | 90 |
| used_by | uuid | NULL |
| created_at | timestamptz | now() |

**RLS:** Admin ALL. User SELECT own.

#### cv_data

| Column | Type | Default |
|--------|------|---------|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid NOT NULL | |
| cv_name, target_position, summary | text | '' |
| years_experience | int | 0 |
| personal_info, experiences, education, skills, certifications, languages | jsonb | Various defaults |
| ai_analysis | jsonb | NULL |
| created_at, updated_at | timestamptz | now() |

**RLS:** Own-row CRUD. Admin SELECT all.

#### module_content

Stores module sections as JSONB. `correctIndex` in quiz is stripped by `get-module-content` edge function.

#### prompts

55+ AI prompts organized by category. Admin-only write; users access via `get-prompts` edge function.

#### user_roles

Role assignments (`user_id` + `app_role` enum). Admin-only management.

---

## 6. Edge Functions

All use `verify_jwt = false` (manual JWT validation). AI Gateway: `https://ai.gateway.lovable.dev/v1/chat/completions`.

| Function | Purpose | Auth | Model |
|----------|---------|------|-------|
| `analyze-cv` | 6 AI modes (analyze, enhance-bullet, generate-summary, rewrite, jd-scan, text-analyze) | JWT + subscription | Flash / Flash Lite |
| `free-cv-check` | Free tier CV check (3/day per IP) | None | Flash Lite |
| `validate-license` | Validate & activate license keys | JWT | — |
| `activate-user` | Admin: assign license to user | JWT (admin) | — |
| `get-module-content` | Fetch module sections (strips correctIndex) | JWT + subscription | — |
| `get-prompts` | Fetch prompt library | JWT + subscription | — |
| `validate-quiz` | Validate quiz answers server-side | JWT | — |

---

## 7. Design System (Neo-Brutalist)

### Colors (CSS Variables)

| Token | HSL | Usage |
|-------|-----|-------|
| `--background` | 43 50% 93% | Ivory page background |
| `--foreground` | 240 24% 14% | Text, borders |
| `--neo-lime` | 84 100% 62% | Primary CTA, success |
| `--neo-pink` | 340 100% 71% | Accent, urgency |
| `--neo-cyan` | 195 100% 61% | Info, secondary CTA |
| `--neo-violet` | 258 90% 66% | Premium accent |

### Typography

- **Display:** Archivo Black — headings, buttons, labels. Always uppercase.
- **Body:** Space Grotesk 300–700 — paragraph text.

### Rules

- Borders: `border-4 border-foreground` (primary), `border-2` (secondary)
- Radius: 0px everywhere
- Shadows: `shadow-neoSm` (2px), `shadow-neo` (4px), `shadow-neoLg` (8px)
- Hover: shadow disappears + translate 4px down-right ("pressed" feel)

---

## 8. Custom Hooks & Libraries

| Hook/Library | Purpose |
|-------------|---------|
| `useAuth` | Auth state, profile, subscription, admin flag, days remaining |
| `useInactivityLogout` | Auto-logout after 8hrs. Dispatches `session-expired` event |
| `useSwipeBack` | iOS-style edge swipe-back gesture |
| `useReadingTracker` | Anti-cheat: scroll %, time, speed detection |
| `useSpeechToText` | Web Speech API wrapper, `id-ID` locale |
| `useDocumentPipeline` | Unified PDF/DOCX/TXT parsing, sanitization, section identification |
| `word-intelligence` | Offline CV text enhancer. Maps weak→strong phrases. ATS score 0–100 |
| `skill-suggestions` | Offline keyword→skill mapper. 20+ categories |
| `links` | Base64-obfuscated checkout/WhatsApp URLs |

---

## 9. Architectural Decisions (LOCKED)

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Interview scoring is 100% client-side, rule-based | No LLM cost, instant feedback |
| 2 | Quiz correctIndex stripped server-side | Anti-cheat |
| 3 | Subscription checked BOTH client + server | Client = UX, server = security |
| 4 | No FK to auth.users | Supabase restriction |
| 5 | Edge functions use manual JWT validation | Granular control |
| 6 | CV file parsing is client-side only | Zero storage cost, privacy |
| 7 | Link URLs are Base64-obfuscated | Prevent scraping |
| 8 | Module content stored in DB, not files | Admin can edit, no redeploy |
| 9 | No framer-motion — CSS-only animations | Smaller bundle |

---

## 10. Extension Cookbook

### Add New Premium Page

```tsx
// 1. Create src/pages/NewPage.tsx
// 2. App.tsx: lazy import + SubscriptionGuard route
const NewPage = React.lazy(() => import("./pages/NewPage"));
<Route path="/dashboard/new-page" element={<SubscriptionGuard><NewPage /></SubscriptionGuard>} />
// 3. Add CTA card in Dashboard.tsx
```

### Add New Edge Function

```
1. Create supabase/functions/my-function/index.ts
2. Import cors from _shared/cors.ts
3. Handle OPTIONS preflight
4. Validate JWT manually
5. Check subscription if premium
6. Add to config.toml: [functions.my-function] verify_jwt = false
```

### Add New Database Table

```sql
CREATE TABLE public.my_table (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.my_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own" ON public.my_table FOR SELECT USING (auth.uid() = user_id);
```

### Add Satellite SEO Page

Add object to `src/data/satellite-pages.ts` with slug, title, category, content. Update `sitemap.xml`.

---

## 11. Anti-Patterns (DO NOT)

1. ❌ Send correctIndex to client
2. ❌ Use LLM for interview scoring
3. ❌ Fetch profile in individual components (use `useAuth()`)
4. ❌ Skip subscription check in edge functions
5. ❌ Hardcode colors (use CSS variables / Tailwind tokens)
6. ❌ Create tables without RLS
7. ❌ Store checkout URLs as plaintext
8. ❌ Use FK reference to auth.users table

---

## 12. Common Pitfalls

| Pitfall | Prevention |
|---------|------------|
| Double profile fetch on init | `initialSessionHandled` guard in AuthContext |
| RLS PERMISSIVE confusion | Admin + User SELECT both PERMISSIVE = either matches |
| CV draft limit bypass | Enforce max 3 BOTH client-side AND before INSERT |
| Speech-to-text browser support | Web Speech API: Chrome + Edge only. Degrade gracefully |
| Hardcoded colors | Always use CSS variables / Tailwind tokens |
| Supabase 1000-row limit | Check if hitting this when debugging missing data |

---

## 13. Security

| Requirement | Implementation |
|-------------|----------------|
| RLS on all tables | Every table has row-level security policies |
| Server-side quiz validation | correctIndex never sent to client |
| JWT validation | All edge functions verify JWT manually |
| Subscription check | Both client-side (guard) AND server-side (edge function) |
| Inactivity logout | 8 hours of no interaction |
| Anti-impersonation | License validation checks user_id matches JWT |
| Link obfuscation | Checkout/WhatsApp URLs Base64-encoded, onClick only |
