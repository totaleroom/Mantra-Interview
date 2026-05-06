import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { satellitePages } from '@/data/satellite-pages';
import type { SatellitePage } from '@/data/satellite-pages';

const categoryMeta: Record<string, { title: string; seoTitle: string; seoDescription: string; description: string }> = {
  all: {
    title: 'Panduan Karir 2026',
    seoTitle: 'Panduan Karir 2026 — CV, Lowongan, Gaji, Istilah | MantraSkill',
    seoDescription: 'Panduan karir lengkap 2026 untuk fresh graduate Indonesia. Contoh CV per posisi, lowongan kerja per kota, info gaji, dan istilah karir penting.',
    description: 'Kumpulan panduan karir lengkap untuk fresh graduate dan job seeker Indonesia 2026.',
  },
  posisi: {
    title: 'Contoh CV per Posisi 2026',
    seoTitle: 'Contoh CV per Posisi 2026 — ATS-Friendly | MantraSkill',
    seoDescription: 'Kumpulan contoh CV ATS-friendly 2026 untuk berbagai posisi: Marketing, Data Analyst, Software Engineer, HRD, Sales, dan lainnya.',
    description: 'Contoh CV ATS-friendly untuk berbagai posisi pekerjaan populer di Indonesia.',
  },
  lokasi: {
    title: 'Lowongan Kerja per Kota 2026',
    seoTitle: 'Lowongan Kerja per Kota 2026 — Panduan Fresh Graduate | MantraSkill',
    seoDescription: 'Panduan cari kerja 2026 di berbagai kota Indonesia: Jakarta, Surabaya, Bandung, Medan, Semarang, Yogyakarta.',
    description: 'Panduan cari kerja di kota-kota besar Indonesia untuk fresh graduate.',
  },
  gaji: {
    title: 'Info Gaji 2026',
    seoTitle: 'Info Gaji 2026 per Posisi — Range & Negosiasi | MantraSkill',
    seoDescription: 'Range gaji 2026 untuk berbagai posisi di Indonesia. Data gaji fresh graduate, marketing, data analyst, dan software engineer.',
    description: 'Range gaji dan tips negosiasi untuk berbagai posisi di Indonesia.',
  },
  istilah: {
    title: 'Istilah Karir Penting',
    seoTitle: 'Glossary Istilah Karir 2026 — ATS, STAR, Soft Skill | MantraSkill',
    seoDescription: 'Penjelasan istilah karir penting: ATS, STAR Method, Cover Letter, Personal Branding, Networking, dan Soft Skill.',
    description: 'Penjelasan istilah-istilah penting dalam dunia karir dan lamaran kerja.',
  },
};

const CareerHub: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const cat = category && categoryMeta[category] ? category : 'all';
  const meta = categoryMeta[cat];

  const pages: SatellitePage[] = cat === 'all'
    ? satellitePages
    : satellitePages.filter((p) => p.category === cat);

  const categories = [
    { key: 'all', label: 'Semua' },
    { key: 'posisi', label: 'Contoh CV' },
    { key: 'lokasi', label: 'Lowongan Kota' },
    { key: 'gaji', label: 'Info Gaji' },
    { key: 'istilah', label: 'Istilah Karir' },
  ];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mantraskill.web.id/' },
      { '@type': 'ListItem', position: 2, name: meta.title, item: `https://mantraskill.web.id/karir${cat !== 'all' ? '/' + cat : ''}` },
    ],
  };

  return (
    <>
      <SEOHead
        title={meta.seoTitle}
        description={meta.seoDescription}
        canonical={`/karir${cat !== 'all' ? '/' + cat : ''}`}
        jsonLd={breadcrumbJsonLd}
      />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-5 py-8">
          <h1 className="font-display text-2xl md:text-4xl uppercase leading-tight mb-3 border-b-4 border-foreground pb-4">
            {meta.title}
          </h1>
          <p className="font-body text-sm text-muted-foreground mb-8">{meta.description}</p>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((c) => (
              <Link
                key={c.key}
                to={c.key === 'all' ? '/karir' : `/karir/${c.key}`}
                className={`font-display text-xs uppercase px-4 py-2 border-2 border-foreground transition-all ${
                  cat === c.key
                    ? 'bg-foreground text-primary-foreground shadow-none'
                    : 'bg-card shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>

          {/* Article Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {pages.map((page) => (
              <Link
                key={page.slug}
                to={`/karir/${page.slug}`}
                className="block border-4 border-foreground p-5 bg-card shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all group"
              >
                <span className="font-display text-[10px] uppercase text-muted-foreground">
                  {page.category === 'posisi' && '📄 CV'}
                  {page.category === 'lokasi' && '📍 Lokasi'}
                  {page.category === 'gaji' && '💰 Gaji'}
                  {page.category === 'istilah' && '📖 Istilah'}
                </span>
                <h2 className="font-display text-sm uppercase mt-1 mb-2 group-hover:text-neoLime transition-colors">
                  {page.title}
                </h2>
                <p className="font-body text-xs text-muted-foreground line-clamp-2">
                  {page.seoDescription}
                </p>
                <span className="inline-flex items-center gap-1 font-display text-xs uppercase text-muted-foreground mt-3 group-hover:text-foreground transition-colors">
                  Baca <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CareerHub;
