// Module 5 interview question bank - kept client-side for the InterviewSimulator component

export interface InterviewQuestion {
  id: string;
  category: 'behavioral' | 'situational' | 'self-awareness' | 'motivational';
  question: string;
  context: string;
  requiredKeywords: string[];
  bonusKeywords: string[];
  redFlags: string[];
  idealStructure: string;
  feedbackTemplates: {
    good: string;
    average: string;
    poor: string;
  };
}

export const interviewQuestions: InterviewQuestion[] = [
  // BEHAVIORAL
  {
    id: 'b1',
    category: 'behavioral',
    question: 'Ceritakan pengalaman kamu menghadapi deadline yang sangat ketat. Bagaimana kamu menanganinya?',
    context: 'Interviewer ingin melihat kemampuan time management dan kerja di bawah tekanan.',
    requiredKeywords: ['situasi', 'deadline', 'langkah', 'hasil', 'waktu', 'prioritas', 'tugas', 'target'],
    bonusKeywords: ['data', 'metrik', 'tim', 'delegasi', 'efisiensi', 'strategi', 'berhasil', 'persen'],
    redFlags: ['tidak tau', 'mungkin', 'kayaknya', 'lupa', 'nggak pernah', 'biasa aja'],
    idealStructure: 'Gunakan STAR: Situation → Task → Action → Result',
    feedbackTemplates: {
      good: 'Jawaban sangat baik! Kamu menjelaskan situasi dengan jelas, langkah-langkah konkret yang diambil, dan hasil yang terukur. Struktur STAR terlihat.',
      average: 'Jawaban cukup baik, tapi coba tambahkan hasil yang lebih terukur (angka/persentase) dan jelaskan langkah spesifik yang KAMU ambil, bukan tim secara umum.',
      poor: 'Jawaban perlu diperkuat. Tips: Ceritakan satu kejadian SPESIFIK, jelaskan apa yang KAMU lakukan (bukan tim), dan sebutkan HASIL nyata dari tindakanmu.',
    },
  },
  {
    id: 'b2',
    category: 'behavioral',
    question: 'Ceritakan saat kamu harus bekerja dalam tim yang anggotanya sulit diajak kerjasama. Apa yang kamu lakukan?',
    context: 'Interviewer menilai kemampuan interpersonal dan conflict resolution.',
    requiredKeywords: ['tim', 'komunikasi', 'masalah', 'solusi', 'diskusi', 'kesepakatan', 'hasil'],
    bonusKeywords: ['empati', 'mendengarkan', 'kompromi', 'mediasi', 'proaktif', 'inisiatif'],
    redFlags: ['salah mereka', 'saya benar', 'males', 'nggak peduli', 'bodo amat'],
    idealStructure: 'Gunakan STAR: Situation → Task → Action → Result',
    feedbackTemplates: {
      good: 'Excellent! Kamu menunjukkan empati, pendekatan komunikatif, dan fokus pada solusi bukan menyalahkan. Ini yang dicari interviewer.',
      average: 'Cukup baik. Coba lebih tekankan BAGAIMANA kamu berkomunikasi dan apa HASIL AKHIR dari upayamu menyelesaikan konflik.',
      poor: 'Jawaban perlu lebih fokus pada AKSi yang kamu ambil untuk menyelesaikan masalah. Hindari menyalahkan orang lain — interviewer ingin melihat solusi, bukan keluhan.',
    },
  },
  {
    id: 'b3',
    category: 'behavioral',
    question: 'Berikan contoh saat kamu mengambil inisiatif untuk menyelesaikan masalah tanpa diminta.',
    context: 'Interviewer menilai proaktivitas dan ownership.',
    requiredKeywords: ['inisiatif', 'masalah', 'solusi', 'aksi', 'hasil', 'tanpa diminta', 'ide'],
    bonusKeywords: ['improvement', 'efisiensi', 'dampak', 'proses', 'inovasi', 'otomatis'],
    redFlags: ['disuruh', 'terpaksa', 'nggak mau', 'malas'],
    idealStructure: 'Gunakan STAR: Situation → Task → Action → Result',
    feedbackTemplates: {
      good: 'Jawaban kuat! Kamu menunjukkan proaktivitas dan ownership yang jelas. Interviewer akan terkesan dengan inisiatif ini.',
      average: 'Bagus, tapi coba perkuat dengan menjelaskan DAMPAK dari inisiatifmu. Berapa banyak waktu/uang yang dihemat? Siapa yang terbantu?',
      poor: 'Coba ceritakan satu kejadian konkret di mana KAMU yang memulai, bukan disuruh. Jelaskan masalah → aksi → hasil.',
    },
  },
  {
    id: 'b4',
    category: 'behavioral',
    question: 'Ceritakan pengalaman saat kamu membuat kesalahan di pekerjaan atau proyek. Bagaimana kamu mengatasinya?',
    context: 'Interviewer menilai accountability dan kemampuan belajar dari kesalahan.',
    requiredKeywords: ['kesalahan', 'mengakui', 'belajar', 'perbaiki', 'solusi', 'tanggung jawab'],
    bonusKeywords: ['preventif', 'sistem', 'proses', 'tidak terulang', 'refleksi', 'grow'],
    redFlags: ['bukan salah saya', 'tidak pernah salah', 'orang lain yang salah'],
    idealStructure: 'Gunakan STAR: Situation → Task → Action → Result + Lesson Learned',
    feedbackTemplates: {
      good: 'Sangat matang! Kamu menunjukkan accountability, mengakui kesalahan, dan menjelaskan apa yang kamu pelajari. Ini menunjukkan growth mindset.',
      average: 'Cukup baik. Tambahkan apa LESSON LEARNED yang kamu ambil dan langkah PREVENTIF agar tidak terulang.',
      poor: 'Tips: Interviewer INGIN mendengar kamu pernah salah — itu menunjukkan kejujuran. Yang penting adalah bagaimana kamu MENGATASI dan BELAJAR darinya.',
    },
  },
  {
    id: 'b5',
    category: 'behavioral',
    question: 'Ceritakan pengalaman saat kamu harus mempelajari sesuatu yang benar-benar baru dalam waktu singkat.',
    context: 'Interviewer menilai learning agility dan adaptability.',
    requiredKeywords: ['belajar', 'baru', 'cepat', 'cara', 'hasil', 'proses', 'waktu'],
    bonusKeywords: ['mentor', 'resource', 'praktek', 'berhasil', 'diterapkan', 'skill'],
    redFlags: ['nggak bisa', 'terlalu sulit', 'menyerah'],
    idealStructure: 'Gunakan STAR: Situation → Task → Action → Result',
    feedbackTemplates: {
      good: 'Bagus sekali! Kamu menunjukkan learning agility — kemampuan belajar cepat yang sangat dihargai employer.',
      average: 'Cukup. Jelaskan lebih detail METODE belajarmu dan HASIL yang dicapai setelah mempelajari hal baru tersebut.',
      poor: 'Coba ceritakan langkah-langkah spesifik yang kamu ambil untuk belajar — sumber apa yang kamu gunakan? Berapa lama? Apa hasilnya?',
    },
  },
  // SITUATIONAL
  {
    id: 's1',
    category: 'situational',
    question: 'Jika atasan kamu memberikan instruksi yang menurut kamu kurang tepat, apa yang akan kamu lakukan?',
    context: 'Interviewer menilai kemampuan komunikasi, diplomasi, dan critical thinking.',
    requiredKeywords: ['diskusi', 'alasan', 'data', 'hormati', 'solusi', 'alternatif', 'profesional'],
    bonusKeywords: ['fakta', 'pendekatan', 'perspektif', 'privat', 'konstruktif', 'respectful'],
    redFlags: ['ikut aja', 'nggak berani', 'diam', 'terserah', 'bos selalu benar'],
    idealStructure: 'Jelaskan pendekatan step-by-step: understand → prepare → communicate → respect decision',
    feedbackTemplates: {
      good: 'Jawaban diplomatik dan profesional! Kamu menunjukkan kemampuan berpikir kritis sambil tetap menghormati hierarki.',
      average: 'Cukup baik. Coba tekankan bahwa kamu akan menyampaikan dengan DATA/FAKTA dan di tempat yang PRIVAT (bukan di depan tim).',
      poor: 'Tips: Jangan jawab "ikut aja" — itu menunjukkan tidak punya critical thinking. Juga jangan "langsung bantah" — itu menunjukkan tidak ada diplomasi.',
    },
  },
  {
    id: 's2',
    category: 'situational',
    question: 'Bagaimana jika kamu diberi dua tugas penting dengan deadline yang sama? Mana yang kamu prioritaskan?',
    context: 'Interviewer menilai prioritization dan decision-making.',
    requiredKeywords: ['prioritas', 'dampak', 'urgency', 'komunikasi', 'atasan', 'rencana'],
    bonusKeywords: ['matrix', 'eisenhower', 'delegasi', 'negosiasi', 'deadline', 'stakeholder'],
    redFlags: ['panik', 'bingung', 'nggak tau', 'serah aja', 'lembur aja'],
    idealStructure: 'Framework: Assess impact → Communicate → Prioritize → Execute',
    feedbackTemplates: {
      good: 'Excellent! Kamu menunjukkan framework prioritisasi yang jelas dan proaktif berkomunikasi dengan atasan.',
      average: 'Cukup. Coba tambahkan bahwa kamu akan KOMUNIKASIKAN ke atasan tentang situasinya dan minta guidance tentang prioritas.',
      poor: 'Tips: Jawab dengan framework — assess mana yang DAMPAK-nya lebih besar, komunikasikan ke atasan, dan buat rencana eksekusi.',
    },
  },
  {
    id: 's3',
    category: 'situational',
    question: 'Jika kamu baru masuk tim dan merasa pendapatmu tidak didengar, apa yang akan kamu lakukan?',
    context: 'Interviewer menilai resilience dan kemampuan adaptasi di lingkungan baru.',
    requiredKeywords: ['adaptasi', 'bukti', 'kontribusi', 'sabar', 'trust', 'kerja', 'nilai'],
    bonusKeywords: ['small wins', 'proaktif', 'hubungan', 'mendengar', 'observasi'],
    redFlags: ['resign', 'diam aja', 'nggak peduli', 'kesel'],
    idealStructure: 'Approach: Observe → Build trust → Contribute → Earn respect',
    feedbackTemplates: {
      good: 'Jawaban matang! Kamu menunjukkan kesabaran dan strategi untuk membangun trust dan credibility secara bertahap.',
      average: 'Cukup baik. Tambahkan strategi konkret: mulai dari SMALL WINS, tunjukkan HASIL kerja, dan bangun HUBUNGAN personal.',
      poor: 'Tips: Jangan jawab "diam aja" atau "resign". Tunjukkan bahwa kamu akan BUILD TRUST melalui kontribusi nyata sambil tetap sabar.',
    },
  },
  {
    id: 's4',
    category: 'situational',
    question: 'Bagaimana kamu menangani situasi di mana kamu harus menyampaikan berita buruk kepada klien atau stakeholder?',
    context: 'Interviewer menilai komunikasi profesional dan crisis management.',
    requiredKeywords: ['jujur', 'solusi', 'langkah', 'komunikasi', 'empati', 'rencana'],
    bonusKeywords: ['proaktif', 'transparansi', 'alternatif', 'tanggung jawab', 'follow-up'],
    redFlags: ['bohong', 'sembunyikan', 'blame', 'hindari'],
    idealStructure: 'Framework: Prepare → Deliver honestly → Offer solution → Follow up',
    feedbackTemplates: {
      good: 'Jawaban profesional! Kamu menunjukkan kejujuran, empati, dan fokus pada solusi — kombinasi yang sangat dihargai.',
      average: 'Cukup. Coba tekankan bahwa kamu akan menyampaikan dengan JUJUR tapi juga menyiapkan SOLUSI atau ALTERNATIF.',
      poor: 'Tips: Kunci menyampaikan berita buruk: jujur + empati + solusi. Jangan sembunyi atau blame orang lain.',
    },
  },
  {
    id: 's5',
    category: 'situational',
    question: 'Jika kamu menyadari bahwa proyek yang sedang kamu kerjakan tidak akan selesai tepat waktu, apa yang kamu lakukan?',
    context: 'Interviewer menilai proaktivitas dan problem-solving.',
    requiredKeywords: ['komunikasi', 'atasan', 'rencana', 'prioritas', 'solusi', 'alternatif'],
    bonusKeywords: ['proaktif', 'early warning', 'adjustment', 'resource', 'negosiasi'],
    redFlags: ['diam', 'sembunyikan', 'lembur terus', 'panik'],
    idealStructure: 'Framework: Identify early → Communicate → Propose alternatives → Execute',
    feedbackTemplates: {
      good: 'Sangat baik! Kamu menunjukkan proaktivitas — memberitahu lebih awal dan menyiapkan alternatif.',
      average: 'Cukup. Poin pentingnya adalah JANGAN TUNGGU sampai deadline — komunikasikan SEGERA dan tawarkan ALTERNATIF.',
      poor: 'Tips: Jangan diam dan berharap semuanya baik-baik saja. Proaktif komunikasikan ke atasan SEGERA dengan alternatif solusi.',
    },
  },
  // SELF-AWARENESS
  {
    id: 'sa1',
    category: 'self-awareness',
    question: 'Apa kelemahan terbesar kamu dan bagaimana kamu mengatasinya?',
    context: 'Interviewer menilai self-awareness dan growth mindset. JANGAN jawab "perfeksionis".',
    requiredKeywords: ['kelemahan', 'sadar', 'langkah', 'perbaiki', 'belajar', 'proses'],
    bonusKeywords: ['feedback', 'mentor', 'progress', 'konsisten', 'strategi', 'improve'],
    redFlags: ['nggak ada kelemahan', 'perfeksionis', 'terlalu rajin', 'terlalu baik'],
    idealStructure: 'Format: Acknowledge → Steps to improve → Progress made',
    feedbackTemplates: {
      good: 'Jawaban jujur dan menunjukkan growth mindset! Kamu mengakui kelemahan nyata dan menjelaskan langkah konkret untuk memperbaikinya.',
      average: 'Cukup. Pastikan kelemahan yang kamu sebut itu NYATA (bukan "perfeksionis") dan jelaskan LANGKAH KONKRET yang sudah kamu ambil.',
      poor: 'Tips: Jangan bilang "tidak punya kelemahan" atau "terlalu perfeksionis" — interviewer sudah dengar itu 1000 kali. Sebutkan kelemahan NYATA + langkah perbaikan.',
    },
  },
  {
    id: 'sa2',
    category: 'self-awareness',
    question: 'Bagaimana rekan kerja atau teman-temanmu mendeskripsikan kamu?',
    context: 'Interviewer menilai self-awareness dan konsistensi karakter.',
    requiredKeywords: ['rekan', 'feedback', 'karakter', 'sifat', 'contoh'],
    bonusKeywords: ['konsisten', 'terbuka', 'reliable', 'supportive', 'jujur', 'bukti'],
    redFlags: ['nggak tau', 'nggak pernah tanya', 'pasti bilang saya baik'],
    idealStructure: 'Format: Trait + Evidence/Example dari rekan',
    feedbackTemplates: {
      good: 'Bagus! Kamu memberikan deskripsi yang specific dan didukung contoh nyata.',
      average: 'Cukup. Coba tambahkan CONTOH KONKRET yang mendukung sifat yang kamu sebutkan.',
      poor: 'Tips: Jangan menjawab generik. Sebutkan 2-3 sifat dan berikan CONTOH kapan sifat itu terlihat menurut orang lain.',
    },
  },
  {
    id: 'sa3',
    category: 'self-awareness',
    question: 'Apa pencapaian profesional yang paling kamu banggakan dan kenapa?',
    context: 'Interviewer menilai values dan apa yang memotivasi kamu.',
    requiredKeywords: ['pencapaian', 'bangga', 'karena', 'dampak', 'usaha', 'hasil'],
    bonusKeywords: ['tim', 'growth', 'tantangan', 'belajar', 'metrik', 'angka'],
    redFlags: ['nggak ada', 'biasa aja', 'nggak pernah'],
    idealStructure: 'Format: Achievement + Why it matters + Impact',
    feedbackTemplates: {
      good: 'Excellent! Kamu menceritakan pencapaian dengan konteks yang jelas dan menjelaskan KENAPA itu bermakna.',
      average: 'Cukup. Coba jelaskan lebih detail KENAPA pencapaian itu bermakna buat kamu dan apa DAMPAK-nya.',
      poor: 'Tips: Semua orang punya pencapaian — bisa proyek kampus, organisasi, atau pekerjaan. Pilih yang punya DAMPAK dan ceritakan prosesnya.',
    },
  },
  // MOTIVATIONAL
  {
    id: 'm1',
    category: 'motivational',
    question: 'Kenapa kamu tertarik dengan posisi ini dan perusahaan kami?',
    context: 'Interviewer menilai apakah kamu sudah riset dan benar-benar tertarik.',
    requiredKeywords: ['perusahaan', 'posisi', 'tertarik', 'karena', 'nilai', 'kontribusi', 'visi'],
    bonusKeywords: ['riset', 'produk', 'misi', 'growth', 'budaya', 'inovasi', 'passion'],
    redFlags: ['butuh uang', 'asal apply', 'nggak tau', 'dengar dari teman', 'dekat rumah'],
    idealStructure: 'Format: Company knowledge + Role alignment + Personal motivation',
    feedbackTemplates: {
      good: 'Jawaban sangat meyakinkan! Kamu menunjukkan riset mendalam tentang perusahaan.',
      average: 'Cukup. Tapi coba lebih spesifik — sebutkan PRODUK, MISI, atau VALUE perusahaan yang SPECIFIC.',
      poor: 'Tips: JANGAN jawab "butuh kerja" atau "dekat rumah." Sebutkan hal SPESIFIK tentang perusahaan.',
    },
  },
  {
    id: 'm2',
    category: 'motivational',
    question: 'Di mana kamu melihat dirimu dalam 3-5 tahun ke depan?',
    context: 'Interviewer menilai apakah goal kamu align dengan apa yang bisa perusahaan tawarkan.',
    requiredKeywords: ['berkembang', 'skill', 'karier', 'kontribusi', 'belajar', 'posisi'],
    bonusKeywords: ['leadership', 'expertise', 'dampak', 'mentor', 'tanggung jawab', 'goal'],
    redFlags: ['nggak tau', 'lihat nanti', 'pindah kerja', 'bikin usaha sendiri', 'terserah'],
    idealStructure: 'Format: Short-term growth → Long-term vision → Company alignment',
    feedbackTemplates: {
      good: 'Bagus! Visi kamu jelas dan ALIGNED dengan apa yang perusahaan bisa tawarkan.',
      average: 'Cukup. Pastikan jawabanmu menunjukkan bahwa goal-mu bisa TERCAPAI di perusahaan ini.',
      poor: 'Tips: Tunjukkan ambisi tapi ALIGNED dengan perusahaan.',
    },
  },
  {
    id: 'm3',
    category: 'motivational',
    question: 'Apa yang memotivasi kamu untuk bekerja setiap hari?',
    context: 'Interviewer menilai intrinsic motivation dan culture fit.',
    requiredKeywords: ['motivasi', 'kerja', 'semangat', 'tujuan', 'dampak', 'berkembang'],
    bonusKeywords: ['passion', 'learning', 'tim', 'challenge', 'meaningful', 'growth'],
    redFlags: ['uang', 'terpaksa', 'nggak ada pilihan', 'gaji'],
    idealStructure: 'Format: Core motivation + How it shows in work + Example',
    feedbackTemplates: {
      good: 'Jawaban authentic! Motivasimu terdengar genuine.',
      average: 'Cukup. Coba beri CONTOH KONKRET bagaimana motivasimu ini terwujud.',
      poor: 'Tips: Jawaban "uang" tidak salah tapi bukan yang interviewer harapkan. Ceritakan apa yang membuat kamu EXCITED.',
    },
  },
  {
    id: 'm4',
    category: 'motivational',
    question: 'Kenapa kami harus memilih kamu dibanding kandidat lain?',
    context: 'Interviewer memberi kesempatan kamu "menjual diri" — ini closing statement.',
    requiredKeywords: ['kelebihan', 'pengalaman', 'kontribusi', 'unik', 'nilai', 'skill', 'hasil'],
    bonusKeywords: ['bukti', 'pencapaian', 'passion', 'cocok', 'siap', 'komitmen'],
    redFlags: ['nggak tau', 'saya biasa aja', 'mungkin', 'coba-coba'],
    idealStructure: 'Format: Unique value + Evidence + Commitment',
    feedbackTemplates: {
      good: 'Closing statement yang kuat! Kamu menyampaikan unique value proposition dengan bukti konkret.',
      average: 'Cukup. Tapi coba lebih SPESIFIK — sebutkan 1-2 hal UNIK tentang kamu.',
      poor: 'Tips: Ini bukan waktunya rendah hati. Sebutkan 2-3 kekuatan terbesarmu + bukti + komitmen.',
    },
  },
];
