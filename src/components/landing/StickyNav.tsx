import React, { useState } from 'react';
import { ArrowRight, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { useNavigate } from 'react-router-dom';

export const StickyNav: React.FC = () => {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();

  if (user) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full bg-card border-t-4 border-foreground z-50 p-3 pb-safe">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div className="hidden md:block">
            <p className="font-display text-sm uppercase">Siap upgrade karir lo?</p>
            <p className="font-body text-xs text-muted-foreground">Daftar gratis, langsung akses</p>
          </div>
          
          <div className="flex-1 md:flex-none flex gap-2">
            <button
              onClick={() => setAuthOpen(true)}
              className="flex-1 bg-neoLime border-4 border-foreground py-3 px-4 font-display text-xs uppercase shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <div className="flex items-center justify-center gap-2">
                <UserPlus size={14} />
                <span>Daftar Gratis</span>
                <ArrowRight size={14} />
              </div>
            </button>
          </div>
        </div>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultView="register" />
    </>
  );
};
