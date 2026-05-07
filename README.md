# MANTRA — Sistem Lamaran Kerja 7 Hari

> Platform e-learning + toolkit karier berbasis sprint 7 hari. Dari CV ATS-friendly sampai interview simulator — semua dalam satu platform.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Node.js](https://img.shields.io/badge/Node.js-Backend-green) ![Express](https://img.shields.io/badge/Express-Server-lightgrey)

## 🛠 Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **UI:** shadcn/ui (custom Neo-brutalist theme), Lucide Icons
- **Backend:** Node.js, Express.js (Independent Custom Backend)
- **Database:** Local JSON File (No vendor lock-in)
- **AI:** Lovable AI Gateway (Gemini Flash, Gemini Flash Lite)
- **Export:** docx.js (DOCX generation)
- **State:** React Context + TanStack Query

## ✨ Fitur Utama

- **100% Free-to-use** — Tidak ada paywall atau login berbayar
- **5 Modul Kursus** — Teks + quiz, progression lock/unlock
- **Interview Simulator** — 5 pertanyaan random, scoring rule-based, speech-to-text
- **CV Builder** — 6-step wizard, AI analyze/rewrite/enhance/JD-scan, DOCX export, 3-draft limit
- **LinkedIn Optimizer** — 4 prompt generator (headline, about, content, connection)
- **Cover Letter Generator** — 3 prompt generator (full letter, hook, company research)
- **Prompt Library** — 55+ prompt AI siap copy, 7 kategori
- **Admin Panel** — User management, stats
- **SEO Satellite Pages** — 26 halaman konten ringan untuk SEO (CV posisi, lokasi kerja, istilah karir, gaji)

## 🚀 Quick Start

```bash
# 1. Clone repo
git clone <repo-url> && cd mantra

# 2. Install Frontend dependencies
npm install

# 3. Setup Frontend environment variables
cp .env.example .env
# Isi VITE_API_URL=http://localhost:5001/api

# 4. Install Backend dependencies
cd server
npm install

# 5. Run Server (Terminal 1)
npm run dev # Menjalankan backend di port 5001

# 6. Run Frontend (Terminal 2)
cd ..
npm run dev # Menjalankan frontend Vite
```

## 📚 Dokumentasi

| File | Audience | Isi |
|------|----------|-----|
| [`DOCS.md`](./DOCS.md) | Developer, AI Agent, Stakeholder | Product spec, arsitektur, DB schema, edge functions, design system, extension cookbook |
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
