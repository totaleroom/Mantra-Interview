import React, { Suspense } from 'react';
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Marquee } from '@/components/landing/Marquee';

// Lazy-load below-the-fold components
const Storytelling = React.lazy(() => import('@/components/landing/Storytelling').then(m => ({ default: m.Storytelling })));
const Features = React.lazy(() => import('@/components/landing/Features').then(m => ({ default: m.Features })));
const VSL = React.lazy(() => import('@/components/landing/VSL').then(m => ({ default: m.VSL })));
const Timeline = React.lazy(() => import('@/components/landing/Timeline').then(m => ({ default: m.Timeline })));
const Testimonials = React.lazy(() => import('@/components/landing/Testimonials').then(m => ({ default: m.Testimonials })));
const CompanyLogos = React.lazy(() => import('@/components/landing/CompanyLogos').then(m => ({ default: m.CompanyLogos })));
const FAQ = React.lazy(() => import('@/components/landing/FAQ').then(m => ({ default: m.FAQ })));
const Footer = React.lazy(() => import('@/components/landing/Footer').then(m => ({ default: m.Footer })));
const PopularArticles = React.lazy(() => import('@/components/landing/PopularArticles').then(m => ({ default: m.PopularArticles })));
const WhatsAppButton = React.lazy(() => import('@/components/landing/WhatsAppButton').then(m => ({ default: m.WhatsAppButton })));

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Suspense fallback={null}>
          <Storytelling />
          <Features />
          <VSL />
          <Timeline />
          <Testimonials />
          <CompanyLogos />
          <FAQ />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <PopularArticles />
        <Footer />
        <WhatsAppButton />
      </Suspense>
    </div>
  );
};

export default Index;
