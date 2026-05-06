import React from 'react';
import { AlertTriangle, Check, ArrowRight, Pencil } from 'lucide-react';
import type { EnhanceResult } from '@/lib/word-intelligence';

interface Props {
  result: EnhanceResult;
  onAccept: () => void;
  onEdit: () => void;
  onDismiss: () => void;
}

const BeforeAfterCard: React.FC<Props> = ({ result, onAccept, onEdit, onDismiss }) => {
  return (
    <div className="border-4 border-foreground bg-card shadow-neo p-4 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-neoPink text-foreground font-display text-xs px-3 py-1 uppercase border-2 border-foreground">
          ✨ Perkuat Kalimat
        </span>
        <span className="font-body text-xs text-muted-foreground">
          ATS Score: <strong className={result.atsScore >= 70 ? 'text-green-600' : result.atsScore >= 50 ? 'text-yellow-600' : 'text-red-600'}>{result.atsScore}/100</strong>
        </span>
      </div>

      {/* Before */}
      <div className="bg-destructive/10 border-2 border-destructive/30 p-3">
        <p className="font-display text-[10px] uppercase text-destructive mb-1">Sebelum</p>
        <p className="font-body text-sm line-through text-muted-foreground">{result.original}</p>
      </div>

      {/* After */}
      <div className="bg-green-500/10 border-2 border-green-500/30 p-3">
        <p className="font-display text-[10px] uppercase text-green-700 mb-1">Sesudah</p>
        <p className="font-body text-sm font-medium">{result.enhanced}</p>
      </div>

      {/* Changes */}
      {result.changes.length > 0 && (
        <div className="space-y-1">
          <p className="font-display text-[10px] uppercase text-muted-foreground">Perubahan:</p>
          {result.changes.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-xs font-body">
              <span className={`shrink-0 mt-0.5 ${c.type === 'replace' ? 'text-blue-600' : 'text-red-600'}`}>
                {c.type === 'replace' ? '🔄' : '🗑️'}
              </span>
              <span>{c.reason}</span>
            </div>
          ))}
        </div>
      )}

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="bg-yellow-500/10 border-2 border-yellow-500/30 p-3 space-y-1">
          {result.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-xs font-body">
              <AlertTriangle size={12} className="shrink-0 mt-0.5 text-yellow-600" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button onClick={onAccept} className="flex-1 bg-neoLime border-2 border-foreground px-3 py-2 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all flex items-center justify-center gap-1">
          <Check size={14} /> Pakai Versi Baru
        </button>
        <button onClick={onEdit} className="flex-1 border-2 border-foreground px-3 py-2 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all flex items-center justify-center gap-1">
          <Pencil size={14} /> Edit Manual
        </button>
        <button onClick={onDismiss} className="border-2 border-foreground/40 px-3 py-2 font-display text-xs uppercase text-muted-foreground hover:border-foreground transition-colors">
          ✕
        </button>
      </div>
    </div>
  );
};

export default BeforeAfterCard;
