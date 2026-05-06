import React, { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import type { AIAnalysis, CVData } from './types';

interface Props {
  analysis: AIAnalysis;
  cvData?: CVData;
  cvId?: string | null;
}

const labelMap: Record<string, string> = {
  ats_compatibility: 'ATS Compatibility',
  keyword_optimization: 'Keyword',
  achievement_vs_responsibility: 'Achievement',
  storytelling_quality: 'Storytelling',
  skill_relevance: 'Skill Relevance',
  experience_depth: 'Experience',
  professional_summary: 'Summary',
  education_fit: 'Education',
  formatting_structure: 'Format',
  overall_impression: 'Impression',
};

const ScoreCard: React.FC<Props> = ({ analysis, cvData, cvId }) => {
  const [rewriting, setRewriting] = useState(false);
  const [rewriteResult, setRewriteResult] = useState<any>(null);
  const { toast } = useToast();

  const chartData = Object.entries(analysis.scores).map(([key, value]) => ({
    category: labelMap[key] || key,
    score: value,
    fullMark: 10,
  }));

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-neoLime';
    if (score >= 6) return 'text-neoCyan';
    if (score >= 4) return 'text-yellow-500';
    return 'text-destructive';
  };

  const handleAIRewrite = async () => {
    if (!cvData || !cvId) return;
    setRewriting(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('analyze-cv', {
        body: { cv_data: cvData, cv_id: cvId, mode: 'rewrite' },
      });
      if (error) throw error;
      if (result?.rewrite) {
        setRewriteResult(result.rewrite);
        toast({ title: 'AI Rewrite berhasil! 🎉 Lihat suggestion di bawah.' });
      } else {
        throw new Error(result?.error || 'Gagal rewrite');
      }
    } catch (e: any) {
      toast({ title: 'Gagal rewrite', description: e.message, variant: 'destructive' });
    } finally {
      setRewriting(false);
    }
  };

  const showRewriteButton = analysis.total_score < 7.5 && cvData && cvId;

  return (
    <div className="space-y-6">
      {/* Total Score */}
      <div className="bg-neoBlack text-background border-4 border-foreground p-6 shadow-neoLg text-center">
        <p className="font-display text-xs uppercase tracking-widest text-neoLime mb-2">Skor CV Kamu</p>
        <p className={`font-display text-6xl ${getScoreColor(analysis.total_score)}`}>
          {analysis.total_score.toFixed(1)}
        </p>
        <p className="font-body text-sm text-muted-foreground mt-1">dari 10.0</p>
      </div>

      {/* AI Rewrite CTA - only when score < 7.5 */}
      {showRewriteButton && !rewriteResult && (
        <div className="bg-neoPink/20 border-4 border-neoPink p-5 shadow-neo">
          <h4 className="font-display text-sm uppercase mb-2">⚡ Skor di bawah standar? Super AI bisa bantu!</h4>
          <p className="font-body text-xs text-muted-foreground mb-3">
            Skor CV kamu {analysis.total_score.toFixed(1)}/10 — di bawah threshold 7.5. Super AI bisa menulis ulang summary dan deskripsi pengalaman kamu agar lebih kuat dan ATS-friendly.
          </p>
          <button
            onClick={handleAIRewrite}
            disabled={rewriting}
            className="w-full bg-neoPink border-4 border-foreground p-3 font-display text-sm uppercase shadow-neo hover:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {rewriting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {rewriting ? 'Super AI sedang menulis...' : 'Tulis Ulang oleh Super AI'}
          </button>
        </div>
      )}

      {/* Rewrite Results */}
      {rewriteResult && (
        <div className="border-4 border-neoLime p-5 bg-neoLime/10 shadow-neo space-y-4">
          <h4 className="font-display text-sm uppercase">✨ Hasil Rewrite Super AI</h4>
          {rewriteResult.summary && (
            <div className="border-2 border-foreground/20 p-3 bg-background">
              <p className="font-display text-xs uppercase text-neoPink mb-1">Summary Baru</p>
              <p className="font-body text-xs">{rewriteResult.summary}</p>
            </div>
          )}
          {rewriteResult.experiences?.map((exp: any, i: number) => (
            <div key={i} className="border-2 border-foreground/20 p-3 bg-background">
              <p className="font-display text-xs uppercase text-neoPink mb-1">Pengalaman: Rewrite</p>
              <p className="font-body text-xs whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
          <p className="font-body text-[10px] text-muted-foreground">💡 Copy teks di atas dan paste ke step yang sesuai untuk menggunakannya.</p>
        </div>
      )}

      {/* Radar Chart */}
      <div className="border-4 border-foreground p-4 bg-card shadow-neo">
        <h4 className="font-display text-sm uppercase mb-4">📊 Analisis Detail</h4>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" className="text-[10px]" />
            <PolarRadiusAxis angle={30} domain={[0, 10]} />
            <Radar name="Score" dataKey="score" stroke="hsl(84, 100%, 62%)" fill="hsl(84, 100%, 62%)" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Scores Breakdown */}
      <div className="border-4 border-foreground p-4 bg-card shadow-neo space-y-3">
        <h4 className="font-display text-sm uppercase">📋 Skor Per Kategori</h4>
        {Object.entries(analysis.scores).map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="font-body text-xs">{labelMap[key]}</span>
                <span className={`font-display text-xs ${getScoreColor(value)}`}>{value}/10</span>
              </div>
              <div className="h-2 bg-muted border border-foreground">
                <div className="h-full bg-neoLime transition-all" style={{ width: `${value * 10}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="border-4 border-foreground p-4 bg-card shadow-neo space-y-3">
        <h4 className="font-display text-sm uppercase">💡 Rekomendasi</h4>
        {Object.entries(analysis.recommendations).map(([key, rec]) => (
          <div key={key} className="border-2 border-foreground/20 p-3 bg-background">
            <p className="font-display text-xs uppercase text-neoPink mb-1">{labelMap[key] || key}</p>
            <p className="font-body text-xs">{rec}</p>
          </div>
        ))}
      </div>

      {/* Tips */}
      {analysis.improvement_tips.length > 0 && (
        <div className="bg-neoCyan/20 border-4 border-foreground p-4 shadow-neo space-y-2">
          <h4 className="font-display text-sm uppercase">🚀 Tips Improvement</h4>
          {analysis.improvement_tips.map((tip, i) => (
            <p key={i} className="font-body text-xs">• {tip}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScoreCard;
