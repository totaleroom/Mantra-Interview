import React, { useState } from 'react';
import { ChevronDown, ChevronUp, List } from 'lucide-react';

interface TOCProps {
  sections: { heading: string }[];
}

const TableOfContents: React.FC<TOCProps> = ({ sections }) => {
  const [open, setOpen] = useState(false);

  if (sections.length < 2) return null;

  return (
    <nav className="my-6 border-4 border-foreground bg-card shadow-neoSm p-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full font-display text-xs uppercase"
      >
        <span className="flex items-center gap-2">
          <List size={14} />
          Daftar Isi
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <ol className="mt-3 space-y-2 font-body text-xs text-muted-foreground list-decimal pl-5">
          {sections.map((s, i) => (
            <li key={i}>
              <a
                href={`#section-${i}`}
                className="hover:text-foreground transition-colors underline-offset-2 hover:underline"
              >
                {s.heading}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
};

export default TableOfContents;
