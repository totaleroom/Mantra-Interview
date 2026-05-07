import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lock, Minus, Crown, User, Clock } from 'lucide-react';

import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from './SEOHead';
import ShareButtons from './ShareButtons';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

interface RelatedArticle {
  title: string;
  href: string;
  description: string;
}

interface LockedResource {
  title: string;
  teaser: string;
}

interface FreeVsMemberItem {
  free: string;
  member: string;
}

/* ── Gratis vs Member Comparison ── */
const FreeVsMemberComparison: React.FC<{ items: FreeVsMemberItem[] }> = ({ items }) => (
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
      <p className="font-body text-xs text-primary-foreground/60 mb-2">🔥 850+ orang sudah pakai MantraSkill</p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 bg-neoLime text-foreground font-display text-xs uppercase px-5 py-2.5 border-2 border-foreground shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
      >
        Daftar Gratis — Akses Semua Fitur <ArrowRight size={14} />
      </Link>
    </div>
  </div>
);

interface ArticleLayoutProps {
  title: string;
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  breadcrumbLabel: string;
  ctaText: string;
  ctaHref: string;
  ctaButtonText?: string;
  relatedArticles: RelatedArticle[];
  lockedResources?: LockedResource[];
  freeVsMember?: FreeVsMemberItem[];
  jsonLd: object;
  children: React.ReactNode;
}

export const ArticleLayout: React.FC<ArticleLayoutProps> = ({
  title,
  seoTitle,
  seoDescription,
  canonical,
  breadcrumbLabel,
  ctaText,
  ctaHref,
  ctaButtonText,
  relatedArticles,
  lockedResources,
  freeVsMember,
  jsonLd,
  children,
}) => {
  const BASE_URL = 'https://mantraskill.web.id';

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tips Karir', item: `${BASE_URL}/tips/cv-ats-friendly` },
      { '@type': 'ListItem', position: 3, name: breadcrumbLabel },
    ],
  };

  const combinedJsonLd = [jsonLd, breadcrumbJsonLd];

  return (
    <>
      <SEOHead title={seoTitle} description={seoDescription} canonical={canonical} jsonLd={combinedJsonLd} />
      <Header />
      <main className="min-h-screen bg-background">
        <article className="max-w-3xl mx-auto px-5 py-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/tips/cv-ats-friendly">Tips Karir</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{breadcrumbLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="font-display text-2xl md:text-4xl uppercase leading-tight mb-4 border-b-4 border-foreground pb-4">
            {title}
          </h1>

          {/* Author info + reading time */}
          <div className="flex items-center gap-4 text-muted-foreground font-body text-xs mb-6 flex-wrap">
            <span className="flex items-center gap-1"><User size={12} /> Tim MantraSkill</span>
            <span className="flex items-center gap-1"><Clock size={12} /> 5 menit baca</span>
            <span>Diperbarui Februari 2026</span>
          </div>

          {/* Share buttons */}
          <ShareButtons url={canonical} title={title} />

          <div className="font-body text-sm md:text-base leading-relaxed space-y-5 text-muted-foreground">
            {children}
          </div>

          {/* Free vs Member Comparison */}
          {freeVsMember && freeVsMember.length > 0 && (
            <FreeVsMemberComparison items={freeVsMember} />
          )}

          {/* Locked Advanced Section */}
          {lockedResources && lockedResources.length > 0 && (
            <div className="my-10 border-4 border-foreground bg-card shadow-neoLg p-5 md:p-6 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <Lock size={16} />
                <h2 className="font-display text-sm uppercase">Template & Prompt Siap Pakai</h2>
              </div>
              <div className="space-y-3">
                {lockedResources.map((r, i) => (
                  <div key={i} className="border-2 border-foreground p-3">
                    <p className="font-display text-xs uppercase mb-1">{r.title}</p>
                    <p className="font-body text-xs text-muted-foreground select-none" style={{ filter: 'blur(4px)' }}>{r.teaser}</p>
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card via-card/95 to-transparent flex flex-col items-center justify-end pb-5">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 bg-foreground text-primary-foreground font-display text-xs uppercase px-5 py-2.5 border-2 border-foreground shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                >
                  Daftar Gratis untuk Akses Semua Resource <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="my-12 bg-foreground text-primary-foreground border-4 border-foreground p-6 md:p-8 shadow-neoLg">
            <h2 className="font-display text-lg md:text-xl uppercase text-neoLime mb-3">
              Siap Praktik Langsung?
            </h2>
            <p className="font-body text-sm text-primary-foreground/80 mb-4">{ctaText}</p>
            <Link
              to={ctaHref}
              className="inline-flex items-center gap-2 bg-neoLime text-foreground font-display text-sm uppercase px-6 py-3 border-2 border-foreground shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              {ctaButtonText || 'Daftar Gratis'} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Share at bottom */}
          <ShareButtons url={canonical} title={title} />

          {/* Related Articles */}
          <section className="border-t-4 border-foreground pt-8">
            <h2 className="font-display text-lg uppercase mb-6">Artikel Terkait</h2>
            <div className="grid gap-4">
              {relatedArticles.map((a) => (
                <Link
                  key={a.href}
                  to={a.href}
                  className="block border-2 border-foreground p-4 bg-card shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  <h3 className="font-display text-sm uppercase mb-1">{a.title}</h3>
                  <p className="font-body text-xs text-muted-foreground">{a.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-8">
            <Link to="/" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={14} /> Kembali ke Beranda
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};
