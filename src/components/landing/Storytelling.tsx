import React from 'react';
import { SectionWrapper } from './SectionWrapper';

export const Storytelling: React.FC = () => {
  return (
    <section className="bg-neoBlack text-background border-b-4 border-foreground py-16">
      <SectionWrapper>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/2">
            <h2 className="font-display text-3xl md:text-5xl uppercase leading-[0.9] text-neoLime mb-6">
              "Sarjana,<br />Kok Nganggur?"
            </h2>
            <div className="space-y-4 font-body text-lg text-gray-300">
              <p>Sakit dengernya? Lebih sakit lagi pas liat saldo ATM 0, atau pas buka LinkedIn isinya temen seumuran lo udah pada update "Started new position at...". Di tengah janji 19 juta lapangan kerja (katanya), lo ngapain? scrolling lowongan, menghayal, main game?</p>
              <p>Nih kamu udah kirim ratusan CV. Hasilnya?Di-ghostingin HRD. Bukan karena kamu gak mampu, tapi karena cara apply nya udah berubah.
                <span className="font-bold bg-neoPink px-1 text-foreground">Di-ghosting HRD.</span> Bukan karena kamu gak mampu — tapi karena <strong>cara main-nya udah berubah</strong>.
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 bg-background border-4 border-white p-6 shadow-[8px_8px_0px_0px_hsl(var(--neo-cyan))] rotate-1 text-foreground">
            <h3 className="font-display text-xl uppercase mb-4 border-b-2 border-foreground pb-2">MASALAHNYA KAMU BUKAN "BEGO"</h3>
            <ul className="space-y-3 font-medium">
              <li className="flex gap-3">
                <span className="text-destructive font-bold">✕</span>
                <span>CV kamu visualnya bagus, tapi gak kebaca mesin ATS.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive font-bold">✕</span>
                <span>Cover letter kamu hasil copy-paste.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive font-bold">✕</span>
                <span>Kamu ngabisin waktu berhari hari buat riset, padahal Mantra bisa kerjain itu 5 menit.</span>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t-2 border-dashed border-foreground">
              <p className="font-display text-center uppercase text-sm">YUK KITA BENERIN CARA MAINNYA SEKARANG.</p>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </section>);

};