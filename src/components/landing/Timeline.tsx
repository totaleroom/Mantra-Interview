import React from 'react';
import { SectionWrapper } from './SectionWrapper';

const days = [
  { day: "Day 1", title: "Audit & Strategi", desc: "Cek bias CV lama lo, tentuin target role yang realistis, setup mindset 'Jualan Skill'. (Modul 1)" },
  { day: "Day 2", title: "Bedah CV ATS", desc: "Buat CV ATS-friendly pake CV Builder AI. Isi bullet points pake rumus 'Action + Result' dibantu scoring otomatis. (Modul 2 + CV Builder)" },
  { day: "Day 3", title: "LinkedIn & Cover Letter", desc: "Optimasi profil LinkedIn & bikin cover letter personal tanpa ngetik ulang tiap kirim. (Modul 3)" },
  { day: "Day 4", title: "Deep Research", desc: "Riset perusahaan target pake framework PESTEL & competitive intelligence. (Modul 4)" },
  { day: "Day 5", title: "Interview Drill", desc: "Simulasi tanya jawab pake Voice AI. Latih mental biar gak a-u-a-u pas ditanya. (Modul 5)" },
  { day: "Day 6", title: "Portfolio & Polish", desc: "Review ulang skor CV di Builder, perbaiki weak points dari AI feedback, finalisasi semua dokumen lamaran." },
  { day: "Day 7", title: "Launch & Apply", desc: "Kirim lamaran ke target perusahaan hasil riset Day 4. Gunakan cover letter yang sudah dibuat, follow-up pakai template dari Prompt Library." },
];

export const Timeline: React.FC = () => {
  return (
    <section id="method" className="bg-card border-y-4 border-foreground py-16">
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="bg-neoCyan border-2 border-foreground px-3 py-1 font-display uppercase text-sm shadow-neoSm">Roadmap</span>
          <h2 className="font-display text-4xl uppercase mt-4">Sprint 7 Hari <br/> <span className="text-neoPink">Anti Wacana</span></h2>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-foreground md:-ml-0.5"></div>

          <div className="space-y-8">
            {days.map((item, index) => (
              <div key={index} className={`relative flex flex-col md:flex-row gap-8 items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-neoLime border-2 border-foreground rounded-full -ml-[6px] md:-ml-2 mt-6 z-10"></div>

                {/* Content Card */}
                <div className="ml-12 md:ml-0 md:w-1/2 px-4">
                  <div className={`bg-background border-4 border-foreground p-4 shadow-neo ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'} hover:-translate-y-1 transition-transform`}>
                    <span className="inline-block bg-foreground text-background font-body text-xs px-2 py-1 mb-2">{item.day}</span>
                    <h3 className="font-display text-xl uppercase mb-2">{item.title}</h3>
                    <p className="font-body text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
};
