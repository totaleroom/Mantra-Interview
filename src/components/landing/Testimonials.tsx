import React from 'react';
import { SectionWrapper } from './SectionWrapper';
import { Star, CheckCircle2 } from 'lucide-react';

const reviews = [
{
  name: "Raka, 24",
  role: "Korban Layoff Tech",
  text: "Porto gue bagus, tapi CV gue ancur layoutnya. Pas dibenerin pake format Mantra + cek skor ATS, baru sadar font gue ga kebaca mesin. Seminggu abis itu dapet 2 offering.",
  highlight: "Dapet 2 Offering"
},
{
  name: "Dinda, 22",
  role: "Admin -> Content Writer",
  text: "Takut banget pas mau switch career. Pake cheat sheet interview-nya, gue bisa jawab pertanyaan teknis soal SEO padahal baru belajar. User-nya sampe ngangguk-ngangguk pas gue jawab.",
  highlight: "Lolos User Interview"
},
{
  name: "Fajar, 26",
  role: "Sales Otomotif",
  text: "Iseng beli karena murah. Ternyata trik 'Deep Research' perusahaan pake AI-nya daging banget. Gue jadi tau pain point perusahaan sebelum ngelamar. Ini cheat code sih.",
  highlight: "Riset 5 Menit Beres"
},
{
  name: "Sisi, 23",
  role: "Fresh Grad Hukum",
  text: "Sempet skeptis, kirain isinya cuma prompt ChatGPT biasa. Ternyata strukturnya rapi banget day-by-day. Ga pusing mikir mau mulai darimana. Worth every rupiah.",
  highlight: "Struktur Jelas"
}];


const blurredReviews = [
{
  name: "Aldi, 25",
  role: "Fresh Grad Teknik",
  text: "Gue fresh grad yang ngelamar udah 3 bulan ga ada panggilan. Setelah revisi CV pake AI scoring dan improve bullet points, langsung dipanggil 4 perusahaan dalam 2 minggu.",
  highlight: "Dipanggil 4 Perusahaan"
},
{
  name: "Mega, 27",
  role: "CS -> Marketing",
  text: "Dari customer service mau pindah ke marketing. Pake prompt LinkedIn optimizer, profil gue langsung dilirik recruiter. Dapet role marketing dengan gaji naik 40%.",
  highlight: "Gaji Naik 40%"
},
{
  name: "Rizky, 23",
  role: "Bootcamp Graduate",
  text: "Lulusan bootcamp coding yang struggle dapet kerja. Deep research framework-nya bikin gue tau persis apa yang dicari perusahaan. Langsung dapet offering di company kedua yang gue lamar.",
  highlight: "Langsung Dapet Offering"
},
{
  name: "Nadia, 24",
  role: "Gap Year 1 Tahun",
  text: "Setahun gap year bikin gue minder. Modul mindset reset-nya ngebantu banget framing pengalaman gap year jadi positif di interview. Sekarang udah balik ke track.",
  highlight: "Balik ke Track"
}];


const ReviewCard = ({ r, i, className = '' }: {r: typeof reviews[0];i: number;className?: string;}) =>
<div className={`relative bg-card border-4 border-foreground p-6 shadow-neo group ${className}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-0.5 text-neoPink">
        {[...Array(5)].map((_, j) => <Star key={j} size={18} fill="currentColor" strokeWidth={2} className="text-foreground" />)}
      </div>
      <div className="bg-gray-100 px-2 py-1 rounded border border-foreground text-[10px] font-bold uppercase tracking-wide">Verified Buyer</div>
    </div>
    
    <p className="font-body font-medium text-lg mb-6 leading-relaxed">"{r.text}"</p>
    
    <div className="flex items-center gap-4 border-t-2 border-foreground pt-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border-2 border-foreground flex items-center justify-center font-display text-sm">
        {r.name.charAt(0)}
      </div>
      <div>
        <p className="font-display text-sm uppercase">{r.name}</p>
        <div className="flex items-center gap-1">
          <p className="font-body text-xs text-muted-foreground font-bold">{r.role}</p>
          {i < 2 && <CheckCircle2 size={12} className="text-blue-500" />}
        </div>
      </div>
    </div>
    
    <div className="absolute -right-2 -bottom-2 bg-neoLime border-2 border-foreground px-2 py-1 text-[10px] font-black uppercase rotate-3">
      {r.highlight}
    </div>
  </div>;


export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-background border-y-4 border-foreground relative">
      {/* Decorative BG */}
      <div className="absolute top-10 left-0 w-24 h-24 bg-neoCyan rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-10 right-0 w-24 h-24 bg-neoPink rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="bg-foreground text-background px-3 py-1 text-sm font-body uppercase transform -rotate-2 inline-block mb-4">YANG SERIUS NYARI KERJA.</span>
          <h2 className="font-display text-3xl md:text-4xl uppercase leading-tight">
            Bukan Testimoni <br /> <span className="bg-neoLime px-2 border-2 border-foreground">Tapi Pencapaian</span>
          </h2>
        </div>

        {/* Main testimonials */}
        <div className="grid md:grid-cols-2 gap-6 relative z-10">
          {reviews.map((r, i) =>
          <ReviewCard key={i} r={r} i={i} />
          )}
        </div>

        {/* Blurred overflow testimonials */}
        <div className="relative mt-6 pointer-events-none select-none">
          {/* Row with blur effect */}
          <div className="grid md:grid-cols-2 gap-6" style={{ filter: 'blur(2px)', opacity: 0.6 }}>
            {blurredReviews.slice(0, 2).map((r, i) =>
            <ReviewCard key={i} r={r} i={i + 4} />
            )}
          </div>

          {/* Partially visible row with stronger blur */}
          <div className="grid md:grid-cols-2 gap-6 mt-6 max-h-[120px] overflow-hidden" style={{ filter: 'blur(5px)', opacity: 0.3 }}>
            {blurredReviews.slice(2, 4).map((r, i) =>
            <ReviewCard key={i} r={r} i={i + 6} />
            )}
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

          {/* Badge */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
            <span className="bg-foreground text-background font-display text-xs md:text-sm uppercase px-4 py-2 border-2 border-foreground shadow-neoSm">
              Dan 800+ review lainnya...
            </span>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-widest">Dan 800+ alumni sprint lainnya...</p>
        </div>
      </SectionWrapper>
    </section>);

};