import React, { useState } from 'react';
import { ArrowRight, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { openCheckout } from '@/lib/links';
import { AuthModal } from '@/components/auth/AuthModal';

export const StickyNav: React.FC = () => {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  if (user) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full bg-card border-t-4 border-foreground z-50 p-3 pb-safe">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div className="hidden md:block">
            <p className="font-display text-sm uppercase">Jangan tutup sebelum lo action.</p>
            <p className="font-body text-xs text-muted-foreground">Harga naik bentar lagi</p>
          </div>
          
          <div className="flex-1 md:flex-none flex gap-2">
            <button
              onClick={openCheckout}
              className="flex-1 bg-neoLime border-4 border-foreground py-3 px-4 font-display text-xs uppercase shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <div className="flex items-center justify-center gap-2">
                <Lock size={14} />
                <span>Amankan Akses</span>
                <ArrowRight size={14} />
              </div>
            </button>
            <button
              onClick={() => setAuthOpen(true)}
              className="bg-neoCyan border-4 border-foreground py-3 px-4 font-display text-xs uppercase shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <div className="flex items-center justify-center gap-2">
                <UserPlus size={14} />
                <span>Daftar</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultView="register" />
    </>
  );
};
