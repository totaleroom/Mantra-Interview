import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const articles = [
{ slug: 'apa-itu-ats', title: 'Apa Itu ATS (Applicant Tracking System)?', desc: 'Pelajari cara kerja ATS dan kenapa CV kamu harus ATS-friendly.' },
{ slug: 'cv-marketing', title: 'Contoh CV Marketing yang Lolos ATS 2026', desc: 'Skill utama, kesalahan umum, dan tips CV marketing.' },
{ slug: 'cv-data-analyst', title: 'Contoh CV Data Analyst Fresh Graduate', desc: 'Cara bikin CV data analyst yang menarik perhatian HRD.' },
{ slug: 'gaji-fresh-graduate-2026', title: 'Gaji Fresh Graduate 2026', desc: 'Range gaji dan tips negosiasi untuk lulusan baru.' },
{ slug: 'kerja-di-jakarta', title: 'Cari Kerja di Jakarta 2026', desc: 'Panduan lengkap cari kerja di ibukota untuk fresh graduate.' },
{ slug: 'apa-itu-star-method', title: 'Metode STAR untuk Interview', desc: 'Framework menjawab pertanyaan behavioral interview.' }];


export const PopularArticles: React.FC = () =>
<section className="border-t-4 border-foreground py-12 px-5">
    <div className="max-w-5xl mx-auto">
      <h2 className="font-display text-lg md:text-xl uppercase mb-6 text-center">
        📚 Panduan Karir Populer
      </h2>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) =>
      <Link
        key={a.slug}
        to={`/karir/${a.slug}`}
        className="block border-2 border-foreground p-4 bg-card shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
        
            <h3 className="font-display text-xs uppercase mb-1">{a.title}</h3>
            <p className="font-body text-[11px] text-muted-foreground">{a.desc}</p>
          </Link>
      )}
      </div>
      <div className="text-center mt-6">
        <Link
        to="/gratis/cek-cv"
        className="inline-flex items-center gap-2 font-display text-xs uppercase hover:underline text-destructive">
        
          Cek CV ATS Gratis Sekarang <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </section>;