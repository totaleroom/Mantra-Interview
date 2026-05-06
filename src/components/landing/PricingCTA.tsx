import React, { useState } from 'react';
import { SectionWrapper } from './SectionWrapper';
import { ArrowRight, Zap, UserPlus } from 'lucide-react';
import { openCheckout } from '@/lib/links';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export const PricingCTA: React.FC = () => {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <section className="bg-neoBlack text-white border-y-4 border-foreground py-16">
      <SectionWrapper>
        <div className="text-center">
          {/* Emotional hook headline */}
          <p className="font-body text-gray-400 text-sm uppercase tracking-widest mb-3">Tanya diri lo sendiri:</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase mb-6 leading-tight">
            Berapa Harga Rasa Malu<br />
            Tiap Kali Jawab{' '}
            <span className="text-neoPink">"Masih Nganggur"</span>?
          </h2>

          <div className="inline-block bg-neoLime text-foreground border-2 border-foreground px-4 py-1 font-display text-sm uppercase shadow-neoSm -rotate-1 mb-6">
            <Zap size={14} className="inline mr-1" />
            LOWONGAN TERBATAS. KESEMPATAN ENGGA SELALU ADA.
          </div>

          {/* Price */}
          <div className="mb-2">
            <p className="font-body text-lg text-gray-400 line-through">IDR 470k</p>
            <h3 className="font-display text-5xl md:text-6xl uppercase">
              IDR <span className="text-neoLime">148k</span>
              <span className="font-body text-sm text-gray-400 ml-2">/ 3 bulan akses penuh</span>
            </h3>
          </div>

          {/* Sub-copy urgency */}
          <p className="font-body text-base text-gray-300 mb-8 mt-4 max-w-md mx-auto">Teman lo sudah mulai. HRD sudah buka email.
Lo masih nunggu apa? :)<br />
            <span className="font-bold text-white">​</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openCheckout}
              className="inline-flex bg-neoLime text-foreground border-4 border-white px-8 py-5 font-display text-lg uppercase shadow-[8px_8px_0px_0px_hsl(var(--neo-pink))] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px] transition-all items-center gap-3 cursor-pointer">
              MULAI SPRINT SEKARANG
              <ArrowRight size={22} />
            </button>
            {!user &&
            <button
              onClick={() => setAuthOpen(true)}
              className="inline-flex border-4 border-white bg-transparent text-white px-8 py-5 font-display text-lg uppercase hover:bg-white/10 transition-all items-center gap-3 cursor-pointer">
                <UserPlus size={22} />
                Daftar Gratis Dulu
              </button>
            }
          </div>

          <p className="font-body text-xs text-gray-500 mt-5 uppercase tracking-widest">
            Bukan motivasi. Ini sistem. 7 hari. Hasilnya ada di tangan lo.
          </p>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-gray-400 font-body">
            <span>✓ Akses instan</span>
            <span>✓ CV Builder + AI Analysis</span>
            <span>✓ Update materi berkala</span>
          </div>
        </div>
      </SectionWrapper>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultView="register" />
    </section>);

};