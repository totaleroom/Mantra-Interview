import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Supabase auto-exchanges the hash tokens for a session on recovery links
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });

    // Also check if we already have a session (in case event fired before mount)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: 'Password minimal 8 karakter', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Password tidak cocok', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast({ title: 'Gagal update password', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Password berhasil diubah!', description: 'Silakan login dengan password baru.' });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md border-4 border-foreground bg-background shadow-neoLg p-8">
        <h1 className="font-display text-2xl uppercase mb-2">Reset Password</h1>

        {!ready ? (
          <div className="text-center py-8">
            <Loader2 className="animate-spin mx-auto mb-4 text-muted-foreground" size={32} />
            <p className="font-body text-sm text-muted-foreground">Memverifikasi link reset...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label className="font-display text-xs uppercase flex items-center gap-2 mb-2">
                <Lock size={14} /> Password Baru
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-foreground bg-card font-body shadow-neoSm pr-10 focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                  placeholder="Min 8 karakter"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <Label className="font-display text-xs uppercase flex items-center gap-2 mb-2">
                <Lock size={14} /> Konfirmasi Password
              </Label>
              <Input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-2 border-foreground bg-card font-body shadow-neoSm focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                placeholder="Ulangi password baru"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neoLime border-4 border-foreground py-3 font-display uppercase shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Simpan Password</span><ArrowRight size={18} /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
