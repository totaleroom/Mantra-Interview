# MantraSkill — Panduan Admin

## 1. Cara Menjadi Admin

Admin ditentukan melalui tabel `user_roles` di database. Untuk menjadikan seseorang admin:

### Langkah-langkah:

1. **Cari `user_id`** pengguna yang ingin dijadikan admin:
   - Buka Lovable Cloud → Run SQL
   - Jalankan query:
     ```sql
     SELECT user_id, full_name, created_at FROM profiles ORDER BY created_at DESC;
     ```
   - Catat `user_id` yang sesuai

2. **Insert role admin**:
   ```sql
   INSERT INTO user_roles (user_id, role) VALUES ('paste-user-id-disini', 'admin');
   ```

3. **Verifikasi**:
   ```sql
   SELECT * FROM user_roles WHERE role = 'admin';
   ```

> ⚠️ **PENTING**: Jangan pernah menghapus semua admin. Pastikan selalu ada minimal 1 admin aktif.

---

## 2. Akses Admin Panel

- **URL**: `/admin` (contoh: `https://domain-kamu.com/admin`)
- **Syarat**: User harus login DAN memiliki role `admin` di tabel `user_roles`
- **Fitur yang tersedia**:
  - Melihat daftar semua pengguna terdaftar
  - Melihat status langganan setiap pengguna
  - Menambah license key baru (satu per satu)
  - **Bulk generate license key** (hingga 500 key sekaligus)
  - **Export CSV / Copy All** untuk distribusi key
  - Melihat license key yang sudah digunakan
  - Deactivate license key

---

## 3. Menambah License Key Baru

### Via Admin Panel — Satu Key (Recommended untuk jumlah kecil):
1. Login sebagai admin
2. Navigasi ke `/admin`
3. Di bagian "License Keys", isi field:
   - **Key**: Masukkan string unik (contoh: `MANTRA-2026-ABCDE`)
   - **Validity Days**: Jumlah hari aktif (default: 90 = 3 bulan)
4. Klik tombol "Add License Key"
5. Key langsung bisa digunakan member baru saat registrasi

### Via Admin Panel — Bulk Generator (Recommended untuk jumlah besar):
1. Login sebagai admin
2. Navigasi ke `/admin`
3. Di bagian "License Keys", klik tombol **"Bulk"**
4. Isi field:
   - **Jumlah Key**: Masukkan angka 1–500
   - **Validity Days**: Jumlah hari aktif (default: 90)
5. Klik **"Generate"**
6. Key otomatis dibuat dengan format `MNTR-XXXX-XXXX` (huruf + angka random)
7. Semua key langsung masuk ke database dengan status `active`
8. Gunakan tombol:
   - **"Copy All"** — Salin semua key ke clipboard
   - **"Download CSV"** — Download file CSV berisi semua key yang di-generate

### Cara Distribusi Key ke Pembeli:
- **Manual**: Copy-paste key satu per satu ke chat/email pembeli
- **Semi-otomatis**: Download CSV → upload ke auto-reply LYNK/email marketing
- **Otomatis (advanced)**: Gunakan Google Sheets + Zapier/Make untuk mengirim 1 key per pembeli secara otomatis setelah pembayaran dikonfirmasi

---

## 4. Skip Timer Modul (Admin Only)

Saat admin membuka modul kursus:
- **Reading timer tetap ditampilkan** (untuk referensi durasi baca member)
- **Tombol "Lanjut ke Quiz" selalu aktif** — admin tidak perlu menunggu timer selesai
- Berguna untuk:
  - Quality check konten modul
  - Testing flow quiz
  - Verifikasi interview simulator

> Admin akan melihat badge **"⚡ Admin Mode"** di reading indicator sebagai penanda.

---

## 5. Monitoring Users

Di Admin Panel (`/admin`), admin bisa melihat:

| Data | Keterangan |
|------|------------|
| Nama Lengkap | Dari profil user |
| License Key | Key yang digunakan saat registrasi |
| Tanggal Registrasi | `created_at` dari profil |
| Status Langganan | Active / Expired + sisa hari |

---

## 6. Deactivate License Key

1. Di Admin Panel, cari key yang ingin dinonaktifkan
2. Klik "Deactivate"
3. Key dengan status `used` (sudah dipakai member) TIDAK bisa di-deactivate
4. Hanya key dengan status `active` yang bisa dinonaktifkan

### Via SQL:
```sql
UPDATE license_keys SET status = 'inactive' WHERE key = 'KEY-YANG-INGIN-DINONAKTIFKAN' AND status = 'active';
```

---

## 7. Troubleshooting

### Member tidak bisa login
- Cek apakah email sudah dikonfirmasi (verifikasi email)
- Cek apakah license key valid dan belum expired

### Admin panel tidak muncul
- Pastikan user_id sudah ada di tabel `user_roles` dengan role `admin`
- Coba logout dan login ulang

### License key "tidak valid" saat registrasi
- Pastikan key ada di tabel `license_keys`
- Pastikan status key adalah `active`
- Pastikan key belum digunakan (kolom `used_by` harus NULL)

---

## 8. SEO Satellite Pages (Info untuk Admin)

Platform memiliki **26 halaman SEO** yang dapat diakses di `/karir/[slug]` (contoh: `/karir/contoh-cv-marketing-manager`).

**Yang perlu diketahui admin:**
- Halaman ini **tidak terlihat** di menu navigasi utama
- Halaman hanya terindeks oleh Google melalui `sitemap.xml`
- Konten bersifat **statis** — admin tidak perlu melakukan apa-apa
- Tujuan: menarik trafik organik dari pencarian seperti "contoh CV marketing manager", "gaji data analyst 2026", dll.
- Setiap halaman memiliki CTA yang mengarah ke checkout LYNK

> Jika ingin menambah halaman satellite baru, hubungi developer untuk update file `src/data/satellite-pages.ts` dan `sitemap.xml`.
