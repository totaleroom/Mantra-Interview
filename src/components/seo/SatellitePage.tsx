import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Minus, Crown, User, Clock } from 'lucide-react';
import { openCheckout } from '@/lib/links';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from './SEOHead';
import ShareButtons from './ShareButtons';
import TableOfContents from './TableOfContents';
import type { SatellitePage as SatellitePageData } from '@/data/satellite-pages';
import { getRelatedPages } from '@/data/satellite-pages';

const FreeVsMemberComparison: React.FC<{ items: { free: string; member: string }[] }> = ({ items }) => (
  <div className="my-10 border-4 border-foreground bg-card shadow-neoLg overflow-hidden">
    <div className="grid grid-cols-2">
      <div className="p-3 bg-muted/50 border-b-4 border-r-2 border-foreground">
        <p className="font-display text-xs uppercase text-muted-foreground">😐 Kamu di sini</p>
      </div>
      <div className="p-3 bg-neoLime/10 border-b-4 border-l-2 border-foreground flex items-center gap-2">
        <Crown size={14} className="text-neoLime" />
        <p className="font-display text-xs uppercase text-foreground">Member MantraSkill</p>
      </div>
    </div>
    {items.map((item, i) => (
      <div key={i} className="grid grid-cols-2 border-b-2 border-foreground last:border-b-0">
        <div className="p-3 border-r-2 border-foreground flex items-start gap-2">
          <Minus size={14} className="text-muted-foreground shrink-0 mt-0.5" />
          <p className="font-body text-xs text-muted-foreground">{item.free}</p>
        </div>
        <div className="p-3 border-l-2 border-foreground bg-neoLime/5 flex items-start gap-2 relative">
          <Lock size={12} className="text-neoLime shrink-0 mt-0.5" />
          <p className="font-body text-xs text-muted-foreground select-none" style={{ filter: 'blur(3px)' }}>{item.member}</p>
        </div>
      </div>
    ))}
    <div className="p-4 bg-foreground text-center">
      <p className="font-body text-xs text-primary-foreground/60 mb-2">🔥 1.247 orang sudah upgrade bulan ini</p>
      <button
        onClick={openCheckout}
        className="inline-flex items-center gap-2 bg-neoLime text-foreground font-display text-xs uppercase px-5 py-2.5 border-2 border-foreground shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
      >
        Upgrade sekarang — mulai IDR 148K <ArrowRight size={14} />
      </button>
    </div>
  </div>
);

interface SatellitePageProps {
  data: SatellitePageData;
}

const SatellitePage: React.FC<SatellitePageProps> = ({ data }) => {
  const relatedPages = getRelatedPages(data.relatedSlugs);
  const BASE_URL = 'https://mantraskill.web.id';

  const categoryLabel: Record<string, string> = {
    posisi: 'Contoh CV',
    lokasi: 'Lowongan Kerja',
    istilah: 'Istilah Karir',
    gaji: 'Info Gaji',
  };

  // Estimate reading time
  const wordCount = data.sections.reduce((sum, s) => sum + s.content.split(/\s+/).length + s.heading.split(/\s+/).length, 0);
  const readingTime = Math.max(3, Math.ceil(wordCount / 200));

  // JSON-LD: Article
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.seoDescription,
    url: `${BASE_URL}/karir/${data.slug}`,
    author: { '@type': 'Organization', name: 'MantraSkill' },
    publisher: { '@type': 'Organization', name: 'MantraSkill', url: BASE_URL, logo: { '@type': 'ImageObject', url: `${BASE_URL}/favicon.png` } },
    datePublished: '2026-02-21',
    dateModified: '2026-02-21',
    inLanguage: 'id',
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: categoryLabel[data.category] || 'Karir', item: `${BASE_URL}/karir/${data.category === 'posisi' ? 'posisi' : data.category === 'lokasi' ? 'lokasi' : data.category === 'gaji' ? 'gaji' : 'istilah'}` },
      { '@type': 'ListItem', position: 3, name: data.title },
    ],
  };

  // JSON-LD: FAQPage (if faqs exist)
  const faqJsonLd = data.faqs && data.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null;

  // Combine JSON-LD
  const combinedJsonLd = [articleJsonLd, breadcrumbJsonLd, ...(faqJsonLd ? [faqJsonLd] : [])];

  return (
    <>
      <SEOHead
        title={data.seoTitle}
        description={data.seoDescription}
        canonical={`/karir/${data.slug}`}
        jsonLd={combinedJsonLd}
      />
      <Header />
      <main className="min-h-screen bg-background">
        <article className="max-w-3xl mx-auto px-5 py-8">
          {/* Breadcrumb */}
          <nav className="font-body text-xs text-muted-foreground mb-6 flex items-center gap-1 flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/karir" className="hover:text-foreground transition-colors">Karir</Link>
            <span>/</span>
            <Link to={`/karir/${data.category}`} className="hover:text-foreground transition-colors">{categoryLabel[data.category]}</Link>
            <span>/</span>
            <span className="text-foreground">{data.title.slice(0, 40)}...</span>
          </nav>

          <h1 className="font-display text-2xl md:text-4xl uppercase leading-tight mb-4 border-b-4 border-foreground pb-4">
            {data.title}
          </h1>

          {/* Author info + reading time */}
          <div className="flex items-center gap-4 text-muted-foreground font-body text-xs mb-6">
            <span className="flex items-center gap-1"><User size={12} /> Tim MantraSkill</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {readingTime} menit baca</span>
            <span>Diperbarui Februari 2026</span>
          </div>

          {/* Share buttons */}
          <ShareButtons url={`/karir/${data.slug}`} title={data.title} />

          {/* Table of Contents */}
          <TableOfContents sections={data.sections} />

          <div className="font-body text-sm md:text-base leading-relaxed space-y-6 text-muted-foreground">
            {data.sections.map((section, i) => (
              <div key={i} id={`section-${i}`}>
                <h2 className="font-display text-base md:text-lg uppercase mb-2 text-foreground">{section.heading}</h2>
                <p className="whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Free vs Member */}
          <FreeVsMemberComparison items={data.freeVsMember} />

          {/* FAQ Section */}
          {data.faqs && data.faqs.length > 0 && (
            <section className="my-10 border-4 border-foreground bg-card shadow-neoLg p-5 md:p-6">
              <h2 className="font-display text-sm uppercase mb-4">❓ Pertanyaan yang Sering Ditanyakan</h2>
              <div className="space-y-4">
                {data.faqs.map((faq, i) => (
                  <div key={i} className="border-b-2 border-muted pb-3 last:border-0 last:pb-0">
                    <h3 className="font-display text-xs uppercase mb-1">{faq.question}</h3>
                    <p className="font-body text-xs text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Locked Resources */}
          {data.lockedResources.length > 0 && (
            <div className="my-10 border-4 border-foreground bg-card shadow-neoLg p-5 md:p-6 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <Lock size={16} />
                <h2 className="font-display text-sm uppercase">Template & Resource Eksklusif</h2>
              </div>
              <div className="space-y-3">
                {data.lockedResources.map((r, i) => (
                  <div key={i} className="border-2 border-foreground p-3">
                    <p className="font-display text-xs uppercase mb-1">{r.title}</p>
                    <p className="font-body text-xs text-muted-foreground select-none" style={{ filter: 'blur(4px)' }}>{r.teaser}</p>
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card via-card/95 to-transparent flex flex-col items-center justify-end pb-5">
                <button
                  onClick={openCheckout}
                  className="inline-flex items-center gap-2 bg-foreground text-primary-foreground font-display text-xs uppercase px-5 py-2.5 border-2 border-foreground shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                >
                  Buka dengan MantraSkill Member <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="my-12 bg-foreground text-primary-foreground border-4 border-foreground p-6 md:p-8 shadow-neoLg">
            <h2 className="font-display text-lg md:text-xl uppercase text-neoLime mb-3">
              Siap Praktik Langsung?
            </h2>
            <p className="font-body text-sm text-primary-foreground/80 mb-4">
              Jangan cuma baca tips — gunakan AI tools MantraSkill untuk langsung membuat CV, latihan interview, dan optimasi LinkedIn kamu.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={openCheckout}
                className="inline-flex items-center gap-2 bg-neoLime text-foreground font-display text-sm uppercase px-6 py-3 border-2 border-foreground shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
              >
                Mulai Sekarang <ArrowRight size={16} />
              </button>
              <Link
                to="/gratis/cek-cv"
                className="inline-flex items-center gap-2 bg-card text-foreground font-display text-sm uppercase px-6 py-3 border-2 border-foreground shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
              >
                Cek CV Gratis
              </Link>
            </div>
          </div>

          {/* Share at bottom */}
          <ShareButtons url={`/karir/${data.slug}`} title={data.title} />

          {/* Related Satellite Pages */}
          {relatedPages.length > 0 && (
            <section className="border-t-4 border-foreground pt-8">
              <h2 className="font-display text-lg uppercase mb-6">Artikel Terkait</h2>
              <div className="grid gap-4">
                {relatedPages.map((page) => (
                  <Link
                    key={page.slug}
                    to={`/karir/${page.slug}`}
                    className="block border-2 border-foreground p-4 bg-card shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    <h3 className="font-display text-sm uppercase mb-1">{page.title}</h3>
                    <p className="font-body text-xs text-muted-foreground">{page.seoDescription.slice(0, 100)}...</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA to Free CV Checker */}
          <div className="mt-8 border-2 border-foreground bg-neoLime/10 p-4 text-center">
            <p className="font-body text-xs text-muted-foreground mb-2">Mau tahu skor ATS CV kamu?</p>
            <Link
              to="/gratis/cek-cv"
              className="inline-flex items-center gap-2 font-display text-xs uppercase text-foreground hover:text-neoLime transition-colors"
            >
              Cek CV ATS Gratis Sekarang <ArrowRight size={14} />
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default SatellitePage;
