import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/landing/Header';
import { ArrowLeft, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useReadingTracker, ReadingIndicator } from '@/components/modules/ReadingTracker';
import ModuleQuiz from '@/components/modules/ModuleQuiz';
import InterviewSimulator from '@/components/modules/InterviewSimulator';
import { Progress } from '@/components/ui/progress';

interface QuizQuestion {
  question: string;
  options: string[];
}

interface ModuleSection {
  id: string;
  title: string;
  content: string;
  quiz: QuizQuestion[];
}

interface ModuleData {
  id: string;
  title: string;
  thesis: string;
  sections: ModuleSection[];
}

type Phase = 'reading' | 'quiz' | 'simulator';

const ModuleReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin, refreshProfile } = useAuth();
  const { toast } = useToast();

  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [phase, setPhase] = useState<Phase>('reading');
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch module content from server
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    // Use direct fetch for GET with query params
    const fetchModule = async () => {
      try {
        const session = (await supabase.auth.getSession()).data.session;
        if (!session) {
          setError('Silakan login terlebih dahulu');
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-module-content?module_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          }
        );

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          setError(errData.error || 'Gagal memuat modul');
          setLoading(false);
          return;
        }

        const data = await res.json();
        setModuleData(data);
      } catch {
        setError('Gagal memuat modul');
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [id]);

  const section = moduleData?.sections[currentSection];

  // Count words in current section
  const wordCount = section ? section.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length : 200;

  const { scrollPercent, timeSpent, minTime, isSpeedScrolling, isReadingComplete } = useReadingTracker({
    wordCount,
    containerRef: contentRef,
    isAdmin,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (error || !moduleData || !section) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <p className="font-display text-xl">{error || 'Modul tidak ditemukan'}</p>
        <button onClick={() => navigate('/dashboard')} className="font-display text-sm underline">Kembali ke Dashboard</button>
      </div>
    );
  }

  const totalSections = moduleData.sections.length;
  const progressPercent = (completedSections.size / totalSections) * 100;

  const handleQuizPass = () => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(currentSection);
    setCompletedSections(newCompleted);

    if (currentSection < totalSections - 1) {
      setTimeout(() => {
        setCurrentSection(prev => prev + 1);
        setPhase('reading');
        if (contentRef.current) contentRef.current.scrollTop = 0;
      }, 1500);
    } else if (id === '5') {
      setTimeout(() => setPhase('simulator'), 1500);
    } else {
      handleModuleComplete();
    }
  };

  const handleQuizFail = () => {
    setPhase('reading');
    if (contentRef.current) contentRef.current.scrollTop = 0;
  };

  const handleModuleComplete = async () => {
    if (!user || !id) return;
    const profile = (await supabase.from('profiles').select('module_progress').eq('user_id', user.id).single()).data;
    if (!profile) return;

    const progress = (profile.module_progress as Record<string, boolean>) || {};
    const newProgress = { ...progress, [id]: true };

    const { error } = await supabase.from('profiles').update({ module_progress: newProgress }).eq('user_id', user.id);
    if (error) {
      toast({ title: 'Gagal update progress', variant: 'destructive' });
    } else {
      toast({ title: `Modul ${id} selesai! 🎉 Kamu sudah siap ke modul selanjutnya.` });
      await refreshProfile();
      navigate('/dashboard');
    }
  };

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-5 py-8">
        {/* Back */}
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 font-display text-xs uppercase mb-4 hover:text-neoPink transition-colors">
          <ArrowLeft size={14} /> Kembali ke Dashboard
        </button>

        {/* Module Header */}
        <div className="bg-neoBlack text-white border-4 border-foreground p-5 shadow-neoLg mb-6">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen size={20} className="text-neoLime" />
            <span className="font-display text-xs uppercase text-neoLime">Modul {moduleData.id}</span>
          </div>
          <h1 className="font-display text-xl uppercase text-neoLime mb-2">{moduleData.title}</h1>
          <p className="font-body text-sm text-gray-400">{moduleData.thesis}</p>

          {/* Section progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-body text-gray-400 mb-1">
              <span>Section {currentSection + 1} / {totalSections}</span>
              <span>{completedSections.size} selesai</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-white/10 border border-white/20" />
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {moduleData.sections.map((s, i) => (
            <div
              key={s.id}
              className={`flex-shrink-0 border-2 border-foreground px-3 py-2 font-display text-[10px] uppercase ${
                completedSections.has(i) ? 'bg-neoLime' : i === currentSection ? 'bg-neoCyan shadow-neoSm' : 'bg-muted opacity-50'
              }`}
            >
              {s.id}
            </div>
          ))}
        </div>

        {/* Section Title */}
        <div className="bg-neoCyan/20 border-4 border-foreground p-4 shadow-neo mb-4">
          <h2 className="font-display text-lg uppercase">{section.id} {section.title}</h2>
        </div>

        {phase === 'simulator' ? (
          <InterviewSimulator
            onComplete={handleModuleComplete}
            onRetry={() => setPhase('simulator')}
          />
        ) : phase === 'quiz' ? (
          <ModuleQuiz
            questions={section.quiz}
            moduleId={id!}
            sectionIndex={currentSection}
            onPass={handleQuizPass}
            onFail={handleQuizFail}
            isAdmin={isAdmin}
          />
        ) : (
          <>
            {/* Reading Indicator */}
            <ReadingIndicator
              scrollPercent={scrollPercent}
              timeSpent={timeSpent}
              minTime={minTime}
              isSpeedScrolling={isSpeedScrolling}
              isAdmin={isAdmin}
            />

            {/* Content Area */}
            <div
              ref={contentRef}
              className="border-4 border-foreground bg-card p-6 shadow-neo max-h-[60vh] overflow-y-auto module-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content) }}
            />

            {/* Continue to Quiz button */}
            <div className="mt-4">
              <button
                onClick={() => isReadingComplete && setPhase('quiz')}
                disabled={!isReadingComplete}
                className="w-full bg-neoLime border-4 border-foreground p-4 font-display text-sm uppercase shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {!isReadingComplete ? (
                  <>Baca dulu sampai selesai untuk lanjut quiz</>
                ) : (
                  <>Lanjut ke Quiz <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </PageTransition>
  );
};

export default ModuleReader;
