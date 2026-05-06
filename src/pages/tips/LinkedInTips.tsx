import { ArticleLayout } from '@/components/seo/ArticleLayout';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Cara Optimasi LinkedIn 2026: Panduan Lengkap Agar Dilirik Recruiter",
  "author": { "@type": "Organization", "name": "MantraSkill" },
  "publisher": { "@type": "Organization", "name": "MantraSkill", "logo": { "@type": "ImageObject", "url": "https://mantraskill.web.id/favicon.png" } },
  "datePublished": "2026-02-21",
  "dateModified": "2026-02-21",
  "inLanguage": "id",
  "mainEntityOfPage": "https://mantraskill.web.id/tips/linkedin-optimization"
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Cara Optimasi LinkedIn agar Dilirik Recruiter",
  "description": "Langkah-langkah optimasi profil LinkedIn untuk meningkatkan visibilitas di mata recruiter.",
  "step": [
    { "@type": "HowToStep", "name": "Optimasi Headline", "text": "Gunakan format: [Role Target] | [Skill Utama] | Open to Work untuk headline LinkedIn." },
    { "@type": "HowToStep", "name": "Pasang Foto Profesional", "text": "Gunakan foto dengan background polos, wajah 70% frame, dan pakaian profesional." },
    { "@type": "HowToStep", "name": "Tulis About Section", "text": "Gunakan formula Hook-Value-Proof-CTA untuk about section yang menarik." },
  ],
};

const relatedArticles = [
  { title: 'CV ATS-Friendly', href: '/tips/cv-ats-friendly', description: 'Panduan membuat CV yang lolos filter ATS' },
  { title: 'Tips Interview Kerja', href: '/tips/interview-kerja', description: 'Persiapan interview untuk fresh graduate dan profesional' },
  { title: 'Cover Letter yang Efektif', href: '/tips/cover-letter', description: 'Panduan bikin cover letter yang personal dan meyakinkan' },
];

const LinkedInTips = () => (
  <ArticleLayout
    title="Cara Optimasi LinkedIn 2026: Panduan Lengkap Agar Dilirik Recruiter"
    seoTitle="Cara Optimasi LinkedIn 2026 — Dilirik Recruiter | MantraSkill"
    seoDescription="Panduan lengkap optimasi LinkedIn untuk fresh graduate Indonesia 2026. Tips headline, about section, experience, dan strategi networking yang efektif."
    canonical="/tips/linkedin-optimization"
    breadcrumbLabel="LinkedIn Optimization"
    ctaText="Gunakan LinkedIn Optimizer MantraSkill dengan AI untuk mengubah profil LinkedIn kamu dalam hitungan menit."
    ctaHref="/"
    relatedArticles={relatedArticles}
    ctaButtonText="Optimasi LinkedIn Sekarang"
    freeVsMember={[
      { free: 'Headline masih "Mahasiswa Universitas X"', member: 'AI generate 5 variasi headline LinkedIn yang proven menarik recruiter' },
      { free: 'About section kosong atau copy-paste dari CV', member: 'AI rewrite seluruh profil LinkedIn — headline, about, experience — dalam 5 menit' },
      { free: 'Nunggu recruiter datang sendiri tanpa strategi', member: 'LinkedIn Optimizer + AI About Section Generator + networking strategy' },
    ]}
    lockedResources={[
      { title: 'Prompt: Optimasi LinkedIn Headline', teaser: 'AI generate 5 variasi headline yang proven menarik recruiter berdasarkan posisi target dan skill utama kamu...' },
      { title: 'Prompt: Generate About Section LinkedIn', teaser: 'Buat about section yang menjual dengan formula Hook-Value-Proof-CTA. AI sesuaikan dengan background kamu...' },
      { title: 'Prompt: Rewrite Experience dari CV', teaser: 'AI mengubah pengalaman CV jadi narasi storytelling LinkedIn yang membuat recruiter tertarik connect...' },
    ]}
    jsonLd={[jsonLd, howToJsonLd]}
  >
    <p className="text-base text-foreground font-medium">LinkedIn bukan sekadar CV online — ini adalah platform di mana 87% recruiter aktif mencari kandidat.</p>

    <h2 className="font-display text-lg uppercase text-foreground mt-8">Kenapa LinkedIn Penting?</h2>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>87% recruiter</strong> menggunakan LinkedIn untuk mencari kandidat</li>
      <li>Profil lengkap mendapat <strong>40x lebih banyak</strong> views</li>
      <li>Banyak lowongan hanya diposting di LinkedIn</li>
    </ul>

    <h2 className="font-display text-lg uppercase text-foreground mt-8">Tips Headline</h2>
    <p>Headline muncul di search results dan koneksi. Gunakan format: [Role Target] | [Skill Utama] | Open to Work.</p>

    <h2 className="font-display text-lg uppercase text-foreground mt-8">Foto Profil</h2>
    <ul className="list-disc pl-5 space-y-1">
      <li>Background polos atau blur</li>
      <li>Wajah terlihat jelas (70% frame)</li>
      <li>Pakaian profesional sesuai industri</li>
    </ul>
    <p className="mt-3 text-xs italic font-bold">Yang serius mau dilirik recruiter, buka sisanya di sini. 👇</p>
  </ArticleLayout>
);

export default LinkedInTips;
