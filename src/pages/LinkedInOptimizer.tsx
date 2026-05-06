import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/landing/Header';
import { ArrowLeft, Linkedin, Copy, Check, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import PageTransition from '@/components/PageTransition';

const LinkedInOptimizer: React.FC = () => {
  const { user, loading, isSubscriptionActive } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    targetRole: '',
    industry: '',
    topSkills: '',
    experience: '',
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
      id: 'headline',
      title: 'Headline Optimizer',
      color: 'bg-neoLime',
      prompt: `Kamu adalah LinkedIn branding expert. Buatkan 5 variasi headline LinkedIn yang powerful untuk seseorang dengan profil berikut:

- Target Role: ${form.targetRole}
- Industri: ${form.industry}
- Top Skills: ${form.topSkills}
- Pengalaman: ${form.experience}

Rules:
1. Maksimal 120 karakter per headline
2. Gunakan formula: [Role] | [Value Proposition] | [Unique Angle]
3. Hindari kata klise seperti "passionate", "motivated", "hardworking"
4. Masukkan angka/metrik jika memungkinkan
5. Minimal 2 variasi harus mengandung keyword yang dicari recruiter

Format output: Berikan 5 headline dengan penjelasan singkat kenapa masing-masing efektif.`,
    },
    {
      id: 'about',
      title: 'About Section Writer',
      color: 'bg-neoCyan',
      prompt: `Kamu adalah LinkedIn copywriter expert. Buatkan "About" section LinkedIn menggunakan framework Hook-Story-Offer untuk profil berikut:

- Target Role: ${form.targetRole}
- Industri: ${form.industry}
- Top Skills: ${form.topSkills}
- Pengalaman: ${form.experience}

Struktur:
1. HOOK (2 kalimat): Buka dengan pertanyaan provokatif atau statement bold yang bikin orang berhenti scroll
2. STORY (3-4 kalimat): Ceritakan journey singkat — dari mana, challenge apa, apa yang dipelajari
3. PROOF (2-3 kalimat): Sebutkan skill, achievement, atau pengalaman konkret
4. OFFER (2 kalimat): Apa yang kamu tawarkan dan kenapa orang harus connect

Rules:
- Bahasa Indonesia semi-formal, energik, relatable
- Maksimal 2000 karakter
- Gunakan line break untuk readability
- Jangan pakai emoji berlebihan (maks 3)
- Akhiri dengan soft CTA untuk connect`,
    },
    {
      id: 'content',
      title: 'Post Content Ideas',
      color: 'bg-neoPink',
      prompt: `Kamu adalah LinkedIn content strategist. Buatkan 10 ide konten LinkedIn untuk seseorang dengan profil:

- Target Role: ${form.targetRole}
- Industri: ${form.industry}
- Top Skills: ${form.topSkills}
- Pengalaman: ${form.experience}

Untuk setiap ide, berikan:
1. Hook kalimat pertama (yang bikin orang klik "see more")
2. Angle/sudut pandang konten
3. Format yang cocok (story, listicle, hot take, carousel, poll)
4. Estimasi engagement potential (low/medium/high)

Mix konten:
- 3 konten edukasi (sharing knowledge)
- 3 konten storytelling (pengalaman personal)
- 2 konten hot take (opini kontroversial tapi profesional)
- 2 konten engagement (pertanyaan/poll)

Semua dalam Bahasa Indonesia.`,
    },
    {
      id: 'connection',
      title: 'Connection Request Message',
      color: 'bg-neoViolet',
      prompt: `Kamu adalah networking expert. Buatkan 3 variasi pesan connection request LinkedIn yang personal dan efektif untuk:

- Pengirim: ${form.targetRole} di bidang ${form.industry}
- Skills: ${form.topSkills}
- Background: ${form.experience}

Skenario:
1. Connect ke HRD/Recruiter perusahaan target
2. Connect ke profesional senior di industri yang sama
3. Connect ke alumni/peer yang sudah bekerja di perusahaan impian

Rules per pesan:
- Maksimal 300 karakter (limit LinkedIn)
- Jangan langsung minta kerja
- Tunjukkan genuine interest
- Sebutkan common ground (industri, topik, konten mereka)
- Akhiri dengan value proposition ringan

Format: 3 template + penjelasan kapan pakai masing-masing.`,
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
            <Linkedin size={24} className="text-neoCyan" />
            <h1 className="font-display text-xl md:text-2xl uppercase text-neoCyan">LinkedIn Prompt Generator</h1>
          </div>
          <p className="font-body text-sm text-gray-400">Generate prompt siap pakai untuk optimasi LinkedIn kamu. Copy → Paste ke AI favorit kamu.</p>
        </div>

        {/* Form */}
        <div className="bg-card border-4 border-foreground p-6 shadow-neo mb-8 space-y-4">
          <h2 className="font-display text-sm uppercase mb-2">📝 Isi Data Kamu</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="font-display text-xs uppercase">Target Role</Label>
              <Input placeholder="contoh: Digital Marketing Specialist" value={form.targetRole} onChange={e => setForm(p => ({ ...p, targetRole: e.target.value }))} className="border-2 border-foreground" />
            </div>
            <div>
              <Label className="font-display text-xs uppercase">Industri</Label>
              <Input placeholder="contoh: Tech Startup, FMCG, Banking" value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} className="border-2 border-foreground" />
            </div>
          </div>
          <div>
            <Label className="font-display text-xs uppercase">Top Skills (pisah koma)</Label>
            <Input placeholder="contoh: SEO, Content Strategy, Data Analytics" value={form.topSkills} onChange={e => setForm(p => ({ ...p, topSkills: e.target.value }))} className="border-2 border-foreground" />
          </div>
          <div>
            <Label className="font-display text-xs uppercase">Pengalaman Singkat</Label>
            <Textarea placeholder="contoh: Fresh graduate Ilmu Komunikasi, pernah magang 6 bulan di agency digital..." value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))} className="border-2 border-foreground" rows={3} />
          </div>
          <button
            onClick={() => {
              if (!form.targetRole || !form.industry) {
                toast({ title: 'Isi minimal Target Role dan Industri', variant: 'destructive' });
                return;
              }
              setGenerated(true);
            }}
            className="w-full bg-neoLime border-4 border-foreground p-3 font-display text-sm uppercase shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2"
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

export default LinkedInOptimizer;
