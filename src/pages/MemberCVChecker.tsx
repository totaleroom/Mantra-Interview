import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Upload, X, Loader2, Brain, Search, CheckCircle, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import { Header } from '@/components/landing/Header';
import { SEOHead } from '@/components/seo/SEOHead';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ScoreCard from '@/components/cv-builder/ScoreCard';
import type { AIAnalysis } from '@/components/cv-builder/types';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

async function parsePDF(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((item: any) => item.str).join(' '));
  }
  return pages.join('\n\n');
}

async function parseDOCX(file: File): Promise<string> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/* ── Regex Analysis ── */
const ATS_SECTIONS = ['pengalaman', 'pendidikan', 'keahlian', 'skill', 'experience', 'education', 'summary', 'ringkasan', 'sertifikasi', 'certification'];
const ACTION_VERBS = ['mengelola', 'memimpin', 'mengembangkan', 'merancang', 'mengimplementasikan', 'meningkatkan', 'mengkoordinasikan', 'menganalisis', 'membangun', 'meluncurkan', 'managed', 'led', 'developed', 'designed', 'implemented', 'increased', 'built', 'launched'];
const CONTACT_PATTERNS = [/[\w.-]+@[\w.-]+\.\w+/, /(\+?\d[\d\s-]{8,})/];

interface CheckResult {
  score: number;
  checks: { label: string; status: 'good' | 'warning' | 'bad'; detail: string }[];
}

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
  else checks.push({ label: 'Struktur Section', status: 'bad', detail: 'Tidak ada section standar ATS.' });

  const foundVerbs = ACTION_VERBS.filter(v => lower.includes(v));
  if (foundVerbs.length >= 3) checks.push({ label: 'Kata Kerja Aksi', status: 'good', detail: `${foundVerbs.length} action verb ditemukan.` });
  else if (foundVerbs.length >= 1) checks.push({ label: 'Kata Kerja Aksi', status: 'warning', detail: `Hanya ${foundVerbs.length} action verb.` });
  else checks.push({ label: 'Kata Kerja Aksi', status: 'bad', detail: 'Tidak ada action verb.' });

  const hasNumbers = /\d+%|\d+ (orang|proyek|project|bulan|tahun|juta|ribu|klien|client)/i.test(text);
  const hasAnyNumber = /\d/.test(text);
  if (hasNumbers) checks.push({ label: 'Metrik & Angka', status: 'good', detail: 'Ada angka terukur.' });
  else if (hasAnyNumber) checks.push({ label: 'Metrik & Angka', status: 'warning', detail: 'Ada angka tapi belum jelas konteksnya.' });
  else checks.push({ label: 'Metrik & Angka', status: 'bad', detail: 'Tidak ada angka/metrik.' });

  const hasEmail = CONTACT_PATTERNS[0].test(text);
  const hasPhone = CONTACT_PATTERNS[1].test(text);
  if (hasEmail && hasPhone) checks.push({ label: 'Info Kontak', status: 'good', detail: 'Email dan telepon ditemukan.' });
  else if (hasEmail || hasPhone) checks.push({ label: 'Info Kontak', status: 'warning', detail: `Hanya ${hasEmail ? 'email' : 'telepon'} ditemukan.` });
  else checks.push({ label: 'Info Kontak', status: 'bad', detail: 'Tidak ada email atau telepon.' });

  const bulletCount = (text.match(/^[\s]*[•\-\*]/gm) || []).length;
  if (bulletCount >= 5) checks.push({ label: 'Format Bullet Points', status: 'good', detail: `${bulletCount} bullet points.` });
  else if (bulletCount >= 1) checks.push({ label: 'Format Bullet Points', status: 'warning', detail: `Hanya ${bulletCount} bullet points.` });
  else checks.push({ label: 'Format Bullet Points', status: 'bad', detail: 'Tidak ada bullet points.' });

  const scoreMap = { good: 16.67, warning: 8, bad: 0 };
  const score = Math.round(checks.reduce((s, c) => s + scoreMap[c.status], 0));
  return { score, checks };
}

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'good') return <CheckCircle size={18} className="text-neoLime shrink-0" />;
  if (status === 'warning') return <AlertTriangle size={18} className="text-accent shrink-0" />;
  return <XCircle size={18} className="text-destructive shrink-0" />;
};

/* ── File Upload Area ── */
const FileUploadArea: React.FC<{
  onTextExtracted: (text: string) => void;
  uploadedFile: { name: string; size: number } | null;
  setUploadedFile: (f: { name: string; size: number } | null) => void;
}> = ({ onTextExtracted, uploadedFile, setUploadedFile }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parsing, setParsing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const processFile = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: 'File terlalu besar', description: 'Maksimal 2MB.', variant: 'destructive' });
      return;
    }
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx'].includes(ext || '')) {
      toast({ title: 'Format tidak didukung', description: 'Hanya PDF dan DOCX.', variant: 'destructive' });
      return;
    }
    setParsing(true);
    try {
      const text = ext === 'pdf' ? await parsePDF(file) : await parseDOCX(file);
      if (text.trim().length < 20) {
        toast({ title: 'Gagal extract teks', description: 'File mungkin berupa scan/gambar.', variant: 'destructive' });
        return;
      }
      onTextExtracted(text);
      setUploadedFile({ name: file.name, size: file.size });
      toast({ title: 'File berhasil diproses! ✅' });
    } catch (err) {
      console.error('Parse error:', err);
      toast({ title: 'Gagal membaca file', description: 'Coba paste teks CV secara manual.', variant: 'destructive' });
    } finally {
      setParsing(false);
    }
  }, [onTextExtracted, setUploadedFile, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  if (uploadedFile) {
    return (
      <div className="flex items-center gap-3 border-2 border-foreground bg-neoLime/10 p-3 mb-3">
        <FileText size={18} className="shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-display text-xs uppercase truncate">{uploadedFile.name}</p>
          <p className="font-body text-[10px] text-muted-foreground">{(uploadedFile.size / 1024).toFixed(0)} KB</p>
        </div>
        <button onClick={() => setUploadedFile(null)} className="p-1 hover:bg-muted transition-colors"><X size={14} /></button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed border-foreground p-5 mb-3 text-center cursor-pointer transition-colors ${dragOver ? 'bg-neoLime/20' : 'hover:bg-muted/50'} ${parsing ? 'pointer-events-none opacity-60' : ''}`}
    >
      <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) processFile(file); e.target.value = ''; }} />
      {parsing ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 size={18} className="animate-spin" />
          <span className="font-display text-xs uppercase">Membaca file...</span>
        </div>
      ) : (
        <>
          <Upload size={22} className="mx-auto mb-2 text-muted-foreground" />
          <p className="font-display text-xs uppercase">Upload CV (PDF / DOCX)</p>
          <p className="font-body text-[10px] text-muted-foreground mt-1">Drag & drop atau klik · Max 2MB</p>
        </>
      )}
    </div>
  );
};

/* ── JD Analysis Result ── */
const JDAnalysisResult: React.FC<{ jd: any }> = ({ jd }) => (
  <div className="border-4 border-foreground p-4 bg-card shadow-neo space-y-4">
    <div className="flex items-center gap-2">
      <Search size={18} className="text-neoViolet" />
      <h4 className="font-display text-sm uppercase">JD Keyword Match</h4>
    </div>
    <div className="text-center">
      <p className="font-display text-4xl text-neoCyan">{jd.match_score}%</p>
      <p className="font-body text-xs text-muted-foreground">Match Score</p>
    </div>
    {jd.matched_keywords?.length > 0 && (
      <div>
        <p className="font-display text-xs uppercase text-neoLime mb-2">✅ Keyword Cocok ({jd.matched_keywords.length})</p>
        <div className="flex flex-wrap gap-1">
          {jd.matched_keywords.map((kw: string, i: number) => (
            <span key={i} className="bg-neoLime/20 border border-neoLime px-2 py-0.5 font-body text-[10px]">{kw}</span>
          ))}
        </div>
      </div>
    )}
    {jd.missing_keywords?.length > 0 && (
      <div>
        <p className="font-display text-xs uppercase text-destructive mb-2">❌ Keyword Hilang ({jd.missing_keywords.length})</p>
        <div className="flex flex-wrap gap-1">
          {jd.missing_keywords.map((kw: string, i: number) => (
            <span key={i} className="bg-destructive/20 border border-destructive px-2 py-0.5 font-body text-[10px]">{kw}</span>
          ))}
        </div>
      </div>
    )}
    {jd.suggestions?.length > 0 && (
      <div className="space-y-2">
        <p className="font-display text-xs uppercase">💡 Saran Penambahan</p>
        {jd.suggestions.map((s: any, i: number) => (
          <div key={i} className="border-2 border-foreground/20 p-3 bg-background">
            <p className="font-display text-xs text-neoPink">{s.keyword}</p>
            <p className="font-body text-xs text-muted-foreground">{s.suggestion}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

/* ── Main Page ── */
const MemberCVChecker: React.FC = () => {
  const [cvText, setCvText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [regexResult, setRegexResult] = useState<CheckResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [showJD, setShowJD] = useState(false);
  const [jdAnalysis, setJdAnalysis] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (cvText.trim().length < 20) {
      toast({ title: 'Teks CV terlalu pendek', variant: 'destructive' });
      return;
    }

    // Instant regex check
    const regex = analyzeCV(cvText);
    setRegexResult(regex);

    // AI comprehensive analysis
    setAiLoading(true);
    setAiAnalysis(null);
    setJdAnalysis(null);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-cv', {
        body: {
          mode: 'text-analyze',
          cv_text: cvText,
          job_description: jobDescription.trim() || undefined,
        },
      });
      if (error) throw error;
      if (data?.analysis) {
        setAiAnalysis(data.analysis);
        if (data.analysis.jd_analysis) {
          setJdAnalysis(data.analysis.jd_analysis);
        }
        toast({ title: 'Analisis AI selesai! 🎉' });
      } else {
        throw new Error(data?.error || 'Gagal analisis');
      }
    } catch (e: any) {
      console.error('AI analysis error:', e);
      toast({ title: 'Gagal analisis AI', description: e.message, variant: 'destructive' });
    } finally {
      setAiLoading(false);
    }
  };

  const handleReset = () => {
    setCvText('');
    setUploadedFile(null);
    setRegexResult(null);
    setAiAnalysis(null);
    setJdAnalysis(null);
    setJobDescription('');
    setShowJD(false);
  };

  return (
    <>
      <SEOHead title="CV Checker — MantraSkill" description="Analisis CV komprehensif dengan AI untuk member MantraSkill." canonical="/dashboard/cv-checker" />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-5 py-8">
          {/* Back link */}
          <Link to="/dashboard" className="inline-flex items-center gap-2 font-display text-xs uppercase text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft size={14} /> Kembali ke Dashboard
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-neoCyan/20 border-2 border-foreground px-4 py-1 font-display text-xs uppercase mb-4">
              <Sparkles size={14} /> Member Exclusive
            </div>
            <h1 className="font-display text-2xl md:text-4xl uppercase leading-tight mb-3">
              CV Checker Komprehensif
            </h1>
            <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto">
              Upload CV dan dapatkan analisis AI lengkap: skor 10 kategori, radar chart, rekomendasi detail, dan JD keyword match.
            </p>
          </div>

          {/* Input Section */}
          {!regexResult && (
            <div className="border-4 border-foreground bg-card shadow-neoLg p-4 md:p-6 mb-8">
              <FileUploadArea onTextExtracted={(text) => setCvText(text)} uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} />

              <label className="font-display text-sm uppercase mb-2 block">Atau Paste Teks CV</label>
              <Textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste seluruh teks CV kamu di sini..."
                className="min-h-[200px] font-body text-sm border-2 border-foreground focus:ring-neoLime mb-4"
              />

              {/* JD Toggle */}
              <button
                onClick={() => setShowJD(!showJD)}
                className="flex items-center gap-2 font-display text-xs uppercase text-neoCyan hover:text-foreground transition-colors mb-3"
              >
                <Search size={14} />
                {showJD ? 'Sembunyikan JD Scanner' : '+ Tambahkan Job Description (Optional)'}
              </button>

              {showJD && (
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job description di sini untuk analisis keyword match..."
                  className="min-h-[120px] font-body text-sm border-2 border-foreground focus:ring-neoCyan mb-4"
                />
              )}

              <Button
                onClick={handleAnalyze}
                disabled={cvText.trim().length < 20 || aiLoading}
                className="w-full bg-foreground text-background font-display text-sm uppercase border-4 border-foreground shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all h-12"
              >
                {aiLoading ? (
                  <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Menganalisis dengan AI...</span>
                ) : (
                  <span className="flex items-center gap-2"><Brain size={16} /> Analisis Komprehensif</span>
                )}
              </Button>
            </div>
          )}

          {/* Loading State */}
          {aiLoading && (
            <div className="border-4 border-foreground bg-card shadow-neoLg p-8 text-center mb-8">
              <Loader2 size={32} className="animate-spin mx-auto mb-4 text-neoCyan" />
              <p className="font-display text-sm uppercase mb-2">AI sedang menganalisis CV kamu...</p>
              <p className="font-body text-xs text-muted-foreground">Ini biasanya butuh 10-20 detik</p>
            </div>
          )}

          {/* Results */}
          {regexResult && !aiLoading && (
            <div className="space-y-6">
              {/* Reset button */}
              <button onClick={handleReset} className="inline-flex items-center gap-2 font-display text-xs uppercase text-muted-foreground hover:text-foreground transition-colors">
                <X size={14} /> Analisis CV Lain
              </button>

              {/* Quick Regex Score */}
              <div className="border-4 border-foreground bg-card shadow-neoLg p-4 md:p-6">
                <h2 className="font-display text-sm uppercase mb-4 flex items-center gap-2">
                  <FileText size={16} /> Quick Check (Regex)
                </h2>
                <div className="text-center mb-4">
                  <p className="font-display text-4xl">{regexResult.score}<span className="text-lg text-muted-foreground">/100</span></p>
                </div>
                <div className="space-y-3">
                  {regexResult.checks.map((check, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <StatusIcon status={check.status} />
                      <div>
                        <p className="font-display text-xs uppercase">{check.label}</p>
                        <p className="font-body text-xs text-muted-foreground">{check.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI ScoreCard */}
              {aiAnalysis && (
                <div>
                  <h2 className="font-display text-lg uppercase mb-4 flex items-center gap-2">
                    <Brain size={20} className="text-neoCyan" /> Analisis AI Komprehensif
                  </h2>
                  <ScoreCard analysis={aiAnalysis} />
                </div>
              )}

              {/* JD Analysis */}
              {jdAnalysis && <JDAnalysisResult jd={jdAnalysis} />}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default MemberCVChecker;
