# MantraSkill — Technical Documentation

> **v3.0** | Updated: 2026-05-08 | Standalone Architecture. Fullstack Node.js + Express + PostgreSQL.

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
→ Verify Email (Planned) → Login → Dashboard
→ Module 1 (auto-unlock) → Read → Quiz → Pass → Module 2 unlocks → ...
→ Module 5 (Interview Simulator) → Complete
→ Access: CV Builder, CV Checker, LinkedIn Optimizer, Cover Letter Generator, Prompt Library
```

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | React | 18.x |
| Bundler | Vite | 5.x |
| Backend | Node.js / Express | 20.x |
| Database | PostgreSQL (Neon) | — |
| AI | Google Gemini API (Direct) | Pro 1.5 / Flash |
| Styling | Tailwind CSS | 3.x |
| State | React Context + React Query | — |
| Deployment | Docker + Cloud Run | — |

---

## 3. Architecture & Routes

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  React 18 + Vite + Tailwind (Neo-Brutalist)         │
│  State: AuthContext (JWT based)                     │
│  Guard: SubscriptionGuard (route)                   │
├─────────────────────────────────────────────────────┤
│                 BACKEND (Express)                    │
│  Auth: JWT & Bcrypt (Custom Logic)                   │
│  DB: PostgreSQL (User profiles & Licenses)           │
│  Content: JSON (Modules & Prompts)                   │
│  AI: Direct SDK to Google Gemini                     │
└─────────────────────────────────────────────────────┘
```

### Folder Structure

```text
├── src/
│   ├── main.tsx                  # Entry point
│   ├── contexts/AuthContext.tsx   # JWT handling & session state
│   ├── components/
│   │   ├── modules/              # ReadingTracker, Quiz, Simulator
│   │   ├── cv-builder/           # AI CV Generator wizard
│   │   └── landing/              # Sales funnel components
│   └── pages/                    # Route handlers
├── server/
│   ├── server.js                 # API Entrypoint
│   ├── data/                     # Content storage (modules.json, prompts.json)
│   ├── routes/                   # API logic (auth, modules, ai)
│   └── scripts/                  # Management scripts (admin setup, etc.)
└── Dockerfile                    # Containerization config
```

---

## 4. Feature Details

### 4.1 Module Reader (`/dashboard/module/:id`)
- **Mindful Reading:** Menggunakan `useReadingTracker` untuk memastikan user tidak sekadar scroll cepat. Membutuhkan minimal waktu baca (WPM based) dan 90% scroll progress.
- **Quiz:** Validasi dilakukan di backend. Kunci jawaban tidak pernah dikirim ke browser.

### 4.2 CV Builder & AI Features
- Terintegrasi langsung dengan Gemini API.
- Fitur: JD Scan, Bullet Point Enhancer, Summary Generator.

### 4.3 Prompt Library
- Berisi 115+ prompt yang dikurasi khusus untuk pasar kerja Indonesia.
- Data disimpan di `server/data/prompts.json`.

### 4.4 Admin Panel (`/admin`)
- Pengelolaan License Keys (Bulk Generate up to 500 keys).
- Monitoring User Progress.

---

## 5. Security & Privacy

| Requirement | Implementation |
|-------------|----------------|
| JWT Auth | Semua request API diproteksi dengan Bearer Token. |
| Password Hashing | Menggunakan Bcrypt dengan salt round tinggi. |
| DB Security | PostgreSQL dengan SSL enabled. |
| Quiz Logic | `correctIndex` hanya ada di server-side. |

---

## 6. Maintenance

- **Update Konten:** Edit file di `server/data/modules.json` atau `server/data/prompts.json`.
- **Tambah Admin:** Ubah kolom `role` menjadi `'admin'` di tabel `profiles`.
- **Deployment:** Gunakan `npm run build` di root, lalu jalankan `node server/server.js` atau gunakan Docker.

---

*Hak Cipta © 2026 MantraSkill.*
