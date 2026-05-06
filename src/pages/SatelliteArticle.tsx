import React, { Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getSatellitePageBySlug } from '@/data/satellite-pages';
import SatellitePage from '@/components/seo/SatellitePage';

const CareerHub = React.lazy(() => import('./CareerHub'));

const CATEGORY_SLUGS = ['posisi', 'lokasi', 'gaji', 'istilah'];

const SatelliteArticle = () => {
  const { slug } = useParams<{ slug: string }>();

  // If slug matches a category, render CareerHub
  if (slug && CATEGORY_SLUGS.includes(slug)) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="font-display text-xl uppercase animate-pulse">Memuat...</div></div>}>
        <CareerHub />
      </Suspense>
    );
  }

  const pageData = slug ? getSatellitePageBySlug(slug) : undefined;

  if (!pageData) {
    return <Navigate to="/404" replace />;
  }

  return <SatellitePage data={pageData} />;
};

export default SatelliteArticle;
