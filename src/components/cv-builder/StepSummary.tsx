import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { CVData } from './types';

interface Props {
  summary: string;
  targetPosition: string;
  yearsExperience: number;
  onChange: (field: string, value: string | number) => void;
  cvData?: CVData;
}

const StepSummary: React.FC<Props> = ({ summary, targetPosition, yearsExperience, onChange, cvData }) => {
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerateSummary = async () => {
    if (!targetPosition.trim()) {
      toast.error('Isi target posisi terlebih dahulu');
      return;
    }
    setAiLoading(true);
    try {
      const payload = cvData ? {
        target_position: cvData.target_position,
        years_experience: cvData.years_experience,
        skills: cvData.skills,
        experiences: cvData.experiences,
      } : {
        target_position: targetPosition,
        years_experience: yearsExperience,
        skills: { hard_skills: [], soft_skills: [] },
        experiences: [],
      };

      const { data: result, error } = await supabase.functions.invoke('analyze-cv', {
        body: { mode: 'generate-summary', cv_data: payload },
      });
      if (error) throw error;
      if (result?.summary) {
        onChange('summary', result.summary);
        toast.success('Summary berhasil di-generate AI!');
      }
    } catch (err) {
      console.error('AI Summary error:', err);
      toast.error(err instanceof Error ? err.message : 'Gagal generate summary, coba lagi.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-neoCyan/20 border-4 border-foreground p-4 shadow-neo">
        <h3 className="font-display text-lg uppercase mb-1">🎯 Ringkasan Profesional</h3>
        <p className="font-body text-sm text-muted-foreground">Bagian pertama yang dibaca HRD — buat singkat, kuat, dan targeted</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="font-display text-xs uppercase">Target Posisi / Jabatan *</Label>
          <Input value={targetPosition} onChange={(e) => onChange('target_position', e.target.value)} placeholder="Frontend Developer" className="border-2 border-foreground shadow-neoSm" />
        </div>
        <div className="space-y-2">
          <Label className="font-display text-xs uppercase">Total Tahun Pengalaman *</Label>
          <Input type="number" min={0} value={yearsExperience} onChange={(e) => onChange('years_experience', parseInt(e.target.value) || 0)} className="border-2 border-foreground shadow-neoSm w-32" />
        </div>
        <div className="space-y-2">
          <Label className="font-display text-xs uppercase">Professional Summary *</Label>
          <Textarea value={summary} onChange={(e) => onChange('summary', e.target.value)} placeholder="Contoh: Frontend Developer dengan 3+ tahun pengalaman membangun web application menggunakan React dan TypeScript. Berhasil meningkatkan page load speed 40% di PT XYZ." rows={5} className="border-2 border-foreground shadow-neoSm" />
          <div className="flex items-center justify-between">
            <p className="font-body text-xs text-muted-foreground">Tips: Sebutkan role, tahun pengalaman, tech stack utama, dan 1 achievement terbaik</p>
            <button
              onClick={handleGenerateSummary}
              disabled={aiLoading}
              className="bg-neoCyan border-2 border-foreground px-4 py-2 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all flex items-center gap-2 disabled:opacity-50 shrink-0"
            >
              {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {aiLoading ? 'Generating...' : 'Generate AI'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepSummary;
