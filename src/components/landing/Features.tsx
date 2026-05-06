import React from 'react';
import { FileText, Cpu, Clock } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

const features = [
{
  icon: FileText,
  title: "Bikin CV ATS-Friendly Yang Benar",
  desc: "Template CV ATS profesional dengan AI scoring & keyword optimization. Cek skor ATS instan — pastikan CV kamu lolos filter HRD.",
  color: "bg-neoLime"
},
{
  icon: Cpu,
  title: "LinkedIn Optimizer & Cover Letter Dengan AI",
  desc: "Optimasi profil LinkedIn biar dicari recruiter. Plus cover letter generator AI yang personal untuk setiap lowongan kerja.",
  color: "bg-neoCyan"
},
{
  icon: Clock,
  title: "Action Plan 7 Hari Dapat Kerja",
  desc: "Dari audit CV ATS sampai simulasi interview online. Semua terstruktur 7 hari. Gak usah mikir mau mulai dari mana.",
  color: "bg-neoPink"
}];


export const Features: React.FC = () => {
  return (
    <section id="features" className="bg-background border-b-4 border-foreground py-16">
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="bg-neoViolet text-white border-2 border-foreground px-3 py-1 font-display uppercase text-sm shadow-neoSm">MANTRA SKILL</span>
          <h2 className="font-display text-3xl md:text-4xl uppercase mt-4">
            Bikin CV ATS-Friendly <br /><span className="text-neoPink">Dalam 5 Menit.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) =>
          <div key={i} className="bg-card border-4 border-foreground p-6 shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all group">
              <div className={`${f.color} w-14 h-14 border-2 border-foreground flex items-center justify-center mb-4 shadow-neoSm group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all`}>
                <f.icon size={28} strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-lg uppercase mb-2">{f.title}</h3>
              <p className="font-body text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          )}
        </div>
      </SectionWrapper>
    </section>);

};