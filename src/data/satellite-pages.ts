export interface SatelliteFAQ {
  question: string;
  answer: string;
}

export interface SatellitePage {
  slug: string;
  category: 'posisi' | 'lokasi' | 'istilah' | 'gaji';
  title: string;
  seoTitle: string;
  seoDescription: string;
  sections: { heading: string; content: string }[];
  freeVsMember: { free: string; member: string }[];
  lockedResources: { title: string; teaser: string }[];
  relatedSlugs: string[];
  faqs?: SatelliteFAQ[];
}

export const satellitePages: SatellitePage[] = [
  // ═══════════════════════════════════════
  // KATEGORI 1: CV untuk [Posisi] (10)
  // ═══════════════════════════════════════
  {
    slug: 'cv-marketing',
    category: 'posisi',
    title: 'Contoh CV Marketing yang Lolos ATS 2026',
    seoTitle: 'Contoh CV Marketing ATS-Friendly 2026 | MantraSkill',
    seoDescription: 'Pelajari skill utama yang dicari HRD untuk posisi marketing dan kesalahan umum CV marketing yang bikin ditolak ATS. Tips gratis dari MantraSkill.',
    sections: [
      { heading: 'Apa yang Dicari HRD untuk Posisi Marketing?', content: 'HRD mencari kandidat marketing yang bisa menunjukkan dampak nyata dari campaign yang pernah dijalankan. Bukan hanya daftar tugas, tapi hasil terukur seperti peningkatan traffic, conversion rate, atau ROI. CV marketing yang kuat selalu berbicara dengan angka.\n\nDi tahun 2026, perusahaan semakin fokus pada data-driven marketing. Artinya, kandidat yang bisa menunjukkan kemampuan menggunakan analytics tools dan mengambil keputusan berdasarkan data akan jauh lebih dihargai dibanding yang hanya mengandalkan kreativitas semata.\n\nSelain itu, kemampuan omnichannel marketing — mengelola campaign yang terintegrasi di berbagai platform (Google Ads, Meta Ads, TikTok, Email, SEO) — menjadi semakin penting karena customer journey semakin kompleks.' },
      { heading: 'Skill Utama yang Harus Ada di CV Marketing', content: '• Digital Marketing (SEO, SEM, Social Media Ads)\n• Content Strategy & Copywriting\n• Data Analytics (Google Analytics, Meta Ads Manager)\n• Campaign Management & Budgeting\n• Marketing Automation (HubSpot, Mailchimp, Moengage)\n• A/B Testing & Conversion Rate Optimization\n• Basic Design (Canva, Figma) untuk kebutuhan konten cepat\n\nUntuk fresh graduate, tidak perlu menguasai semua skill di atas. Fokus pada 2-3 skill utama yang relevan dengan posisi target dan tunjukkan bukti nyata melalui project, magang, atau portfolio online. Sertifikasi Google Ads dan Meta Blueprint bisa menjadi pembeda signifikan.' },
      { heading: 'Kesalahan Umum CV Marketing', content: 'Kesalahan terbesar adalah menulis "mengelola media sosial" tanpa metrik. HRD ingin melihat "meningkatkan engagement Instagram 45% dalam 3 bulan" bukan deskripsi tugas generik. CV marketing tanpa angka hampir pasti masuk tumpukan "tidak".\n\nKesalahan lainnya:\n• Tidak menyebutkan tools yang dikuasai — recruiter sering filter berdasarkan tools\n• Menulis pengalaman organisasi kampus tanpa konteks marketing — "ketua divisi acara" tidak sama dengan "mengelola campaign promosi event dengan 500+ peserta"\n• Tidak ada link portfolio atau contoh campaign — marketing adalah bidang visual, tunjukkan hasil kerja kamu\n• Menggunakan jargon tanpa penjelasan — "growth hacking" tanpa contoh spesifik terkesan kosong' },
      { heading: 'Cara Menulis Bullet Point CV Marketing yang Kuat', content: 'Gunakan formula: Action Verb + Konteks + Hasil Terukur\n\nContoh lemah: "Bertanggung jawab atas media sosial perusahaan"\nContoh kuat: "Mengelola 4 akun media sosial dengan total 50K followers, meningkatkan engagement rate dari 2.1% ke 4.8% dalam 6 bulan melalui content calendar strategis dan A/B testing caption"\n\nContoh lain:\n• "Merancang dan mengeksekusi campaign email nurturing 5 tahap yang menghasilkan conversion rate 12% (rata-rata industri 3%)"\n• "Mengoptimasi Google Ads campaign dengan budget Rp 20 juta/bulan, menurunkan CPA 35% sambil meningkatkan leads 50%"\n• "Membuat content strategy untuk blog perusahaan yang meningkatkan organic traffic 200% dalam 12 bulan"' },
      { heading: 'Template Struktur CV Marketing ATS-Friendly', content: 'Struktur CV marketing yang optimal untuk ATS:\n\n1. Header — Nama, email, telepon, LinkedIn, portfolio link\n2. Professional Summary — 2-3 kalimat yang merangkum pengalaman dan spesialisasi marketing kamu\n3. Pengalaman Kerja — Urutkan dari terbaru, gunakan bullet points dengan metrik\n4. Pendidikan — Gelar, universitas, tahun lulus\n5. Skills & Tools — List technical skills dan marketing tools yang dikuasai\n6. Sertifikasi — Google Ads, Meta Blueprint, HubSpot, dll\n\nPastikan heading menggunakan kata standar yang bisa dibaca ATS. Hindari heading kreatif seperti "Jejak Profesional" — gunakan "Pengalaman Kerja" yang langsung dipahami mesin dan HRD.' },
    ],
    freeVsMember: [
      { free: 'Tahu skill dasar marketing', member: 'AI generate CV marketing lengkap dengan keyword matching per JD' },
      { free: 'Tips format umum', member: 'Template CV marketing proven + 55 prompt AI siap pakai' },
      { free: 'Baca contoh generik', member: 'AI rewrite setiap bullet point dengan metrik yang relevan' },
    ],
    lockedResources: [
      { title: 'Template CV Digital Marketing 2026', teaser: 'Template yang sudah dioptimasi untuk ATS dengan section khusus portfolio campaign dan metrik ROI...' },
      { title: 'Prompt AI: Rewrite Pengalaman Marketing', teaser: 'Ubah deskripsi tugas biasa menjadi achievement-based bullet point dengan angka konkret...' },
    ],
    relatedSlugs: ['cv-content-writer', 'cv-sales', 'gaji-marketing-2026', 'apa-itu-ats'],
    faqs: [
      { question: 'Berapa gaji marketing fresh graduate 2026?', answer: 'Gaji marketing fresh graduate di Indonesia berkisar Rp 5.000.000 - Rp 8.000.000 per bulan, tergantung spesialisasi dan lokasi perusahaan.' },
      { question: 'Apa skill yang harus dimiliki marketing?', answer: 'Skill utama marketing meliputi Digital Marketing (SEO, SEM), Content Strategy, Data Analytics, dan Campaign Management.' },
    ],
  },
  {
    slug: 'cv-data-analyst',
    category: 'posisi',
    title: 'Contoh CV Data Analyst Fresh Graduate 2026',
    seoTitle: 'Contoh CV Data Analyst Fresh Graduate 2026 | MantraSkill',
    seoDescription: 'Cara membuat CV data analyst yang menarik perhatian HRD. Skill wajib, kesalahan umum, dan tips ATS untuk fresh graduate.',
    sections: [
      { heading: 'Apa yang Dicari HRD untuk Posisi Data Analyst?', content: 'Perusahaan mencari data analyst yang bisa mengubah data mentah menjadi insight actionable. Untuk fresh graduate, pengalaman project kampus atau portofolio analisis data bisa menjadi pengganti pengalaman kerja. Yang penting: tunjukkan proses berpikir analitis kamu.\n\nDi 2026, peran data analyst semakin krusial karena keputusan bisnis harus data-driven. Perusahaan tidak hanya mencari orang yang bisa query SQL, tapi yang bisa storytelling dengan data — mempresentasikan insight dalam bahasa yang dipahami stakeholder non-teknis.\n\nFresh graduate yang punya portfolio Kaggle, project GitHub, atau dashboard Tableau publik memiliki keunggulan besar dibanding yang hanya mencantumkan "mahir Python" tanpa bukti.' },
      { heading: 'Skill Utama yang Harus Ada di CV Data Analyst', content: '• SQL & Database Management (PostgreSQL, MySQL, BigQuery)\n• Python atau R untuk analisis data (pandas, numpy, scikit-learn)\n• Data Visualization (Tableau, Power BI, Looker, atau Matplotlib)\n• Statistical Analysis & A/B Testing\n• Excel/Google Sheets tingkat lanjut (pivot table, VLOOKUP, macro)\n• Basic ETL & Data Pipeline understanding\n• Komunikasi & Data Storytelling\n\nUntuk fresh graduate, fokus pada SQL + Python + satu visualization tool. Ini adalah kombinasi minimum yang dicari hampir semua perusahaan. Tambahkan sertifikasi Google Data Analytics atau IBM Data Science untuk memperkuat profil.' },
      { heading: 'Kesalahan Umum CV Data Analyst', content: 'Fresh graduate sering hanya menulis "mahir Excel dan Python" tanpa bukti. Lebih baik tulis project spesifik: "Menganalisis 50.000 baris data penjualan menggunakan Python pandas, menghasilkan rekomendasi yang meningkatkan efisiensi 20%."\n\nKesalahan umum lainnya:\n• Tidak menyertakan link GitHub/portfolio — HRD data analyst PASTI cek portfolio teknis kamu\n• Menulis terlalu banyak teori tanpa praktik — "memahami machine learning" tanpa project konkret tidak berarti apa-apa\n• Tidak menyebutkan tipe data yang pernah dianalisis — "data keuangan", "data e-commerce", atau "data IoT" memberikan konteks industri\n• Memasukkan semua tools yang pernah disentuh — lebih baik 3-4 tools yang dikuasai mendalam daripada 15 tools yang hanya pernah dicoba sekali' },
      { heading: 'Cara Menulis Project Data di CV Fresh Graduate', content: 'Fresh graduate bisa menonjolkan project kampus, hackathon, atau project mandiri sebagai pengganti pengalaman kerja. Gunakan format:\n\nNama Project → Tools yang Digunakan → Hasil/Impact\n\nContoh:\n• "Prediksi Customer Churn — Python, scikit-learn, Tableau | Membangun model prediksi churn dengan akurasi 87% menggunakan Random Forest, menganalisis 100K records data pelanggan telekomunikasi"\n• "Dashboard Sales Analytics — SQL, Power BI | Membuat interactive dashboard yang menampilkan tren penjualan 3 tahun untuk 5 kategori produk, digunakan oleh tim sales untuk weekly planning"\n• "Sentiment Analysis Twitter — Python, NLP, Matplotlib | Menganalisis 25K tweets tentang brand FMCG, mengidentifikasi 3 pain point utama konsumen yang dijadikan input strategi marketing"\n\nProject mandiri dari Kaggle atau dataset publik juga valid — yang penting tunjukkan proses analitis dan impact dari insight yang kamu temukan.' },
    ],
    freeVsMember: [
      { free: 'Tahu skill dasar yang dibutuhkan', member: 'AI generate CV data analyst dengan keyword matching otomatis per JD' },
      { free: 'Tips umum format CV', member: 'Template CV data analyst + section portofolio project yang optimal' },
      { free: 'Baca contoh generik', member: 'AI scoring CV kamu vs standar industri data analyst' },
    ],
    lockedResources: [
      { title: 'Template CV Data Analyst 2026', teaser: 'Template khusus dengan section technical skills, project portfolio, dan certifications yang ATS-friendly...' },
      { title: 'Prompt AI: Tulis Project Data di CV', teaser: 'Prompt untuk mengubah project kampus menjadi bullet point profesional yang mengesankan HRD...' },
    ],
    relatedSlugs: ['cv-software-engineer', 'gaji-data-analyst-2026', 'apa-itu-ats', 'cv-admin'],
    faqs: [
      { question: 'Apakah fresh graduate bisa jadi data analyst?', answer: 'Ya! Banyak perusahaan menerima fresh graduate untuk posisi junior data analyst, terutama jika memiliki portfolio project analisis data dari kampus.' },
      { question: 'Tool apa yang harus dikuasai data analyst?', answer: 'Tool wajib data analyst: SQL, Python/R, dan visualization tools seperti Tableau atau Power BI.' },
    ],
  },
  {
    slug: 'cv-ui-ux-designer',
    category: 'posisi',
    title: 'Contoh CV UI/UX Designer yang Menarik HRD 2026',
    seoTitle: 'Contoh CV UI/UX Designer 2026 | Tips ATS-Friendly | MantraSkill',
    seoDescription: 'Buat CV UI/UX designer yang lolos ATS dan menarik perhatian HRD. Skill wajib, kesalahan umum, dan tips portofolio.',
    sections: [
      { heading: 'Apa yang Dicari HRD untuk Posisi UI/UX Designer?', content: 'HRD mencari designer yang tidak hanya bisa membuat desain cantik, tapi juga memahami user research dan bisa menunjukkan dampak desain terhadap metrik bisnis. Portofolio yang kuat lebih penting dari gelar.' },
      { heading: 'Skill Utama yang Harus Ada di CV UI/UX Designer', content: '• User Research & Usability Testing\n• Wireframing & Prototyping (Figma, Sketch)\n• Design System & Component Library\n• Interaction Design & Micro-animation' },
      { heading: 'Kesalahan Umum CV UI/UX Designer', content: 'Kesalahan fatal: CV tanpa link portofolio. Designer yang hanya menulis skill tanpa menunjukkan hasil kerja langsung di-skip HRD. Selalu sertakan link Dribbble, Behance, atau website portofolio pribadi.' },
    ],
    freeVsMember: [
      { free: 'Tahu skill dasar UI/UX', member: 'AI generate CV designer + optimize portofolio description' },
      { free: 'Tips format umum', member: 'Template CV designer dengan section case study yang proven' },
      { free: 'Baca tips generik', member: 'AI rewrite pengalaman design dengan metrik UX yang relevan' },
    ],
    lockedResources: [
      { title: 'Template CV UI/UX Designer 2026', teaser: 'Layout khusus designer dengan section portofolio, case study summary, dan tools proficiency...' },
      { title: 'Prompt AI: Tulis Case Study di CV', teaser: 'Prompt untuk mengubah project design menjadi case study ringkas yang menunjukkan proses dan dampak...' },
    ],
    relatedSlugs: ['cv-software-engineer', 'cv-content-writer', 'apa-itu-personal-branding', 'gaji-software-engineer-2026'],
  },
  {
    slug: 'cv-software-engineer',
    category: 'posisi',
    title: 'Contoh CV Software Engineer yang Lolos ATS 2026',
    seoTitle: 'Contoh CV Software Engineer 2026 | ATS-Friendly | MantraSkill',
    seoDescription: 'Cara membuat CV software engineer yang lolos ATS. Tech stack, project highlight, dan kesalahan umum developer saat bikin CV.',
    sections: [
      { heading: 'Apa yang Dicari HRD untuk Posisi Software Engineer?', content: 'Recruiter teknis mencari engineer yang bisa menunjukkan kontribusi nyata pada project. Bukan hanya list teknologi yang dikuasai, tapi bagaimana teknologi itu digunakan untuk menyelesaikan masalah bisnis.' },
      { heading: 'Skill Utama yang Harus Ada di CV Software Engineer', content: '• Programming Language utama (JavaScript/Python/Java/Go)\n• Framework & Library (React, Node.js, Django, Spring Boot)\n• Database & Cloud (PostgreSQL, AWS/GCP)\n• Version Control & CI/CD' },
      { heading: 'Kesalahan Umum CV Software Engineer', content: 'Menulis daftar panjang teknologi tanpa konteks proyek. HRD teknis lebih terkesan dengan "Membangun microservice dengan Go yang menangani 10K request/detik" daripada list 20 teknologi tanpa penjelasan.' },
    ],
    freeVsMember: [
      { free: 'Tahu skill dasar yang dibutuhkan', member: 'AI generate CV engineer dengan keyword matching per job description' },
      { free: 'Tips format umum', member: 'Template CV engineer + GitHub project highlight optimizer' },
      { free: 'Baca contoh generik', member: 'AI scoring CV tech kamu vs standar FAANG/startup' },
    ],
    lockedResources: [
      { title: 'Template CV Software Engineer 2026', teaser: 'Template dengan section technical skills terstruktur, project highlights, dan open source contributions...' },
      { title: 'Prompt AI: Tulis Project Tech di CV', teaser: 'Prompt untuk mengubah deskripsi project menjadi bullet point yang menunjukkan impact dan scale...' },
    ],
    relatedSlugs: ['cv-data-analyst', 'cv-ui-ux-designer', 'gaji-software-engineer-2026', 'apa-itu-ats'],
    faqs: [
      { question: 'Bahasa pemrograman apa yang paling dicari 2026?', answer: 'JavaScript, Python, Go, dan TypeScript adalah bahasa pemrograman paling dicari untuk posisi software engineer di Indonesia 2026.' },
      { question: 'Berapa gaji software engineer fresh graduate?', answer: 'Gaji software engineer fresh graduate berkisar Rp 7.000.000 - Rp 15.000.000 per bulan, tergantung perusahaan dan tech stack.' },
    ],
  },
  {
    slug: 'cv-admin',
    category: 'posisi',
    title: 'Contoh CV Admin & Staff Administrasi 2026',
    seoTitle: 'Contoh CV Admin / Staff Administrasi 2026 | MantraSkill',
    seoDescription: 'Tips membuat CV admin yang profesional dan lolos ATS. Skill wajib, format yang benar, dan kesalahan yang harus dihindari.',
    sections: [
      { heading: 'Apa yang Dicari HRD untuk Posisi Admin?', content: 'Untuk posisi administrasi, HRD mencari kandidat yang terorganisir, teliti, dan bisa mengelola banyak tugas sekaligus. Kemampuan menggunakan software office dan sistem filing digital menjadi nilai tambah besar.' },
      { heading: 'Skill Utama yang Harus Ada di CV Admin', content: '• Microsoft Office Suite (Word, Excel, PowerPoint)\n• Data Entry & Filing System\n• Scheduling & Calendar Management\n• Komunikasi Tertulis & Verbal' },
      { heading: 'Kesalahan Umum CV Admin', content: 'Banyak pelamar admin menulis CV terlalu panjang dengan pengalaman yang tidak relevan. Untuk posisi admin, fokuslah pada kemampuan organisasi dan efisiensi. Satu halaman CV yang rapi lebih baik dari tiga halaman yang berantakan.' },
    ],
    freeVsMember: [
      { free: 'Tahu skill dasar admin', member: 'AI generate CV admin profesional dalam 5 menit' },
      { free: 'Format CV umum', member: 'Template CV admin ATS-friendly + keyword optimizer' },
      { free: 'Tips generik', member: '55 prompt AI untuk berbagai posisi admin' },
    ],
    lockedResources: [
      { title: 'Template CV Staff Administrasi 2026', teaser: 'Template clean dan profesional dengan section yang tepat untuk posisi admin di berbagai industri...' },
    ],
    relatedSlugs: ['cv-akuntan', 'cv-hrd', 'cv-customer-service', 'apa-itu-ats'],
  },
  {
    slug: 'cv-akuntan',
    category: 'posisi',
    title: 'Contoh CV Akuntan & Finance 2026',
    seoTitle: 'Contoh CV Akuntan & Finance 2026 | ATS-Friendly | MantraSkill',
    seoDescription: 'Buat CV akuntan yang lolos ATS. Skill wajib, sertifikasi penting, dan kesalahan umum CV di bidang keuangan.',
    sections: [
      { heading: 'Apa yang Dicari HRD untuk Posisi Akuntan?', content: 'Perusahaan mencari akuntan yang teliti, memahami standar akuntansi (PSAK/IFRS), dan bisa bekerja dengan software akuntansi modern. Sertifikasi seperti Brevet A/B menjadi nilai tambah signifikan.' },
      { heading: 'Skill Utama yang Harus Ada di CV Akuntan', content: '• Standar Akuntansi (PSAK/IFRS)\n• Software Akuntansi (SAP, Accurate, Jurnal.id)\n• Tax Compliance & Reporting\n• Financial Analysis & Budgeting' },
      { heading: 'Kesalahan Umum CV Akuntan', content: 'Tidak mencantumkan sertifikasi dan software yang dikuasai. Untuk posisi akuntan, sertifikasi Brevet dan penguasaan software spesifik sering menjadi filter pertama HRD sebelum membaca pengalaman kerja.' },
    ],
    freeVsMember: [
      { free: 'Tahu skill dasar akuntan', member: 'AI generate CV akuntan dengan keyword per JD spesifik' },
      { free: 'Format CV umum', member: 'Template CV finance + certification highlight optimizer' },
      { free: 'Tips generik', member: 'AI scoring CV akuntan vs standar Big 4 accounting firm' },
    ],
    lockedResources: [
      { title: 'Template CV Akuntan & Finance 2026', teaser: 'Template dengan section sertifikasi, software proficiency, dan achievement keuangan yang terstruktur...' },
    ],
    relatedSlugs: ['cv-admin', 'cv-hrd', 'gaji-fresh-graduate-2026', 'apa-itu-ats'],
  },
  {
    slug: 'cv-hrd',
    category: 'posisi',
    title: 'Contoh CV HRD & Human Resources 2026',
    seoTitle: 'Contoh CV HRD / Human Resources 2026 | MantraSkill',
    seoDescription: 'Tips membuat CV HRD yang profesional. Skill recruitment, people management, dan kesalahan umum CV di bidang HR.',
    sections: [
      { heading: 'Apa yang Dicari untuk Posisi HRD?', content: 'Ironisnya, banyak praktisi HR yang CV-nya sendiri tidak optimal. Perusahaan mencari HR yang memahami full employee lifecycle: dari recruitment, onboarding, hingga retention. Kemampuan menggunakan HRIS modern juga sangat dihargai.' },
      { heading: 'Skill Utama yang Harus Ada di CV HRD', content: '• Recruitment & Talent Acquisition\n• HRIS (SAP HR, Talenta, BambooHR)\n• Employee Relations & Labor Law\n• Training & Development Program' },
      { heading: 'Kesalahan Umum CV HRD', content: 'Menulis "bertanggung jawab atas recruitment" tanpa metrik. Lebih baik tulis "berhasil mengisi 50 posisi dalam 6 bulan dengan time-to-hire rata-rata 21 hari" untuk menunjukkan efektivitas kerja kamu.' },
    ],
    freeVsMember: [
      { free: 'Tahu skill dasar HR', member: 'AI generate CV HR dengan metrik recruitment yang impactful' },
      { free: 'Format CV umum', member: 'Template CV HR profesional + achievement optimizer' },
      { free: 'Tips generik', member: 'AI rewrite pengalaman HR dengan data-driven bullet points' },
    ],
    lockedResources: [
      { title: 'Template CV HRD & Recruitment 2026', teaser: 'Template dengan section recruitment metrics, program HR, dan HRIS proficiency...' },
    ],
    relatedSlugs: ['cv-admin', 'cv-akuntan', 'apa-itu-networking', 'apa-itu-soft-skill'],
  },
  {
    slug: 'cv-sales',
    category: 'posisi',
    title: 'Contoh CV Sales & Business Development 2026',
    seoTitle: 'Contoh CV Sales / Business Development 2026 | MantraSkill',
    seoDescription: 'Cara membuat CV sales yang menjual diri kamu. Target achievement, skill negosiasi, dan tips lolos ATS untuk posisi sales.',
    sections: [
      { heading: 'Apa yang Dicari HRD untuk Posisi Sales?', content: 'Untuk posisi sales, satu hal yang paling dicari: ANGKA. HRD ingin melihat track record pencapaian target, revenue yang dihasilkan, dan kemampuan closing deal. CV sales tanpa angka adalah kontradiksi.' },
      { heading: 'Skill Utama yang Harus Ada di CV Sales', content: '• Target Achievement & Revenue Growth\n• CRM Tools (Salesforce, HubSpot, Pipedrive)\n• Negotiation & Closing Techniques\n• Client Relationship Management' },
      { heading: 'Kesalahan Umum CV Sales', content: 'Tidak menyebutkan pencapaian target. Jika kamu pernah achieve 120% target, itu HARUS ada di CV. Sales yang tidak bisa "menjual" dirinya sendiri di CV akan sulit meyakinkan HRD bahwa kamu bisa menjual produk mereka.' },
    ],
    freeVsMember: [
      { free: 'Tahu pentingnya angka di CV', member: 'AI generate CV sales dengan achievement metrics yang powerful' },
      { free: 'Format CV umum', member: 'Template CV sales dengan section target vs achievement' },
      { free: 'Tips generik', member: 'AI rewrite pengalaman sales dengan revenue impact' },
    ],
    lockedResources: [
      { title: 'Template CV Sales & BD 2026', teaser: 'Template dengan section pipeline metrics, client portfolio, dan target achievement yang terstruktur...' },
    ],
    relatedSlugs: ['cv-marketing', 'cv-customer-service', 'gaji-marketing-2026', 'apa-itu-personal-branding'],
  },
  {
    slug: 'cv-content-writer',
    category: 'posisi',
    title: 'Contoh CV Content Writer & Copywriter 2026',
    seoTitle: 'Contoh CV Content Writer / Copywriter 2026 | MantraSkill',
    seoDescription: 'Buat CV content writer yang menarik. Portfolio writing, skill SEO content, dan kesalahan umum CV di bidang penulisan.',
    sections: [
      { heading: 'Apa yang Dicari HRD untuk Posisi Content Writer?', content: 'Perusahaan mencari writer yang bisa menulis dengan purpose: meningkatkan traffic, engagement, atau conversion. Kemampuan SEO writing dan memahami target audience lebih dihargai daripada sekadar "bisa menulis dengan baik".' },
      { heading: 'Skill Utama yang Harus Ada di CV Content Writer', content: '• SEO Content Writing & Keyword Research\n• Copywriting (AIDA, PAS framework)\n• Content Management System (WordPress, dll)\n• Social Media Content Strategy' },
      { heading: 'Kesalahan Umum CV Content Writer', content: 'Tidak menyertakan portfolio atau contoh tulisan. Writer yang bilang "saya bisa menulis" tanpa bukti sama dengan sales yang bilang "saya bisa menjual" tanpa track record. Selalu sertakan link portfolio atau blog.' },
    ],
    freeVsMember: [
      { free: 'Tahu skill dasar content writer', member: 'AI generate CV writer + portfolio description optimizer' },
      { free: 'Format CV umum', member: 'Template CV writer dengan section portfolio & metrics' },
      { free: 'Tips generik', member: 'AI rewrite pengalaman writing dengan content metrics' },
    ],
    lockedResources: [
      { title: 'Template CV Content Writer 2026', teaser: 'Template dengan section writing samples, content metrics, dan platform proficiency...' },
    ],
    relatedSlugs: ['cv-marketing', 'cv-ui-ux-designer', 'apa-itu-personal-branding', 'apa-itu-cover-letter'],
  },
  {
    slug: 'cv-customer-service',
    category: 'posisi',
    title: 'Contoh CV Customer Service Representative 2026',
    seoTitle: 'Contoh CV Customer Service 2026 | ATS-Friendly | MantraSkill',
    seoDescription: 'Tips membuat CV customer service yang profesional. Skill komunikasi, problem solving, dan cara lolos ATS untuk posisi CS.',
    sections: [
      { heading: 'Apa yang Dicari HRD untuk Posisi Customer Service?', content: 'HRD mencari kandidat CS yang sabar, komunikatif, dan bisa menyelesaikan masalah dengan cepat. Pengalaman menangani komplain dan kemampuan menggunakan tools CRM menjadi pembeda utama antar kandidat.' },
      { heading: 'Skill Utama yang Harus Ada di CV Customer Service', content: '• Communication & Active Listening\n• Problem Solving & Conflict Resolution\n• CRM & Ticketing System (Zendesk, Freshdesk)\n• Multitasking & Time Management' },
      { heading: 'Kesalahan Umum CV Customer Service', content: 'Menulis "melayani pelanggan" tanpa metrik kepuasan. Lebih baik tulis "mempertahankan rating kepuasan pelanggan 4.8/5 dengan rata-rata resolve time 15 menit" untuk menunjukkan kualitas layanan kamu.' },
    ],
    freeVsMember: [
      { free: 'Tahu skill dasar CS', member: 'AI generate CV customer service dengan satisfaction metrics' },
      { free: 'Format CV umum', member: 'Template CV CS + achievement-based bullet point generator' },
      { free: 'Tips generik', member: 'AI scoring CV CS kamu vs standar industri' },
    ],
    lockedResources: [
      { title: 'Template CV Customer Service 2026', teaser: 'Template dengan section customer metrics, tools proficiency, dan resolution achievement...' },
    ],
    relatedSlugs: ['cv-admin', 'cv-sales', 'apa-itu-soft-skill', 'gaji-fresh-graduate-2026'],
  },

  // ═══════════════════════════════════════
  // KATEGORI 2: Lowongan Kerja [Kota] (6)
  // ═══════════════════════════════════════
  {
    slug: 'kerja-di-jakarta',
    category: 'lokasi',
    title: 'Cari Kerja di Jakarta 2026: Panduan Fresh Graduate',
    seoTitle: 'Lowongan Kerja Jakarta 2026 | Tips Fresh Graduate | MantraSkill',
    seoDescription: 'Panduan cari kerja di Jakarta 2026 untuk fresh graduate. Industri terbesar, tips melamar, dan cara bersaing di pasar kerja Jakarta.',
    sections: [
      { heading: 'Kondisi Pasar Kerja Jakarta 2026', content: 'Jakarta tetap menjadi pusat ekonomi Indonesia dengan konsentrasi tertinggi perusahaan multinasional, startup, dan BUMN. Kompetisi tinggi, tapi peluang juga paling banyak. Rata-rata satu lowongan di Jakarta menerima 200+ lamaran.\n\nEkosistem kerja Jakarta 2026 semakin dinamis dengan pertumbuhan coworking space, hybrid work arrangement, dan hub-hub industri baru di luar CBD tradisional. Area seperti PIK 2, BSD City, dan Alam Sutera mulai menarik perusahaan tech dan startup yang sebelumnya terkonsentrasi di SCBD dan Kuningan.' },
      { heading: 'Industri Terbesar di Jakarta', content: '• Fintech & Perbankan — OJK, Bank Indonesia, dan ratusan fintech (GoPay, OVO, Dana, LinkAja)\n• E-commerce & Tech — Tokopedia, Shopee, Gojek HQ, Traveloka, Blibli\n• Konsultan & Professional Services — Big 4 (Deloitte, EY, PwC, KPMG), McKinsey, BCG, Bain\n• Media & Kreatif — Kompas, Tempo, dan agency kreatif besar\n• FMCG — Unilever, P&G, Nestlé, Indofood HQ\n• Perbankan — BCA, Mandiri, BRI, BNI, dan bank digital (Jago, Blu, Neobank)\n\nMasing-masing sektor punya culture dan recruitment process yang berbeda. Tech company cenderung pakai technical test, consulting pakai case interview, FMCG pakai assessment center. Sesuaikan persiapan kamu dengan industri target.' },
      { heading: 'Tips Cari Kerja di Jakarta', content: '• Optimalkan LinkedIn — 70% recruiter Jakarta aktif di LinkedIn. Pastikan headline, summary, dan experience section kamu teroptimasi\n• Targetkan area industri spesifik — SCBD untuk finance/consulting, TB Simatupang untuk tech, Sudirman untuk BUMN\n• Siapkan CV ATS-friendly karena perusahaan besar Jakarta hampir semua pakai ATS (Workday, Taleo, Kalibrr)\n• Ikut job fair — UI Career Fair, ITB Job Fair, dan Jakarta Career Expo rutin diadakan\n• Manfaatkan referral — 40% posisi di Jakarta diisi melalui referral internal. Networking adalah kunci\n• Persiapkan biaya hidup — Estimasi minimum Rp 3.000.000 - Rp 5.000.000 untuk kos, transport, dan makan di Jakarta sebelum gaji pertama\n• Pertimbangkan commuter town — Tinggal di Depok, Bekasi, atau Tangerang bisa menghemat 30-50% biaya kos' },
      { heading: 'Strategi Melamar Kerja di Jakarta untuk Fresh Graduate', content: 'Jakarta adalah pasar kerja paling kompetitif di Indonesia. Untuk menonjol dari ratusan pelamar lain, kamu perlu strategi yang tepat:\n\n1. Buat CV yang berbeda untuk setiap industri — CV untuk posisi marketing di startup berbeda dengan CV untuk posisi marketing di bank\n2. Apply di waktu yang tepat — Puncak hiring di Jakarta: Januari-Maret (budget baru) dan Juli-September (setelah mid-year review). Hindari apply Desember (budget freeze)\n3. Gunakan multiple channel — Jangan hanya andalkan JobStreet. Gunakan LinkedIn Jobs, Glints, Kalibrr, dan website karir perusahaan langsung\n4. Follow up yang sopan — Kirim follow-up email 1 minggu setelah melamar jika belum ada respons\n5. Siapkan portfolio online — Terutama untuk posisi kreatif, tech, dan marketing. GitHub, Behance, atau personal website\n\nDengan persiapan yang matang dan CV ATS-friendly, peluang kamu mendapat panggilan interview di Jakarta meningkat signifikan.' },
    ],
    freeVsMember: [
      { free: 'Baca tips umum cari kerja', member: 'AI riset perusahaan target + generate CV per JD spesifik' },
      { free: 'Tahu industri besar', member: 'Database 500+ perusahaan Jakarta + contact recruiter' },
      { free: 'Tips LinkedIn basic', member: 'LinkedIn Optimizer + AI networking message generator' },
    ],
    lockedResources: [
      { title: 'Daftar Top 50 Employer Jakarta 2026', teaser: 'Daftar perusahaan dengan benefit terbaik, kultur kerja positif, dan program graduate trainee...' },
    ],
    relatedSlugs: ['kerja-di-bandung', 'kerja-di-surabaya', 'apa-itu-ats', 'cv-admin'],
    faqs: [
      { question: 'Berapa gaji rata-rata di Jakarta 2026?', answer: 'UMR Jakarta 2026 sekitar Rp 5.300.000. Fresh graduate di perusahaan swasta umumnya Rp 5.000.000 - Rp 8.000.000, di tech bisa mencapai Rp 15.000.000.' },
      { question: 'Industri apa yang paling banyak hiring di Jakarta?', answer: 'Fintech, e-commerce, perbankan, dan consulting adalah industri yang paling aktif hiring di Jakarta 2026.' },
    ],
  },
  {
    slug: 'kerja-di-surabaya',
    category: 'lokasi',
    title: 'Cari Kerja di Surabaya 2026: Panduan Lengkap',
    seoTitle: 'Lowongan Kerja Surabaya 2026 | Tips Karir | MantraSkill',
    seoDescription: 'Panduan cari kerja di Surabaya 2026. Industri utama, peluang karir, dan tips untuk fresh graduate di kota pahlawan.',
    sections: [
      { heading: 'Kondisi Pasar Kerja Surabaya 2026', content: 'Surabaya sebagai kota terbesar kedua di Indonesia memiliki ekonomi yang terus berkembang. Biaya hidup lebih rendah dari Jakarta dengan peluang karir yang kompetitif, menjadikannya pilihan menarik bagi fresh graduate.' },
      { heading: 'Industri Terbesar di Surabaya', content: '• Manufaktur & Industri — kawasan SIER dan berbagai pabrik besar\n• Perdagangan & Logistik — Pelabuhan Tanjung Perak sebagai hub\n• Hospitality & F&B — sektor pariwisata dan kuliner yang kuat' },
      { heading: 'Tips Cari Kerja di Surabaya', content: '• Manfaatkan job fair ITS dan Unair yang rutin diadakan\n• Networking di komunitas profesional Surabaya (SBC, Jenius Surabaya)\n• Targetkan perusahaan manufaktur besar yang selalu butuh fresh graduate' },
    ],
    freeVsMember: [
      { free: 'Baca tips umum', member: 'AI generate CV yang disesuaikan industri Surabaya' },
      { free: 'Tahu industri besar', member: 'AI riset perusahaan target + interview preparation' },
      { free: 'Tips networking basic', member: 'AI networking strategy + LinkedIn optimizer' },
    ],
    lockedResources: [
      { title: 'Top Employer Surabaya 2026', teaser: 'Daftar perusahaan terbaik untuk fresh graduate di Surabaya dengan info gaji dan benefit...' },
    ],
    relatedSlugs: ['kerja-di-jakarta', 'kerja-di-semarang', 'kerja-di-yogyakarta', 'gaji-fresh-graduate-2026'],
  },
  {
    slug: 'kerja-di-bandung',
    category: 'lokasi',
    title: 'Cari Kerja di Bandung 2026: Peluang & Tips',
    seoTitle: 'Lowongan Kerja Bandung 2026 | Fresh Graduate | MantraSkill',
    seoDescription: 'Panduan cari kerja di Bandung 2026. Startup scene, industri kreatif, dan tips karir untuk fresh graduate di kota kembang.',
    sections: [
      { heading: 'Kondisi Pasar Kerja Bandung 2026', content: 'Bandung dikenal sebagai kota startup dan industri kreatif. Dengan banyaknya lulusan ITB, Unpad, dan universitas berkualitas lainnya, kompetisi cukup ketat. Namun, ekosistem startup yang supportive membuka banyak peluang.' },
      { heading: 'Industri Terbesar di Bandung', content: '• Tech & Startup — Bandung Digital Valley, banyak software house\n• Industri Kreatif — Fashion, design, dan konten digital\n• Pendidikan & Riset — cluster universitas dan lembaga riset' },
      { heading: 'Tips Cari Kerja di Bandung', content: '• Ikut komunitas startup Bandung (BDG Connector, Founders Friday)\n• Bangun portofolio online — perusahaan kreatif Bandung sangat menghargai portfolio\n• Pertimbangkan remote work untuk perusahaan Jakarta dengan base di Bandung' },
    ],
    freeVsMember: [
      { free: 'Baca tips umum', member: 'AI generate CV untuk industri kreatif & tech Bandung' },
      { free: 'Tahu industri besar', member: 'AI riset startup Bandung + pitch preparation' },
      { free: 'Tips portfolio basic', member: 'AI portfolio optimizer + LinkedIn Bandung network builder' },
    ],
    lockedResources: [
      { title: 'Startup & Tech Company Bandung 2026', teaser: 'Daftar startup dan perusahaan tech Bandung yang sedang hiring beserta range salary...' },
    ],
    relatedSlugs: ['kerja-di-jakarta', 'kerja-di-yogyakarta', 'cv-software-engineer', 'cv-ui-ux-designer'],
  },
  {
    slug: 'kerja-di-medan',
    category: 'lokasi',
    title: 'Cari Kerja di Medan 2026: Panduan Karir',
    seoTitle: 'Lowongan Kerja Medan 2026 | Tips Karir | MantraSkill',
    seoDescription: 'Panduan cari kerja di Medan 2026. Industri utama, peluang fresh graduate, dan tips bersaing di pasar kerja Sumatera Utara.',
    sections: [
      { heading: 'Kondisi Pasar Kerja Medan 2026', content: 'Medan sebagai kota terbesar di Sumatera memiliki ekonomi yang didominasi perdagangan, perkebunan, dan jasa. Peluang kerja terus bertambah seiring pertumbuhan ekonomi regional Sumatera Utara.' },
      { heading: 'Industri Terbesar di Medan', content: '• Perkebunan & Agribisnis — kelapa sawit, karet, dan kakao\n• Perdagangan & Retail — pusat distribusi Sumatera\n• Perbankan & Jasa Keuangan — cabang bank nasional dan BPD' },
      { heading: 'Tips Cari Kerja di Medan', content: '• Manfaatkan alumni network USU dan universitas lokal\n• Targetkan perusahaan perkebunan besar yang memiliki program MT\n• Pertimbangkan posisi regional manager untuk perusahaan nasional' },
    ],
    freeVsMember: [
      { free: 'Baca tips umum', member: 'AI generate CV yang disesuaikan industri Medan' },
      { free: 'Tahu industri besar', member: 'AI riset perusahaan Sumatera + interview tips regional' },
      { free: 'Tips networking basic', member: 'AI career strategy untuk pasar kerja Medan' },
    ],
    lockedResources: [
      { title: 'Top Employer Medan & Sumut 2026', teaser: 'Daftar perusahaan besar di Medan dengan program management trainee dan graduate hire...' },
    ],
    relatedSlugs: ['kerja-di-jakarta', 'kerja-di-surabaya', 'gaji-fresh-graduate-2026', 'cv-admin'],
  },
  {
    slug: 'kerja-di-semarang',
    category: 'lokasi',
    title: 'Cari Kerja di Semarang 2026: Tips & Peluang',
    seoTitle: 'Lowongan Kerja Semarang 2026 | Fresh Graduate | MantraSkill',
    seoDescription: 'Panduan cari kerja di Semarang 2026. Industri utama, tips karir, dan peluang untuk fresh graduate di ibukota Jawa Tengah.',
    sections: [
      { heading: 'Kondisi Pasar Kerja Semarang 2026', content: 'Semarang mengalami pertumbuhan ekonomi stabil dengan biaya hidup yang lebih terjangkau dibanding Jakarta atau Surabaya. Kota ini menjadi hub logistik dan manufaktur penting di Jawa Tengah.' },
      { heading: 'Industri Terbesar di Semarang', content: '• Manufaktur & Garmen — kawasan industri Kendal dan Demak\n• Logistik & Transportasi — Pelabuhan Tanjung Emas\n• FMCG & Distribusi — gudang regional berbagai brand nasional' },
      { heading: 'Tips Cari Kerja di Semarang', content: '• Ikut job fair Undip dan UNIKA yang rutin mengundang perusahaan besar\n• Targetkan kawasan industri Kendal untuk posisi manufaktur\n• Bangun koneksi di komunitas bisnis Semarang (SBC, JCI Semarang)' },
    ],
    freeVsMember: [
      { free: 'Baca tips umum', member: 'AI generate CV untuk industri manufaktur & logistik' },
      { free: 'Tahu industri besar', member: 'AI riset perusahaan Semarang + salary benchmark' },
      { free: 'Tips dasar', member: 'AI career strategy untuk pasar kerja Jawa Tengah' },
    ],
    lockedResources: [
      { title: 'Top Employer Semarang 2026', teaser: 'Daftar perusahaan manufaktur dan logistik Semarang dengan info program MT dan salary range...' },
    ],
    relatedSlugs: ['kerja-di-yogyakarta', 'kerja-di-surabaya', 'kerja-di-jakarta', 'cv-admin'],
  },
  {
    slug: 'kerja-di-yogyakarta',
    category: 'lokasi',
    title: 'Cari Kerja di Yogyakarta 2026: Panduan Lengkap',
    seoTitle: 'Lowongan Kerja Yogyakarta 2026 | Tips Karir | MantraSkill',
    seoDescription: 'Panduan cari kerja di Yogyakarta 2026. Industri kreatif, tech scene, dan tips untuk fresh graduate di kota pelajar.',
    sections: [
      { heading: 'Kondisi Pasar Kerja Yogyakarta 2026', content: 'Yogyakarta dikenal sebagai kota pelajar dengan biaya hidup rendah. Meski UMR termasuk rendah, banyak perusahaan tech dan kreatif yang menawarkan gaji kompetitif. Remote work semakin populer di kalangan profesional Yogya.' },
      { heading: 'Industri Terbesar di Yogyakarta', content: '• Tech & Software House — banyak developer dan agency digital\n• Pariwisata & Hospitality — hotel, travel, dan F&B\n• Pendidikan — UGM, UNY, dan lembaga pelatihan' },
      { heading: 'Tips Cari Kerja di Yogyakarta', content: '• Bangun skill tech — banyak software house Yogya yang selalu hiring\n• Pertimbangkan remote work untuk perusahaan Jakarta\n• Manfaatkan komunitas kreatif dan tech Yogya yang sangat aktif' },
    ],
    freeVsMember: [
      { free: 'Baca tips umum', member: 'AI generate CV untuk tech & creative industry Yogya' },
      { free: 'Tahu industri besar', member: 'AI riset software house Yogya + interview preparation' },
      { free: 'Tips dasar', member: 'AI remote work strategy + LinkedIn optimizer' },
    ],
    lockedResources: [
      { title: 'Tech Company & Startup Yogyakarta 2026', teaser: 'Daftar software house dan startup Yogyakarta yang sedang hiring dengan info kultur dan benefit...' },
    ],
    relatedSlugs: ['kerja-di-semarang', 'kerja-di-bandung', 'cv-software-engineer', 'cv-content-writer'],
  },

  // ═══════════════════════════════════════
  // KATEGORI 3: Glossary / Istilah (6)
  // ═══════════════════════════════════════
  {
    slug: 'apa-itu-ats',
    category: 'istilah',
    title: 'Apa Itu ATS (Applicant Tracking System)?',
    seoTitle: 'Apa Itu ATS? Pengertian & Cara Lolos ATS 2026 | MantraSkill',
    seoDescription: 'Pengertian ATS (Applicant Tracking System), cara kerjanya, dan kenapa penting untuk CV kamu. Pelajari cara lolos filter ATS.',
    sections: [
      { heading: 'Definisi ATS', content: 'ATS (Applicant Tracking System) adalah software yang digunakan perusahaan untuk menyaring CV secara otomatis sebelum dibaca HRD. ATS memindai CV kamu untuk mencari keyword yang sesuai dengan job description. Jika tidak ditemukan, CV kamu langsung ditolak — tanpa pernah dibaca manusia.\n\nATS bekerja dengan cara parsing (membaca) teks di CV kamu, lalu mencocokkan dengan kriteria yang ditentukan recruiter. Kriteria ini biasanya mencakup: keyword skill yang relevan, pengalaman kerja minimum, pendidikan, dan lokasi. CV yang mendapat skor tinggi akan masuk ke shortlist HRD, sisanya langsung ditolak.' },
      { heading: 'Kenapa ATS Penting untuk Karir Kamu?', content: 'Lebih dari 75% perusahaan besar di Indonesia sudah menggunakan ATS. Artinya, CV kamu harus "berbicara" dalam bahasa yang dipahami mesin sebelum bisa sampai ke mata HRD. Tanpa pemahaman ATS, kamu mungkin sudah ditolak ratusan kali tanpa sadar.\n\nATS populer yang dipakai di Indonesia antara lain: Workday, Taleo (Oracle), Greenhouse, Lever, dan Kalibrr. Masing-masing punya cara parsing yang sedikit berbeda, tapi prinsip dasarnya sama: CV yang simpel, terstruktur, dan keyword-rich akan mendapat skor lebih tinggi.' },
      { heading: 'Cara Membuat CV yang Lolos ATS', content: 'Berikut langkah-langkah konkret agar CV kamu lolos filter ATS:\n\n1. Gunakan format file yang tepat — PDF atau DOCX. Hindari format gambar (JPG, PNG) karena ATS tidak bisa membacanya.\n2. Pakai heading standar — "Pengalaman Kerja", "Pendidikan", "Keahlian". Jangan heading kreatif seperti "Perjalanan Karir" atau menggunakan ikon.\n3. Masukkan keyword dari job description — Baca JD target, identifikasi skill dan keyword penting, lalu masukkan secara natural di CV kamu.\n4. Hindari tabel, kolom, dan grafik — ATS sering gagal membaca layout kompleks. Gunakan format satu kolom yang linear.\n5. Jangan gunakan header/footer — Beberapa ATS tidak membaca teks di header/footer dokumen.\n6. Sertakan info kontak lengkap — Nama, email, nomor telepon, dan LinkedIn di bagian atas CV.' },
      { heading: 'Perbedaan CV ATS-Friendly vs CV Biasa', content: 'CV biasa sering dibuat dengan fokus visual: warna, grafik skill bar, layout multi-kolom, ikon. Ini bagus untuk dilihat manusia, tapi buruk untuk ATS.\n\nCV ATS-friendly mengutamakan:\n• Struktur teks yang bersih dan linear\n• Heading standar yang dikenali mesin\n• Keyword yang sesuai dengan job description target\n• Format file yang bisa di-parse (bukan gambar)\n• Bullet points dengan action verb dan metrik\n\nKabar baiknya: CV ATS-friendly yang baik juga enak dibaca manusia. Format yang clean dan terstruktur justru lebih profesional di mata HRD.' },
      { heading: 'Tools Gratis untuk Cek CV ATS', content: 'MantraSkill menyediakan tool cek CV ATS gratis yang bisa kamu gunakan tanpa login. Cukup paste teks CV kamu dan dapatkan skor ATS instan beserta rekomendasi perbaikan spesifik.\n\nTool ini menganalisis 6 aspek kunci:\n• Panjang CV — apakah terlalu pendek atau terlalu panjang\n• Struktur section — apakah ada heading standar ATS\n• Kata kerja aksi — apakah bullet points dimulai dengan action verb\n• Metrik & angka — apakah ada pencapaian terukur\n• Info kontak — apakah email dan telepon tersedia\n• Format bullet points — apakah menggunakan format yang ATS-friendly\n\nSetelah cek gratis, member MantraSkill bisa menggunakan AI CV Builder untuk langsung membuat CV ATS-friendly dengan skor 90+ secara otomatis.' },
    ],
    freeVsMember: [
      { free: 'Tahu definisi ATS', member: 'AI analisis CV kamu vs ATS + skor kompatibilitas real-time' },
      { free: 'Baca tips umum', member: 'AI rewrite CV otomatis agar lolos ATS + keyword matching per JD' },
      { free: 'Cek CV manual', member: 'Free CV Checker + AI optimizer dengan 25+ kriteria' },
    ],
    lockedResources: [
      { title: 'Checklist Lolos ATS 2026', teaser: 'Daftar 15 kriteria yang harus dipenuhi CV kamu agar lolos filter ATS di perusahaan besar...' },
    ],
    relatedSlugs: ['apa-itu-cover-letter', 'apa-itu-star-method', 'cv-software-engineer', 'cv-marketing'],
    faqs: [
      { question: 'Bagaimana cara lolos ATS?', answer: 'Gunakan format CV standar (tanpa tabel/grafik), heading yang jelas (Pengalaman, Pendidikan, Keahlian), dan masukkan keyword dari job description.' },
      { question: 'Apakah semua perusahaan pakai ATS?', answer: 'Sekitar 75-90% perusahaan besar di Indonesia sudah menggunakan ATS. Startup kecil mungkin belum, tapi CV ATS-friendly tetap lebih mudah dibaca HRD.' },
    ],
  },
  {
    slug: 'apa-itu-star-method',
    category: 'istilah',
    title: 'Apa Itu Metode STAR untuk Interview?',
    seoTitle: 'Apa Itu Metode STAR? Cara Jawab Interview 2026 | MantraSkill',
    seoDescription: 'Pengertian metode STAR (Situation, Task, Action, Result) untuk menjawab pertanyaan interview kerja. Tips dan contoh lengkap.',
    sections: [
      { heading: 'Definisi Metode STAR', content: 'STAR adalah singkatan dari Situation, Task, Action, Result — sebuah framework untuk menjawab pertanyaan behavioral interview secara terstruktur. Dengan metode ini, jawaban kamu tidak berputar-putar tapi langsung menunjukkan kompetensi melalui pengalaman nyata.' },
      { heading: 'Kenapa STAR Penting untuk Karir Kamu?', content: 'Hampir semua perusahaan besar menggunakan behavioral interview. Tanpa metode STAR, jawaban kamu akan terasa tidak terstruktur dan sulit dinilai oleh interviewer. Kandidat yang menggunakan STAR secara konsisten memiliki tingkat keberhasilan interview 40% lebih tinggi.' },
    ],
    freeVsMember: [
      { free: 'Tahu teori STAR', member: 'AI Simulator latihan interview dengan feedback real-time' },
      { free: 'Baca definisi', member: 'Simulasi 10+ pertanyaan spesifik posisi target + scoring' },
      { free: 'Tips umum', member: 'AI generate jawaban STAR dari pengalaman kamu secara otomatis' },
    ],
    lockedResources: [
      { title: 'Template Jawaban STAR untuk 10 Pertanyaan Umum', teaser: 'Template siap pakai untuk pertanyaan seperti "ceritakan tentang konflik di tempat kerja" dan "berikan contoh leadership"...' },
    ],
    relatedSlugs: ['apa-itu-cover-letter', 'apa-itu-soft-skill', 'apa-itu-networking', 'cv-marketing'],
  },
  {
    slug: 'apa-itu-cover-letter',
    category: 'istilah',
    title: 'Apa Itu Cover Letter? Panduan Lengkap 2026',
    seoTitle: 'Apa Itu Cover Letter? Pengertian & Tips 2026 | MantraSkill',
    seoDescription: 'Pengertian cover letter, bedanya dengan CV, dan kenapa penting saat melamar kerja. Panduan dasar untuk fresh graduate.',
    sections: [
      { heading: 'Definisi Cover Letter', content: 'Cover letter adalah surat pengantar yang menyertai CV saat melamar kerja. Berbeda dengan CV yang berisi data faktual, cover letter adalah kesempatan kamu untuk "bercerita" — menjelaskan kenapa kamu tertarik dengan posisi tersebut dan apa yang membuat kamu kandidat terbaik.' },
      { heading: 'Kenapa Cover Letter Penting untuk Karir Kamu?', content: 'Meski tidak semua perusahaan mewajibkan, cover letter yang baik bisa menjadi pembeda antara kamu dan kandidat lain dengan kualifikasi serupa. Survey menunjukkan 83% HRD mengatakan cover letter yang baik bisa membuat mereka memanggil kandidat yang CV-nya "biasa saja".' },
    ],
    freeVsMember: [
      { free: 'Tahu definisi cover letter', member: 'AI generate cover letter custom per perusahaan dalam 2 menit' },
      { free: 'Baca tips umum', member: 'Template cover letter + AI personalization per JD' },
      { free: 'Tulis manual', member: 'AI Cover Letter Generator + tone & style optimizer' },
    ],
    lockedResources: [
      { title: 'Template Cover Letter untuk 5 Industri', teaser: 'Template cover letter yang sudah proven untuk industri tech, finance, FMCG, consulting, dan startup...' },
    ],
    relatedSlugs: ['apa-itu-ats', 'apa-itu-personal-branding', 'apa-itu-star-method', 'cv-admin'],
  },
  {
    slug: 'apa-itu-personal-branding',
    category: 'istilah',
    title: 'Apa Itu Personal Branding untuk Karir?',
    seoTitle: 'Apa Itu Personal Branding? Tips Karir 2026 | MantraSkill',
    seoDescription: 'Pengertian personal branding untuk karir, cara membangunnya di LinkedIn, dan kenapa penting untuk fresh graduate di 2026.',
    sections: [
      { heading: 'Definisi Personal Branding', content: 'Personal branding adalah cara kamu mempresentasikan diri secara profesional kepada dunia — apa yang orang pikirkan tentang kamu saat nama kamu disebut dalam konteks karir. Di era digital, personal branding kamu adalah LinkedIn, portfolio, dan jejak digital profesional kamu.' },
      { heading: 'Kenapa Personal Branding Penting untuk Karir Kamu?', content: '87% recruiter mengaku mencari kandidat di Google dan LinkedIn sebelum memanggil interview. Personal branding yang kuat bisa membuat recruiter menghubungi KAMU, bukan sebaliknya. Ini mengubah job search dari "melamar" menjadi "dipilih".' },
    ],
    freeVsMember: [
      { free: 'Tahu definisi personal branding', member: 'AI audit LinkedIn profile + branding strategy generator' },
      { free: 'Tips umum', member: 'LinkedIn Optimizer + AI content calendar untuk visibility' },
      { free: 'Baca teori', member: 'AI generate About section, headline, dan summary LinkedIn' },
    ],
    lockedResources: [
      { title: 'Personal Branding Checklist 2026', teaser: 'Daftar 20 langkah membangun personal brand profesional dari nol di LinkedIn dan sosial media...' },
    ],
    relatedSlugs: ['apa-itu-networking', 'apa-itu-cover-letter', 'cv-content-writer', 'cv-marketing'],
  },
  {
    slug: 'apa-itu-networking',
    category: 'istilah',
    title: 'Apa Itu Networking untuk Karir?',
    seoTitle: 'Apa Itu Networking Profesional? Tips 2026 | MantraSkill',
    seoDescription: 'Pengertian networking profesional, cara membangun koneksi karir, dan kenapa networking penting untuk fresh graduate di 2026.',
    sections: [
      { heading: 'Definisi Networking Profesional', content: 'Networking adalah proses membangun dan memelihara hubungan profesional yang saling menguntungkan. Bukan sekadar "kenal banyak orang", tapi membentuk koneksi bermakna yang bisa membuka peluang karir, mentorship, dan kolaborasi.' },
      { heading: 'Kenapa Networking Penting untuk Karir Kamu?', content: 'Data menunjukkan 70-80% lowongan kerja tidak pernah diiklankan secara publik — mereka diisi melalui referral dan networking. Artinya, tanpa networking yang baik, kamu hanya bersaing untuk 20-30% lowongan yang terlihat. Ini mengubah permainan sepenuhnya.' },
    ],
    freeVsMember: [
      { free: 'Tahu definisi networking', member: 'AI networking message generator + LinkedIn connection strategy' },
      { free: 'Tips umum', member: 'AI riset 50 kontak relevan + approach template per industri' },
      { free: 'Baca teori', member: 'AI follow-up sequence + relationship nurturing planner' },
    ],
    lockedResources: [
      { title: 'Template Pesan Networking LinkedIn', teaser: 'Template cold message, warm intro, dan follow-up yang sudah proven untuk berbagai situasi networking...' },
    ],
    relatedSlugs: ['apa-itu-personal-branding', 'apa-itu-soft-skill', 'kerja-di-jakarta', 'cv-sales'],
  },
  {
    slug: 'apa-itu-soft-skill',
    category: 'istilah',
    title: 'Apa Itu Soft Skill? Pentingnya untuk Karir',
    seoTitle: 'Apa Itu Soft Skill? Daftar & Tips 2026 | MantraSkill',
    seoDescription: 'Pengertian soft skill, daftar soft skill paling dicari perusahaan 2026, dan cara mengembangkannya untuk karir kamu.',
    sections: [
      { heading: 'Definisi Soft Skill', content: 'Soft skill adalah kemampuan non-teknis yang berkaitan dengan cara kamu bekerja dan berinteraksi dengan orang lain. Berbeda dengan hard skill yang bisa dipelajari dari buku, soft skill dikembangkan melalui pengalaman dan kesadaran diri. Contoh: komunikasi, kepemimpinan, dan problem solving.' },
      { heading: 'Kenapa Soft Skill Penting untuk Karir Kamu?', content: 'Studi LinkedIn menunjukkan 92% hiring manager mengatakan soft skill sama penting atau lebih penting dari hard skill. Di era AI, kemampuan teknis semakin mudah diotomasi, tapi soft skill seperti empati, kreativitas, dan critical thinking justru semakin berharga.' },
    ],
    freeVsMember: [
      { free: 'Tahu definisi soft skill', member: 'AI interview simulator untuk melatih soft skill secara langsung' },
      { free: 'Baca daftar soft skill', member: 'AI assessment soft skill kamu + development plan personalized' },
      { free: 'Tips umum', member: 'AI generate contoh soft skill untuk CV & interview dari pengalaman kamu' },
    ],
    lockedResources: [
      { title: 'Top 10 Soft Skill yang Dicari 2026', teaser: 'Daftar soft skill paling dicari recruiter beserta cara menunjukkannya di CV dan interview...' },
    ],
    relatedSlugs: ['apa-itu-star-method', 'apa-itu-networking', 'apa-itu-personal-branding', 'cv-customer-service'],
  },

  // ═══════════════════════════════════════
  // KATEGORI 4: Gaji [Posisi] 2026 (4)
  // ═══════════════════════════════════════
  {
    slug: 'gaji-fresh-graduate-2026',
    category: 'gaji',
    title: 'Gaji Fresh Graduate 2026: Range & Tips Negosiasi',
    seoTitle: 'Gaji Fresh Graduate 2026 Indonesia | Range & Tips | MantraSkill',
    seoDescription: 'Range gaji fresh graduate 2026 di Indonesia. Faktor yang mempengaruhi gaji pertama dan tips negosiasi untuk lulusan baru.',
    sections: [
      { heading: 'Range Gaji Fresh Graduate 2026', content: 'Gaji fresh graduate di Indonesia bervariasi tergantung industri, lokasi, dan universitas. Secara umum, range gaji fresh graduate 2026 berkisar antara Rp 4.500.000 - Rp 8.000.000 per bulan untuk posisi entry-level. Di sektor tech dan consulting, angka ini bisa mencapai Rp 8.000.000 - Rp 15.000.000.\n\nBerikut breakdown per industri:\n• Perbankan & Keuangan: Rp 5.000.000 - Rp 9.000.000\n• Tech & Startup: Rp 6.000.000 - Rp 15.000.000\n• FMCG & Manufaktur: Rp 4.500.000 - Rp 7.500.000\n• Consulting (Big 4): Rp 7.000.000 - Rp 12.000.000\n• Media & Kreatif: Rp 4.000.000 - Rp 7.000.000\n• E-commerce: Rp 5.500.000 - Rp 10.000.000' },
      { heading: 'Faktor yang Mempengaruhi Gaji', content: '• Industri — Tech, consulting, dan finance cenderung membayar lebih tinggi\n• Lokasi — Jakarta dan kota besar umumnya menawarkan gaji lebih tinggi (UMR Jakarta 2026 ~Rp 5.300.000)\n• Skill & Sertifikasi — sertifikasi tambahan bisa meningkatkan gaji 15-30%\n• Universitas — alumni PTN top dan universitas luar negeri sering mendapat tawaran lebih tinggi\n• Kemampuan bahasa asing — bilingual (terutama Inggris) bisa menambah 20-40% gaji\n• Pengalaman magang — fresh graduate dengan 2+ magang relevan lebih kompetitif\n\nPerlu dicatat: gaji bukan satu-satunya faktor. Pertimbangkan juga benefit (BPJS, asuransi swasta, tunjangan makan/transport), kultur kerja, learning opportunity, dan jenjang karir saat mengevaluasi tawaran.' },
      { heading: 'Tips Negosiasi Gaji Pertama', content: 'Banyak fresh graduate takut bernegosiasi dan langsung menerima tawaran pertama. Padahal, riset menunjukkan 73% perusahaan mengharapkan kandidat bernegosiasi. Kunci negosiasi: riset range gaji posisi tersebut, tunjukkan value unik kamu, dan jangan sebut angka duluan.\n\nLangkah-langkah negosiasi gaji:\n1. Riset benchmark gaji — Gunakan Glassdoor, JobStreet Salary Guide, atau tanya alumni\n2. Jangan sebut ekspektasi gaji di awal — Biarkan perusahaan memberikan angka duluan\n3. Jika ditanya ekspektasi, berikan range — "Berdasarkan riset saya, range untuk posisi ini di industri X adalah Rp Y - Rp Z"\n4. Highlight value unik — Sertifikasi, bilingual, project relevan, magang di kompetitor\n5. Pertimbangkan total package — Gaji pokok + bonus + benefit. Kadang benefit senilai 30% gaji pokok\n6. Jangan takut counter-offer — "Terima kasih atas tawarannya. Berdasarkan skill dan kontribusi yang bisa saya berikan, apakah ada ruang untuk [angka]?"' },
      { heading: 'Perbedaan Gaji per Kota', content: 'Lokasi sangat mempengaruhi range gaji fresh graduate di Indonesia:\n\n• Jakarta — Tertinggi, tapi biaya hidup juga paling tinggi. UMR ~Rp 5.300.000, rata-rata fresh graduate Rp 5.500.000 - Rp 9.000.000\n• Surabaya — 70-80% dari Jakarta. Rata-rata Rp 4.500.000 - Rp 7.000.000\n• Bandung — Populer untuk tech, gaji kompetitif untuk startup. Rata-rata Rp 4.000.000 - Rp 8.000.000\n• Yogyakarta — UMR terendah di Jawa, tapi banyak remote opportunity. Rata-rata Rp 3.500.000 - Rp 6.000.000\n• Medan — Hub bisnis Sumatera. Rata-rata Rp 4.000.000 - Rp 6.500.000\n\nTips: Pertimbangkan purchasing power, bukan nominal. Gaji Rp 6 juta di Yogya bisa lebih "kaya" dari Rp 8 juta di Jakarta setelah menghitung biaya kos, transport, dan makan.' },
    ],
    freeVsMember: [
      { free: 'Tahu range gaji umum', member: 'AI salary research per posisi + perusahaan spesifik' },
      { free: 'Tips negosiasi basic', member: 'AI negotiation script generator + practice simulator' },
      { free: 'Baca faktor umum', member: 'AI analisis market value kamu berdasarkan skill & pengalaman' },
    ],
    lockedResources: [
      { title: 'Salary Benchmark Fresh Graduate 2026', teaser: 'Data gaji detail per industri, posisi, dan kota untuk fresh graduate dengan perbandingan benefit...' },
      { title: 'Script Negosiasi Gaji', teaser: 'Template script negosiasi gaji untuk fresh graduate yang sudah proven berhasil di berbagai industri...' },
    ],
    relatedSlugs: ['gaji-marketing-2026', 'gaji-data-analyst-2026', 'gaji-software-engineer-2026', 'kerja-di-jakarta'],
    faqs: [
      { question: 'Berapa UMR Jakarta 2026?', answer: 'UMR DKI Jakarta 2026 diperkirakan sekitar Rp 5.300.000 per bulan. Fresh graduate di perusahaan swasta umumnya mendapat di atas UMR.' },
      { question: 'Kapan waktu terbaik negosiasi gaji?', answer: 'Negosiasi gaji paling efektif dilakukan setelah menerima offering letter, bukan saat interview awal. Riset benchmark gaji sebelum negosiasi.' },
    ],
  },
  {
    slug: 'gaji-marketing-2026',
    category: 'gaji',
    title: 'Gaji Marketing 2026: Digital & Tradisional',
    seoTitle: 'Gaji Marketing 2026 Indonesia | Digital & Traditional | MantraSkill',
    seoDescription: 'Range gaji posisi marketing 2026 di Indonesia. Perbandingan gaji digital marketing vs traditional marketing dan tips negosiasi.',
    sections: [
      { heading: 'Range Gaji Marketing 2026', content: 'Gaji di bidang marketing sangat bervariasi tergantung spesialisasi. Digital marketing specialist: Rp 5.000.000 - Rp 12.000.000. Marketing manager: Rp 12.000.000 - Rp 25.000.000. Head of Marketing: Rp 25.000.000 - Rp 50.000.000+. Digital marketing cenderung dibayar lebih tinggi dari traditional marketing.' },
      { heading: 'Faktor yang Mempengaruhi Gaji Marketing', content: '• Spesialisasi — Performance marketing dan growth hacking dibayar premium\n• Portfolio — Campaign dengan ROI terukur meningkatkan bargaining power\n• Sertifikasi — Google Ads, Meta Blueprint, HubSpot menambah value 20-40%' },
      { heading: 'Tips Negosiasi Gaji Marketing', content: 'Untuk posisi marketing, kunci negosiasi adalah DATA. Bawa bukti campaign yang pernah kamu jalankan dengan hasil terukur. Satu campaign sukses dengan ROI jelas lebih berharga dari 5 tahun pengalaman tanpa metrik.' },
    ],
    freeVsMember: [
      { free: 'Tahu range gaji umum', member: 'AI salary benchmark per perusahaan + posisi spesifik' },
      { free: 'Tips negosiasi basic', member: 'AI negotiation strategy berdasarkan portfolio kamu' },
      { free: 'Baca faktor umum', member: 'AI market value calculator untuk marketing professional' },
    ],
    lockedResources: [
      { title: 'Salary Guide Marketing 2026', teaser: 'Data gaji detail untuk setiap level dan spesialisasi marketing di berbagai industri...' },
    ],
    relatedSlugs: ['gaji-fresh-graduate-2026', 'cv-marketing', 'cv-content-writer', 'gaji-data-analyst-2026'],
  },
  {
    slug: 'gaji-data-analyst-2026',
    category: 'gaji',
    title: 'Gaji Data Analyst 2026: Junior hingga Senior',
    seoTitle: 'Gaji Data Analyst 2026 Indonesia | Range Lengkap | MantraSkill',
    seoDescription: 'Range gaji data analyst 2026 di Indonesia dari junior hingga senior. Skill yang meningkatkan gaji dan tips negosiasi.',
    sections: [
      { heading: 'Range Gaji Data Analyst 2026', content: 'Data analyst menjadi salah satu posisi dengan pertumbuhan gaji tercepat. Junior data analyst: Rp 6.000.000 - Rp 10.000.000. Mid-level: Rp 10.000.000 - Rp 18.000.000. Senior/Lead: Rp 18.000.000 - Rp 35.000.000. Data scientist bisa mencapai Rp 25.000.000 - Rp 50.000.000+.' },
      { heading: 'Faktor yang Mempengaruhi Gaji Data Analyst', content: '• Tech stack — Python + SQL + cloud tools dibayar lebih dari Excel-only\n• Industri — Fintech dan e-commerce membayar premium untuk data talent\n• Impact — Analyst yang bisa menunjukkan business impact dari insight mereka naik gaji lebih cepat' },
      { heading: 'Tips Negosiasi Gaji Data Analyst', content: 'Data analyst punya keuntungan unik dalam negosiasi: kamu bisa menggunakan DATA untuk mendukung permintaan gaji kamu sendiri. Riset benchmark gaji, kuantifikasi impact project kamu, dan presentasikan seperti kamu mempresentasikan insight ke stakeholder.' },
    ],
    freeVsMember: [
      { free: 'Tahu range gaji umum', member: 'AI salary benchmark data analyst per kota & industri' },
      { free: 'Tips negosiasi basic', member: 'AI negotiation strategy + impact quantification helper' },
      { free: 'Baca faktor umum', member: 'AI career path planner: analyst → scientist → engineer' },
    ],
    lockedResources: [
      { title: 'Salary Guide Data Roles 2026', teaser: 'Data gaji komprehensif untuk data analyst, scientist, dan engineer di berbagai level dan industri...' },
    ],
    relatedSlugs: ['gaji-software-engineer-2026', 'gaji-fresh-graduate-2026', 'cv-data-analyst', 'apa-itu-ats'],
  },
  {
    slug: 'gaji-software-engineer-2026',
    category: 'gaji',
    title: 'Gaji Software Engineer 2026: Startup vs Corporate',
    seoTitle: 'Gaji Software Engineer 2026 Indonesia | Startup vs Corp | MantraSkill',
    seoDescription: 'Range gaji software engineer 2026 di Indonesia. Perbandingan startup vs corporate, remote vs onsite, dan tips negosiasi.',
    sections: [
      { heading: 'Range Gaji Software Engineer 2026', content: 'Software engineer tetap menjadi salah satu posisi dengan gaji tertinggi. Junior engineer: Rp 7.000.000 - Rp 15.000.000. Mid-level: Rp 15.000.000 - Rp 30.000.000. Senior: Rp 30.000.000 - Rp 60.000.000. Staff/Principal di tech besar: Rp 50.000.000 - Rp 100.000.000+.' },
      { heading: 'Faktor yang Mempengaruhi Gaji Engineer', content: '• Tech stack — Golang, Rust, dan Kubernetes engineer dibayar premium\n• Tipe perusahaan — Unicorn dan perusahaan asing umumnya lebih tinggi\n• Remote work — engineer yang bekerja remote untuk perusahaan luar negeri bisa mendapat gaji 2-5x lipat' },
      { heading: 'Tips Negosiasi Gaji Engineer', content: 'Engineer punya leverage tinggi dalam negosiasi karena demand > supply. Kunci: tunjukkan kontribusi teknis spesifik (system design, performance improvement, cost reduction). Jangan ragu minta equity atau remote flexibility sebagai bagian dari paket kompensasi.' },
    ],
    freeVsMember: [
      { free: 'Tahu range gaji umum', member: 'AI salary benchmark per tech stack & company type' },
      { free: 'Tips negosiasi basic', member: 'AI negotiation strategy + total compensation calculator' },
      { free: 'Baca faktor umum', member: 'AI career path planner engineer + remote opportunity finder' },
    ],
    lockedResources: [
      { title: 'Salary Guide Software Engineer 2026', teaser: 'Data gaji detail per tech stack, company type, dan level dari junior hingga staff engineer...' },
      { title: 'Remote Work Salary Guide', teaser: 'Panduan gaji remote work untuk engineer Indonesia yang bekerja untuk perusahaan asing...' },
    ],
    relatedSlugs: ['gaji-data-analyst-2026', 'gaji-fresh-graduate-2026', 'cv-software-engineer', 'kerja-di-bandung'],
  },
];

export const getSatellitePageBySlug = (slug: string): SatellitePage | undefined =>
  satellitePages.find((p) => p.slug === slug);

export const getRelatedPages = (slugs: string[]): SatellitePage[] =>
  slugs.map((s) => satellitePages.find((p) => p.slug === s)).filter(Boolean) as SatellitePage[];
