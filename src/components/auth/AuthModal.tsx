import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, ArrowRight, Loader2, Mail, Lock, User, X, CheckCircle, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type AuthView = 'login' | 'register' | 'forgot' | 'success';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultView?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange, defaultView = 'login' }) => {
  const [view, setView] = useState<AuthView>(defaultView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [honeypot, setHoneypot] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Sync defaultView when prop changes
  useEffect(() => {
    if (open) {
      setView(defaultView);
    }
  }, [defaultView, open]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setHoneypot('');
    setShowPassword(false);
  };

  const switchView = (v: AuthView) => {
    resetForm();
    setView(v);
  };

  const validatePassword = (p: string) => {
    if (p.length < 8) return 'Password minimal 8 karakter';
    if (!/[A-Z]/.test(p)) return 'Password harus ada 1 huruf besar';
    if (!/[0-9]/.test(p)) return 'Password harus ada 1 angka';
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: 'Login gagal', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Berhasil login!' });
      onOpenChange(false);
      resetForm();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    const pwError = validatePassword(password);
    if (pwError) {
      toast({ title: 'Password tidak valid', description: pwError, variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error, session } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      toast({ title: 'Registrasi gagal', description: error, variant: 'destructive' });
    } else if (session) {
      toast({ title: 'Akun berhasil dibuat!' });
      onOpenChange(false);
      navigate('/dashboard');
    } else {
      setView('success');
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      toast({ title: 'Gagal', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Email terkirim!', description: 'Cek inbox kamu untuk link reset password.' });
      switchView('login');
    }
  };

  const handleNavigate = (path: string) => {
    onOpenChange(false);
    resetForm();
    navigate(path);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-4 border-foreground shadow-neoLg p-0 max-w-md [&>button:last-child]:hidden">
        <DialogClose className="absolute -top-4 -right-4 z-50 w-8 h-8 bg-foreground text-background border-2 border-foreground flex items-center justify-center hover:bg-destructive transition-colors">
          <X className="h-4 w-4" />
        </DialogClose>

        {view === 'success' ? (
          <SuccessScreen onNavigate={handleNavigate} onClose={() => { onOpenChange(false); resetForm(); setView(defaultView); }} />
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b-4 border-foreground">
              {(['login', 'register', 'forgot'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => switchView(v)}
                  className={`flex-1 py-3 font-display text-xs uppercase transition-colors ${
                    view === v ? 'bg-neoLime text-foreground' : 'bg-background text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {v === 'login' ? 'Login' : v === 'register' ? 'Daftar' : 'Lupa PW'}
                </button>
              ))}
            </div>

            <div className="p-6">
              <DialogHeader className="mb-6">
                <DialogTitle className="font-display text-2xl uppercase">
                  {view === 'login' && 'Login'}
                  {view === 'register' && 'Daftar Akun Gratis'}
                  {view === 'forgot' && 'Reset Password'}
                </DialogTitle>
                {view === 'register' && (
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    Daftar gratis, langsung akses semua fitur. Tanpa aktivasi.
                  </p>
                )}
              </DialogHeader>

              {/* LOGIN */}
              {view === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="absolute opacity-0 h-0 w-0 -z-10" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                  <div>
                    <Label className="font-display text-xs uppercase flex items-center gap-2 mb-2">
                      <Mail size={14} /> Email
                    </Label>
                    <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="border-2 border-foreground bg-card font-body shadow-neoSm focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all" placeholder="email@kamu.com" />
                  </div>
                  <div>
                    <Label className="font-display text-xs uppercase flex items-center gap-2 mb-2">
                      <Lock size={14} /> Password
                    </Label>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="border-2 border-foreground bg-card font-body shadow-neoSm pr-10 focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-neoLime border-4 border-foreground py-3 font-display uppercase shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Masuk</span><ArrowRight size={18} /></>}
                  </button>
                </form>
              )}

              {/* REGISTER */}
              {view === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="absolute opacity-0 h-0 w-0 -z-10" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                  <div>
                    <Label className="font-display text-xs uppercase flex items-center gap-2 mb-2">
                      <User size={14} /> Nama Lengkap
                    </Label>
                    <Input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="border-2 border-foreground bg-card font-body shadow-neoSm focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all" placeholder="Nama kamu" />
                  </div>
                  <div>
                    <Label className="font-display text-xs uppercase flex items-center gap-2 mb-2">
                      <Mail size={14} /> Email
                    </Label>
                    <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="border-2 border-foreground bg-card font-body shadow-neoSm focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all" placeholder="email@kamu.com" />
                  </div>
                  <div>
                    <Label className="font-display text-xs uppercase flex items-center gap-2 mb-2">
                      <Lock size={14} /> Password
                    </Label>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="border-2 border-foreground bg-card font-body shadow-neoSm pr-10 focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all" placeholder="Min 8 karakter, 1 huruf besar, 1 angka" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <p className="text-[10px] font-body text-muted-foreground mt-1">Min 8 karakter, 1 huruf besar, 1 angka</p>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-neoLime border-4 border-foreground py-3 font-display uppercase shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Daftar Gratis</span><ArrowRight size={18} /></>}
                  </button>
                  <p className="text-center text-xs font-body text-muted-foreground mt-3">
                    Sudah punya akun?{' '}
                    <button type="button" onClick={() => switchView('login')} className="underline hover:text-foreground transition-colors">Login di sini</button>
                  </p>
                </form>
              )}

              {/* FORGOT PASSWORD */}
              {view === 'forgot' && (
                <form onSubmit={handleForgot} className="space-y-4">
                  <p className="font-body text-sm text-muted-foreground mb-2">
                    Masukkan email kamu, dan kita kirim link untuk reset password.
                  </p>
                  <div>
                    <Label className="font-display text-xs uppercase flex items-center gap-2 mb-2">
                      <Mail size={14} /> Email
                    </Label>
                    <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="border-2 border-foreground bg-card font-body shadow-neoSm focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all" placeholder="email@kamu.com" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-neoCyan border-4 border-foreground py-3 font-display uppercase shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Kirim Reset Link</span><ArrowRight size={18} /></>}
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

/* ─── Post-Register Success Screen ─── */
const SuccessScreen: React.FC<{ onNavigate: (path: string) => void; onClose: () => void }> = ({ onNavigate, onClose }) => {
  return (
    <div className="p-6 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-neoLime border-4 border-foreground mb-4">
        <CheckCircle size={32} />
      </div>
      <h2 className="font-display text-2xl uppercase mb-2">Akun Berhasil Dibuat!</h2>
      <p className="font-body text-sm text-muted-foreground mb-6">
        Akun kamu sudah siap.<br />
        Silakan login untuk mengakses semua fitur secara gratis!
      </p>
      <div className="space-y-3 mb-6">
        <button
          onClick={() => onNavigate('/dashboard')}
          className="w-full bg-neoLime border-4 border-foreground py-3 px-4 font-display text-sm uppercase shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2"
        >
          <LayoutDashboard size={16} />
          Buka Dashboard
        </button>
        <button
          onClick={() => onNavigate('/gratis/cek-cv')}
          className="w-full bg-neoCyan border-4 border-foreground py-3 px-4 font-display text-sm uppercase shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2"
        >
          Cek Skor CV Gratis
        </button>
      </div>
      <button onClick={onClose} className="font-body text-xs text-muted-foreground underline hover:text-foreground transition-colors">
        Tutup
      </button>
    </div>
  );
};
