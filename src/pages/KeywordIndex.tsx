import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { ArrowLeft } from 'lucide-react';

const categories = [
  {
    title: 'Karir & Pekerjaan',
    keywords: [
      { term: 'cara dapat kerja cepat', desc: 'Strategi dan action plan untuk mempercepat proses pencarian kerja.' },
      { term: 'lowongan kerja 2026', desc: 'Informasi tren dan peluang kerja terbaru di Indonesia tahun 2026.' },
      { term: 'tips cari kerja fresh graduate', desc: 'Panduan lengkap bagi lulusan baru yang sedang memulai karir pertama.' },
      { term: 'pengangguran sarjana Indonesia', desc: 'Analisis tantangan ketenagakerjaan dan solusi praktis untuk lulusan universitas.' },
      { term: 'cara melamar kerja online', desc: 'Langkah-langkah efektif melamar pekerjaan melalui platform digital.' },
      { term: 'sprint cari kerja 7 hari', desc: 'Program akselerasi karir intensif untuk mendapat interview dalam 7 hari.' },
      { term: 'platform cari kerja Indonesia', desc: 'Daftar tools dan platform terbaik untuk pencari kerja di Indonesia.' },
      { term: 'skill yang dibutuhkan 2026', desc: 'Kompetensi yang paling dicari oleh perusahaan di tahun 2026.' },
    ],
  },
  {
    title: 'CV & Resume',
    keywords: [
      { term: 'CV ATS friendly Indonesia', desc: 'Panduan membuat CV yang lolos Applicant Tracking System perusahaan Indonesia.' },
      { term: 'cara bikin CV yang benar', desc: 'Tutorial step-by-step membuat CV profesional dari nol.' },
      { term: 'contoh CV fresh graduate', desc: 'Template dan contoh CV untuk lulusan baru tanpa pengalaman kerja.' },
      { term: 'template CV profesional', desc: 'Koleksi format CV yang disetujui HRD dan ramah ATS.' },
      { term: 'cek CV ATS gratis', desc: 'Tool gratis untuk mengecek apakah CV kamu bisa dibaca oleh sistem ATS.' },
      { term: 'CV builder Indonesia', desc: 'Platform pembuatan CV otomatis dengan AI khusus pasar Indonesia.' },
      { term: 'cara menulis pengalaman kerja di CV', desc: 'Tips mendeskripsikan pengalaman kerja agar menarik perhatian recruiter.' },
      { term: 'CV bahasa Inggris contoh', desc: 'Contoh CV dalam bahasa Inggris untuk melamar ke perusahaan multinasional.' },
    ],
  },
  {
    title: 'Interview Kerja',
    keywords: [
      { term: 'tips lolos interview kerja', desc: 'Strategi menjawab pertanyaan interview dengan percaya diri dan tepat.' },
      { term: 'simulasi interview online', desc: 'Latihan interview dengan AI untuk mempersiapkan diri sebelum hari H.' },
      { term: 'pertanyaan interview dan jawaban', desc: 'Kumpulan pertanyaan interview paling umum beserta contoh jawaban terbaik.' },
      { term: 'persiapan interview bahasa Inggris', desc: 'Panduan interview dalam bahasa Inggris untuk posisi di perusahaan global.' },
      { term: 'interview kerja pertama kali', desc: 'Tips khusus bagi yang baru pertama kali menghadapi sesi interview.' },
      { term: 'cara follow up setelah interview', desc: 'Template dan timing yang tepat untuk follow up hasil interview.' },
    ],
  },
  {
    title: 'LinkedIn',
    keywords: [
      { term: 'LinkedIn optimization Indonesia', desc: 'Cara mengoptimalkan profil LinkedIn agar ditemukan recruiter Indonesia.' },
      { term: 'cara buat profil LinkedIn menarik', desc: 'Tips menulis headline, summary, dan pengalaman yang menarik di LinkedIn.' },
      { term: 'LinkedIn untuk fresh graduate', desc: 'Strategi membangun presence LinkedIn meski belum punya pengalaman kerja.' },
      { term: 'LinkedIn headline contoh', desc: 'Contoh headline LinkedIn yang meningkatkan visibility di pencarian recruiter.' },
      { term: 'networking LinkedIn tips', desc: 'Cara membangun koneksi profesional yang bermakna di LinkedIn.' },
    ],
  },
  {
    title: 'Cover Letter & Surat Lamaran',
    keywords: [
      { term: 'contoh cover letter Indonesia', desc: 'Template cover letter bahasa Indonesia untuk berbagai posisi.' },
      { term: 'cover letter template', desc: 'Format surat lamaran yang profesional dan mudah dikustomisasi.' },
      { term: 'cara menulis surat lamaran kerja', desc: 'Panduan menulis surat lamaran yang membuat HRD tertarik membaca CV kamu.' },
      { term: 'cover letter fresh graduate', desc: 'Contoh surat lamaran khusus untuk lulusan baru.' },
      { term: 'cover letter bahasa Inggris', desc: 'Template dan contoh cover letter dalam bahasa Inggris.' },
    ],
  },
  {
    title: 'AI & Teknologi untuk Karir',
    keywords: [
      { term: 'skill AI untuk kerja', desc: 'Kemampuan AI yang perlu dikuasai untuk meningkatkan daya saing di dunia kerja.' },
      { term: 'cara pakai AI untuk cari kerja', desc: 'Panduan menggunakan tools AI untuk mempercepat proses pencarian kerja.' },
      { term: 'AI career tools Indonesia', desc: 'Daftar tools berbasis AI untuk akselerasi karir di Indonesia.' },
      { term: 'ChatGPT untuk cari kerja', desc: 'Cara memanfaatkan ChatGPT untuk menulis CV, cover letter, dan persiapan interview.' },
      { term: 'AI CV builder', desc: 'Platform yang menggunakan AI untuk membuat CV profesional secara otomatis.' },
      { term: 'AI interview simulator', desc: 'Simulasi interview kerja berbasis AI untuk latihan menjawab pertanyaan.' },
    ],
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Indeks Topik & Kata Kunci — MantraSkill',
  description: 'Halaman indeks topik dan kata kunci seputar karir, CV, interview, LinkedIn, dan AI yang relevan dengan platform MantraSkill.',
  url: 'https://mantraskill.web.id/seo/keywords',
  publisher: {
    '@type': 'Organization',
    name: 'MantraSkill',
    url: 'https://mantraskill.web.id',
  },
};

const KeywordIndex: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Indeks Topik & Kata Kunci — MantraSkill"
        description="Halaman indeks topik dan kata kunci seputar karir, CV ATS, interview kerja, LinkedIn, cover letter, dan AI yang relevan dengan platform MantraSkill Indonesia."
        canonical="/seo/keywords"
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-5 py-12">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>

          <h1 className="font-display text-3xl md:text-4xl uppercase mb-4">Indeks Topik & Kata Kunci</h1>
          <p className="font-body text-muted-foreground leading-relaxed mb-10">
            Halaman ini berisi indeks topik dan kata kunci yang relevan dengan platform MantraSkill. 
            Setiap topik mencerminkan area yang kami bantu selesaikan melalui program akselerasi karir 7 hari kami. 
            Daftar ini disusun secara transparan untuk membantu mesin pencari dan pengguna menemukan informasi yang tepat.
          </p>

          <div className="space-y-10">
            {categories.map((cat) => (
              <section key={cat.title}>
                <h2 className="font-display text-xl uppercase border-b-2 border-foreground pb-2 mb-4">{cat.title}</h2>
                <dl className="space-y-3">
                  {cat.keywords.map((kw) => (
                    <div key={kw.term}>
                      <dt className="font-body font-semibold text-foreground">{kw.term}</dt>
                      <dd className="font-body text-sm text-muted-foreground ml-0">{kw.desc}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-muted">
            <p className="font-body text-xs text-muted-foreground">
              © {new Date().getFullYear()} MantraSkill. Halaman ini diperbarui secara berkala sesuai tren pencarian terbaru.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default KeywordIndex;
