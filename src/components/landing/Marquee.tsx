import React from 'react';

const items = [
  { text: "CV ATS-FRIENDLY", color: "bg-neoLime" },
  { text: "INTERVIEW PREP", color: "bg-neoPink" },
  { text: "AI-POWERED", color: "bg-neoCyan" },
  { text: "7 HARI SPRINT", color: "bg-neoViolet text-white" },
  { text: "LINKEDIN HACK", color: "bg-neoLime" },
  { text: "COVER LETTER", color: "bg-neoPink" },
];

export const Marquee: React.FC = () => {
  const tripled = [...items, ...items, ...items];

  return (
    <div className="bg-foreground border-y-4 border-foreground py-3 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {tripled.map((item, i) => (
          <span key={i} className="inline-flex items-center mx-4">
            <span className={`${item.color} px-3 py-1 font-display text-sm uppercase border-2 border-foreground`}>
              {item.text}
            </span>
            <span className="text-neoLime font-display text-lg mx-3">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};
