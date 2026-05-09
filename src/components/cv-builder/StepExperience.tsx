import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import type { Experience } from './types';
import { enhanceBullets, type EnhanceResult } from '@/lib/word-intelligence';
import BeforeAfterCard from './BeforeAfterCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Props {
  data: Experience[];
  onChange: (data: Experience[]) => void;
  targetPosition?: string;
}

const StepExperience: React.FC<Props> = ({ data, onChange, targetPosition }) => {
  const [enhanceResults, setEnhanceResults] = useState<Record<string, EnhanceResult[]>>({});
  const [showEnhance, setShowEnhance] = useState<Record<string, boolean>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});

  const addExperience = () => {
    onChange([...data, { id: crypto.randomUUID(), company: '', position: '', start_date: '', end_date: '', is_current: false, description: '', type: 'kerja' }]);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter(e => e.id !== id));
    const newResults = { ...enhanceResults };
    delete newResults[id];
    setEnhanceResults(newResults);
  };

  const updateField = (id: string, field: keyof Experience, value: string | boolean) => {
    onChange(data.map(e => e.id === id ? { ...e, [field]: value } : e));
    if (field === 'description') {
      setShowEnhance(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleEnhance = (id: string) => {
    const exp = data.find(e => e.id === id);
    if (!exp || !exp.description.trim()) return;
    const { bullets } = enhanceBullets(exp.description);
    setEnhanceResults(prev => ({ ...prev, [id]: bullets }));
    setShowEnhance(prev => ({ ...prev, [id]: true }));
  };

  const [aiOptimizeResult, setAiOptimizeResult] = useState<Record<string, { original: string; enhanced: string }>>({});

  const handleAIOptimize = async (id: string) => {
    const exp = data.find(e => e.id === id);
    if (!exp || !exp.description.trim()) return;

    setAiLoading(prev => ({ ...prev, [id]: true }));
    try {
      const { data: result, error } = await supabase.functions.invoke('analyze-cv', {
        body: { mode: 'enhance-bullet', text: exp.description, target_position: targetPosition || exp.position },
      });
      if (error) throw error;
      if (result?.enhanced) {
        setAiOptimizeResult(prev => ({ ...prev, [id]: { original: exp.description, enhanced: result.enhanced } }));
      }
    } catch (err) {
      console.error('AI Optimize error:', err);
      toast.error(err instanceof Error ? err.message : 'Gagal mengoptimasi, coba lagi.');
    } finally {
      setAiLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const acceptAIOptimize = (id: string) => {
    const result = aiOptimizeResult[id];
    if (!result) return;
    onChange(data.map(e => e.id === id ? { ...e, description: result.enhanced } : e));
    setAiOptimizeResult(prev => { const n = { ...prev }; delete n[id]; return n; });
    toast.success('Deskripsi berhasil dioptimasi AI!');
  };

  const editAIOptimize = (id: string, newText: string) => {
    setAiOptimizeResult(prev => ({ ...prev, [id]: { ...prev[id], enhanced: newText } }));
  };

  const dismissAIOptimize = (id: string) => {
    setAiOptimizeResult(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const acceptEnhancement = (expId: string) => {
    const results = enhanceResults[expId];
    if (!results) return;
    const enhanced = results.map(r => `• ${r.enhanced}`).join('\n');
    onChange(data.map(e => e.id === expId ? { ...e, description: enhanced } : e));
    setShowEnhance(prev => ({ ...prev, [expId]: false }));
  };

  const dismissEnhancement = (expId: string) => {
    setShowEnhance(prev => ({ ...prev, [expId]: false }));
  };

  return (
    <div className="space-y-5">
      <div className="bg-neoPink/20 border-4 border-foreground p-4 shadow-neo">
        <h3 className="font-display text-lg uppercase mb-1">💼 Pengalaman Kerja</h3>
        <p className="font-body text-sm text-muted-foreground">Tulis achievement (dengan angka!), bukan hanya tanggung jawab</p>
      </div>

      {data.map((exp, idx) => (
        <div key={exp.id} className="border-4 border-foreground p-4 bg-card shadow-neo space-y-3">
          <div className="flex items-center justify-between">
            <span className="bg-foreground text-background font-display text-xs px-3 py-1 uppercase">Pengalaman {idx + 1}</span>
            <button onClick={() => removeExperience(exp.id)} className="text-destructive hover:bg-destructive/10 p-1"><Trash2 size={16} /></button>
          </div>

          {/* Experience Type Toggle */}
          <div className="flex flex-wrap gap-2">
            {(['kerja', 'magang', 'freelance', 'organisasi', 'volunteer'] as const).map(t => (
              <button
                key={t}
                onClick={() => updateField(exp.id, 'type', t)}
                className={`border-2 border-foreground px-3 py-1 font-display text-[10px] uppercase transition-all ${
                  exp.type === t ? 'bg-neoCyan shadow-neoSm' : 'bg-muted hover:bg-accent/20'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="font-display text-xs uppercase">Perusahaan *</Label>
              <Input value={exp.company} onChange={(e) => updateField(exp.id, 'company', e.target.value)} placeholder="PT ABC" className="border-2 border-foreground" />
            </div>
            <div className="space-y-1">
              <Label className="font-display text-xs uppercase">Jabatan *</Label>
              <Input value={exp.position} onChange={(e) => updateField(exp.id, 'position', e.target.value)} placeholder="Frontend Developer" className="border-2 border-foreground" />
            </div>
            <div className="space-y-1">
              <Label className="font-display text-xs uppercase">Mulai *</Label>
              <Input type="month" value={exp.start_date} onChange={(e) => updateField(exp.id, 'start_date', e.target.value)} className="border-2 border-foreground" />
            </div>
            <div className="space-y-1">
              <Label className="font-display text-xs uppercase">Selesai</Label>
              <Input type="month" value={exp.end_date} onChange={(e) => updateField(exp.id, 'end_date', e.target.value)} disabled={exp.is_current} className="border-2 border-foreground" />
              <div className="flex items-center gap-2 mt-1">
                <Checkbox checked={exp.is_current} onCheckedChange={(v) => updateField(exp.id, 'is_current', !!v)} />
                <span className="font-body text-xs">Masih bekerja di sini</span>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="font-display text-xs uppercase">Deskripsi & Achievement *</Label>
            <Textarea value={exp.description} onChange={(e) => updateField(exp.id, 'description', e.target.value)} placeholder="• Meningkatkan page speed 40% dengan code splitting dan lazy loading&#10;• Memimpin tim 3 orang dalam migrasi dari Vue ke React&#10;• Mengurangi bug rate 25% dengan implementasi unit testing" rows={4} className="border-2 border-foreground" />
            <p className="font-body text-xs text-muted-foreground">Gunakan bullet points (•) dan sertakan angka/metrik</p>
          </div>

          {/* Action Buttons */}
          {exp.description.trim().length > 10 && !showEnhance[exp.id] && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleEnhance(exp.id)}
                className="bg-neoPink border-2 border-foreground px-4 py-2 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all flex items-center gap-2"
              >
                <Sparkles size={14} /> Perkuat Kalimat
              </button>
              <button
                onClick={() => handleAIOptimize(exp.id)}
                disabled={aiLoading[exp.id]}
                className="bg-neoCyan border-2 border-foreground px-4 py-2 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {aiLoading[exp.id] ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {aiLoading[exp.id] ? 'Optimizing...' : 'Optimize AI'}
              </button>
            </div>
          )}

          {/* Before/After Cards - Word Intelligence */}
          {showEnhance[exp.id] && enhanceResults[exp.id] && (
            <div className="space-y-3">
              {enhanceResults[exp.id].map((result, i) => (
                <BeforeAfterCard
                  key={i}
                  result={result}
                  onAccept={() => acceptEnhancement(exp.id)}
                  onEdit={() => dismissEnhancement(exp.id)}
                  onDismiss={() => dismissEnhancement(exp.id)}
                />
              ))}
            </div>
          )}

          {/* AI Optimize Before/After */}
          {aiOptimizeResult[exp.id] && (
            <div className="border-4 border-foreground bg-card shadow-neo p-4 space-y-3">
              <span className="bg-neoCyan text-foreground font-display text-xs px-3 py-1 uppercase border-2 border-foreground">
                🤖 AI Optimize — Before / After
              </span>
              <div className="bg-destructive/10 border-2 border-destructive/30 p-3">
                <p className="font-display text-[10px] uppercase text-destructive mb-1">Sebelum</p>
                <p className="font-body text-sm whitespace-pre-wrap text-muted-foreground">{aiOptimizeResult[exp.id].original}</p>
              </div>
              <div className="bg-green-500/10 border-2 border-green-500/30 p-3">
                <p className="font-display text-[10px] uppercase text-green-700 mb-1">Sesudah (AI)</p>
                <textarea
                  value={aiOptimizeResult[exp.id].enhanced}
                  onChange={(e) => editAIOptimize(exp.id, e.target.value)}
                  rows={5}
                  className="w-full font-body text-sm bg-transparent border-0 focus:outline-none resize-y"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => acceptAIOptimize(exp.id)} className="flex-1 bg-neoLime border-2 border-foreground px-3 py-2 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all">
                  ✓ Pakai Versi Ini
                </button>
                <button onClick={() => dismissAIOptimize(exp.id)} className="border-2 border-foreground/40 px-3 py-2 font-display text-xs uppercase text-muted-foreground hover:border-foreground transition-colors">
                  ✕ Batal
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <button onClick={addExperience} className="w-full border-4 border-dashed border-foreground/40 p-4 font-display text-sm uppercase flex items-center justify-center gap-2 hover:border-foreground hover:bg-accent/10 transition-colors">
        <Plus size={18} /> Tambah Pengalaman
      </button>
    </div>
  );
};

export default StepExperience;
