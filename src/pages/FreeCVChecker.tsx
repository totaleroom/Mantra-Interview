import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, AlertTriangle, XCircle, FileText, Lock, Brain, Search, Sparkles, Minus, Crown, Upload, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import { useDocumentPipeline, type PipelineResult } from '@/lib/document-pipeline';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

/* ── Upload Area Component ── */
const FileUploadArea: React.FC<{
  onResult: (result: PipelineResult) => void;
  uploadedFile: { name: string; size: number } | null;
  setUploadedFile: (f: { name: string; size: number } | null) => void;
}> = ({ onResult, uploadedFile, setUploadedFile }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { processDocument, isProcessing } = useDocumentPipeline();
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    const result = await processDocument(file);
    if (result) {
      onResult(result);
      setUploadedFile({ name: file.name, size: file.size });
    }
  }, [processDocument, onResult, setUploadedFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  if (uploadedFile) {
    return (
      <div className="flex items-center gap-3 border-2 border-foreground bg-neoLime/10 p-3 mb-3">
        <FileText size={18} className="shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-display text-xs uppercase truncate">{uploadedFile.name}</p>
          <p className="font-body text-[10px] text-muted-foreground">{(uploadedFile.size / 1024).toFixed(0)} KB</p>
        </div>
        <button onClick={() => setUploadedFile(null)} className="p-1 hover:bg-muted transition-colors">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed border-foreground p-5 mb-3 text-center cursor-pointer transition-colors ${
        dragOver ? 'bg-neoLime/20' : 'hover:bg-muted/50'
      } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      {isProcessing ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 size={18} className="animate-spin" />
          <span className="font-display text-xs uppercase">Membaca file...</span>
        </div>
      ) : (
        <>
          <Upload size={22} className="mx-auto mb-2 text-muted-foreground" />
          <p className="font-display text-xs uppercase">Upload CV (PDF / DOCX / TXT)</p>
          <p className="font-body text-[10px] text-muted-foreground mt-1">Drag & drop atau klik · Max 2MB · File tidak di-upload ke server</p>
        </>
      )}
    </div>
  );
};

/* ── AI Insight Card ── */
const AIInsightCard: React.FC<{ insight: string; title: string; icon: React.ReactNode; blurred?: boolean }> = ({ insight, title, icon, blurred }) => (
  <div className="relative border-4 border-foreground bg-card shadow-neoSm p-4 overflow-hidden">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <h3 className="font-display text-xs uppercase">{title}</h3>
    </div>
    {blurred ? (
      <>
        <p className="font-body text-xs text-muted-foreground select-none" style={{ filter: 'blur(4px)' }}>{insight}</p>
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-card via-card/90 to-transparent flex flex-col items-center justify-end pb-4">
          <Lock size={20} className="text-muted-foreground mb-2" />
          <button
            className="inline-flex items-center gap-2 bg-foreground text-primary-foreground font-display text-[10px] uppercase px-4 py-2 border-2 border-foreground shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <Link to="/dashboard/cv-checker">Daftar Gratis untuk Analisis Lengkap <ArrowRight size={12} /></Link>
          </button>
        </div>
      </>
    ) : (
      <p className="font-body text-xs text-muted-foreground">{insight}</p>
    )}
  </div>
);

/* ── Blurred Premium Insight Card (fallback) ── */
const BlurredInsight: React.FC<{ title: string; teaserLine: string; icon: React.ReactNode }> = ({ title, teaserLine, icon }) => (
  <div className="relative border-4 border-foreground bg-card shadow-neoSm p-4 overflow-hidden">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <h3 className="font-display text-xs uppercase">{title}</h3>
    </div>
    <p className="font-body text-xs text-muted-foreground mb-2">{teaserLine}</p>
    <div className="space-y-2 select-none" aria-hidden="true" style={{ filter: 'blur(4px)' }}>
      <p className="font-body text-xs text-muted-foreground">CV kamu memiliki potensi tinggi di area komunikasi dan leadership. Namun, beberapa keyword penting belum muncul...</p>
      <p className="font-body text-xs text-muted-foreground">Rekomendasi: tambahkan 3-4 keyword industri target di summary dan experience section untuk skor optimal...</p>
    </div>
    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-card via-card/90 to-transparent flex flex-col items-center justify-end pb-4">
      <Lock size={20} className="text-muted-foreground mb-2" />
      <button
        className="inline-flex items-center gap-2 bg-foreground text-primary-foreground font-display text-[10px] uppercase px-4 py-2 border-2 border-foreground shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
      >
        <Link to="/dashboard/cv-checker">Daftar Gratis untuk Analisis Lengkap <ArrowRight size={12} /></Link>
      </button>
    </div>
  </div>
);

/* ── Competitor Score Comparison ── */
const CompetitorScore: React.FC<{ userScore: number }> = ({ userScore }) => {
  const memberAvg = 92;
  const barColor = userScore >= 70 ? 'bg-neoLime' : userScore >= 40 ? 'bg-yellow-500' : 'bg-destructive';
  return (
    <div className="border-4 border-foreground bg-card shadow-neoLg p-4 md:p-6">
      <h2 className="font-display text-sm uppercase mb-4">Perbandingan Skor</h2>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between font-body text-xs mb-1">
            <span>Skor Kamu</span>
            <span className="font-display">{userScore}/100</span>
          </div>
          <div className="h-4 w-full bg-muted border-2 border-foreground overflow-hidden">
            <div className={`h-full ${barColor} transition-all duration-700`} style={{ width: `${userScore}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between font-body text-xs mb-1">
            <span>Rata-rata Member MantraSkill</span>
            <span className="font-display text-neoLime">{memberAvg}/100</span>
          </div>
          <div className="h-4 w-full bg-muted border-2 border-foreground overflow-hidden">
            <div className="h-full bg-neoLime transition-all duration-700" style={{ width: `${memberAvg}%` }} />
          </div>
        </div>
      </div>
      <p className="font-body text-xs text-muted-foreground mt-3">
        Member MantraSkill rata-rata dapat skor <strong className="text-foreground">40% lebih tinggi</strong> dari non-member berkat AI CV Builder.
      </p>
    </div>
  );
};

interface CheckResult {
  score: number;
  checks: { label: string; status: 'good' | 'warning' | 'bad'; detail: string }[];
}

const ATS_SECTIONS = ['pengalaman', 'pendidikan', 'keahlian', 'skill', 'experience', 'education', 'summary', 'ringkasan', 'sertifikasi', 'certification'];
const ACTION_VERBS = ['mengelola', 'memimpin', 'mengembangkan', 'merancang', 'mengimplementasikan', 'meningkatkan', 'mengkoordinasikan', 'menganalisis', 'membangun', 'meluncurkan', 'managed', 'led', 'developed', 'designed', 'implemented', 'increased', 'built', 'launched'];
const CONTACT_PATTERNS = [/[\w.-]+@[\w.-]+\.\w+/, /(\+?\d[\d\s-]{8,})/];

function analyzeCV(text: string): CheckResult {
  const checks: CheckResult['checks'] = [];
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).length;

  if (words < 100) checks.push({ label: 'Panjang CV', status: 'bad', detail: `Hanya ${words} kata. CV yang baik minimal 200-600 kata.` });
  else if (words > 800) checks.push({ label: 'Panjang CV', status: 'warning', detail: `${words} kata — terlalu panjang. Ideal 200-600 kata.` });
  else checks.push({ label: 'Panjang CV', status: 'good', detail: `${words} kata — panjang ideal.` });

  const foundSections = ATS_SECTIONS.filter(s => lower.includes(s));
  if (foundSections.length >= 3) checks.push({ label: 'Struktur Section', status: 'good', detail: `Ditemukan ${foundSections.length} section ATS.` });
  else if (foundSections.length >= 1) checks.push({ label: 'Struktur Section', status: 'warning', detail: `Hanya ${foundSections.length} section. Tambahkan: Pengalaman, Pendidikan, Keahlian.` });
  else checks.push({ label: 'Struktur Section', status: 'bad', detail: 'Tidak ada section standar ATS. Tambahkan heading: Pengalaman, Pendidikan, Keahlian.' });

  const foundVerbs = ACTION_VERBS.filter(v => lower.includes(v));
  if (foundVerbs.length >= 3) checks.push({ label: 'Kata Kerja Aksi', status: 'good', detail: `${foundVerbs.length} action verb ditemukan. Bagus!` });
  else if (foundVerbs.length >= 1) checks.push({ label: 'Kata Kerja Aksi', status: 'warning', detail: `Hanya ${foundVerbs.length} action verb. Gunakan lebih banyak: Mengelola, Memimpin, Mengembangkan.` });
  else checks.push({ label: 'Kata Kerja Aksi', status: 'bad', detail: 'Tidak ada action verb. Mulai bullet points dengan: Mengelola, Memimpin, Meningkatkan.' });

  const hasNumbers = /\d+%|\d+ (orang|proyek|project|bulan|tahun|juta|ribu|klien|client)/i.test(text);
  const hasAnyNumber = /\d/.test(text);
  if (hasNumbers) checks.push({ label: 'Metrik & Angka', status: 'good', detail: 'Ada angka terukur. Ini meningkatkan kredibilitas CV.' });
  else if (hasAnyNumber) checks.push({ label: 'Metrik & Angka', status: 'warning', detail: 'Ada angka tapi belum jelas konteksnya. Tambahkan: "meningkatkan 30%", "mengelola 5 orang".' });
  else checks.push({ label: 'Metrik & Angka', status: 'bad', detail: 'Tidak ada angka/metrik. ATS dan HRD suka pencapaian terukur.' });

  const hasEmail = CONTACT_PATTERNS[0].test(text);
  const hasPhone = CONTACT_PATTERNS[1].test(text);
  if (hasEmail && hasPhone) checks.push({ label: 'Info Kontak', status: 'good', detail: 'Email dan nomor telepon ditemukan.' });
  else if (hasEmail || hasPhone) checks.push({ label: 'Info Kontak', status: 'warning', detail: `Hanya ${hasEmail ? 'email' : 'telepon'} ditemukan. Tambahkan keduanya.` });
  else checks.push({ label: 'Info Kontak', status: 'bad', detail: 'Tidak ada email atau telepon. HRD tidak bisa menghubungi kamu!' });

  const bulletCount = (text.match(/^[\s]*[•\-\*]/gm) || []).length;
  if (bulletCount >= 5) checks.push({ label: 'Format Bullet Points', status: 'good', detail: `${bulletCount} bullet points — format ATS-friendly.` });
  else if (bulletCount >= 1) checks.push({ label: 'Format Bullet Points', status: 'warning', detail: `Hanya ${bulletCount} bullet points. Gunakan lebih banyak untuk pengalaman.` });
  else checks.push({ label: 'Format Bullet Points', status: 'bad', detail: 'Tidak ada bullet points. Gunakan "•" atau "-" untuk list pengalaman.' });

  const scoreMap = { good: 16.67, warning: 8, bad: 0 };
  const score = Math.round(checks.reduce((s, c) => s + scoreMap[c.status], 0));

  return { score, checks };
}

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'good') return <CheckCircle size={18} className="text-neoLime shrink-0" />;
  if (status === 'warning') return <AlertTriangle size={18} className="text-accent shrink-0" />;
  return <XCircle size={18} className="text-destructive shrink-0" />;
};

const FreeCVChecker = () => {
  const [cvText, setCvText] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [aiInsights, setAiInsights] = useState<string[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const { toast } = useToast();

  const fetchAIInsights = async (text: string) => {
    setAiLoading(true);
    setAiInsights(null);
    try {
      const { data, error } = await supabase.functions.invoke('free-cv-check', {
        body: { cv_text: text },
      });
      if (error) throw error;
      if (data?.insights && Array.isArray(data.insights)) {
        setAiInsights(data.insights);
      }
    } catch (err) {
      console.error('AI insight error:', err);
      // Silently fail — blurred fallback will show
    } finally {
      setAiLoading(false);
    }
  };

  const handleCheck = () => {
    if (cvText.trim().length < 20) return;
    const res = analyzeCV(cvText);
    setResult(res);
    // Fire AI insights in background
    fetchAIInsights(cvText);
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Cek CV ATS Gratis Online 2026 — MantraSkill",
      "description": "Tool gratis untuk mengecek apakah CV kamu ATS-friendly. Dapatkan skor ATS instan dan rekomendasi perbaikan tanpa login.",
      "url": "https://mantraskill.web.id/gratis/cek-cv",
      "applicationCategory": "BusinessApplication",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "IDR" },
      "operatingSystem": "Web"
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Cara Cek CV ATS-Friendly Gratis Online",
      "description": "Langkah-langkah mengecek apakah CV kamu sudah ATS-friendly menggunakan tool gratis MantraSkill.",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "Upload atau Paste CV", "text": "Upload file CV (PDF/DOCX) atau paste teks CV kamu ke kolom yang tersedia." },
        { "@type": "HowToStep", "position": 2, "name": "Klik Cek Sekarang", "text": "Klik tombol 'Cek Sekarang' untuk memulai analisis ATS otomatis." },
        { "@type": "HowToStep", "position": 3, "name": "Lihat Skor & Rekomendasi", "text": "Dapatkan skor ATS dari 100, detail analisis 6 kriteria, dan rekomendasi perbaikan spesifik." }
      ],
      "totalTime": "PT2M"
    }
  ];

  const insightMeta = [
    { title: 'AI Analysis', icon: <Brain size={16} className="text-neoCyan shrink-0" /> },
    { title: 'JD Keyword Match', icon: <Search size={16} className="text-neoViolet shrink-0" /> },
    { title: 'AI Rewrite Tips', icon: <Sparkles size={16} className="text-neoPink shrink-0" /> },
  ];

  return (
    <>
      <SEOHead
        title="Cek CV ATS Gratis Online 2026 — Skor ATS Instan | MantraSkill"
        description="Cek CV ATS gratis tanpa login! Upload atau paste CV, dapatkan skor ATS instan + rekomendasi perbaikan. Tool #1 Indonesia untuk bikin CV ATS-friendly 2026."
        canonical="/gratis/cek-cv"
        jsonLd={jsonLd}
      />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-5 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-neoLime/20 border-2 border-foreground px-4 py-1 font-display text-xs uppercase mb-4">
              <FileText size={14} /> 100% Gratis — Tanpa Login
            </div>
            <h1 className="font-display text-2xl md:text-4xl uppercase leading-tight mb-3">
              Cek CV ATS Gratis
            </h1>
            <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto">
              Upload file CV atau paste teks di bawah untuk cek apakah CV kamu bisa lolos filter ATS (Applicant Tracking System) yang dipakai 90% perusahaan.
            </p>
          </div>

          <div className="border-4 border-foreground bg-card shadow-neoLg p-4 md:p-6 mb-8">
            {/* File Upload Area */}
            <FileUploadArea
              onResult={(res) => setCvText(res.cleanText)}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
            />

            <label className="font-display text-sm uppercase mb-2 block">
              {uploadedFile ? 'Teks CV (dari file)' : 'Atau Paste CV Kamu'}
            </label>
            <Textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Salin dan tempel seluruh teks CV kamu di sini... (Ctrl+A lalu Ctrl+C dari dokumen CV kamu)"
              className="min-h-[200px] border-2 border-foreground font-body text-sm"
              rows={10}
            />
            <div className="flex items-center justify-between mt-4">
              <span className="font-body text-xs text-muted-foreground">
                {cvText.split(/\s+/).filter(Boolean).length} kata
              </span>
              <Button
                onClick={handleCheck}
                disabled={cvText.trim().length < 20}
                className="bg-foreground text-background font-display text-sm uppercase px-6 py-2 border-2 border-foreground shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-50"
              >
                Cek Sekarang
              </Button>
            </div>
          </div>

          {result && (
            <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4">
              {/* Score */}
              <div className="border-4 border-foreground bg-card shadow-neoLg p-6 text-center">
                <p className="font-display text-sm uppercase text-muted-foreground mb-2">Skor ATS CV Kamu</p>
                <p className={`font-display text-6xl ${result.score >= 70 ? 'text-neoLime' : result.score >= 40 ? 'text-yellow-500' : 'text-destructive'}`}>
                  {result.score}
                </p>
                <p className="font-body text-xs text-muted-foreground mt-1">dari 100</p>
                <Progress value={result.score} className="mt-4 h-3 border-2 border-foreground" />
              </div>

              {/* Checks */}
              <div className="border-4 border-foreground bg-card shadow-neoLg p-4 md:p-6 space-y-4">
                <h2 className="font-display text-sm uppercase">Detail Analisis</h2>
                {result.checks.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 border-b border-muted pb-3 last:border-0 last:pb-0">
                    <StatusIcon status={c.status} />
                    <div>
                      <p className="font-display text-xs uppercase">{c.label}</p>
                      <p className="font-body text-xs text-muted-foreground">{c.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Competitor Score */}
              <CompetitorScore userScore={result.score} />

              {/* Free vs Member Comparison */}
              <div className="border-4 border-foreground bg-card shadow-neoLg overflow-hidden">
                <div className="grid grid-cols-2">
                  <div className="p-3 bg-muted/50 border-b-4 border-r-2 border-foreground">
                    <p className="font-display text-xs uppercase text-muted-foreground">😐 Cek Gratis</p>
                  </div>
                  <div className="p-3 bg-neoLime/10 border-b-4 border-l-2 border-foreground flex items-center gap-2">
                    <Crown size={14} className="text-neoLime" />
                    <p className="font-display text-xs uppercase text-foreground">Member MantraSkill</p>
                  </div>
                </div>
                {[
                  { free: 'Cek 6 kriteria dasar', member: 'AI analisis 25+ kriteria + JD matching otomatis' },
                  { free: 'Skor umum tanpa konteks', member: 'Skor spesifik per posisi target + rekomendasi detail' },
                  { free: 'Tips perbaikan generic', member: 'AI rewrite otomatis setiap bullet point + keyword optimization' },
                ].map((item, i) => (
                  <div key={i} className="grid grid-cols-2 border-b-2 border-foreground last:border-b-0">
                    <div className="p-3 border-r-2 border-foreground flex items-start gap-2">
                      <Minus size={14} className="text-muted-foreground shrink-0 mt-0.5" />
                      <p className="font-body text-xs text-muted-foreground">{item.free}</p>
                    </div>
                    <div className="p-3 border-l-2 border-foreground bg-neoLime/5 flex items-start gap-2">
                      <Lock size={12} className="text-neoLime shrink-0 mt-0.5" />
                      <p className="font-body text-xs text-muted-foreground select-none" style={{ filter: 'blur(3px)' }}>{item.member}</p>
                    </div>
                  </div>
                ))}
                <div className="p-4 bg-foreground text-center">
                  <p className="font-body text-xs text-primary-foreground/60 mb-2">🔥 850+ orang udah pakai MantraSkill</p>
                  <Link
                    to="/dashboard/cv-checker"
                    className="inline-flex items-center gap-2 bg-neoLime text-foreground font-display text-xs uppercase px-5 py-2.5 border-2 border-foreground shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                  >
                    Daftar Gratis — Akses Semua Fitur <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* AI Insights Section */}
              <div className="space-y-4">
                <h2 className="font-display text-sm uppercase flex items-center gap-2">
                  {aiLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> AI sedang menganalisis...
                    </>
                  ) : aiInsights ? (
                    '🧠 AI Insights'
                  ) : (
                    '🔒 Insight Premium — Tersedia untuk Member'
                  )}
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {aiInsights ? (
                    // Show real AI insights: 1 open, 2 blurred
                    aiInsights.map((insight, i) => (
                      <AIInsightCard
                        key={i}
                        insight={insight}
                        title={insightMeta[i]?.title || `Insight ${i + 1}`}
                        icon={insightMeta[i]?.icon || <Brain size={16} />}
                        blurred={i > 0}
                      />
                    ))
                  ) : aiLoading ? (
                    // Loading skeleton
                    insightMeta.map((meta, i) => (
                      <div key={i} className="border-4 border-foreground bg-card shadow-neoSm p-4 animate-pulse">
                        <div className="flex items-center gap-2 mb-2">
                          {meta.icon}
                          <div className="h-3 w-24 bg-muted rounded" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 w-full bg-muted rounded" />
                          <div className="h-2 w-3/4 bg-muted rounded" />
                        </div>
                      </div>
                    ))
                  ) : (
                    // Fallback blurred insights
                    <>
                      <BlurredInsight title="AI Analysis" teaserLine="CV kamu memiliki potensi tinggi di area..." icon={<Brain size={16} className="text-neoCyan shrink-0" />} />
                      <BlurredInsight title="JD Keyword Match" teaserLine="Cocokkan CV dengan job description target..." icon={<Search size={16} className="text-neoViolet shrink-0" />} />
                      <BlurredInsight title="AI Rewrite Suggestions" teaserLine="3 bullet point kamu bisa di-rewrite jadi..." icon={<Sparkles size={16} className="text-neoPink shrink-0" />} />
                    </>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-foreground text-primary-foreground border-4 border-foreground p-6 shadow-neoLg">
                <h2 className="font-display text-lg uppercase text-neoLime mb-2">
                  Mau Skor Lebih Tinggi?
                </h2>
                <p className="font-body text-sm text-primary-foreground/80 mb-4">
                  MantraSkill punya AI CV Builder yang otomatis membuat CV ATS-friendly dengan skor 90+. Plus LinkedIn optimizer, cover letter generator, dan simulasi interview AI.
                </p>
                <p className="font-body text-xs text-neoLime/70 mb-4">
                  🔥 850+ orang udah pakai MantraSkill
                </p>
                <Link
                  to="/dashboard/cv-checker"
                  className="inline-flex items-center gap-2 bg-neoLime text-foreground font-display text-sm uppercase px-6 py-3 border-2 border-foreground shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                >
                  Daftar Gratis — Akses Semua Fitur <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}

          {/* SEO Content */}
          <section className="mt-12 font-body text-sm text-muted-foreground space-y-4 leading-relaxed">
            <h2 className="font-display text-lg uppercase text-foreground">Apa itu ATS dan Kenapa CV Kamu Harus ATS-Friendly?</h2>
            <p>ATS (Applicant Tracking System) adalah software yang digunakan 90% perusahaan besar di Indonesia untuk menyaring CV secara otomatis. Jika CV kamu tidak ATS-friendly, lamaran kamu bahkan tidak akan pernah dibaca oleh HRD manusia.</p>
            <p>Tool cek CV ATS gratis ini menganalisis 6 aspek kunci: panjang CV, struktur section, penggunaan kata kerja aksi, metrik & angka, info kontak, dan format bullet points. Setiap aspek dinilai berdasarkan standar ATS terkini.</p>
            <h2 className="font-display text-lg uppercase text-foreground mt-8">Tips Agar CV Lolos ATS</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gunakan heading standar: Pengalaman Kerja, Pendidikan, Keahlian</li>
              <li>Mulai setiap bullet point dengan kata kerja aksi (Mengelola, Memimpin, Mengembangkan)</li>
              <li>Sertakan angka dan metrik (meningkatkan penjualan 30%, mengelola tim 5 orang)</li>
              <li>Jangan gunakan tabel, kolom, atau grafik — ATS tidak bisa membacanya</li>
              <li>Pastikan ada email dan nomor telepon yang jelas</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FreeCVChecker;
