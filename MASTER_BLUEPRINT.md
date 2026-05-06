# MASTER_BLUEPRINT.md — MantraSkill

> Comprehensive technical documentation reverse-engineered from the production codebase.
> Generated: 2026-03-18

---

## 1. PROJECT OVERVIEW & TECH STACK

**App**: MantraSkill — a 7-day career acceleration platform targeting Gen-Z job seekers in Indonesia. Members pay IDR 148k for access to 5 learning modules, an ATS CV Builder, LinkedIn Optimizer, Cover Letter Generator, Prompt AI Library, and a comprehensive CV Checker.

**Production URL**: `https://mantraskill.web.id` (alias `mantraskill.lovable.app`)

**Core Stack & Versions** (from `package.json`):

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | React | 18.3.1 |
| Bundler | Vite | 5.4.19 |
| Language | TypeScript | 5.8.3 |
| Styling | Tailwind CSS | 3.4.17 |
| UI Primitives | Radix UI | Various (1.x–2.x) |
| Routing | react-router-dom | 6.30.1 |
| Server State | @tanstack/react-query | 5.83.0 |
| Backend | Supabase (Lovable Cloud) | supabase-js 2.95.3 |
| Charts | Recharts | 2.15.4 |
| Forms | react-hook-form + zod | 7.61.1 / 3.25.76 |
| Icons | lucide-react | 0.462.0 |
| PDF Parsing | pdfjs-dist | 4.9.155 |
| DOCX Parsing | mammoth | 1.8.0 |
| DOCX Generation | docx | 9.5.3 |
| Animations | tailwindcss-animate | 1.0.7 |
| Minifier | Terser | 5.46.0 |
| AI Gateway | Lovable AI (google/gemini-2.5-flash) | — |

---

## 2. ARCHITECTURE & FOLDER STRUCTURE

```text
├── index.html                    # Static shell + JSON-LD + CSP + SEO meta
├── vite.config.ts                # Vite config: SWC, Terser, manual chunks
├── tailwind.config.ts            # Design tokens, neo-brutalist theme
├── public/
│   ├── manifest.json             # PWA manifest
│   ├── robots.txt / sitemap.xml  # Crawl directives
│   ├── og-image.png              # OpenGraph image
│   └── google*.html / BingSiteAuth.xml  # Search console verification
├── src/
│   ├── main.tsx                  # React root mount
│   ├── App.tsx                   # Route definitions + provider tree
│   ├── App.css / index.css       # Global styles + print styles
│   ├── contexts/
│   │   └── AuthContext.tsx        # Auth state, profile, subscription logic
│   ├── hooks/
│   │   ├── use-toast.ts           # Toast notification hook
│   │   ├── use-mobile.tsx         # Mobile breakpoint detection
│   │   ├── useInactivityLogout.ts # 8hr auto-logout
│   │   └── useSwipeBack.ts       # iOS-style swipe-back navigation
│   ├── lib/
│   │   ├── links.ts              # Obfuscated checkout/WA URLs
│   │   ├── word-intelligence.ts  # Offline CV text enhancement engine
│   │   ├── skill-suggestions.ts  # Keyword→skill mapping
│   │   └── utils.ts              # cn() utility
│   ├── components/
│   │   ├── auth/                 # AuthModal, LogoutConfirmDialog, SubscriptionGuard
│   │   ├── landing/              # Hero, Header, Footer, FAQ, Features, Testimonials,
│   │   │                         # Timeline, VSL, ValueStack, PricingCTA, CompanyLogos,
│   │   │                         # Marquee, DenialTimer, SocialProofPopup, StickyNav,
│   │   │                         # Storytelling, WhatsAppButton, SectionWrapper
│   │   ├── cv-builder/           # CVPreview, ScoreCard, BeforeAfterCard,
│   │   │                         # Step{Personal,Experience,Education,Skills,Summary,Review}
│   │   ├── modules/              # InterviewSimulator, ModuleQuiz, ReadingTracker,
│   │   │                         # useSpeechToText
│   │   ├── seo/                  # SEOHead, ArticleLayout, SatellitePage, ShareButtons
│   │   └── ui/                   # 40+ shadcn/ui primitives
│   ├── pages/
│   │   ├── Index.tsx             # Landing page
│   │   ├── Dashboard.tsx         # Member dashboard
│   │   ├── CVBuilder.tsx         # Multi-step CV builder
│   │   ├── MemberCVChecker.tsx   # Comprehensive CV analysis (member)
│   │   ├── FreeCVChecker.tsx     # Free CV check (public, results blurred)
│   │   ├── ModuleReader.tsx      # Module content viewer
│   │   ├── LinkedInOptimizer.tsx # LinkedIn profile optimizer
│   │   ├── CoverLetterGenerator.tsx
│   │   ├── PromptLibrary.tsx     # 55+ AI prompts
│   │   ├── Admin.tsx             # Admin panel (user/license management)
│   │   ├── CareerHub.tsx         # SEO content hub (/karir)
│   │   ├── SatelliteArticle.tsx  # Dynamic SEO articles
│   │   ├── KeywordIndex.tsx      # SEO keyword index
│   │   ├── ResetPassword.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   ├── NotFound.tsx
│   │   └── tips/                 # CVATSTips, InterviewTips, LinkedInTips, CoverLetterTips
│   ├── data/
│   │   ├── module-1-content.ts   # Module 1 text content
│   │   ├── module-5-content.ts   # Interview questions bank
│   │   └── satellite-pages.ts   # 30+ SEO satellite page data
│   └── integrations/supabase/
│       ├── client.ts             # Auto-generated Supabase client
│       └── types.ts              # Auto-generated DB types
├── supabase/
│   ├── config.toml               # Supabase project config
│   ├── templates/confirmation.html
│   ├── migrations/               # SQL migrations
│   └── functions/
│       ├── _shared/cors.ts       # CORS with origin whitelist
│       ├── _shared/rate-limit.ts # In-memory IP rate limiter
│       ├── analyze-cv/           # AI CV analysis (3 modes)
│       ├── free-cv-check/        # Free tier CV check
│       ├── validate-license/     # License key validation
│       ├── activate-user/        # Admin user activation
│       ├── get-module-content/   # Fetch module content
│       ├── get-prompts/          # Fetch prompt library
│       └── validate-quiz/        # Quiz answer validation
```

**Separation of Concerns**:

- `contexts/` — Global auth/session state only
- `hooks/` — Reusable stateful logic (toast, mobile detection, inactivity, gestures)
- `lib/` — Pure utility functions (no React dependencies except `links.ts`)
- `components/` — Presentational + domain-specific components, grouped by feature
- `pages/` — Route-level components, one per route
- `data/` — Static content that would otherwise bloat components
- `supabase/functions/` — Deno-based edge functions (serverless backend)

---

## 3. UI/UX & DESIGN SYSTEM ("NEO-BRUTALIST")

### Color Palette

HSL CSS variables defined in `src/index.css`:

| Token | Light Mode HSL | Approx Hex | Usage |
|-------|---------------|-----------|-------|
| `--background` | 43 50% 93% | `#ECE8D9` | Page background (ivory) |
| `--foreground` | 240 24% 14% | `#1E1B3A` | Text, borders |
| `--neo-lime` | 84 100% 62% | `#A3F73E` | Primary CTA, success |
| `--neo-pink` | 340 100% 71% | `#FF6B9D` | Accent, urgency |
| `--neo-cyan` | 195 100% 61% | `#38D4FF` | Secondary CTA, info |
| `--neo-violet` | 258 90% 66% | `#8B5CF6` | Tertiary accent |
| `--neo-black` | 240 24% 14% | `#1E1B3A` | Dark sections |

### Typography

Google Fonts (preloaded in `index.html`):

- **Display**: `Archivo Black` — all headings, buttons, labels. Always `uppercase`.
- **Body**: `Space Grotesk` (300–700) — paragraph text, descriptions.

### Spacing & Border Radius

- `--radius: 0px` — all corners are sharp (neo-brutalist).
- Borders: thick (`border-2` to `border-4`) with `border-foreground`.
- Shadows: offset box-shadows — `shadow-neoSm` (2px), `shadow-neo` (4px), `shadow-neoLg` (8px).

### Animation Paradigms

- **No framer-motion** — all CSS-based.
- Interactive hover: `hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]` (pressed button effect).
- Marquee: custom `@keyframes marquee` (20s infinite linear).
- Blob: `@keyframes blob` (7s infinite, translate + scale).
- Accordion: Radix-powered `accordion-down`/`accordion-up`.
- Pulse: Tailwind `animate-pulse` for loading states.

### Reusable UI Components

`src/components/ui/` contains 40+ shadcn/ui primitives including: `Button`, `Dialog`, `Card`, `Tabs`, `Accordion`, `Toast`, `Toaster` (dual: Radix + Sonner), `Input`, `Textarea`, `Select`, `Progress`, `Badge`, `Sheet`, `Popover`, `Tooltip`, `Form`, `Table`, `Checkbox`, `Switch`, `Slider`, `Calendar`, etc.

### Special Effects

- **Dot Pattern Background**: `.dot-pattern` — radial-gradient 16×16px grid.

---

## 4. STATE MANAGEMENT & DATA FLOW

### Global State

Single React Context (`AuthContext`):

- **Provides**: `user`, `session`, `profile`, `isSubscriptionActive`, `isAdmin`, `daysRemaining`
- **Auth methods**: `signUp`, `signIn`, `signOut`, `resetPassword`, `refreshProfile`, `refreshIfStale`
- **Auto-refresh**: Profile refreshed every 5 minutes and on tab visibility change
- **Stale threshold**: 5 minutes (`STALE_THRESHOLD_MS`)

### Server State

`@tanstack/react-query` `QueryClient` at app root. Used implicitly by Supabase queries in pages.

**No Redux/Zustand** — prop drilling + context is the pattern.

### Data Flow

```text
User Action → Component State (useState)
              ↓
         supabase.functions.invoke() or supabase.from().select()
              ↓
         Edge Function (Deno) → Lovable AI Gateway / DB
              ↓
         Response → setState → UI Update
```

### Database Schema (6 tables)

| Table | Purpose | RLS |
|-------|---------|-----|
| `profiles` | User profile, license key, module progress, expiry | Users own rows; admins see all |
| `license_keys` | License keys with status, validity_days, used_by | Admins manage; users see own |
| `cv_data` | Saved CVs (JSONB: personal_info, experiences, education, skills, etc.) | Users own rows; admins see all |
| `module_content` | Module text content (title, thesis, sections JSONB) | Admin-only write; authenticated read via edge function |
| `prompts` | AI prompt library (category, title, prompt_text, sort_order) | Admin-only write; read via edge function |
| `user_roles` | Role assignments (user_id, role enum: admin/user) | Admin-only manage |

### Edge Functions (7)

| Function | Purpose | Auth Required |
|----------|---------|--------------|
| `analyze-cv` | AI CV analysis (3 modes: default, text-analyze, jd-scan) | Yes + subscription |
| `free-cv-check` | Free tier CV check (limited, blurred results) | No |
| `validate-license` | Validate & activate license keys | Yes |
| `activate-user` | Admin: assign license to user | Yes (admin) |
| `get-module-content` | Fetch module sections | Yes + subscription |
| `get-prompts` | Fetch prompt library | Yes + subscription |
| `validate-quiz` | Validate quiz answers | Yes |

### AI Integration

All AI calls go through `https://ai.gateway.lovable.dev/v1/chat/completions` using `google/gemini-2.5-flash` model. No external API keys needed.

---

## 5. PRODUCTION & SEO READINESS

### SEO Implementation

- **`index.html`**: Full meta tags (description, keywords, OG, Twitter Card), canonical URL, hreflang `id`, robots directives.
- **JSON-LD structured data**: `Organization`, `WebSite` (with SearchAction), `Course` (with price + rating), `FAQPage`.
- **`SEOHead` component** (`src/components/seo/SEOHead.tsx`): Dynamic per-page title, description, OG tags, canonical, and JSON-LD injection.
- **Search console verification**: Google (`google6b0e66dff4d8a921.html`) + Bing (`BingSiteAuth.xml`).
- **`robots.txt` + `sitemap.xml`** in `/public`.
- **Satellite SEO pages**: 30+ pages at `/karir/:slug` covering positions, locations, salaries, career terms.
- **Career Hub** (`/karir`): Topic cluster pages grouped by category.
- **Tips pages**: 4 long-form SEO articles at `/tips/*`.

### Performance Optimizations

- **Code splitting**: All pages except `Index` and `NotFound` use `React.lazy()` + `Suspense`.
- **Manual chunks** (`vite.config.ts`): `vendor` (react, react-dom, react-router-dom), `ui` (radix dialog, tooltip, popover).
- **Font loading**: `preconnect` + `preload` with `onload` swap for Google Fonts.
- **DNS prefetch**: Supabase API + Clearbit logos.
- **Static shell**: `index.html` has an inline-styled skeleton for instant LCP before React hydrates.
- **Terser**: `drop_console: true`, 2 passes, toplevel mangle, no comments.
- **Print CSS**: `@media print` with `@page { margin: 0 }` for clean PDF export.
- **CSP header**: Strict Content-Security-Policy in meta tag.

### Security Headers (in `index.html` meta)

- `Content-Security-Policy`: script-src self + unsafe-inline; connect-src to Supabase + AI gateway; frame-src none; object-src none.
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Deployment

- **Frontend**: Lovable hosting (publish button → lovable.app subdomain).
- **Backend**: Edge functions auto-deploy on push.
- **Custom domain**: `mantraskill.web.id`.
- **PWA**: `manifest.json` with standalone display, theme `#1E1B3A`.

### Environment Variables (auto-managed)

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

---

## 6. CORE BUSINESS LOGIC & CUSTOM HOOKS

### Custom Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useAuth` | `src/contexts/AuthContext.tsx` | Access auth state, profile, subscription status, admin flag, days remaining. Includes `refreshIfStale()` for lazy profile refresh. |
| `useInactivityLogout` | `src/hooks/useInactivityLogout.ts` | Auto-logout after 8 hours of inactivity. Listens to mousemove, keydown, scroll, touchstart, click. Dispatches `session-expired` custom event. |
| `useSwipeBack` | `src/hooks/useSwipeBack.ts` | iOS-style edge swipe-back gesture for mobile. Detects left-edge touch, locks direction, triggers `navigate(-1)` at 30% threshold. Skips in non-standalone Safari. |
| `useSpeechToText` | `src/components/modules/useSpeechToText.ts` | Web Speech API wrapper for interview simulator. Supports Indonesian (`id-ID`). Auto-restarts sessions, handles errors gracefully. |
| `useReadingTracker` | `src/components/modules/ReadingTracker.tsx` | Tracks scroll percentage + time spent reading. Calculates minimum read time (180 WPM). Detects speed-scrolling to prevent module skip. |
| `useToast` | `src/hooks/use-toast.ts` | Toast notification state management. |
| `useMobile` | `src/hooks/use-mobile.tsx` | Responsive breakpoint detection. |

### Core Utility Libraries

| Library | File | Purpose |
|---------|------|---------|
| `word-intelligence` | `src/lib/word-intelligence.ts` | **100% offline** CV text enhancement. Maps 25+ weak Indonesian/English phrases to strong action verbs. Removes cliché phrases. Checks for metrics, action verb starts, length. Computes ATS score (0–100). Functions: `enhanceDescription()`, `splitToBullets()`, `enhanceBullets()`. |
| `skill-suggestions` | `src/lib/skill-suggestions.ts` | **100% offline** keyword→skill mapper. 20+ keyword categories (marketing, data, web, etc.) map to relevant hard skills. Function: `suggestSkills(experienceTexts[])`. |
| `links` | `src/lib/links.ts` | Base64-obfuscated checkout (LYNK.id) and WhatsApp URLs. Prevents scraping/hotlinking. Functions: `getCheckoutUrl()`, `getWaUrl()`, `openCheckout()`, `openWhatsApp()`. |

### Key Business Logic Patterns

1. **Subscription Model**: License key–based. Profile stores `license_key` + `license_expires_at`. `isSubscriptionActive = !!license_key && daysRemaining > 0`. `SubscriptionGuard` component wraps protected routes.

2. **Module Progression**: Sequential unlock — module N requires module N-1 completed. Progress stored as JSONB `{"1": false, "2": false, ...}` in profiles table.

3. **CV Builder Flow**: 6-step wizard (Personal → Experience → Education → Skills → Summary → Review). Data stored in `cv_data` table as JSONB columns. AI analysis via `analyze-cv` edge function. Export via `window.print()` with custom `@media print` styles.

4. **Free vs Member CV Check**: Free version (`/gratis/cek-cv`) calls `free-cv-check` edge function — results partially blurred. Member version (`/dashboard/cv-checker`) calls `analyze-cv` with `text-analyze` mode — full unblurred report with radar chart + JD keyword match.

5. **Admin Panel**: License key generation, user activation via `activate-user` edge function, module content management.

---

*Generated: 2026-03-18 | MantraSkill v0.0.0*
