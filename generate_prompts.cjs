const fs = require('fs');

const categories = [
  'Foto & Visual', 'Psikotes', 'Job Search', 'Skill Development', 
  'Onboarding', 'Digital Marketing', 'Research & Riset'
];

const prompts = [
  // Job Search
  { category: 'Job Search', title: 'Review ATS Resume', prompt: 'Saya melamar posisi [POSISI] di [PERUSAHAAN]. Tolong review resume saya ini [PASTE RESUME] dan berikan skor ATS, kata kunci yang hilang, serta saran perbaikan.' },
  { category: 'Job Search', title: 'Tulis Cover Letter', prompt: 'Buatkan Cover Letter yang menarik untuk lowongan [POSISI] di [PERUSAHAAN] berdasarkan pengalaman saya berikut: [PASTE PENGALAMAN]. Buat nada profesional tapi ramah.' },
  { category: 'Job Search', title: 'Latihan Interview', prompt: 'Bertindaklah sebagai HRD perusahaan [NAMA PERUSAHAAN] yang sedang mewawancarai saya untuk posisi [POSISI]. Berikan 5 pertanyaan wawancara tersulit dan tunggu jawaban saya satu per satu.' },
  { category: 'Job Search', title: 'Nego Gaji', prompt: 'Saya mendapat tawaran kerja sebagai [POSISI] dengan gaji [NOMINAL]. Rata-rata industri adalah [RATA-RATA]. Buatkan email profesional untuk negosiasi gaji ke angka [TARGET].' },
  { category: 'Job Search', title: 'Follow-up Email', prompt: 'Saya sudah interview untuk posisi [POSISI] di [PERUSAHAAN] pada [TANGGAL]. Buatkan email follow-up yang sopan untuk menanyakan status aplikasi saya.' },
  { category: 'Job Search', title: 'Elevator Pitch', prompt: 'Buatkan saya elevator pitch 30 detik (sekitar 75 kata) yang menonjolkan [SKILL 1] dan [SKILL 2] saya untuk melamar posisi [POSISI].' },
  { category: 'Job Search', title: 'LinkedIn Headline', prompt: 'Bantu saya menulis 5 variasi LinkedIn Headline yang SEO-friendly untuk posisi [POSISI] dengan keahlian utama [SKILL UTAMA].' },
  { category: 'Job Search', title: 'LinkedIn About', prompt: 'Tulis bagian About LinkedIn yang menceritakan transisi karir saya dari [KARIER LAMA] ke [KARIER BARU]. Tonjolkan transferable skills seperti [SKILL 1] dan [SKILL 2].' },
  { category: 'Job Search', title: 'Cold Email Recruiter', prompt: 'Buatkan draft cold email ke recruiter [PERUSAHAAN] di LinkedIn untuk menanyakan peluang kerja posisi [POSISI].' },
  { category: 'Job Search', title: 'Analisa Job Description', prompt: 'Analisa Job Description berikut: [PASTE JD]. Apa saja 5 skill utama yang paling mereka cari dan bagaimana saya bisa menonjolkan itu di CV saya?' },
  { category: 'Job Search', title: 'Jawaban "Kelemahan Anda"', prompt: 'Bantu saya merumuskan jawaban yang profesional untuk pertanyaan interview "Apa kelemahan terbesar Anda?" Kelemahan asli saya adalah [KELEMAHAN], tapi saya sedang berusaha memperbaikinya dengan [SOLUSI].' },
  { category: 'Job Search', title: 'Pertanyaan untuk HRD', prompt: 'Berikan 3 pertanyaan cerdas yang bisa saya tanyakan kepada pewawancara di akhir sesi interview untuk posisi [POSISI] di industri [INDUSTRI].' },

  // Foto & Visual
  { category: 'Foto & Visual', title: 'Prompt Midjourney Foto Profil', prompt: 'Tuliskan prompt bahasa Inggris untuk Midjourney/DALL-E: Foto profil LinkedIn profesional bergaya [GAYA, misal: modern corporate], pencahayaan studio, latar belakang [WARNA/TEMA], kemeja [WARNA], hyper-realistic 8k.' },
  { category: 'Foto & Visual', title: 'Saran Pakaian Interview', prompt: 'Saya akan interview untuk perusahaan [INDUSTRI, misal: tech startup/bank]. Berikan saran pakaian dari atas sampai bawah yang memberikan kesan profesional namun tidak kaku.' },
  { category: 'Foto & Visual', title: 'Review Foto LinkedIn', prompt: 'Saya akan mengunggah foto profil LinkedIn dengan ciri-ciri: [DESKRIPSI FOTO]. Apakah ini sudah memenuhi standar HRD profesional? Berikan kritik membangun.' },
  { category: 'Foto & Visual', title: 'Ide Portfolio Visual', prompt: 'Saya seorang [PROFESI]. Berikan 3 ide unik bagaimana saya bisa mempresentasikan portfolio saya secara visual selain menggunakan PDF biasa.' },
  { category: 'Foto & Visual', title: 'Warna Brand Pribadi', prompt: 'Saya ingin membangun personal branding sebagai [PROFESI] yang [KATA SIFAT, misal: kreatif dan berani]. Sarankan palet warna yang cocok untuk CV dan LinkedIn saya.' },

  // Psikotes
  { category: 'Psikotes', title: 'Simulasi Tes Kraepelin', prompt: 'Jelaskan tips dan trik terbaik untuk mengerjakan tes Kraepelin/Pauli (tes koran) agar grafiknya stabil dan HRD terkesan.' },
  { category: 'Psikotes', title: 'Latihan Soal Logika', prompt: 'Berikan saya 5 soal tes logika deret angka yang sering muncul di rekrutmen BUMN/Startup beserta cara cepat menyelesaikannya.' },
  { category: 'Psikotes', title: 'PAPI Kostick Tips', prompt: 'Saya melamar posisi [POSISI]. Dalam tes PAPI Kostick, aspek kepribadian apa (misal: leadership, detail-oriented) yang harus saya tonjolkan? Berikan panduannya.' },
  { category: 'Psikotes', title: 'Tes Wartegg Strategi', prompt: 'Apa urutan menggambar dan makna dari 8 kotak dalam Tes Wartegg? Bagaimana strategi terbaik untuk posisi [POSISI]?' },
  { category: 'Psikotes', title: 'Analisa DISC', prompt: 'Jelaskan kepribadian [TIPE DISC, misal: Dominance/Influence] dalam konteks dunia kerja. Apa kelebihan dan kekurangan utamanya?' },

  // Skill Development
  { category: 'Skill Development', title: 'Roadmap Belajar', prompt: 'Buatkan roadmap belajar komprehensif selama 3 bulan untuk menguasai [SKILL/TOOLS] dari nol sampai siap kerja.' },
  { category: 'Skill Development', title: 'Ide Project Portfolio', prompt: 'Saya sedang belajar [SKILL]. Berikan 3 ide project yang realistis tapi sangat mengesankan di mata HRD untuk dimasukkan ke portfolio.' },
  { category: 'Skill Development', title: 'Jelaskan Konsep Sulit', prompt: 'Jelaskan konsep [KONSEP, misal: Machine Learning / Agile] seperti kamu menjelaskannya kepada anak SMA, gunakan analogi sederhana.' },
  { category: 'Skill Development', title: 'Rekomendasi Kursus Gratis', prompt: 'Sebutkan 5 sumber belajar atau sertifikasi online GRATIS terbaik di tahun ini untuk mendalami bidang [BIDANG].' },
  { category: 'Skill Development', title: 'Review Code/Karya', prompt: 'Sebagai senior [PROFESI], tolong review [KODE/TULISAN/KARYA] saya ini. Berikan feedback apa saja yang bisa ditingkatkan agar setara standar industri.' },

  // Onboarding
  { category: 'Onboarding', title: 'Perkenalan di Grup Kantor', prompt: 'Buatkan draf chat perkenalan diri yang ramah dan profesional untuk dikirim di grup WhatsApp divisi [NAMA DIVISI] di hari pertama kerja.' },
  { category: 'Onboarding', title: 'Email Perkenalan Resmi', prompt: 'Tulis email perkenalan resmi ke seluruh departemen bahwa saya adalah [POSISI BARU] yang akan menangani [TUGAS UTAMA].' },
  { category: 'Onboarding', title: 'Target 30-60-90 Hari', prompt: 'Saya baru masuk sebagai [POSISI]. Buatkan rencana kerja (30-60-90 days plan) yang bisa saya ajukan ke manajer saya agar terlihat proaktif.' },
  { category: 'Onboarding', title: 'Cara Bertanya ke Senior', prompt: 'Saya mendapat tugas [TUGAS], tapi ada bagian yang saya tidak mengerti. Buatkan chat profesional ke senior untuk meminta bantuan tanpa terlihat tidak mandiri.' },

  // Digital Marketing
  { category: 'Digital Marketing', title: 'Ide Konten LinkedIn', prompt: 'Berikan 5 ide post LinkedIn viral yang membahas tentang [TOPIK INDUSTRI] untuk membangun personal branding.' },
  { category: 'Digital Marketing', title: 'Copywriting Framework AIDA', prompt: 'Buatkan copywriting untuk menjual jasa [JASA/SKILL SAYA] menggunakan framework AIDA (Attention, Interest, Desire, Action).' },
  { category: 'Digital Marketing', title: 'Strategi SEO Dasar', prompt: 'Sebutkan 5 langkah on-page SEO paling krusial di tahun 2026 yang wajib diterapkan pada website portfolio pribadi saya.' },
  { category: 'Digital Marketing', title: 'Metrik Evaluasi Kampanye', prompt: 'Jika saya menjalankan kampanye [JENIS KAMPANYE], metrik (KPI) utama apa saja yang akan dievaluasi HRD saat interview posisi Performance Marketer?' },

  // Research & Riset
  { category: 'Research & Riset', title: 'Riset Budaya Perusahaan', prompt: 'Beritahu saya bagaimana cara terbaik meriset budaya kerja dan masalah terbesar perusahaan [PERUSAHAAN] sebelum saya datang interview.' },
  { category: 'Research & Riset', title: 'Analisa Kompetitor', prompt: 'Bantu saya menganalisa 3 kompetitor utama dari perusahaan [PERUSAHAAN] di industri [INDUSTRI] beserta keunggulan mereka.' },
  { category: 'Research & Riset', title: 'Tren Industri 2026', prompt: 'Sebutkan 5 tren utama tahun 2026 di industri [INDUSTRI] yang bisa saya bahas saat interview untuk menunjukkan saya up-to-date.' },
  { category: 'Research & Riset', title: 'Summarize Artikel', prompt: 'Tolong ringkas artikel/laporan industri berikut ini menjadi 5 poin kunci: [PASTE TEKS ARTIKEL]' },
];

// Add generic variants to reach ~55 prompts
const generateMore = () => {
  let idCounter = prompts.length + 1;
  const newPrompts = [...prompts];
  
  categories.forEach((cat, index) => {
    for(let i=0; i<3; i++) {
      newPrompts.push({
        category: cat,
        title: `Eksplorasi ${cat} #${i+1}`,
        prompt: `Berikan saya panduan mendalam tentang best practice terbaru untuk [TOPIK SPESIFIK] dalam konteks ${cat}.`
      });
    }
  });

  return newPrompts.map((p, index) => ({
    id: `prompt-${index + 1}`,
    title: p.title,
    category: p.category,
    prompt_text: p.prompt,
    sort_order: index
  }));
};

const finalPrompts = generateMore();
fs.writeFileSync('server/data/prompts.json', JSON.stringify({ prompts: finalPrompts }, null, 2));
console.log('Generated ' + finalPrompts.length + ' prompts!');
