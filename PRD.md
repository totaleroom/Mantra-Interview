# PRD — MantraSkill Platform

> **v2.0** | Updated: 2026-03-18 | Purpose: Product spec ONLY. For technical implementation → [`RAG.md`](./RAG.md)

---

## 1. Product Summary

| Key | Value |
|-----|-------|
| Product | MantraSkill — 7-day career sprint platform |
| URL | `https://mantraskill.web.id` |
| Target | Indonesian job seekers 22-30, fresh grads, career switchers |
| Price | IDR 148,000 / 90 days (configurable per license key) |
| Core Value | Structured learning + AI-powered CV tools + interview prep |

---

## 2. User Journey

```
Landing Page → Buy License Key (external checkout) → Register (email + key)
→ Verify Email → Login → Dashboard
→ Module 1 (auto-unlock) → Read → Quiz → Pass → Module 2 unlocks → ...
→ Module 5 (Interview Simulator) → Score ≥ 7/10 → Complete
→ Access: CV Builder, CV Checker, LinkedIn Optimizer, Cover Letter Generator, Prompt Library
```

---

## 3. Features

### 3.1 Landing Page (`/`)

13 sequential sales funnel components:

| # | Component | Purpose |
|---|-----------|---------|
| 1 | Header | Logo + Login/Dashboard button |
| 2 | Hero | Headline + CTA + social proof counter |
| 3 | Marquee | Scrolling branding text |
| 4 | Storytelling | Pain point narrative |
| 5 | Features | 6 feature highlights with icons |
| 6 | DenialTimer | Psychological urgency countdown |
| 7 | VSL | Video Sales Letter embed |
| 8 | Timeline | 7-day sprint roadmap visual |
| 9 | ValueStack | Total value breakdown vs price |
| 10 | PricingCTA | IDR 148k pricing card + purchase CTA |
| 11 | Testimonials | User social proof |
| 12 | CompanyLogos | Target company logos |
| 13 | FAQ | Accordion Q&A |
| — | Footer, WhatsAppButton, StickyNav | Persistent UI elements |

### 3.2 Dashboard (`/dashboard`)

- Welcome header with name + subscription countdown (green → yellow → red)
- Sprint progress bar (X/5 modules completed)
- CTA cards: Prompt Library, CV Builder, CV Checker, LinkedIn Optimizer, Cover Letter Generator
- Module list with lock/unlock/complete status
- Coming Soon: 4 future features (greyed out)
- If expired: all CTAs disabled + warning banner

**Module Lock Logic:**
- Module 1: always unlocked (if subscription active)
- Module N: unlocked when Module N-1 is completed
- Completed modules show green checkmark

### 3.3 Module Reader (`/dashboard/module/:id`)

**Per-section flow:** Reading → Quiz → Next Section

**Reading Requirements (anti-cheat):**

| Check | Threshold |
|-------|-----------|
| Scroll progress | ≥ 90% |
| Minimum read time | wordCount / 3 seconds (~180 WPM) |
| Speed scroll detection | avg scroll speed > 2000px/s |
| Tab visibility | Timer pauses when hidden |
| Admin bypass | All requirements skipped |

**Quiz System:**
- Answers validated server-side (correctIndex never sent to client)
- All answers must be correct → fail = re-read section
- Module 5: ends with Interview Simulator instead of regular quiz

### 3.4 Interview Simulator (Module 5 finale)

| Aspect | Detail |
|--------|--------|
| Questions | 5 random: 1 behavioral + 1 situational + 1 self-awareness + 1 motivational + 1 random |
| Input | Text or speech-to-text (Web Speech API, Indonesian) |
| Scoring | 100% client-side, rule-based (NO LLM) |
| Pass | Average ≥ 7/10 across 5 questions |
| Fail | Retry with re-randomized questions |

**Scoring breakdown:**

| Component | Points |
|-----------|--------|
| Word count ≥ 100 | +2 |
| Word count ≥ 50 | +1 |
| Required keyword match ratio | 0–5 |
| Bonus keywords (max 2) | 0–2 |
| STAR structure detected | +1 |
| Red flag penalty | -1 each |
| **Range** | **1–10** |

### 3.5 CV Builder (`/dashboard/cv-builder`)

**6-step wizard:**

| Step | Content |
|------|---------|
| 1 | Personal info (name locked from profile) |
| 2 | Professional summary + target position + years experience |
| 3 | Work experience CRUD + AI bullet enhancement |
| 4 | Education CRUD |
| 5 | Hard/soft skills, certifications, languages |
| 6 | Review + AI analysis + DOCX export + rewrite + JD scan |

**Draft system:** Max 3 drafts per user, auto-save on step change.

**AI Modes (6):**

| Mode | Function | Description |
|------|----------|-------------|
| `analyze` | Score 10 ATS categories + recommendations |
| `enhance-bullet` | Rewrite single bullet point |
| `generate-summary` | Generate professional summary |
| `rewrite` | Rewrite summary + all experience descriptions |
| `jd-scan` | Match CV keywords against job description |
| `text-analyze` | Analyze raw text from uploaded CV file |

**10 ATS Scoring Categories:** ATS Compatibility, Keyword Optimization, Achievement vs Responsibility, Storytelling Quality, Skill Relevance, Experience Depth, Professional Summary, Education Fit, Formatting Structure, Overall Impression.

### 3.6 CV Checker — Free vs Member

| Aspect | Free (`/gratis/cek-cv`) | Member (`/dashboard/cv-checker`) |
|--------|-------------------------|----------------------------------|
| Auth required | No | Yes + subscription |
| File upload | PDF/DOCX, max 2MB | PDF/DOCX, max 2MB |
| Parsing | Client-side (pdfjs-dist, mammoth) | Client-side |
| Regex checks | Full (instant) | Full (instant) |
| AI analysis | 1 insight free + 2 blurred | Full unblurred report |
| JD keyword scan | No | Yes |
| Radar chart | No | Yes (10 categories) |
| Rate limit | 3/day per IP | Unlimited |
| Upsell | CTA to purchase | — |

### 3.7 LinkedIn Optimizer (`/dashboard/linkedin-optimizer`)

**Input:** Target role, industry, top skills, experience summary
**Output:** 4 copy-paste prompts for ChatGPT/Gemini:
1. Headline Optimizer (5 variants, max 120 chars)
2. About Section Writer (Hook-Story-Offer framework)
3. Post Content Ideas (10 mixed content ideas)
4. Connection Request Message (3 templates, max 300 chars)

### 3.8 Cover Letter Generator (`/dashboard/cover-letter`)

**Input:** Position, company, job description, achievement
**Output:** 3 copy-paste prompts:
1. Full Cover Letter (4-paragraph: Hook-Evidence-Connection-Close)
2. Opening Hook Generator (5 variants with ratings)
3. Company Research Integration (research checklist + sentence templates)

### 3.9 Prompt Library (`/dashboard/prompt-library`)

- 55+ prompts from database (not hardcoded)
- 7 categories: Foto & Visual, Psikotes, Job Search, Skill Development, Onboarding, Digital Marketing, Research & Riset
- Search + category filter
- One-click copy with toast notification

### 3.10 Admin Panel (`/admin`)

| Feature | Detail |
|---------|--------|
| Access | `admin` role in `user_roles` table only |
| Stats | Total users, active users, active license keys |
| License CRUD | Add single key, bulk generate (1–500, format `MNTR-XXXX-XXXX`), copy all, download CSV, deactivate |
| User activation | Assign available license key to existing user |
| User list | Name, license key, status (Active/Expired/Incomplete/Pending), registration date |

**Status definitions:**
- **Active**: has license_key AND not expired
- **Expired**: has license_key AND expired
- **Incomplete**: has expiry date but no license_key (data inconsistency)
- **Pending**: no license_key and no expiry

### 3.11 SEO Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/karir` | CareerHub | Topic cluster hub, 4 categories |
| `/karir/:slug` | SatelliteArticle | 26+ long-tail SEO articles |
| `/seo/keywords` | KeywordIndex | Keyword index page |
| `/tips/cv-ats-friendly` | CVATSTips | SEO article |
| `/tips/interview-kerja` | InterviewTips | SEO article |
| `/tips/linkedin-optimization` | LinkedInTips | SEO article |
| `/tips/cover-letter` | CoverLetterTips | SEO article |

Hidden from main navigation. Listed in sitemap.xml. CTA links to checkout.

---

## 4. License & Subscription System

### Registration Flow
1. User buys license key externally (checkout link)
2. Register: name + email + password + license key
3. Backend validates key via edge function
4. If valid: key marked `used`, profile gets `license_expires_at`
5. Email verification sent → verify → login

### Validity
- Default: 90 days (configurable per key via `validity_days`)
- Dashboard shows countdown
- Warning banner at ≤ 7 days remaining

### Protection
- All premium routes wrapped in `<SubscriptionGuard>`
- Check: logged in + subscription active (or admin)
- If expired: redirect to dashboard + toast
- Edge functions also validate subscription server-side

---

## 5. Design Identity — Neo-Brutalist

| Element | Specification |
|---------|---------------|
| Display font | Archivo Black (headings, buttons, labels — always uppercase) |
| Body font | Space Grotesk (300–700) |
| Background | Ivory `hsl(43, 50%, 93%)` |
| Text | Dark `hsl(240, 24%, 14%)` |
| Primary CTA | neoLime `hsl(84, 100%, 62%)` |
| Accent | neoPink `hsl(340, 100%, 71%)` |
| Info | neoCyan `hsl(195, 100%, 61%)` |
| Premium | neoViolet `hsl(258, 90%, 66%)` |
| Borders | 4px solid (primary), 2px (secondary) |
| Border radius | 0px everywhere |
| Shadows | Offset: 2px/4px/8px solid black |
| Hover effect | Shadow disappears + element translates 4px down-right ("pressed" feel) |

---

## 6. Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| RLS on all tables | Every table has row-level security policies |
| Server-side quiz validation | correctIndex never sent to client |
| JWT validation | All edge functions verify JWT manually |
| Subscription check | Both client-side (guard) AND server-side (edge function) |
| Inactivity logout | 8 hours of no interaction |
| Password policy | Min 8 chars, 1 uppercase, 1 number |
| Anti-impersonation | License validation checks user_id matches JWT |
| Link obfuscation | Checkout/WhatsApp URLs Base64-encoded, onClick only |
