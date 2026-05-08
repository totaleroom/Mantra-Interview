# MANTRA — Sistem Lamaran Kerja 7 Hari

> Platform e-learning + toolkit karier berbasis sprint 7 hari. Dari CV ATS-friendly sampai interview simulator — semua dalam satu platform mandiri.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Node.js](https://img.shields.io/badge/Node.js-Backend-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue) ![Docker](https://img.shields.io/badge/Docker-Cloud--Run-lightgrey)

## 🛠 Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **UI:** shadcn/ui (custom Neo-brutalist theme), Lucide Icons
- **Backend:** Node.js, Express.js (Standalone Custom API)
- **Database:** PostgreSQL (Neon) + Local JSON for Content
- **AI:** Google Gemini API (Direct Integration)
- **Export:** docx.js (DOCX generation)
- **State:** React Context + TanStack Query

## ✨ Fitur Utama

- **100% Independent** — Tidak bergantung lagi pada Lovable Cloud/Supabase Cloud.
- **5 Modul Kursus (Restored)** — Konten asli 1-5 beserta quiz dan progression lock.
- **Prompt AI Library (Merged)** — 115+ prompt AI siap copy, hasil migrasi dari Lovable.
- **Interview Simulator** — Speech-to-text & AI feedback menggunakan Gemini.
- **CV Builder** — 6-step wizard, AI JD-scan, DOCX export.
- **Admin Panel** — License key management & user monitoring.
- **SEO Satellite Pages** — 26 halaman konten otomatis untuk trafik organik.

## 🚀 Quick Start

### 1. Persiapan Database & AI
- Siapkan database PostgreSQL (disarankan menggunakan [Neon.tech](https://neon.tech)).
- Dapatkan API Key Google Gemini dari [Google AI Studio](https://aistudio.google.com/).

### 2. Setup Backend
```bash
cd server
cp .env.example .env
# Isi DATABASE_URL, GEMINI_API_KEY, dan JWT_SECRET
npm install
npm run dev # Berjalan di port 5001
```

### 3. Setup Frontend
```bash
cd ..
npm install
npm run dev # Berjalan di port 5173
```

## 📚 Dokumentasi Lanjutan

| File | Audience | Isi |
|------|----------|-----|
| [`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md) | Owner / Admin | Cara kelola user, license key, dan edit konten modul/prompt. |
| [`from_lovable/`](./from_lovable/) | Developer | Backup data asli (JSON/CSV) hasil migrasi dari sistem lama. |

## 🚢 Deployment (Cloud Run)

Aplikasi ini sudah dilengkapi `Dockerfile` untuk deployment skala besar di Google Cloud Run.
1. Build image: `docker build -t mantra-app .`
2. Push ke Artifact Registry.
3. Deploy ke Cloud Run dengan menginjeksi Environment Variables yang diperlukan.

## 📄 Lisensi

Proprietary. Hak cipta dilindungi oleh MantraSkill.
