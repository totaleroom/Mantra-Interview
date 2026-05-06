# MANTRA — Sistem Lamaran Kerja 7 Hari

> Platform e-learning + toolkit karier berbasis sprint 7 hari. Dari CV ATS-friendly sampai interview simulator — semua dalam satu platform.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-Backend-green) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan)

## 🛠 Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **UI:** shadcn/ui (custom Neo-brutalist theme), Lucide Icons
- **Backend:** Supabase (Auth, PostgreSQL, Edge Functions, RLS)
- **AI:** Lovable AI Gateway (Gemini Flash, Gemini Flash Lite)
- **Export:** docx.js (DOCX generation)
- **State:** React Context + TanStack Query

## ✨ Fitur Utama

- **5 Modul Kursus** — Teks + quiz server-side, progression lock/unlock
- **Interview Simulator** — 5 pertanyaan random, scoring rule-based, speech-to-text
- **CV Builder** — 6-step wizard, AI analyze/rewrite/enhance/JD-scan, DOCX export, 3-draft limit
- **LinkedIn Optimizer** — 4 prompt generator (headline, about, content, connection)
- **Cover Letter Generator** — 3 prompt generator (full letter, hook, company research)
- **Prompt Library** — 55+ prompt AI siap copy, 7 kategori
- **Admin Panel** — User management, license key CRUD, stats
- **Anti-cheat** — Reading tracker (scroll + time + speed), server-side quiz validation
- **SEO Satellite Pages** — 26 halaman konten ringan untuk SEO (CV posisi, lokasi kerja, istilah karir, gaji)
- **Bulk License Key Generator** — Generate hingga 500 key sekaligus + export CSV

## 🚀 Quick Start

```bash
# 1. Clone repo
git clone <repo-url> && cd mantra

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY

# 4. Setup Supabase (lihat RAG.md section 3g untuk SQL lengkap)

# 5. Run development server
npm run dev
```

## 📚 Dokumentasi

| File | Audience | Isi |
|------|----------|-----|
| [`PRD.md`](./PRD.md) | Product Owner, Stakeholder | Spesifikasi fitur, user journey, design system |
| [`RAG.md`](./RAG.md) | Developer, AI Agent | Arsitektur teknis, DB schema, edge functions, setup guide |
| [`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md) | Admin | Cara jadi admin, bulk generate key, monitoring user, satellite pages |

## 🚢 Deployment

**Lovable (Recommended):**
Buka project di Lovable → Share → Publish.

**Vercel / Netlify:**
Connect repo → Build command: `npm run build` → Output dir: `dist`

**VPS / Docker:**
```bash
npm run build
# Serve folder dist/ dengan nginx atau static server
```

## 📄 Lisensi

Proprietary. Hak cipta dilindungi.
