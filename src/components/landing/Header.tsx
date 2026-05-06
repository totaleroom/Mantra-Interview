import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, LogOut, LayoutDashboard, FileText, BookOpen, Mic, Linkedin, Mail, ChevronDown } from 'lucide-react';
import logoMantra from '@/assets/logo-mantra.png';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { LogoutConfirmDialog } from '@/components/auth/LogoutConfirmDialog';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const gratisLinks = [
  { to: '/gratis/cek-cv', label: 'Cek CV ATS Gratis', icon: FileText, highlight: true, badge: 'TOOL' },
  { to: '/tips/cv-ats-friendly', label: 'Tips CV ATS-Friendly', icon: BookOpen },
  { to: '/tips/interview-kerja', label: 'Tips Interview Kerja', icon: Mic },
  { to: '/tips/linkedin-optimization', label: 'Tips LinkedIn', icon: Linkedin },
  { to: '/tips/cover-letter', label: 'Tips Cover Letter', icon: Mail },
];

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [gratisOpen, setGratisOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const gratisRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (gratisRef.current && !gratisRef.current.contains(e.target as Node)) {
        setGratisOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isLanding = location.pathname === '/';

  const scrollToOrNavigate = (id: string) => {
    if (isLanding) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
    setMenuOpen(false);
  };

  const handleAuthClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setAuthOpen(true);
    }
    setMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background border-b-4 border-foreground">
        <div className="max-w-4xl mx-auto px-5 py-3 flex items-center justify-between">
          <img
            src={logoMantra}
            alt="MantraSkill"
            width={294}
            height={56}
            className="h-8 md:h-10 w-auto object-contain cursor-pointer"
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/'); }}
          />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 font-body font-medium text-sm uppercase">
            {!user && (
              <>
                <button onClick={() => scrollToOrNavigate('method')} className="hover:text-neoPink transition-colors">Metode</button>
                <button onClick={() => scrollToOrNavigate('features')} className="hover:text-neoPink transition-colors">Fitur</button>
                <button onClick={() => scrollToOrNavigate('value')} className="hover:text-neoPink transition-colors">Harga</button>

                {/* Gratis Dropdown */}
                <div ref={gratisRef} className="relative">
                  <button
                    onClick={() => setGratisOpen(!gratisOpen)}
                    onMouseEnter={() => setGratisOpen(true)}
                    className="hover:text-neoPink transition-colors flex items-center gap-1"
                  >
                    Gratis
                    <span className="bg-neoPink text-white text-[8px] font-display px-1.5 py-0.5 rounded-sm -rotate-3 leading-none ml-0.5">FREE</span>
                    <ChevronDown size={14} className={`transition-transform ${gratisOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {gratisOpen && (
                    <div
                      onMouseLeave={() => setGratisOpen(false)}
                      className="absolute top-full right-0 mt-2 w-64 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_hsl(var(--foreground))] z-[60] py-2"
                    >
                      {gratisLinks.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setGratisOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm normal-case font-body hover:bg-accent transition-colors ${item.highlight ? 'bg-neoLime/20' : ''}`}
                        >
                          <item.icon size={16} className="shrink-0" />
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className="bg-neoLime border border-foreground text-[9px] font-display px-1.5 py-0.5 leading-none">{item.badge}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/dashboard')} className="bg-neoLime border-2 border-foreground px-4 py-2 font-display text-xs shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2">
                  <LayoutDashboard size={14} />
                  Dashboard
                </button>
                <button onClick={() => setLogoutOpen(true)} className="p-2 hover:text-destructive transition-colors" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button onClick={handleAuthClick} className="bg-foreground text-background px-4 py-2 font-display text-xs shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                Member Login
              </button>
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button className="md:hidden flex items-center gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}>
            {!user && !menuOpen && (
              <span className="bg-neoPink text-white text-[8px] font-display px-1.5 py-0.5 rounded-sm -rotate-3 leading-none">FREE</span>
            )}
            <span className="font-display text-xs uppercase">{menuOpen ? 'Tutup' : 'Menu'}</span>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t-2 border-foreground bg-background px-5 py-4 space-y-3">
            {!user && (
              <>
                <button onClick={() => scrollToOrNavigate('method')} className="block w-full text-left font-display text-sm uppercase py-2">Metode</button>
                <button onClick={() => scrollToOrNavigate('features')} className="block w-full text-left font-display text-sm uppercase py-2">Fitur</button>
                <button onClick={() => scrollToOrNavigate('value')} className="block w-full text-left font-display text-sm uppercase py-2">Harga</button>

                {/* Mobile Gratis Section */}
                <div className="border-t-2 border-foreground pt-3 mt-3">
                  <p className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                    Gratis
                    <span className="bg-neoPink text-white text-[8px] font-display px-1.5 py-0.5 rounded-sm -rotate-3 leading-none">FREE</span>
                  </p>
                  {gratisLinks.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 py-2.5 text-sm font-body ${item.highlight ? 'bg-neoLime/20 border-2 border-foreground px-3 -mx-1 my-1' : ''}`}
                    >
                      <item.icon size={16} className="shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="bg-neoLime border border-foreground text-[9px] font-display px-1.5 py-0.5 leading-none">{item.badge}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </>
            )}
            {user ? (
              <>
                <button onClick={() => { navigate('/dashboard'); setMenuOpen(false); }} className="w-full bg-neoLime border-2 border-foreground py-3 font-display text-sm uppercase shadow-neoSm flex items-center justify-center gap-2">
                  <LayoutDashboard size={16} /> Dashboard
                </button>
                <button onClick={() => { setLogoutOpen(true); setMenuOpen(false); }} className="w-full py-2 font-display text-sm uppercase text-destructive">Logout</button>
              </>
            ) : (
              <button onClick={handleAuthClick} className="w-full bg-foreground text-background py-3 font-display text-sm uppercase shadow-neoSm">
                Member Login
              </button>
            )}
          </div>
        )}
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} onConfirm={() => { signOut(); setLogoutOpen(false); }} />
    </>
  );
};
