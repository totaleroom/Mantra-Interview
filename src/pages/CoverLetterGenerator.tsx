import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/landing/Header';
import { ArrowLeft, FileEdit, Copy, Check, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import PageTransition from '@/components/PageTransition';

const CoverLetterGenerator: React.FC = () => {
  const { user, loading, isSubscriptionActive } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    position: '',
    company: '',
    jobDesc: '',
    achievement: '',
  });
  const [generated, setGenerated] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Subscription check handled by SubscriptionGuard wrapper

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: 'Prompt disalin! 📋', description: 'Paste ke ChatGPT, Gemini, atau Claude kamu.' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const prompts = [
    {
      id: 'full',
      title: 'Full Cover Letter',
      color: 'bg-neoCyan',
      prompt: `Kamu adalah career coach dan cover letter expert. Buatkan cover letter profesional dalam Bahasa Indonesia untuk posisi berikut:

- Posisi: ${form.position}
- Perusahaan: ${form.company}
- Job Description: ${form.jobDesc}
- Achievement Utama Pelamar: ${form.achievement}

Gunakan struktur 4 paragraf:

1. HOOK (2-3 kalimat): Buka dengan sesuatu yang bikin HRD tertarik baca. JANGAN pakai "Dengan hormat, saya bermaksud melamar..." — itu template tahun 2010. Mulai dengan insight tentang perusahaan, industri challenge, atau statement bold tentang kontribusi yang bisa diberikan.

2. EVIDENCE (3-4 kalimat): Hubungkan achievement pelamar dengan requirement di job description. Gunakan angka dan metrik spesifik. Tunjukkan DAMPAK, bukan sekadar tugas.

3. CONNECTION (2-3 kalimat): Jelaskan kenapa perusahaan INI (bukan perusahaan lain). Riset tentang values, produk, atau inisiatif perusahaan dan hubungkan dengan passion/pengalaman pelamar.

4. CLOSE (2 kalimat): CTA yang confident tapi tidak arogan. Ajak untuk diskusi lebih lanjut.

Rules:
- Bahasa Indonesia semi-formal, profesional tapi tidak kaku
- Maksimal 400 kata
- JANGAN pakai klise: "saya orang yang pekerja keras", "saya passionate tentang...", "saya yakin saya kandidat yang tepat"
- Tampilkan personality pelamar
- Format siap kirim (termasuk salam pembuka dan penutup)`,
    },
    {
      id: 'hook',
      title: 'Opening Hook Generator',
      color: 'bg-neoPink',
      prompt: `Kamu adalah copywriter yang expert di cover letter opening lines. Buatkan 5 variasi opening hook untuk cover letter dengan konteks:

- Posisi: ${form.position}
- Perusahaan: ${form.company}
- Key requirement dari JD: ${form.jobDesc}
- Achievement pelamar: ${form.achievement}

Rules untuk setiap hook:
1. Maksimal 2 kalimat
2. HARUS bikin HRD pengen baca paragraf selanjutnya
3. JANGAN mulai dengan "Dengan hormat" atau "Saya bermaksud melamar"
4. Variasi approach:
   - Hook #1: Mulai dengan insight tentang tantangan industri
   - Hook #2: Mulai dengan achievement/angka impressive
   - Hook #3: Mulai dengan pertanyaan provokatif
   - Hook #4: Mulai dengan referensi berita/inisiatif perusahaan
   - Hook #5: Mulai dengan bold statement tentang value yang dibawa

Format: Berikan 5 hook + label approach + rating efektivitas (⭐1-5)`,
    },
    {
      id: 'research',
      title: 'Company Research Integration',
      color: 'bg-neoViolet',
      prompt: `Kamu adalah career strategist. Bantu saya mengintegrasikan riset perusahaan ke dalam cover letter saya.

Konteks:
- Saya melamar posisi: ${form.position}
- Di perusahaan: ${form.company}
- Achievement saya: ${form.achievement}

Tolong lakukan:

1. RESEARCH CHECKLIST: Berikan 10 hal yang harus saya riset tentang ${form.company} sebelum nulis cover letter (values, recent news, produk, culture, CEO vision, dll)

2. CONNECTION MAPPING: Untuk setiap item riset, berikan contoh kalimat bagaimana menghubungkannya dengan profil saya di cover letter

3. RED FLAG DETECTOR: 3 hal yang JANGAN disebutkan di cover letter (yang bikin kelihatan belum riset atau asal apply)

4. TEMPLATE KALIMAT: 5 template kalimat "company-specific" yang bisa saya customize:
   - "Saya notice bahwa [perusahaan] baru saja [inisiatif]. Ini resonates dengan pengalaman saya di [bidang] karena..."
   - Dan 4 variasi lainnya

Output dalam Bahasa Indonesia.`,
    },
  ];

  if (loading) return null;

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-5 py-8">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 font-display text-xs uppercase mb-4 hover:text-neoPink transition-colors">
          <ArrowLeft size={14} /> Kembali ke Dashboard
        </button>

        <div className="bg-neoBlack text-white border-4 border-foreground p-6 shadow-neoLg mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileEdit size={24} className="text-neoPink" />
            <h1 className="font-display text-xl md:text-2xl uppercase text-neoPink">Cover Letter Prompt Generator</h1>
          </div>
          <p className="font-body text-sm text-gray-400">Generate prompt untuk bikin cover letter yang bikin HRD berhenti scroll. Copy → Paste ke AI.</p>
        </div>

        {/* Form */}
        <div className="bg-card border-4 border-foreground p-6 shadow-neo mb-8 space-y-4">
          <h2 className="font-display text-sm uppercase mb-2">📝 Detail Lamaran</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="font-display text-xs uppercase">Posisi yang Dilamar</Label>
              <Input placeholder="contoh: Frontend Developer" value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} className="border-2 border-foreground" />
            </div>
            <div>
              <Label className="font-display text-xs uppercase">Nama Perusahaan</Label>
              <Input placeholder="contoh: Tokopedia, Gojek, BCA" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className="border-2 border-foreground" />
            </div>
          </div>
          <div>
            <Label className="font-display text-xs uppercase">Job Description (copy-paste dari lowongan)</Label>
            <Textarea placeholder="Paste requirement dari job posting di sini..." value={form.jobDesc} onChange={e => setForm(p => ({ ...p, jobDesc: e.target.value }))} className="border-2 border-foreground" rows={4} />
          </div>
          <div>
            <Label className="font-display text-xs uppercase">Achievement Utama Kamu</Label>
            <Textarea placeholder="contoh: Meningkatkan traffic website 200% dalam 3 bulan, mengelola tim 5 orang..." value={form.achievement} onChange={e => setForm(p => ({ ...p, achievement: e.target.value }))} className="border-2 border-foreground" rows={3} />
          </div>
          <button
            onClick={() => {
              if (!form.position || !form.company) {
                toast({ title: 'Isi minimal Posisi dan Perusahaan', variant: 'destructive' });
                return;
              }
              setGenerated(true);
            }}
            className="w-full bg-neoPink border-4 border-foreground p-3 font-display text-sm uppercase shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={16} /> Generate Prompts
          </button>
        </div>

        {/* Generated Prompts */}
        {generated && (
          <div className="space-y-6">
            <h2 className="font-display text-lg uppercase flex items-center gap-2">
              <Sparkles size={18} className="text-neoPink" /> Prompt Siap Pakai
            </h2>
            {prompts.map(p => (
              <div key={p.id} className="border-4 border-foreground bg-card shadow-neo">
                <div className={`${p.color} px-4 py-3 border-b-4 border-foreground flex items-center justify-between`}>
                  <h3 className="font-display text-sm uppercase">{p.title}</h3>
                  <button
                    onClick={() => handleCopy(p.prompt, p.id)}
                    className="bg-foreground text-background px-3 py-1 font-display text-xs uppercase flex items-center gap-1 border-2 border-foreground shadow-neoSm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                  >
                    {copiedId === p.id ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Prompt</>}
                  </button>
                </div>
                <div className="p-4 max-h-48 overflow-y-auto">
                  <pre className="font-body text-xs whitespace-pre-wrap leading-relaxed text-muted-foreground">{p.prompt}</pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  );
};

export default CoverLetterGenerator;
