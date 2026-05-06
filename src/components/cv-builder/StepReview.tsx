import React, { useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Brain, FileText, Download, FileDown, Target, CheckCircle2, XCircle, Sparkles, AlertTriangle, Check, Pencil, Trash2 } from 'lucide-react';
import CVPreview from './CVPreview';
import ScoreCard from './ScoreCard';
import type { CVData, AIAnalysis } from './types';
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Packer,
} from 'docx';

interface Props {
  data: CVData;
  cvId: string | null;
  onCvDataChange?: (data: CVData) => void;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatMonthYear(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!year || !month) return dateStr;
  const monthIdx = parseInt(month, 10) - 1;
  return `${MONTHS[monthIdx] || month} ${year}`;
}

const expTypeLabel: Record<string, string> = {
  kerja: 'WORK EXPERIENCE',
  magang: 'INTERNSHIP',
  freelance: 'FREELANCE',
  organisasi: 'ORGANIZATION',
  volunteer: 'VOLUNTEER',
};

interface JDImprovement {
  target: 'summary' | 'experience' | 'skills';
  experience_id?: string;
  original: string;
  improved: string;
  reason: string;
}

interface JDScanResult {
  match_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: { keyword: string; suggestion: string }[];
  improvements?: JDImprovement[];
}

// Emoji detection regex (covers most emoji ranges used in documents)
const EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu;

function findEmojis(text: string): string[] {
  return [...new Set(text.match(EMOJI_REGEX) || [])];
}

function stripEmojis(text: string): string {
  return text.replace(EMOJI_REGEX, '').replace(/\s{2,}/g, ' ').trim();
}

const StepReview: React.FC<Props> = ({ data, cvId, onCvDataChange }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [aiCooldown, setAiCooldown] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [scanning, setScanning] = useState(false);
  const [jdCooldown, setJdCooldown] = useState(false);
  const [jdResult, setJdResult] = useState<JDScanResult | null>(null);
  const [editingImprovement, setEditingImprovement] = useState<Record<number, string>>({});
  const [appliedImprovements, setAppliedImprovements] = useState<Set<number>>(new Set());
  const [dismissedImprovements, setDismissedImprovements] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  // Emoji detection
  const detectedEmojis = useMemo(() => {
    const allText = [
      data.summary,
      data.target_position,
      data.personal_info.full_name,
      data.personal_info.tagline || '',
      ...data.experiences.map(e => `${e.position} ${e.company} ${e.description}`),
      ...data.education.map(e => `${e.degree} ${e.major} ${e.institution}`),
      ...data.skills.hard_skills,
      ...data.certifications.map(c => `${c.name} ${c.issuer}`),
    ].join(' ');
    return findEmojis(allText);
  }, [data]);

  const handleRemoveAllEmojis = () => {
    if (!onCvDataChange) return;
    const cleaned: CVData = {
      ...data,
      summary: stripEmojis(data.summary),
      target_position: stripEmojis(data.target_position),
      personal_info: {
        ...data.personal_info,
        full_name: stripEmojis(data.personal_info.full_name),
        tagline: data.personal_info.tagline ? stripEmojis(data.personal_info.tagline) : '',
      },
      experiences: data.experiences.map(e => ({
        ...e,
        position: stripEmojis(e.position),
        company: stripEmojis(e.company),
        description: stripEmojis(e.description),
      })),
      education: data.education.map(e => ({
        ...e,
        degree: stripEmojis(e.degree),
        major: stripEmojis(e.major),
        institution: stripEmojis(e.institution),
      })),
      skills: {
        ...data.skills,
        hard_skills: data.skills.hard_skills.map(s => stripEmojis(s)),
      },
      certifications: data.certifications.map(c => ({
        ...c,
        name: stripEmojis(c.name),
        issuer: stripEmojis(c.issuer),
      })),
    };
    onCvDataChange(cleaned);
    toast({ title: 'Semua emoji berhasil dihapus dari CV ✅' });
  };

  const applyImprovement = (idx: number) => {
    if (!onCvDataChange || !jdResult?.improvements) return;
    const imp = jdResult.improvements[idx];
    const text = editingImprovement[idx] ?? imp.improved;

    let updated = { ...data };
    if (imp.target === 'summary') {
      updated.summary = text;
    } else if (imp.target === 'experience') {
      // Try matching by experience_id first
      let matched = false;
      if (imp.experience_id) {
        const found = data.experiences.find(e => e.id === imp.experience_id);
        if (found) {
          updated.experiences = data.experiences.map(e =>
            e.id === imp.experience_id ? { ...e, description: text } : e
          );
          matched = true;
        }
      }
      // Fallback: match by original text content
      if (!matched && imp.original) {
        const targetExp = data.experiences.find(e =>
          e.description.includes(imp.original) || imp.original.includes(e.description)
        );
        if (targetExp) {
          updated.experiences = data.experiences.map(e =>
            e.id === targetExp.id ? { ...e, description: text } : e
          );
          matched = true;
        }
      }
      // Last fallback: if only one experience, apply to it
      if (!matched && data.experiences.length === 1) {
        updated.experiences = [{ ...data.experiences[0], description: text }];
      }
    } else if (imp.target === 'skills') {
      const newSkills = text.split(',').map(s => s.trim()).filter(Boolean);
      const existing = new Set(data.skills.hard_skills.map(s => s.toLowerCase()));
      const toAdd = newSkills.filter(s => !existing.has(s.toLowerCase()));
      updated.skills = { ...data.skills, hard_skills: [...data.skills.hard_skills, ...toAdd] };
    }

    onCvDataChange(updated);
    setAppliedImprovements(prev => new Set(prev).add(idx));
    setAnalysis(null); // Reset analysis so user can re-analyze to see improvement
    toast({ title: 'Improvement berhasil di-apply! Jalankan ulang Analisis AI untuk lihat peningkatan skor.' });
  };

  const dismissImprovement = (idx: number) => {
    setDismissedImprovements(prev => new Set(prev).add(idx));
  };

  const handleAnalyze = async () => {
    if (!cvId) {
      toast({ title: 'Simpan CV dulu sebelum analisis', variant: 'destructive' });
      return;
    }
    if (aiCooldown) return;
    setAnalyzing(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('analyze-cv', {
        body: { cv_data: data, cv_id: cvId },
      });
      if (error) throw error;
      if (result?.analysis) {
        setAnalysis(result.analysis);
        toast({ title: 'Analisis selesai! 🎉' });
      } else {
        throw new Error(result?.error || 'Gagal menganalisis CV');
      }
    } catch (e: any) {
      toast({ title: 'Gagal analisis', description: e.message, variant: 'destructive' });
    } finally {
      setAnalyzing(false);
      setAiCooldown(true);
      setTimeout(() => setAiCooldown(false), 5000);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleDownloadDocx = async () => {
    setDownloadingDocx(true);
    try {
      const { personal_info: p, summary, target_position, experiences, education, skills, certifications, languages } = data;

      const groupedExp = experiences.reduce<Record<string, typeof experiences>>((acc, exp) => {
        const type = exp.type || 'kerja';
        if (!acc[type]) acc[type] = [];
        acc[type].push(exp);
        return acc;
      }, {});

      const sectionHeader = (text: string) =>
        new Paragraph({
          text,
          heading: HeadingLevel.HEADING_2,
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' } },
          spacing: { before: 200, after: 100 },
        });

      const children: Paragraph[] = [];

      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: p.full_name || 'NAMA LENGKAP', bold: true, size: 28, font: 'Calibri' })],
        })
      );

      if (p.tagline) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [new TextRun({ text: p.tagline, italics: true, size: 20, color: '444444', font: 'Calibri' })],
          })
        );
      }

      if (target_position) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [new TextRun({ text: target_position, size: 20, font: 'Calibri' })],
          })
        );
      }

      const linkedinDisplay = p.linkedin_url ? p.linkedin_url.replace(/^https?:\/\//, '') : '';
      const portfolioDisplay = p.portfolio_url ? p.portfolio_url.replace(/^https?:\/\//, '') : '';
      const contactParts = [p.email, p.phone, p.city, linkedinDisplay, portfolioDisplay].filter(Boolean);
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' } },
          children: [new TextRun({ text: contactParts.join(' | '), size: 18, color: '555555', font: 'Calibri' })],
        })
      );

      if (summary) {
        children.push(sectionHeader('PROFESSIONAL SUMMARY'));
        children.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [new TextRun({ text: summary, size: 20, font: 'Calibri' })],
          })
        );
      }

      Object.entries(groupedExp).forEach(([type, exps]) => {
        children.push(sectionHeader(expTypeLabel[type] || 'EXPERIENCE'));
        exps.forEach((exp) => {
          children.push(
            new Paragraph({
              spacing: { after: 20 },
              children: [
                new TextRun({ text: exp.position, bold: true, size: 20, font: 'Calibri' }),
                new TextRun({ text: `  ${formatMonthYear(exp.start_date)} — ${exp.is_current ? 'Present' : formatMonthYear(exp.end_date)}`, size: 18, color: '666666', font: 'Calibri' }),
              ],
            })
          );
          children.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [new TextRun({ text: exp.company, italics: true, size: 18, color: '555555', font: 'Calibri' })],
            })
          );
          if (exp.description) {
            const lines = exp.description.split('\n').filter(Boolean);
            lines.forEach((line) => {
              const clean = line.replace(/^[•\-]s*/, '');
              children.push(
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { after: 20 },
                  children: [new TextRun({ text: clean, size: 20, font: 'Calibri' })],
                })
              );
            });
          }
          children.push(new Paragraph({ spacing: { after: 60 } }));
        });
      });

      if (education.length > 0) {
        children.push(sectionHeader('EDUCATION'));
        education.forEach((edu) => {
          children.push(
            new Paragraph({
              spacing: { after: 20 },
              children: [
                new TextRun({ text: `${edu.degree} — ${edu.major}`, bold: true, size: 20, font: 'Calibri' }),
                new TextRun({ text: `  ${edu.graduation_year}`, size: 18, color: '666666', font: 'Calibri' }),
              ],
            })
          );
          const gpaStr = edu.gpa && parseFloat(edu.gpa) >= 3.0 ? ` | IPK: ${edu.gpa}` : '';
          children.push(
            new Paragraph({
              spacing: { after: 80 },
              children: [new TextRun({ text: `${edu.institution}${gpaStr}`, size: 18, color: '555555', font: 'Calibri' })],
            })
          );
        });
      }

      if (skills.hard_skills.length > 0) {
        children.push(sectionHeader('SKILLS'));
        children.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({ text: 'Technical: ', bold: true, size: 20, font: 'Calibri' }),
              new TextRun({ text: skills.hard_skills.join(', '), size: 20, font: 'Calibri' }),
            ],
          })
        );
      }

      if (languages && languages.length > 0) {
        children.push(sectionHeader('LANGUAGES'));
        children.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [new TextRun({ text: languages.map(l => `${l.name} (${l.level})`).join(' · '), size: 20, font: 'Calibri' })],
          })
        );
      }

      if (certifications.length > 0) {
        children.push(sectionHeader('CERTIFICATIONS'));
        certifications.forEach((cert) => {
          children.push(
            new Paragraph({
              spacing: { after: 60 },
              children: [new TextRun({ text: `${cert.name} — ${cert.issuer} (${cert.year})`, size: 20, font: 'Calibri' })],
            })
          );
        });
      }

      const doc = new Document({
        styles: {
          default: { document: { run: { font: 'Calibri', size: 22 } } },
        },
        sections: [{ properties: {}, children }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = (p.full_name || 'CV').replace(/\s+/g, '_');
      const safePos = (target_position || 'Posisi').replace(/\s+/g, '_');
      a.href = url;
      a.download = `${safeName}_${safePos}_CV.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({ title: 'DOCX berhasil didownload! 📄' });
    } catch (e: any) {
      toast({ title: 'Gagal generate DOCX', description: e.message, variant: 'destructive' });
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handleJDScan = async () => {
    if (!jobDescription.trim()) {
      toast({ title: 'Paste job description dulu', variant: 'destructive' });
      return;
    }
    if (jdCooldown) return;
    setScanning(true);
    setAppliedImprovements(new Set());
    setDismissedImprovements(new Set());
    setEditingImprovement({});
    try {
      const { data: result, error } = await supabase.functions.invoke('analyze-cv', {
        body: { mode: 'jd-scan', cv_data: data, job_description: jobDescription },
      });
      if (error) throw error;
      if (result?.match_score !== undefined) {
        setJdResult(result);
        toast({ title: `JD Scan selesai! Match: ${result.match_score}%` });
      } else {
        throw new Error(result?.error || 'Gagal scan JD');
      }
    } catch (e: any) {
      toast({ title: 'Gagal scan JD', description: e.message, variant: 'destructive' });
    } finally {
      setScanning(false);
      setJdCooldown(true);
      setTimeout(() => setJdCooldown(false), 5000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-neoLime border-4 border-foreground p-4 shadow-neo">
        <h3 className="font-display text-lg uppercase mb-1">🏁 Review & Analisis</h3>
        <p className="font-body text-sm">Preview CV kamu dan dapatkan analisis AI</p>
      </div>

      {/* ATS Emoji Warning */}
      {detectedEmojis.length > 0 && onCvDataChange && (
        <div className="bg-yellow-500/10 border-4 border-yellow-500/50 p-4 shadow-neo space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} className="text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display text-sm uppercase">⚠️ Emoji Terdeteksi — Risiko ATS</h4>
              <p className="font-body text-xs text-muted-foreground mt-1">
                ATS enterprise (Workday, Taleo, iCIMS) sering gagal mem-parse emoji. Karakter ini bisa muncul sebagai kotak atau hilang, membuat CV kamu tidak terbaca mesin.
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {detectedEmojis.map((e, i) => (
                  <span key={i} className="border border-foreground px-2 py-0.5 text-sm bg-background">{e}</span>
                ))
                }
              </div>
            </div>
          </div>
          <button
            onClick={handleRemoveAllEmojis}
            className="bg-neoLime border-2 border-foreground px-4 py-2 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all flex items-center gap-2"
          >
            <Trash2 size={14} /> Hapus Semua Emoji dari CV
          </button>
        </div>
      )}

      {/* JD Scanner */}
      <div className="bg-background border-4 border-foreground p-4 shadow-neo space-y-3">
        <div className="flex items-center gap-2">
          <Target size={18} />
          <h4 className="font-display text-sm uppercase">🎯 JD Scanner — Cocokkan CV dengan Lowongan</h4>
        </div>
        <p className="font-body text-xs text-muted-foreground">Paste job description untuk cek keyword match CV kamu dengan ATS perusahaan target</p>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description di sini... (Requirements, Qualifications, About the Role, dll.)"
          className="w-full min-h-[120px] border-2 border-foreground p-3 font-body text-sm bg-background resize-y focus:outline-none focus:border-neoPink"
        />
        <button
          onClick={handleJDScan}
          disabled={scanning || jdCooldown}
          className="bg-neoViolet border-4 border-foreground px-4 py-2 font-display text-sm uppercase shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {scanning ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {scanning ? 'Scanning...' : jdCooldown ? 'Tunggu...' : 'Scan JD'}
        </button>

        {/* JD Scan Results */}
        {jdResult && (
          <div className="space-y-3 pt-2 border-t-2 border-foreground">
            {/* Score bar */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-display text-sm uppercase">Match Score</span>
                <span className="font-display text-lg">{jdResult.match_score}%</span>
              </div>
              <div className="w-full bg-muted border-2 border-foreground h-5">
                <div
                  className={`h-full transition-all ${jdResult.match_score >= 70 ? 'bg-neoLime' : jdResult.match_score >= 50 ? 'bg-yellow-400' : 'bg-neoPink'}`}
                  style={{ width: `${jdResult.match_score}%` }}
                />
              </div>
              <p className="font-body text-xs mt-1 text-muted-foreground">
                {jdResult.match_score >= 70 ? '✅ Bagus! CV kamu cukup relevan untuk posisi ini.' : jdResult.match_score >= 50 ? '⚠️ Perlu improvement — tambahkan keyword yang kurang.' : '❌ Match rendah — update CV kamu sebelum apply!'}
              </p>
            </div>

            {/* Keywords grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border-2 border-foreground p-3 bg-neoLime/20">
                <div className="flex items-center gap-1 mb-2">
                  <CheckCircle2 size={14} className="text-green-700" />
                  <span className="font-display text-xs uppercase">Match ({jdResult.matched_keywords.length})</span>
                </div>
                <div className="space-y-1">
                  {jdResult.matched_keywords.map((kw) => (
                    <span key={kw} className="block font-body text-xs bg-neoLime border border-foreground px-2 py-0.5 truncate">{kw}</span>
                  ))
                  }
                </div>
              </div>
              <div className="border-2 border-foreground p-3 bg-neoPink/10">
                <div className="flex items-center gap-1 mb-2">
                  <XCircle size={14} className="text-red-600" />
                  <span className="font-display text-xs uppercase">Kurang ({jdResult.missing_keywords.length})</span>
                </div>
                <div className="space-y-1">
                  {jdResult.missing_keywords.map((kw) => (
                    <span key={kw} className="block font-body text-xs bg-neoPink/20 border border-foreground px-2 py-0.5 truncate">{kw}</span>
                  ))
                  }
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {jdResult.suggestions.length > 0 && (
              <div className="border-2 border-foreground p-3 bg-muted/50">
                <p className="font-display text-xs uppercase mb-2">💡 Saran Perbaikan</p>
                <div className="space-y-2">
                  {jdResult.suggestions.map((s, i) => (
                    <div key={i} className="font-body text-xs">
                      <span className="font-bold text-neoPink">"{s.keyword}"</span>
                      <span className="text-muted-foreground"> → {s.suggestion}</span>
                    </div>
                  ))
                  }
                </div>
              </div>
            )}

            {/* Actionable Improvements */}
            {jdResult.improvements && jdResult.improvements.length > 0 && onCvDataChange && (
              <div className="space-y-3 pt-2 border-t-2 border-dashed border-foreground/30">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-neoViolet" />
                  <p className="font-display text-sm uppercase">🔧 Perbaikan yang Bisa Di-Apply</p>
                </div>
                <p className="font-body text-xs text-muted-foreground">
                  AI sudah menyiapkan rewrite untuk bagian CV kamu. Review, edit jika perlu, lalu apply.
                </p>

                {jdResult.improvements.map((imp, idx) => {
                  if (dismissedImprovements.has(idx)) return null;
                  const isApplied = appliedImprovements.has(idx);
                  const isEditing = editingImprovement[idx] !== undefined;
                  const currentText = editingImprovement[idx] ?? imp.improved;

                  return (
                    <div key={idx} className={`border-4 border-foreground bg-card shadow-neo p-4 space-y-3 ${isApplied ? 'opacity-50' : ''}`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-neoViolet text-foreground font-display text-[10px] px-2 py-0.5 uppercase border-2 border-foreground">
                            {imp.target === 'summary' ? '📝 Summary' : imp.target === 'experience' ? '💼 Experience' : '🛠 Skills'}
                          </span>
                          <span className="font-body text-xs text-muted-foreground">{imp.reason}</span>
                        </div>
                        {!isApplied && (
                          <button
                            onClick={() => dismissImprovement(idx)}
                            className="shrink-0 w-7 h-7 flex items-center justify-center border-2 border-foreground bg-muted hover:bg-destructive/20 transition-colors"
                            title="Tolak rekomendasi"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>

                      {/* Before */}
                      <div className="bg-destructive/10 border-2 border-destructive/30 p-3">
                        <p className="font-display text-[10px] uppercase text-destructive mb-1">Sebelum</p>
                        <p className="font-body text-sm whitespace-pre-wrap text-muted-foreground">{imp.original}</p>
                      </div>

                      {/* After */}
                      <div className="bg-green-500/10 border-2 border-green-500/30 p-3">
                        <p className="font-display text-[10px] uppercase text-green-700 mb-1">Sesudah (AI)</p>
                        {isEditing ? (
                          <textarea
                            value={currentText}
                            onChange={(e) => setEditingImprovement(prev => ({ ...prev, [idx]: e.target.value }))}
                            rows={4}
                            className="w-full font-body text-sm bg-transparent border-0 focus:outline-none resize-y"
                          />
                        ) : (
                          <p className="font-body text-sm font-medium whitespace-pre-wrap">{imp.improved}</p>
                        )}
                      </div>

                      {/* Actions */}
                      {!isApplied && (
                        <div className="flex gap-2 pt-1 flex-wrap">
                          <button
                            onClick={() => applyImprovement(idx)}
                            className="flex-1 bg-neoLime border-2 border-foreground px-3 py-2 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all flex items-center justify-center gap-1"
                          >
                            <Check size={14} /> Apply
                          </button>
                          {!isEditing ? (
                            <button
                              onClick={() => setEditingImprovement(prev => ({ ...prev, [idx]: imp.improved }))}
                              className="flex-1 border-2 border-foreground px-3 py-2 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all flex items-center justify-center gap-1"
                            >
                              <Pencil size={14} /> Edit Manual
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditingImprovement(prev => { const n = { ...prev }; delete n[idx]; return n; })}
                              className="flex-1 border-2 border-foreground px-3 py-2 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all flex items-center justify-center gap-1"
                            >
                              Batal Edit
                            </button>
                          )}
                        </div>
                      )}
                      {isApplied && (
                        <p className="font-display text-xs uppercase text-green-700 flex items-center gap-1">
                          <CheckCircle2 size={14} /> Applied
                        </p>
                      )}
                    </div>
                  );
                })
                }
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleAnalyze}
          disabled={analyzing || aiCooldown}
          className="flex-1 bg-neoPink border-4 border-foreground p-4 font-display text-sm uppercase shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {analyzing ? <Loader2 size={18} className="animate-spin" /> : <Brain size={18} />}
          {analyzing ? 'Menganalisis...' : aiCooldown ? 'Tunggu sebentar...' : 'Analisis CV dengan AI'}
        </button>
        <button
          onClick={handleDownloadDocx}
          disabled={downloadingDocx}
          className="bg-foreground text-background border-4 border-foreground p-4 font-display text-sm uppercase shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {downloadingDocx ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
          {downloadingDocx ? 'Generating...' : 'Download DOCX'}
        </button>
        <button
          onClick={handleDownloadPDF}
          className="bg-muted border-4 border-foreground p-4 font-display text-sm uppercase shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2"
          title="Dialog print akan terbuka. Pilih 'Save as PDF' untuk menyimpan sebagai PDF."
        >
          <Download size={18} /> Download PDF
        </button>
      </div>

      {/* AI Analysis Results */}
      {analysis && <ScoreCard analysis={analysis} cvData={data} cvId={cvId} />}

      {/* CV Preview */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText size={18} />
          <h4 className="font-display text-sm uppercase">Preview CV ATS</h4>
        </div>
        <CVPreview data={data} />
      </div>
    </div>
  );
};

export default StepReview;
