import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuizQuestion {
  question: string;
  options: string[];
}

interface Props {
  questions: QuizQuestion[];
  moduleId: string;
  sectionIndex: number;
  onPass: () => void;
  onFail: () => void;
  isAdmin?: boolean;
}

const ModuleQuiz: React.FC<Props> = ({ questions, moduleId, sectionIndex, onPass, onFail, isAdmin }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [results, setResults] = useState<{ correct: boolean }[]>([]);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answersArray = questions.map((_, i) => answers[i] ?? -1);

      const { data, error } = await supabase.functions.invoke('validate-quiz', {
        body: {
          module_id: moduleId,
          section_index: sectionIndex,
          answers: answersArray,
        },
      });

      if (error) throw error;

      setResults(data.results || []);
      setAllCorrect(data.correct);
      setSubmitted(true);

      if (data.correct) {
        setTimeout(() => onPass(), 1500);
      }
    } catch {
      toast({ title: 'Gagal memvalidasi quiz', description: 'Coba lagi dalam beberapa saat.', variant: 'destructive' });
      setSubmitted(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setAllCorrect(false);
    setResults([]);
    onFail();
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="border-4 border-foreground bg-card p-6 shadow-neoLg space-y-6">
      <div className="bg-neoPink/20 border-2 border-foreground p-3">
        <h4 className="font-display text-sm uppercase">📝 Quiz — Jawab Semua Dengan Benar</h4>
        <p className="font-body text-xs text-muted-foreground mt-1">Semua jawaban harus benar untuk melanjutkan. Jika salah, kamu harus baca ulang section ini.</p>
      </div>

      {questions.map((q, qi) => {
        const isCorrect = submitted && results[qi]?.correct;
        const isWrong = submitted && results[qi] && !results[qi].correct;

        return (
          <div key={qi} className={`p-4 border-2 ${isCorrect ? 'border-neoLime bg-neoLime/10' : isWrong ? 'border-destructive bg-destructive/10' : 'border-foreground/30'}`}>
            <p className="font-body text-sm font-semibold mb-3 flex items-start gap-2">
              <span className="bg-foreground text-background font-display text-[10px] px-2 py-0.5 mt-0.5 shrink-0">{qi + 1}</span>
              {q.question}
              {isCorrect && <CheckCircle size={18} className="text-neoLime shrink-0 ml-auto" />}
              {isWrong && <XCircle size={18} className="text-destructive shrink-0 ml-auto" />}
            </p>
            <RadioGroup
              value={answers[qi] !== undefined ? answers[qi].toString() : ''}
              onValueChange={(v) => !submitted && setAnswers(prev => ({ ...prev, [qi]: parseInt(v) }))}
              className="space-y-2"
            >
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <RadioGroupItem value={oi.toString()} id={`q${qi}-o${oi}`} disabled={submitted} />
                  <Label htmlFor={`q${qi}-o${oi}`} className="font-body text-sm cursor-pointer">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      })}

      {!submitted ? (
        <div className="space-y-2">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="w-full bg-neoLime border-4 border-foreground p-3 font-display text-sm uppercase shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Memeriksa...</> : 'Submit Jawaban'}
          </button>
          {isAdmin && (
            <button
              onClick={onPass}
              className="w-full bg-neoCyan border-4 border-foreground p-3 font-display text-sm uppercase shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              ⚡ Admin: Skip Quiz
            </button>
          )}
        </div>
      ) : allCorrect ? (
        <div className="bg-neoLime/20 border-4 border-neoLime p-4 text-center">
          <p className="font-display text-lg uppercase">🎉 Semua Benar!</p>
          <p className="font-body text-sm text-muted-foreground">Melanjutkan ke section berikutnya...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-destructive/10 border-4 border-destructive p-4 text-center">
            <p className="font-display text-sm uppercase text-destructive">❌ Ada jawaban yang salah!</p>
            <p className="font-body text-xs text-muted-foreground mt-1">Kamu harus baca ulang section ini dan mengerjakan quiz lagi.</p>
          </div>
          <button
            onClick={handleRetry}
            className="w-full bg-neoPink border-4 border-foreground p-3 font-display text-sm uppercase shadow-neo hover:shadow-none transition-all"
          >
            Baca Ulang Section Ini
          </button>
        </div>
      )}
    </div>
  );
};

export default ModuleQuiz;
