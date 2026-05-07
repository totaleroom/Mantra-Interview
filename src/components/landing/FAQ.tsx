import React from 'react';
import { SectionWrapper } from './SectionWrapper';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
{
  q: "Gue udah kirim puluhan lamaran, hasilnya nol. Ini bisa bantu?",
  a: "Itu bukan nasib buruk, itu sistem yang salah. Sembilan dari sepuluh CV fresh grad langsung gugur sebelum mata HRD sempat baca, karena mesin filter menyaringnya lebih dulu. MantraSkill benerin itu dari akar: CV jadi ATS-friendly, LinkedIn muncul di radar recruiter, mental interview siap. Hasilnya bukan janji, tapi proses yang bisa lo jalanin sendiri."
},
{
  q: "Kenapa CV gue selalu di-ghosting padahal udah bagus?",
  a: "Karena bagus menurut lo bukan berarti lolos sistem. Filter otomatis perusahaan besar buang CV tanpa keyword yang tepat, bahkan sebelum satu orang pun sempat baca. Di MantraSkill, lo belajar cara nulis CV yang ngomong bahasa yang dimengerti mesin sekaligus bikin HRD langsung tertarik waktu baca."
},
{
  q: "Berapa lama sampai gue mulai dapet interview?",
  a: "Banyak alumni mulai dapet respon HRD dalam 1 sampai 2 minggu setelah selesai sprint. Ada yang lebih cepat, tergantung industri dan seberapa serius lo jalanin setiap step-nya. Yang pasti, kalau lo terus kirim CV dengan cara yang sama, hasilnya akan tetap sama. Sprint ini memutus siklus itu."
},
{
  q: "Ini cocok buat gue yang fresh grad banget, pengalaman nol?",
  a: "Justru ini dibuat buat kondisi lo. MantraSkill ngajarin cara framing pengalaman yang lo punya, sekecil apapun itu, supaya keliatan relevan di mata recruiter. Proyek kuliah, magang singkat, organisasi, volunteer, semuanya bisa dikemas dengan benar. Pengalaman nol bukan halangan kalau lo tahu cara presentasinnya."
},
{
  q: "Kalau gue sama sekali gak ngerti AI gimana?",
  a: "Semua prompt sudah disiapkan, tinggal copy, paste, sesuaikan. Gak perlu ngerti cara kerja AI. Lo cuma butuh ChatGPT gratis dan kemauan untuk mulai. Sisanya, MantraSkill yang guide step by step."
},
{
  q: "Apakah AI benar-benar bisa bantu cari kerja?",
  a: "Sangat bisa. AI bisa analisis CV lo vs job desc dalam 30 detik, generate cover letter yang personal bukan generik, simulasi interview dengan feedback instan, dan riset perusahaan yang bikin lo keliatan sudah persiapan di mata interviewer. Yang paham cara pakai AI punya keunggulan nyata sekarang. MantraSkill ngajarin cara pakainya."
},
{
  q: "MantraSkill vs nunggu janji lapangan kerja dari pemerintah?",
  a: "Mereka janji 19 juta lapangan kerja. Lo nunggu. Sementara itu, teman lo yang ambil kendali karirnya sendiri sudah mulai dapet panggilan interview. MantraSkill bukan solusi politis. Ini langkah pribadi. Lo gak perlu nunggu siapapun untuk mulai."
},
{
  q: "Ini beneran gratis? Gak ada biaya tersembunyi?",
  a: "100% gratis. Daftar akun, langsung akses semua modul, CV Builder, CV Checker, LinkedIn Optimizer, Cover Letter Generator, dan 55+ prompt AI. Gak ada paywall, gak ada langganan, gak ada kartu kredit. Misi kita sederhana: bantu sebanyak mungkin pencari kerja Indonesia punya CV yang bener dan mindset yang tepat."
}];


export const FAQ: React.FC = () => {
  return (
    <section id="faq" className="bg-card border-y-4 border-foreground py-16">
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="bg-neoLime border-2 border-foreground px-3 py-1 font-display uppercase text-sm shadow-neoSm">FAQ</span>
          <h2 className="font-display text-3xl md:text-4xl uppercase mt-4">
            Yang Sering <span className="text-neoPink">Ditanya</span>
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-2 max-w-md mx-auto">Kebanyakan nanya lo...

          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) =>
          <AccordionItem key={i} value={`item-${i}`} className="border-4 border-foreground bg-background shadow-neo data-[state=open]:shadow-none data-[state=open]:translate-x-[4px] data-[state=open]:translate-y-[4px] transition-all">
              <AccordionTrigger className="px-6 py-4 font-display text-sm md:text-base uppercase text-left hover:no-underline hover:text-neoPink">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 font-body text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </SectionWrapper>
    </section>);

};