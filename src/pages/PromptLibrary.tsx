import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/landing/Header';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Search, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';

interface Prompt {
  id: string;
  title: string;
  category: string;
  prompt_text: string;
  sort_order: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Foto & Visual': 'bg-neoCyan text-foreground',
  'Psikotes': 'bg-neoViolet text-white',
  'Job Search': 'bg-neoLime text-foreground',
  'Skill Development': 'bg-neoPink text-foreground',
  'Onboarding': 'bg-neoCyan text-foreground',
  'Digital Marketing': 'bg-neoLime text-foreground',
  'Research & Riset': 'bg-neoViolet text-white',
};

const CATEGORIES = ['Semua', 'Foto & Visual', 'Psikotes', 'Job Search', 'Skill Development', 'Onboarding', 'Digital Marketing', 'Research & Riset'];

const PromptLibrary: React.FC = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoadingPrompts(true);
      const { data, error } = await supabase.functions.invoke('get-prompts', {
        method: 'POST',
        body: {},
      });
      if (data?.prompts) {
        setPrompts(data.prompts);
      } else {
        toast({ title: 'Gagal memuat prompts', description: error?.message || 'Coba lagi nanti.', variant: 'destructive' });
      }
      setLoadingPrompts(false);
    };
    fetchPrompts();
  }, []);

  const filtered = prompts.filter((p) => {
    const matchCat = activeCategory === 'Semua' || p.category === activeCategory;
    const matchSearch = search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || p.prompt_text.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCopy = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.prompt_text);
      setCopiedId(prompt.id);
      toast({ title: '✅ Prompt disalin!', description: 'Paste ke ChatGPT atau Gemini sekarang.' });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast({ title: 'Gagal menyalin', description: 'Coba copy manual dari card.', variant: 'destructive' });
    }
  };

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-5xl mx-auto px-5 py-8">
        {/* Back */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>

        {/* Header */}
        <div className="bg-neoBlack text-white border-4 border-foreground p-6 shadow-neoLg mb-8 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-neoViolet rounded-full opacity-20 blur-2xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
            <div className="bg-neoViolet w-16 h-16 border-2 border-white flex items-center justify-center shadow-neoSm shrink-0">
              <Sparkles size={32} className="text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-neoViolet text-white px-3 py-1 font-display text-xs uppercase mb-2 border border-white/30">
                {prompts.length} Prompt Siap Copy
              </div>
              <h1 className="font-display text-2xl md:text-3xl uppercase text-white">Prompt AI Library</h1>
              <p className="font-body text-sm text-gray-400 mt-1">Paste langsung ke ChatGPT atau Gemini. Ganti bagian dalam [kurung] sesuai situasimu.</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari prompt..."
            className="w-full border-4 border-foreground bg-card font-body text-sm pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-neoViolet transition-shadow"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-display text-xs uppercase px-3 py-1.5 border-2 border-foreground transition-all ${
                activeCategory === cat
                  ? 'bg-foreground text-background shadow-none translate-x-[2px] translate-y-[2px]'
                  : 'bg-card hover:bg-muted shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="font-body text-xs text-muted-foreground uppercase mb-4">
          Menampilkan {filtered.length} prompt{activeCategory !== 'Semua' ? ` · ${activeCategory}` : ''}
        </p>

        {/* Loading */}
        {loadingPrompts ? (
          <div className="text-center py-20 border-4 border-dashed border-foreground/20">
            <div className="font-display text-lg uppercase animate-pulse">Memuat prompts...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border-4 border-dashed border-foreground/20">
            <p className="font-display text-lg uppercase text-muted-foreground">Tidak ada prompt ditemukan</p>
            <p className="font-body text-sm text-muted-foreground mt-2">Coba kata kunci lain atau pilih kategori berbeda</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-card border-4 border-foreground p-5 shadow-neo flex flex-col gap-3 hover:shadow-neoLg transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`${CATEGORY_COLORS[prompt.category] || 'bg-muted'} font-display text-[10px] uppercase px-2 py-0.5 border border-foreground/30 shrink-0`}>
                    {prompt.category}
                  </span>
                </div>
                <h3 className="font-display text-sm uppercase leading-tight">{prompt.title}</h3>
                <p className="font-body text-xs text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                  {prompt.prompt_text}
                </p>
                <button
                  onClick={() => handleCopy(prompt)}
                  className={`flex items-center justify-center gap-2 w-full font-display text-xs uppercase px-4 py-2.5 border-2 border-foreground transition-all ${
                    copiedId === prompt.id
                      ? 'bg-neoLime text-foreground shadow-none translate-x-[2px] translate-y-[2px]'
                      : 'bg-foreground text-background hover:bg-foreground/80 shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
                  }`}
                >
                  {copiedId === prompt.id ? (
                    <><Check size={14} /> Copied!</>
                  ) : (
                    <><Copy size={14} /> Copy Prompt</>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  );
};

export default PromptLibrary;
