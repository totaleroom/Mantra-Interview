import React from 'react';
import { SectionWrapper } from './SectionWrapper';
import { X, Check, ArrowRight, TrendingUp } from 'lucide-react';

const transformations = [
  {
    before: "Bertanggung jawab atas sosial media perusahaan",
    after: "Meningkatkan engagement Instagram 340% dalam 3 bulan melalui content calendar strategy",
  },
  {
    before: "Membantu tim marketing dalam berbagai tugas",
    after: "Menghasilkan 50+ qualified leads/bulan melalui kampanye digital dengan ROI 280%",
  },
  {
    before: "Mengelola data perusahaan menggunakan Excel",
    after: "Mengotomasi 15+ proses reporting menggunakan Excel VBA, menghemat 20 jam kerja/minggu",
  },
];

export const VSL: React.FC = () => {
  return (
    <div className="bg-foreground py-12 border-t-4 border-foreground">
      <SectionWrapper>
        <div className="text-center mb-10">
          <h2 className="text-background font-display text-3xl uppercase tracking-tighter">
            Lihat Bedanya <span className="text-neoLime">Sebelum & Sesudah</span>
          </h2>
          <p className="text-background/60 font-body text-sm mt-2">
            Sama-sama pengalaman yang sama — beda cara nulis, beda hasil.
          </p>
        </div>

        <div className="space-y-5">
          {transformations.map((t, i) => (
            <div key={i} className="grid md:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
              {/* Before */}
              <div className="bg-red-950/40 border-2 border-red-500/50 p-4 flex items-start gap-3">
                <X size={18} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-display uppercase text-red-400 tracking-wider">Sebelum</span>
                  <p className="text-background/70 font-body text-sm line-through decoration-red-400/50 mt-1">{t.before}</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center">
                <ArrowRight size={24} className="text-neoLime" />
              </div>

              {/* After */}
              <div className="bg-emerald-950/40 border-2 border-emerald-500/50 p-4 flex items-start gap-3">
                <Check size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-display uppercase text-emerald-400 tracking-wider">Sesudah</span>
                  <p className="text-background font-body text-sm font-medium mt-1">{t.after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ATS Score */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2 bg-red-950/40 border-2 border-red-500/50 px-4 py-2">
            <TrendingUp size={16} className="text-red-400" />
            <span className="font-display text-sm text-red-400">ATS Score: 35/100</span>
          </div>
          <ArrowRight size={20} className="text-neoLime hidden sm:block" />
          <div className="flex items-center gap-2 bg-emerald-950/40 border-2 border-emerald-500/50 px-4 py-2">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="font-display text-sm text-emerald-400">ATS Score: 87/100</span>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};
