import { ArticleLayout } from '@/components/seo/ArticleLayout';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Cara Bikin Cover Letter yang Efektif 2026: Panduan untuk Fresh Graduate Indonesia",
  "author": { "@type": "Organization", "name": "MantraSkill" },
  "publisher": { "@type": "Organization", "name": "MantraSkill", "logo": { "@type": "ImageObject", "url": "https://mantraskill.web.id/favicon.png" } },
  "datePublished": "2026-02-21",
  "dateModified": "2026-02-21",
  "inLanguage": "id",
  "mainEntityOfPage": "https://mantraskill.web.id/tips/cover-letter"
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Cara Bikin Cover Letter yang Efektif",
  "description": "Panduan membuat cover letter 3-4 paragraf yang menarik perhatian HRD.",
  "step": [
    { "@type": "HowToStep", "name": "Tulis Hook", "text": "Buat pembuka yang menarik perhatian HRD dalam 7 detik pertama." },
    { "@type": "HowToStep", "name": "Tunjukkan Value", "text": "Jelaskan skill dan pengalaman relevan yang kamu bawa." },
    { "@type": "HowToStep", "name": "Jelaskan Why This Company", "text": "Tunjukkan riset kamu tentang perusahaan dan kenapa kamu tertarik." },
    { "@type": "HowToStep", "name": "Tutup dengan CTA", "text": "Akhiri dengan ajakan untuk berdiskusi lebih lanjut." },
  ],
};

const relatedArticles = [
  { title: 'CV ATS-Friendly', href: '/tips/cv-ats-friendly', description: 'Panduan membuat CV yang lolos filter ATS' },
  { title: 'Tips Interview Kerja', href: '/tips/interview-kerja', description: 'Persiapan interview untuk fresh graduate dan profesional' },
  { title: 'Optimasi LinkedIn', href: '/tips/linkedin-optimization', description: 'Cara optimasi profil LinkedIn agar dilirik recruiter' },
];

const CoverLetterTips = () => (
  <ArticleLayout
    title="Cara Bikin Cover Letter yang Efektif 2026: Panduan untuk Fresh Graduate Indonesia"
    seoTitle="Cara Bikin Cover Letter 2026 — Panduan Fresh Graduate | MantraSkill"
    seoDescription="Panduan lengkap cara bikin cover letter yang efektif untuk fresh graduate Indonesia 2026. Template, contoh, dan tips agar lamaran kamu dilirik HRD."
    canonical="/tips/cover-letter"
    breadcrumbLabel="Cover Letter"
    ctaText="Gunakan Cover Letter Generator MantraSkill dengan AI untuk membuat cover letter personal dalam hitungan menit."
    ctaHref="/"
    relatedArticles={relatedArticles}
    ctaButtonText="Generate Cover Letter AI"
    freeVsMember={[
      { free: 'Copy-paste template yang sama ke 50 lamaran', member: 'AI generate cover letter personal dari CV + JD dalam 2 menit' },
      { free: 'Opening paragraph "Dengan hormat, saya yang bertanda tangan..."', member: 'AI analisis cover letter kamu + rewrite otomatis yang meyakinkan HRD' },
      { free: 'Nulis 1 jam per cover letter tapi tetap generic', member: 'Template khusus career switcher + prompt opening paragraph yang powerful' },
    ]}
    lockedResources={[
      { title: 'Prompt: Generate Cover Letter Personal', teaser: 'AI generate cover letter yang benar-benar personal dari CV dan JD kamu, bukan template generik...' },
      { title: 'Prompt: Rewrite Opening Paragraph', teaser: 'AI mengubah opening lemah jadi hook yang langsung menarik perhatian HRD dalam 7 detik pertama...' },
      { title: 'Template: Cover Letter Career Switcher', teaser: 'Template proven untuk yang pindah industri — fokus transferable skills dan motivasi yang meyakinkan...' },
    ]}
    jsonLd={[jsonLd, howToJsonLd]}
  >
    <p className="text-base text-foreground font-medium">Cover letter adalah senjata rahasia yang membedakan kamu dari ratusan pelamar lain. Sayangnya, 90% fresh graduate menulis cover letter yang generic.</p>

    <h2 className="font-display text-lg uppercase text-foreground mt-8">Kenapa Cover Letter Masih Penting?</h2>
    <p>83% HRD mengatakan cover letter yang baik bisa membuat mereka mempertimbangkan kandidat yang sebelumnya tidak qualified di atas kertas.</p>

    <h2 className="font-display text-lg uppercase text-foreground mt-8">Struktur Dasar Cover Letter</h2>
    <p>Cover letter yang baik hanya 3-4 paragraf:</p>
    <ol className="list-decimal pl-5 space-y-1">
      <li>Hook — pembuka yang menarik perhatian</li>
      <li>Value — skill dan pengalaman relevan</li>
      <li>Why This Company — kenapa perusahaan ini</li>
      <li>CTA — ajakan untuk berdiskusi lebih lanjut</li>
    </ol>

    <h2 className="font-display text-lg uppercase text-foreground mt-8">3 Kesalahan Umum</h2>
    <ul className="list-disc pl-5 space-y-1">
      <li>Copy-paste template tanpa personalisasi</li>
      <li>Mengulang isi CV alih-alih melengkapi</li>
      <li>Terlalu panjang (lebih dari 1 halaman)</li>
    </ul>
    <p className="mt-3 text-xs italic font-bold">Yang serius mau HRD bales, buka sisanya di sini. 👇</p>
  </ArticleLayout>
);

export default CoverLetterTips;
