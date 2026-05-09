import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/landing/Header';
import { ArrowLeft, ArrowRight, Save, Plus, Trash2, Edit3, FileText } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import StepPersonal from '@/components/cv-builder/StepPersonal';
import StepSummary from '@/components/cv-builder/StepSummary';
import StepExperience from '@/components/cv-builder/StepExperience';
import StepEducation from '@/components/cv-builder/StepEducation';
import StepSkills from '@/components/cv-builder/StepSkills';
import StepReview from '@/components/cv-builder/StepReview';
import { emptyCV, type CVData } from '@/components/cv-builder/types';

const steps = [
  { id: 1, label: 'Data Pribadi', color: 'bg-neoLime' },
  { id: 2, label: 'Ringkasan', color: 'bg-neoCyan' },
  { id: 3, label: 'Pengalaman', color: 'bg-neoPink' },
  { id: 4, label: 'Pendidikan', color: 'bg-neoViolet' },
  { id: 5, label: 'Skills', color: 'bg-neoLime' },
  { id: 6, label: 'Review', color: 'bg-neoCyan' },
];

interface DraftMeta {
  id: string;
  cv_name: string | null;
  target_position: string;
  updated_at: string;
}

const CVBuilder: React.FC = () => {
  const { user, loading, isSubscriptionActive, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [cvData, setCvData] = useState<CVData>(emptyCV);
  const [cvId, setCvId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [drafts, setDrafts] = useState<DraftMeta[]>([]);
  const [showDraftPicker, setShowDraftPicker] = useState(false);
  const [loadingDrafts, setLoadingDrafts] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Subscription check handled by SubscriptionGuard wrapper

  const initialLoadDone = useRef(false);

  // Load existing drafts
  useEffect(() => {
    if (!user?.id) return;
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    const loadDrafts = async () => {
      setLoadingDrafts(true);
      const { data } = await supabase
        .from('cv_data')
        .select('id, cv_name, target_position, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      const draftList = (data || []) as DraftMeta[];
      setDrafts(draftList);
      if (draftList.length > 0) {
        setShowDraftPicker(true);
      }
      setLoadingDrafts(false);
    };
    loadDrafts();
  }, [user?.id]);

  const loadDraft = async (draftId: string) => {
    if (!user) return;
    const { data } = await supabase
      .from('cv_data')
      .select('*')
      .eq('id', draftId)
      .single();
    if (data) {
      setCvId(data.id);
      setCvData({
        personal_info: (data.personal_info as any) || emptyCV.personal_info,
        summary: data.summary || '',
        target_position: data.target_position || '',
        years_experience: data.years_experience || 0,
        experiences: (data.experiences as any) || [],
        education: (data.education as any) || [],
        skills: (data.skills as any) || emptyCV.skills,
        certifications: (data.certifications as any) || [],
        languages: ((data as any).languages as any) || [],
      });
    }
    setShowDraftPicker(false);
    setCurrentStep(1);
  };

  const startNewDraft = () => {
    if (drafts.length >= 3) {
      toast({
        title: 'Batas 3 draft tercapai',
        description: 'Hapus salah satu draft dulu sebelum buat CV baru.',
        variant: 'destructive',
      });
      return;
    }
    setCvId(null);
    setCvData(emptyCV);
    setShowDraftPicker(false);
    setCurrentStep(1);
  };

  const deleteDraft = async (draftId: string) => {
    setDeletingId(draftId);
    const { error } = await supabase.from('cv_data').delete().eq('id', draftId);
    if (error) {
      toast({ title: 'Gagal hapus draft', description: error.message, variant: 'destructive' });
    } else {
      setDrafts(prev => prev.filter(d => d.id !== draftId));
      toast({ title: 'Draft dihapus' });
    }
    setDeletingId(null);
  };

  const saveCV = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const personalInfo = profile?.full_name
        ? { ...cvData.personal_info, full_name: profile.full_name }
        : cvData.personal_info;

      const payload = {
        user_id: user.id,
        personal_info: personalInfo as any,
        summary: cvData.summary,
        target_position: cvData.target_position,
        years_experience: cvData.years_experience,
        experiences: cvData.experiences as any,
        education: cvData.education as any,
        skills: cvData.skills as any,
        certifications: cvData.certifications as any,
        languages: cvData.languages as any,
      };

      if (cvId) {
        const { error } = await supabase.from('cv_data').update(payload).eq('id', cvId);
        if (error) throw error;
      } else {
        // Check 3-draft limit before insert
        const { count } = await supabase
          .from('cv_data')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);
        if ((count ?? 0) >= 3) {
          toast({
            title: 'Batas 3 draft tercapai',
            description: 'Hapus salah satu draft dulu sebelum buat CV baru.',
            variant: 'destructive',
          });
          return;
        }
        const { data, error } = await supabase.from('cv_data').insert(payload).select('id').single();
        if (error) throw error;
        setCvId(data.id);
        setDrafts(prev => [{ id: data.id, cv_name: null, target_position: cvData.target_position, updated_at: new Date().toISOString() }, ...prev]);
      }
      toast({ title: 'CV berhasil disimpan! 💾' });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Terjadi kesalahan';
      toast({ title: 'Gagal menyimpan', description: message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const goNext = async () => {
    await saveCV();
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const goPrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (loading || !user) return null;

  // Draft Picker UI
  if (showDraftPicker && !loadingDrafts) {
    return (
      <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-5 py-8">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 font-display text-xs uppercase mb-6 hover:text-neoPink transition-colors">
            <ArrowLeft size={14} /> Kembali ke Dashboard
          </button>

          <div className="bg-neoLime border-4 border-foreground p-5 shadow-neoLg mb-6">
            <h1 className="font-display text-2xl uppercase mb-1">CV Builder</h1>
            <p className="font-body text-sm">Pilih draft yang ingin diedit atau buat CV baru</p>
          </div>

          {/* Draft List */}
          <div className="space-y-3 mb-6">
            {drafts.map((draft) => (
              <div key={draft.id} className="bg-card border-4 border-foreground p-4 shadow-neo flex items-center gap-4">
                <div className="bg-neoCyan w-12 h-12 border-2 border-foreground flex items-center justify-center shrink-0">
                  <FileText size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm uppercase truncate">
                    {draft.cv_name || draft.target_position || 'Draft CV'}
                  </h3>
                  <p className="font-body text-xs text-muted-foreground">
                    Diupdate: {new Date(draft.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => loadDraft(draft.id)}
                    className="flex items-center gap-1 bg-neoLime border-2 border-foreground px-3 py-2 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all"
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => deleteDraft(draft.id)}
                    disabled={deletingId === draft.id}
                    className="flex items-center gap-1 bg-neoPink border-2 border-foreground px-3 py-2 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all disabled:opacity-50"
                  >
                    <Trash2 size={12} /> {deletingId === draft.id ? '...' : 'Hapus'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* New Draft Button */}
          <button
            onClick={startNewDraft}
            disabled={drafts.length >= 3}
            className="w-full flex items-center justify-center gap-2 border-4 border-dashed border-foreground p-5 font-display text-sm uppercase hover:bg-card transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            {drafts.length >= 3 ? 'Batas 3 draft tercapai — hapus dulu' : `Buat CV Baru (${drafts.length}/3)`}
          </button>
        </div>
      </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-5 py-8">
        {/* Back button */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => drafts.length > 0 ? setShowDraftPicker(true) : navigate('/dashboard')} className="flex items-center gap-2 font-display text-xs uppercase hover:text-neoPink transition-colors">
            <ArrowLeft size={14} /> {drafts.length > 0 ? 'Pilih Draft' : 'Kembali ke Dashboard'}
          </button>
          {cvId && (
            <span className="font-body text-xs text-muted-foreground">
              · {cvData.target_position || 'Draft CV'}
            </span>
          )}
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex-shrink-0 border-2 border-foreground px-3 py-2 font-display text-[10px] uppercase transition-all ${
                currentStep === step.id
                  ? `${step.color} shadow-neo font-bold`
                  : currentStep > step.id
                  ? 'bg-foreground text-background'
                  : 'bg-card opacity-60'
              }`}
            >
              {step.id}. {step.label}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && (
            <StepPersonal data={cvData.personal_info} onChange={(d) => setCvData({ ...cvData, personal_info: d })} lockedName={profile?.full_name} />
          )}
          {currentStep === 2 && (
            <StepSummary summary={cvData.summary} targetPosition={cvData.target_position} yearsExperience={cvData.years_experience} onChange={(field, value) => setCvData({ ...cvData, [field]: value })} cvData={cvData} />
          )}
          {currentStep === 3 && (
            <StepExperience data={cvData.experiences} onChange={(d) => setCvData({ ...cvData, experiences: d })} targetPosition={cvData.target_position} />
          )}
          {currentStep === 4 && (
            <StepEducation data={cvData.education} onChange={(d) => setCvData({ ...cvData, education: d })} />
          )}
          {currentStep === 5 && (
            <StepSkills
              skills={cvData.skills}
              certifications={cvData.certifications}
              languages={cvData.languages}
              onSkillsChange={(s) => setCvData({ ...cvData, skills: s })}
              onCertsChange={(c) => setCvData({ ...cvData, certifications: c })}
              onLanguagesChange={(l) => setCvData({ ...cvData, languages: l })}
              experienceTexts={cvData.experiences.map(e => e.description)}
            />
          )}
          {currentStep === 6 && <StepReview data={cvData} cvId={cvId} onCvDataChange={setCvData} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t-4 border-foreground pt-4">
          <button
            onClick={goPrev}
            disabled={currentStep === 1}
            className="flex items-center gap-2 border-2 border-foreground px-4 py-2 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all disabled:opacity-30"
          >
            <ArrowLeft size={14} /> Sebelumnya
          </button>

          <button onClick={saveCV} disabled={saving} className="flex items-center gap-2 bg-foreground text-background px-4 py-2 font-display text-xs uppercase border-2 border-foreground">
            <Save size={14} /> {saving ? 'Menyimpan...' : 'Simpan Draft'}
          </button>

          {currentStep < 6 ? (
            <button
              onClick={goNext}
              className="flex items-center gap-2 bg-neoLime border-2 border-foreground px-4 py-2 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all"
            >
              Selanjutnya <ArrowRight size={14} />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default CVBuilder;
