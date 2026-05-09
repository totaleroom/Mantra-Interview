import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/landing/Header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
import {
  LogOut, Play, FileText, CheckCircle, Lock, Clock, ArrowRight, Zap, Linkedin, FileEdit, Sparkles
} from 'lucide-react';

const modules = [
  { id: '1', title: 'Audit Diri & Mindset Reset', type: 'text', duration: '30 menit', icon: FileText, color: 'bg-neoLime' },
  { id: '2', title: 'CV ATS-Friendly', type: 'text', duration: '45 menit', icon: FileText, color: 'bg-neoCyan' },
  { id: '3', title: 'LinkedIn & Cover Letter', type: 'text', duration: '50 menit', icon: FileText, color: 'bg-neoPink' },
  { id: '4', title: 'Deep Research & Company Intel', type: 'text', duration: '40 menit', icon: FileText, color: 'bg-neoViolet' },
  { id: '5', title: 'Interview Simulator', type: 'interactive', duration: '60 menit', icon: Play, color: 'bg-neoLime' },
];

const Dashboard: React.FC = () => {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-display text-2xl uppercase animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) return null;

  const progress = profile.module_progress as Record<string, boolean>;
  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressPercent = (completedCount / modules.length) * 100;

  const isModuleUnlocked = (moduleId: string): boolean => {
    const idx = parseInt(moduleId);
    if (idx === 1) return true;
    return progress[String(idx - 1)] === true;
  };

  const isModuleCompleted = (moduleId: string): boolean => {
    return progress[moduleId] === true;
  };

  const handleCompleteModule = async (moduleId: string) => {
    if (!isModuleUnlocked(moduleId) || isModuleCompleted(moduleId)) return;

    const newProgress = { ...progress, [moduleId]: true };
    try {
      const res = await fetch(`${API_URL}/profile/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mantra_token')}`
        },
        body: JSON.stringify({ module_progress: newProgress })
      });
      
      if (!res.ok) throw new Error('Gagal update progress');
      
      toast({ title: `Modul ${moduleId} selesai! 🎉` });
      await refreshProfile();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
      toast({ title: 'Gagal update progress', description: message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-3xl mx-auto px-5 py-8">
        {/* Welcome Header */}
        <div className="bg-neoBlack text-white border-4 border-foreground p-6 shadow-neoLg mb-8 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-neoLime rounded-full opacity-20 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-body text-sm text-gray-400 uppercase tracking-widest mb-1">Welcome back,</p>
                <h1 className="font-display text-2xl md:text-3xl uppercase text-neoLime">{profile.full_name || 'Member'}</h1>
              </div>
              <div className="flex items-center gap-2 bg-neoLime/20 border border-neoLime/30 px-3 py-2">
                <span className="font-body text-sm font-bold text-neoLime">
                  Free Access ✓
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-xs uppercase tracking-wider">Sprint Progress</span>
                <span className="font-body text-sm font-bold text-neoLime">{completedCount}/{modules.length} Modul</span>
              </div>
              <div className="relative h-4 w-full overflow-hidden border-2 border-white/20 bg-white/10">
                <div
                  className="h-full bg-neoLime transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Prompt Library CTA */}
        <Link
          to="/dashboard/prompt-library"
          className="block bg-neoViolet border-4 border-foreground p-5 shadow-neoLg hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all mb-4"
        >
          <div className="flex items-center gap-4">
            <div className="bg-foreground text-background w-14 h-14 flex items-center justify-center border-2 border-foreground shadow-neoSm">
              <Sparkles size={28} />
            </div>
            <div>
              <h2 className="font-display text-lg uppercase text-white">Prompt AI Library</h2>
              <p className="font-body text-sm text-white/80">55+ prompt AI siap copy-paste — dari riset perusahaan sampai nego gaji</p>
            </div>
            <ArrowRight size={24} className="ml-auto text-white" />
          </div>
        </Link>

        {/* CV Builder CTA */}
        <Link
          to="/dashboard/cv-builder"
          className="block bg-neoCyan border-4 border-foreground p-5 shadow-neoLg hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="bg-foreground text-background w-14 h-14 flex items-center justify-center border-2 border-foreground shadow-neoSm">
              <FileText size={28} />
            </div>
            <div>
              <h2 className="font-display text-lg uppercase">ATS CV Builder</h2>
              <p className="font-body text-sm">Bikin CV yang lolos ATS + AI scoring real-time. Bukan template asal-asalan.</p>
            </div>
            <ArrowRight size={24} className="ml-auto" />
          </div>
        </Link>

        {/* CV Checker CTA */}
        <Link
          to="/dashboard/cv-checker"
          className="block bg-neoViolet/20 border-4 border-foreground p-5 shadow-neoLg hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all mb-4"
        >
          <div className="flex items-center gap-4">
            <div className="bg-neoViolet text-background w-14 h-14 flex items-center justify-center border-2 border-foreground shadow-neoSm">
              <ClipboardCheck size={28} />
            </div>
            <div>
              <h2 className="font-display text-lg uppercase">CV Checker Komprehensif</h2>
              <p className="font-body text-sm">Upload CV & dapatkan analisis AI lengkap: skor 10 kategori + JD keyword match.</p>
            </div>
            <ArrowRight size={24} className="ml-auto" />
          </div>
        </Link>

        {/* LinkedIn & Cover Letter CTAs */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link
            to="/dashboard/linkedin-optimizer"
            className="bg-neoCyan/20 border-4 border-foreground p-5 shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-neoCyan w-12 h-12 border-2 border-foreground flex items-center justify-center shadow-neoSm">
                <Linkedin size={24} />
              </div>
              <div>
                <h2 className="font-display text-sm uppercase">LinkedIn Optimizer</h2>
                <p className="font-body text-xs text-muted-foreground">Prompt AI biar profil lo dicari recruiter, bukan cuma pajangan</p>
              </div>
              <ArrowRight size={18} className="ml-auto" />
            </div>
          </Link>
          <Link
            to="/dashboard/cover-letter"
            className="bg-neoPink/20 border-4 border-foreground p-5 shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-neoPink w-12 h-12 border-2 border-foreground flex items-center justify-center shadow-neoSm">
                <FileEdit size={24} />
              </div>
              <div>
                <h2 className="font-display text-sm uppercase">Cover Letter Generator</h2>
                <p className="font-body text-xs text-muted-foreground">Generate cover letter personal per perusahaan. Anti copy-paste.</p>
              </div>
              <ArrowRight size={18} className="ml-auto" />
            </div>
          </Link>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={18} className="text-neoPink" />
            <h2 className="font-display text-xl uppercase">5 Senjata Sprint</h2>
          </div>

        {modules.map((mod) => {

            const unlocked = isModuleUnlocked(mod.id);
            const completed = isModuleCompleted(mod.id);

            return (
              <div
                key={mod.id}
                className={`border-4 border-foreground p-5 transition-all ${
                  completed
                    ? 'bg-neoLime/20 shadow-none translate-x-[4px] translate-y-[4px]'
                    : unlocked
                    ? 'bg-card shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer'
                    : 'bg-muted shadow-none opacity-60'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-3 sm:contents">
                    <div className={`${completed ? 'bg-neoLime' : unlocked ? mod.color : 'bg-muted'} w-12 h-12 border-2 border-foreground flex items-center justify-center shrink-0 shadow-neoSm`}>
                      {completed ? (
                        <CheckCircle size={24} strokeWidth={3} />
                      ) : unlocked ? (
                        <mod.icon size={24} strokeWidth={2.5} />
                      ) : (
                        <Lock size={24} />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:hidden">
                      <span className="bg-foreground text-background font-body text-[10px] px-2 py-0.5 uppercase">Modul {mod.id}</span>
                      <span className="font-body text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                        <Clock size={10} /> {mod.duration}
                      </span>
                      {mod.type === 'interactive' && (
                        <span className="bg-neoPink text-foreground font-body text-[10px] px-2 py-0.5 uppercase border border-foreground">Interactive</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="hidden sm:flex items-center gap-2 mb-1">
                      <span className="bg-foreground text-background font-body text-[10px] px-2 py-0.5 uppercase">Modul {mod.id}</span>
                      <span className="font-body text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                        <Clock size={10} /> {mod.duration}
                      </span>
                      {mod.type === 'interactive' && (
                        <span className="bg-neoPink text-foreground font-body text-[10px] px-2 py-0.5 uppercase border border-foreground">Interactive</span>
                      )}
                    </div>
                    <h3 className="font-display text-sm md:text-base uppercase break-words">{mod.title}</h3>
                  </div>

                  <div className="w-full sm:w-auto sm:shrink-0">
                    {completed ? (
                      <button
                        onClick={() => navigate(`/dashboard/module/${mod.id}`)}
                        className="w-full sm:w-auto font-display text-xs text-neoLime uppercase bg-foreground px-3 py-2 border-2 border-foreground hover:opacity-80 transition-opacity flex items-center justify-center gap-1"
                      >
                        Review Lagi <ArrowRight size={14} />
                      </button>
                    ) : unlocked ? (
                      <button
                        onClick={() => navigate(`/dashboard/module/${mod.id}`)}
                        className="w-full sm:w-auto bg-neoLime border-2 border-foreground px-4 py-2 font-display text-xs uppercase shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-1"
                      >
                        Mulai <ArrowRight size={14} />
                      </button>
                    ) : (
                      <span className="font-body text-xs text-muted-foreground uppercase">Terkunci</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coming Soon Modules */}
        <div className="space-y-4 mt-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={18} className="text-neoViolet" />
            <h2 className="font-display text-xl uppercase">Senjata Berikutnya</h2>
          </div>

          {[
            { title: 'Salary Negotiation Toolkit', desc: 'Panduan negosiasi gaji + template email counter offer', color: 'bg-neoCyan' },
            { title: 'Portfolio Builder', desc: 'Buat portfolio online untuk showcase project', color: 'bg-neoPink' },
            { title: 'Blast & Track (Job Tracker)', desc: 'Lacak semua lamaran + status follow-up', color: 'bg-neoLime' },
            { title: 'Networking Script Generator', desc: 'Template cold DM ke recruiter/HRD di LinkedIn', color: 'bg-neoViolet' },
          ].map((item) => (
            <div
              key={item.title}
              className="border-4 border-foreground/40 bg-muted p-5 opacity-60 relative overflow-hidden"
            >
              <div className="absolute top-3 right-3 bg-neoPink border-2 border-foreground px-2 py-0.5 font-display text-[10px] uppercase shadow-neoSm">
                SOON
              </div>
              <div className="flex items-center gap-4 pr-16">
                <div className={`${item.color} w-12 h-12 border-2 border-foreground/40 flex items-center justify-center shrink-0 opacity-50`}>
                  <Lock size={24} />
                </div>
                <div>
                  <h3 className="font-display text-sm uppercase break-words">{item.title}</h3>
                  <p className="font-body text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
