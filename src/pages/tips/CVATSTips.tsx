import { Link } from 'react-router-dom';
import { ArticleLayout } from '@/components/seo/ArticleLayout';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Cara Bikin CV ATS-Friendly 2026: Panduan Lengkap untuk Fresh Graduate Indonesia",
  "author": { "@type": "Organization", "name": "MantraSkill" },
  "publisher": { "@type": "Organization", "name": "MantraSkill", "logo": { "@type": "ImageObject", "url": "https://mantraskill.web.id/favicon.png" } },
  "datePublished": "2026-02-21",
  "dateModified": "2026-02-21",
  "inLanguage": "id",
  "mainEntityOfPage": "https://mantraskill.web.id/tips/cv-ats-friendly"
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Cara Bikin CV ATS-Friendly 2026",
  "description": "Panduan step-by-step membuat CV yang lolos filter ATS untuk fresh graduate Indonesia.",
  "step": [
    { "@type": "HowToStep", "name": "Buat Header", "text": "Tulis nama lengkap, kontak (email & telepon), dan link LinkedIn di bagian paling atas CV." },
    { "@type": "HowToStep", "name": "Tulis Ringkasan Profesional", "text": "Buat summary 2-3 kalimat yang merangkum skill utama dan tujuan karir kamu." },
    { "@type": "HowToStep", "name": "Tulis Pengalaman Kerja", "text": "Gunakan bullet points dengan action verbs dan metrik terukur untuk setiap pengalaman." },
    { "@type": "HowToStep", "name": "Tambahkan Pendidikan", "text": "Cantumkan pendidikan terakhir beserta IPK jika di atas 3.0." },
    { "@type": "HowToStep", "name": "Daftarkan Keahlian", "text": "Tulis skill teknis dan soft skill yang relevan dengan posisi target." },
    { "@type": "HowToStep", "name": "Tambahkan Sertifikasi", "text": "Cantumkan sertifikasi profesional yang relevan dengan industri target." },
  ],
};

const relatedArticles = [
  { title: 'Tips Interview Kerja', href: '/tips/interview-kerja', description: 'Persiapan interview untuk fresh graduate dan profesional' },
  { title: 'Optimasi LinkedIn', href: '/tips/linkedin-optimization', description: 'Cara optimasi profil LinkedIn agar dilirik recruiter' },
  { title: 'Cover Letter yang Efektif', href: '/tips/cover-letter', description: 'Panduan bikin cover letter yang personal dan meyakinkan' },
];

const CVATSTips = () => (
  <ArticleLayout
    title="Cara Bikin CV ATS-Friendly 2026: Panduan Lengkap untuk Fresh Graduate Indonesia"
    seoTitle="Cara Bikin CV ATS-Friendly 2026 — Panduan Lengkap | MantraSkill"
    seoDescription="Panduan lengkap cara bikin CV ATS-friendly untuk fresh graduate Indonesia 2026. Template, tips format, dan kata kerja aksi yang bikin CV kamu lolos filter HRD."
    canonical="/tips/cv-ats-friendly"
    breadcrumbLabel="CV ATS-Friendly"
    ctaText="Gunakan AI CV Builder MantraSkill untuk membuat CV ATS-friendly dengan skor 90+ dalam hitungan menit."
    ctaHref="/"
    relatedArticles={relatedArticles}
    ctaButtonText="Bikin CV Skor 90+"
    freeVsMember={[
      { free: 'Bisa bikin CV tapi ditolak ATS terus', member: 'AI generate CV lengkap skor 90+ dalam 5 menit dengan keyword matching otomatis' },
      { free: 'Copy-paste action verb dari Google', member: 'AI rewrite setiap bullet point + keyword matching dari job description target' },
      { free: 'Format CV asal rapi tapi tetap ditolak', member: '55 prompt siap pakai + template profesional + AI analysis mendalam' },
    ]}
    lockedResources={[
      { title: 'Prompt: Generate CV Summary ATS-Friendly', teaser: 'Generate ringkasan profesional yang langsung lolos ATS dengan keyword matching otomatis dari JD target...' },
      { title: 'Prompt: Rewrite Bullet Points + Action Verbs', teaser: 'AI rewrite setiap bullet point jadi achievement-oriented dengan metrik terukur dan keyword industri...' },
      { title: 'Template: CV 1 Halaman Fresh Graduate', teaser: 'Template proven dengan skor ATS 95+ yang sudah dipakai 2.000+ member MantraSkill...' },
      { title: 'Prompt: JD Keyword Scanner & Gap Analysis', teaser: 'Scan job description target, analisis gap keyword CV kamu, dan dapatkan rekomendasi penambahan otomatis...' },
    ]}
    jsonLd={[jsonLd, howToJsonLd]}
  >
    <p className="text-base text-foreground font-medium">Kamu sudah kirim puluhan CV tapi tidak ada yang merespon? Mungkin bukan skill kamu yang kurang — tapi CV kamu yang tidak bisa dibaca mesin.</p>

    <h2 className="font-display text-lg uppercase text-foreground mt-8">Apa itu ATS (Applicant Tracking System)?</h2>
    <p>ATS adalah software yang digunakan oleh 90% perusahaan besar di Indonesia untuk menyaring CV secara otomatis sebelum dibaca HRD. Jika CV kamu tidak lolos filter ATS, lamaran kamu langsung masuk tong sampah digital.</p>

    <h2 className="font-display text-lg uppercase text-foreground mt-8">3 Alasan CV Kamu Ditolak ATS</h2>
    <ul className="list-disc pl-5 space-y-2">
      <li>Format tidak standar (tabel, kolom ganda, grafik)</li>
      <li>Heading kreatif yang tidak dikenali ATS</li>
      <li>Tidak ada keyword dari job description</li>
    </ul>

    <h2 className="font-display text-lg uppercase text-foreground mt-8">Struktur CV ATS-Friendly</h2>
    <p>Urutan section yang benar:</p>
    <ol className="list-decimal pl-5 space-y-1">
      <li>Header (nama, kontak, LinkedIn)</li>
      <li>Ringkasan Profesional</li>
      <li>Pengalaman Kerja</li>
      <li>Pendidikan</li>
      <li>Keahlian</li>
      <li>Sertifikasi</li>
    </ol>
    <p className="mt-3 text-xs italic font-bold">Yang serius mau lolos ATS, buka sisanya di sini. 👇</p>

    <h2 className="font-display text-lg uppercase text-foreground mt-8">Cek CV Kamu Gratis</h2>
    <p>Belum yakin apakah CV kamu sudah ATS-friendly? Gunakan <Link to="/gratis/cek-cv" className="text-foreground font-bold underline underline-offset-4 hover:text-neoPink transition-colors">tool cek CV ATS gratis</Link> dari MantraSkill untuk skor instan.</p>
  </ArticleLayout>
);

export default CVATSTips;
