import React, { useState } from 'react';
import { ArrowRight, Users, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { useNavigate } from 'react-router-dom';

export const Hero: React.FC = () => {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-background border-b-4 border-foreground">
      {/* Dot pattern */}
      <div className="absolute inset-0 dot-pattern opacity-40"></div>

      <div className="relative px-5 py-16 md:py-24 max-w-lg mx-auto md:max-w-2xl lg:max-w-4xl text-center">
        {/* Sticker label */}
        <div className="inline-block border-2 border-foreground px-3 py-1 font-display text-xs uppercase shadow-neoSm -rotate-2 mb-6 bg-accent">
          ⚡ Sprint 7 Hari
        </div>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl uppercase leading-[0.9] mb-6">
          Stop Kirim CV{' '}
          <span className="relative inline-block">
            <span className="relative z-10">SIA-SIA!</span>
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
              <path d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8" stroke="hsl(var(--neo-lime))" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>
          <br />
          <span className="text-neoPink">BIKIN CV ATS</span> Yang Benar Biar Lolos
        </h1>

        <p className="font-body text-lg md:text-xl max-w-xl mx-auto mb-8 leading-relaxed">
          Sistem lamaran kerja dalam 7 hari yang bikin HRD{' '}
          <span className="font-bold bg-neoLime px-1 border border-foreground">bales email lo</span>. Ini bukan motivasi, bukan webinar. Ini <span className="font-bold">action plan</span>!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-3">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-neoLime border-4 border-foreground px-8 py-4 font-display text-lg uppercase shadow-neoLg hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2 text-foreground cursor-pointer">
              Buka Dashboard
              <ArrowRight size={20} />
            </button>
          ) : (
            <>
              <button
                onClick={() => setAuthOpen(true)}
                className="bg-neoLime border-4 border-foreground px-8 py-4 font-display text-lg uppercase shadow-neoLg hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2 text-foreground cursor-pointer">
                <UserPlus size={20} />
                Daftar Gratis
                <ArrowRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Micro-copy */}
        <p className="font-body text-xs text-muted-foreground mb-6 mt-3 italic">
          100% gratis. Tanpa kartu kredit. Langsung akses semua fitur.
        </p>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-2 font-body text-sm">
          <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) =>
            <div key={i} className="w-8 h-8 rounded-full border-2 border-foreground bg-gradient-to-br from-neoCyan to-neoViolet" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span className="font-bold">850+</span> udah mulai sprint
          </div>
        </div>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultView="register" />
    </section>);

};