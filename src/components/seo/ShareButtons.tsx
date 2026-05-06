import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
  const [copied, setCopied] = useState(false);
  const fullUrl = `https://mantraskill.web.id${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 my-6">
      <span className="font-display text-xs uppercase text-muted-foreground flex items-center gap-1">
        <Share2 size={14} /> Bagikan
      </span>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-8 h-8 border-2 border-foreground bg-card shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-xs font-bold"
        aria-label="Share via WhatsApp"
      >
        WA
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-8 h-8 border-2 border-foreground bg-card shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-xs font-bold"
        aria-label="Share on X/Twitter"
      >
        X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-8 h-8 border-2 border-foreground bg-card shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-xs font-bold"
        aria-label="Share on LinkedIn"
      >
        in
      </a>
      <button
        onClick={handleCopy}
        className="inline-flex items-center justify-center w-8 h-8 border-2 border-foreground bg-card shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        aria-label="Copy link"
      >
        {copied ? <Check size={14} className="text-neoLime" /> : <Copy size={14} />}
      </button>
    </div>
  );
};

export default ShareButtons;
