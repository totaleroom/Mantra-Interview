const fs = require('fs');

const modulesData = {
  "1": {
    title: "Menemukan Arah Karir & Analisa Diri",
    sections: [
      {
        title: "Pentingnya Analisa Diri",
        content: "<p>Sebelum melamar kerja, kamu wajib mengenal diri sendiri. Analisa diri membantu memetakan kelebihan, kelemahan, dan nilai jualmu di mata HRD.</p><p>Gunakan metode analisis SWOT (Strengths, Weaknesses, Opportunities, Threats) untuk dirimu sendiri.</p>",
        quiz: [{
          question: "Apa fungsi utama dari analisa diri sebelum melamar kerja?",
          options: ["Menghitung gaji yang diinginkan", "Memetakan kelebihan dan kelemahan untuk nilai jual", "Menulis CV lebih panjang", "Mencari teman orang dalam"],
          correctIndex: 1,
          explanation: "Analisa diri membantu memetakan nilai jualmu yang sesungguhnya di mata rekruter."
        }]
      },
      {
        title: "Memilih Industri",
        content: "<p>Industri menentukan gaya kerjamu. Startup bergerak cepat, sementara corporate lebih stabil. Pilihlah yang sesuai dengan kepribadianmu.</p>",
        quiz: [{
          question: "Apa perbedaan utama startup dan korporat konvensional?",
          options: ["Gaji selalu lebih besar di startup", "Startup umumnya bergerak lebih cepat dan dinamis", "Korporat selalu lebih santai", "Tidak ada bedanya"],
          correctIndex: 1,
          explanation: "Startup dikenal karena kelincahan dan pergerakannya yang dinamis."
        }]
      }
    ]
  },
  "2": {
    title: "Membangun CV ATS-Friendly",
    sections: [
      {
        title: "Apa itu ATS?",
        content: "<p>ATS (Applicant Tracking System) adalah robot pintar yang menyeleksi CV. Jika CV-mu tidak ramah ATS, ia akan ditolak sebelum sempat dibaca HRD.</p>",
        quiz: [{
          question: "Apa singkatan dari ATS?",
          options: ["Automated Tracking Software", "Applicant Tracking System", "Application Testing System", "Auto Text Scanner"],
          correctIndex: 1,
          explanation: "ATS adalah Applicant Tracking System yang digunakan HRD untuk screening CV otomatis."
        }]
      }
    ]
  },
  "3": {
    title: "Optimasi Profil LinkedIn",
    sections: [
      {
        title: "Pentingnya LinkedIn",
        content: "<p>LinkedIn bukan sekadar CV online, melainkan alat networking terkuat. Pastikan menggunakan foto profesional dan mengisi headline yang deskriptif.</p>",
        quiz: [{
          question: "Apa fungsi utama LinkedIn dalam job search?",
          options: ["Media sosial hiburan", "Tempat menyimpan foto", "Alat networking dan branding profesional", "Bermain game"],
          correctIndex: 2,
          explanation: "LinkedIn adalah alat utama untuk personal branding dan networking profesional."
        }]
      }
    ]
  },
  "4": {
    title: "Strategi Melamar & Networking",
    sections: [
      {
        title: "Cold Emailing",
        content: "<p>Cold emailing adalah seni mengirim pesan ke HRD atau manager di perusahaan incaranmu secara langsung tanpa diminta.</p>",
        quiz: [{
          question: "Apa tujuan utama Cold Email?",
          options: ["Spamming", "Minta uang", "Menjangkau decision maker secara langsung", "Berlangganan newsletter"],
          correctIndex: 2,
          explanation: "Cold email bertujuan untuk membuka percakapan dengan decision maker."
        }]
      }
    ]
  },
  "5": {
    title: "Interview Mastery (Simulasi)",
    sections: [
      {
        title: "Teknik STAR",
        content: "<p>Gunakan teknik STAR (Situation, Task, Action, Result) saat menjawab pertanyaan wawancara behavioral untuk hasil yang terstruktur.</p>",
        quiz: [{
          question: "Apa kepanjangan dari STAR?",
          options: ["Situation, Task, Action, Result", "Start, Target, Aim, Run", "Story, Timeline, Action, Reason", "Situation, Time, Action, Review"],
          correctIndex: 0,
          explanation: "STAR = Situation, Task, Action, Result."
        }]
      }
    ]
  }
};

fs.writeFileSync('data/modules.json', JSON.stringify(modulesData, null, 2));
console.log('Modules dummy data generated');
