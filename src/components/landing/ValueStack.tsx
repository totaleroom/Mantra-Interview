import React from 'react';
import { SectionWrapper } from './SectionWrapper';
import { CheckSquare, Wrench, BookOpen, Gift } from 'lucide-react';

const cards = [
{
  title: "Tools Siap Pakai",
  icon: Wrench,
  headerBg: "bg-neoBlack",
  headerText: "text-white",
  checkBg: "bg-neoPink",
  checkText: "",
  items: [
  "CV Builder + AI Scoring (ATS Checker)",
  "LinkedIn Prompt Optimizer",
  "Cover Letter Prompt Generator",
  "Interview Simulator (Voice AI)"]

},
{
  title: "5 Modul Intensif",
  icon: BookOpen,
  headerBg: "bg-neoCyan",
  headerText: "",
  checkBg: "bg-neoViolet",
  checkText: "text-white",
  items: [
  "Modul 1: Audit Diri & Mindset Reset",
  "Modul 2: CV ATS-Friendly Masterclass",
  "Modul 3: LinkedIn & Cover Letter Strategy",
  "Modul 4: Deep Research & Company Intel",
  "Modul 5: Interview Simulator & Mental Prep"]

},
{
  title: "Bonus & Support",
  icon: Gift,
  headerBg: "bg-neoLime",
  headerText: "",
  checkBg: "bg-neoCyan",
  checkText: "",
  items: [
  "Akses Penuh 90 Hari (3 Bulan)",
  "Update Materi Berkala",
  "Prompt AI Siap Copy-Paste (55+ Prompt)",
  "Sertifikat Completion 🔜"]

}];


export const ValueStack: React.FC = () => {
  return (
    <SectionWrapper id="value" className="relative !py-16">
      <div className="absolute top-0 left-0 w-full h-4 bg-[repeating-linear-gradient(90deg,hsl(var(--foreground)),hsl(var(--foreground))_20px,transparent_20px,transparent_40px)]"></div>
      
      <h2 className="font-display text-3xl md:text-4xl uppercase mb-4 text-center leading-tight">
        Apa Aja Yang Bakal <br />
        <span className="bg-neoPink px-3 py-1 border-2 border-foreground shadow-neoSm inline-block mt-2 rotate-1">Lo Dapetin?</span>
      </h2>
      <p className="text-center font-body text-sm text-muted-foreground mb-12 max-w-md mx-auto">Bukan cuma teori. Semua tools dan modul ini bisa langsung lo terapin dari hari pertama.

      </p>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {cards.map((card, ci) =>
        <div key={ci} className="bg-card border-4 border-foreground p-0 shadow-neoLg flex flex-col h-full hover:scale-[1.02] transition-transform duration-300">
            <div className={`${card.headerBg} p-5 border-b-4 border-foreground relative overflow-hidden`}>
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-white opacity-10 rounded-full"></div>
              <h3 className={`${card.headerText} font-display text-lg uppercase text-center tracking-wide flex items-center justify-center gap-2`}>
                <card.icon size={20} />
                {card.title}
              </h3>
            </div>
            <div className="p-6 flex-1 dot-pattern">
              <ul className="space-y-4">
                {card.items.map((item, idx) =>
              <li key={idx} className="flex items-start gap-3 group">
                    <div className={`mt-0.5 ${card.checkBg} border-2 border-foreground w-5 h-5 flex items-center justify-center shrink-0 shadow-neoSm group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all`}>
                      <CheckSquare size={12} strokeWidth={4} className={card.checkText} />
                    </div>
                    <span className="font-bold text-sm leading-snug">{item}</span>
                  </li>
              )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>);

};