# MantraSkill — Panduan Administrator (v2.0)

Panduan ini ditujukan bagi pemilik platform untuk mengelola pengguna, lisensi, dan konten pendidikan secara mandiri setelah migrasi ke infrastruktur baru.

---

## 1. Cara Menjadi Admin

Status Admin sekarang dikelola langsung di tabel `profiles` pada database PostgreSQL.

### Melalui SQL (Neon Console):
Jika kamu ingin mengubah seorang user menjadi admin, jalankan query berikut:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'user@email.com';
```

### Hak Istimewa Admin:
- **Bypass Timer:** Admin tidak perlu menunggu timer membaca modul selesai untuk lanjut ke quiz.
- **Bypass License:** Admin bisa mengakses semua fitur tanpa memasukkan license key.
- **Badge "⚡ Admin Mode":** Muncul di indikator pembaca modul.

---

## 2. Mengelola Konten (Modul & Prompt)

Saat ini, konten utama disimpan dalam file JSON di dalam folder `server/data/`. Kamu bisa mengubah isi teks, pertanyaan quiz, atau prompt AI tanpa harus menyentuh database SQL.

### A. Mengedit Modul Pembelajaran
File: `server/data/modules.json`
- Berisi 5 modul utama.
- Kamu bisa mengubah `content` (HTML) dan `quiz` (array pertanyaan).
- **PENTING:** Pastikan `correctIndex` pada quiz sesuai dengan urutan pilihan jawaban (dimulai dari 0).

### B. Mengedit Prompt AI Library
File: `server/data/prompts.json`
- Berisi 115+ prompt yang muncul di fitur "Prompt Library".
- Kamu bisa menambah atau mengubah prompt sesuai tren karir terbaru.

> **Tips:** Setelah mengubah file JSON, kamu harus me-restart server backend agar perubahan tersebut terbaca (atau jika menggunakan Docker, lakukan build ulang).

---

## 3. Manajemen License Key

Akses ke fitur berbayar (seperti CV Analyzer) dikelola melalui Admin Panel.

- **URL:** `/admin`
- **Cara Masuk:** Login dengan akun yang memiliki role `admin`.
- **Fitur:**
    - **Bulk Generate:** Membuat ratusan key sekaligus untuk dibagikan ke pembeli.
    - **CSV Export:** Mengunduh daftar key untuk dimasukkan ke platform penjualan (seperti LYNK atau email automation).

---

## 4. Monitoring Pengguna

Semua aktivitas pengguna tercatat di tabel `profiles`. Kamu bisa memantau perkembangan belajar mereka (kolom `module_progress`) untuk melihat seberapa banyak user yang berhasil menyelesaikan kursus 7 hari.

---

## 5. Troubleshooting Dasar

Jika aplikasi terasa lambat atau fitur AI tidak merespon:
1. **Cek Quota Gemini:** Pastikan API Key Gemini di `server/.env` masih memiliki kuota atau saldo yang cukup.
2. **Cek Database:** Pastikan koneksi ke PostgreSQL (Neon) tidak terputus.
3. **Log Server:** Periksa terminal yang menjalankan `node server.js` untuk melihat pesan error yang muncul.

---

*Hormat kami,*
**Tim Developer MantraSkill**
