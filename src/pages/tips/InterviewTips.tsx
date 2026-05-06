import { ArticleLayout } from '@/components/seo/ArticleLayout';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Tips Interview Kerja 2026: Panduan Lengkap Lolos Interview untuk Fresh Graduate",
  "author": { "@type": "Organization", "name": "MantraSkill" },
  "publisher": { "@type": "Organization", "name": "MantraSkill", "logo": { "@type": "ImageObject", "url": "https://mantraskill.web.id/favicon.png" } },
  "datePublished": "2026-02-21",
  "dateModified": "2026-02-21",
  "inLanguage": "id",
  "mainEntityOfPage": "https://mantraskill.web.id/tips/interview-kerja"
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Cara Persiapan Interview Kerja 2026",
  "description": "3 langkah persiapan interview kerja yang efektif untuk fresh graduate.",
  "step": [
    { "@type": "HowToStep", "name": "Riset Perusahaan", "text": "Pelajari website, berita terbaru, dan kultur kerja perusahaan target." },
    { "@type": "HowToStep", "name": "Pahami Job Description", "text": "Identifikasi 3-5 skill utama yang dicari dan siapkan contoh pengalaman relevan." },
    { "@type": "HowToStep", "name": "Siapkan Cerita STAR", "text": "Gunakan metode STAR (Situation, Task, Action, Result) untuk menjawab pertanyaan behavioral." },
  ],
};

const relatedArticles = [
  { title: 'CV ATS-Friendly', href: '/tips/cv-ats-friendly', description: 'Panduan membuat CV yang lolos filter ATS' },
  { title: 'Optimasi LinkedIn', href: '/tips/linkedin-optimization', description: 'Cara optimasi profil LinkedIn agar dilirik recruiter' },
  { title: 'Cover Letter yang Efektif', href: '/tips/cover-letter', description: 'Panduan bikin cover letter yang personal dan meyakinkan' },
];

const InterviewTips = () => (
  <ArticleLayout
    title="Tips Interview Kerja 2026: Panduan Lengkap Lolos Interview untuk Fresh Graduate"
    seoTitle="Tips Interview Kerja 2026 — Panduan Fresh Graduate | MantraSkill"
    seoDescription="Tips interview kerja lengkap untuk fresh graduate 2026. Cara jawab pertanyaan interview, persiapan, teknik STAR, dan simulasi interview AI gratis."
    canonical="/tips/interview-kerja"
    breadcrumbLabel="Interview Kerja"
    ctaText="Latihan interview dengan AI Simulator MantraSkill. Dapatkan feedback real-time dan tingkatkan kepercayaan diri kamu."
    ctaHref="/"
    relatedArticles={relatedArticles}
    ctaButtonText="Coba Simulasi Interview AI"
    freeVsMember={[
      { free: 'Hafal teori STAR tapi blank pas interview beneran', member: 'Latihan langsung dengan AI Simulator + feedback real-time per jawaban' },
      { free: 'Latihan jawab di depan cermin sendiri', member: 'Simulasi 10 pertanyaan spesifik posisi target + scoring otomatis' },
      { free: 'Googling "pertanyaan interview" malam sebelumnya', member: 'AI riset perusahaan + generate talking points otomatis untuk interview' },
    ]}
    lockedResources={[
      { title: 'Prompt: Simulasi Interview Posisi Target', teaser: 'AI mensimulasikan 10 pertanyaan interview realistis berdasarkan posisi dan perusahaan target kamu...' },
      { title: 'Prompt: Generate Jawaban STAR Method', teaser: 'Ceritakan pengalaman singkat, AI mengubahnya jadi jawaban STAR terstruktur yang mengesankan interviewer...' },
      { title: 'Prompt: Riset Perusahaan untuk Interview', teaser: 'Masukkan nama perusahaan, dapatkan ringkasan culture, produk, dan talking points yang bikin kamu terlihat prepared...' },
    ]}
    jsonLd={[jsonLd, howToJsonLd]}
  >
    <p className="text-base text-foreground font-medium">Dapat panggilan interview tapi nervous? Persiapan yang benar menentukan 80% kesuksesan interview.</p>

    <h2 className="font-display text-lg uppercase text-foreground mt-8">3 Langkah Persiapan Interview</h2>
    <ol className="list-decimal pl-5 space-y-2">
      <li>Riset perusahaan: website, berita terbaru, kultur kerja</li>
      <li>Pahami job description: identifikasi 3-5 skill utama yang dicari</li>
      <li>Siapkan cerita pengalaman menggunakan metode STAR</li>
    </ol>

    <h2 className="font-display text-lg uppercase text-foreground mt-8">Apa itu Metode STAR?</h2>
    <p>STAR adalah framework untuk menjawab pertanyaan behavioral interview: <strong>S</strong>ituation, <strong>T</strong>ask, <strong>A</strong>ction, <strong>R</strong>esult. Dengan framework ini, jawaban kamu terstruktur dan meyakinkan.</p>
    <p className="mt-3 text-xs italic font-bold">Yang serius mau lolos interview, buka sisanya di sini. 👇</p>
  </ArticleLayout>
);

export default InterviewTips;
