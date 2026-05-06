import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Instagram } from 'lucide-react';
import logoMantra from '@/assets/logo-mantra.png';

const navLinks = [
  { label: 'Fitur', href: '#features' },
  { label: 'Roadmap', href: '#method' },
  { label: 'Testimoni', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

const resourceLinks = [
  { label: 'Cek CV Gratis', to: '/gratis/cek-cv' },
  { label: 'Tips CV ATS', to: '/tips/cv-ats-friendly' },
  { label: 'Tips Interview', to: '/tips/interview-kerja' },
  { label: 'Tips LinkedIn', to: '/tips/linkedin-optimization' },
  { label: 'Tips Cover Letter', to: '/tips/cover-letter' },
];

const karirLinks = [
  { label: 'Contoh CV', to: '/karir/posisi' },
  { label: 'Lowongan per Kota', to: '/karir/lokasi' },
  { label: 'Info Gaji 2026', to: '/karir/gaji' },
  { label: 'Istilah Karir', to: '/karir/istilah' },
];

const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const id = href.replace('#', '');
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-primary-foreground border-t-4 border-neoLime">
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* About */}
          <div>
            <div className="mb-4">
              <img src={logoMantra} alt="MantraSkill" width={294} height={56} className="h-8 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
              Platform akselerasi karir berbasis AI untuk Gen-Z Indonesia. Kami membantu kamu membangun CV ATS-friendly, 
              menguasai interview, dan mendapatkan pekerjaan impian dalam 7 hari.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm uppercase text-neoLime mb-4">Navigasi</h3>
            <ul className="space-y-2 font-body text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className="text-primary-foreground/70 hover:text-neoLime transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/privacy-policy" className="text-primary-foreground/70 hover:text-neoLime transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display text-sm uppercase text-neoLime mb-4">Resources</h3>
            <ul className="space-y-2 font-body text-sm">
              {resourceLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-primary-foreground/70 hover:text-neoLime transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Karir */}
          <div>
            <h3 className="font-display text-sm uppercase text-neoLime mb-4">Karir</h3>
            <ul className="space-y-2 font-body text-sm">
              {karirLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-primary-foreground/70 hover:text-neoLime transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="font-display text-sm uppercase text-neoLime mt-6 mb-3">Kontak</h3>
            <ul className="space-y-2 font-body text-sm">
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Mail size={14} className="text-neoLime shrink-0" />
                <a href="mailto:hello00mantra@gmail.com" className="hover:text-neoLime transition-colors">hello00mantra@gmail.com</a>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Instagram size={14} className="text-neoLime shrink-0" />
                <a href="https://instagram.com/mantraskill" target="_blank" rel="noopener noreferrer" className="hover:text-neoLime transition-colors">@hiimantra</a>
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin size={14} className="text-neoLime shrink-0 mt-0.5" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
            <Link to="/seo/keywords" className="inline-block mt-3 font-body text-xs text-primary-foreground/40 hover:text-primary-foreground/60 transition-colors">
              Indeks Topik
            </Link>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="border-t border-primary-foreground/20 pt-6 pb-4 mb-6">
          <h3 className="font-display text-sm uppercase text-primary-foreground/50 mb-3">Segera Hadir</h3>
          <div className="flex flex-wrap gap-2">
            {['Job Tracker & Pipeline', 'AI Mock Interview (Video)', 'Salary Negotiation Coach', 'Company Culture Match'].map((feature) => (
              <span key={feature} className="inline-flex items-center gap-1.5 font-body text-xs text-primary-foreground/50 border border-primary-foreground/20 px-3 py-1.5">
                <span className="bg-neoLime text-foreground text-[8px] font-display px-1 py-0.5 leading-none">SOON</span>
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} MantraSkill. All rights reserved.
          </p>
          <p className="font-body text-xs text-primary-foreground/60">
            Built with 💚 for Gen-Z Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};
