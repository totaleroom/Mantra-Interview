import React, { useState, useEffect, useRef, useCallback } from 'react';
import { interviewQuestions, type InterviewQuestion } from '@/data/module-5-content';
import { useSpeechToText } from './useSpeechToText';
import { Mic, MicOff, Send, RotateCcw, CheckCircle, XCircle, MessageSquare, Award } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface QuestionResult {
  question: InterviewQuestion;
  answer: string;
  score: number;
  feedback: string;
  details: { requiredFound: string[]; bonusFound: string[]; redFlagsFound: string[]; wordCount: number; hasSTAR: boolean };
}

function selectQuestions(): InterviewQuestion[] {
  const byCategory: Record<string, InterviewQuestion[]> = {};
  interviewQuestions.forEach(q => {
    if (!byCategory[q.category]) byCategory[q.category] = [];
    byCategory[q.category].push(q);
  });

  const selected: InterviewQuestion[] = [];
  const categories: InterviewQuestion['category'][] = ['behavioral', 'situational', 'self-awareness', 'motivational'];

  categories.forEach(cat => {
    const pool = byCategory[cat];
    if (pool?.length) {
      selected.push(pool[Math.floor(Math.random() * pool.length)]);
    }
  });

  // Add 1 random extra
  const remaining = interviewQuestions.filter(q => !selected.includes(q));
  if (remaining.length) {
    selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
  }

  return selected;
}

function analyzeAnswer(answer: string, question: InterviewQuestion): { score: number; feedback: string; details: QuestionResult['details'] } {
  const lower = answer.toLowerCase();
  const words = answer.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const requiredFound = question.requiredKeywords.filter(k => lower.includes(k.toLowerCase()));
  const bonusFound = question.bonusKeywords.filter(k => lower.includes(k.toLowerCase()));
  const redFlagsFound = question.redFlags.filter(k => lower.includes(k.toLowerCase()));

  // Detect STAR structure
  const starIndicators = ['situasi', 'situation', 'tugas', 'task', 'aksi', 'action', 'langkah', 'hasil', 'result', 'dampak'];
  const starCount = starIndicators.filter(s => lower.includes(s)).length;
  const hasSTAR = starCount >= 3;

  // Score calculation
  let score = 0;

  // Word count (0-2 points)
  if (wordCount >= 100) score += 2;
  else if (wordCount >= 50) score += 1;

  // Required keywords (0-5 points)
  const reqRatio = question.requiredKeywords.length > 0 ? requiredFound.length / question.requiredKeywords.length : 0;
  score += Math.round(reqRatio * 5);

  // Bonus keywords (0-2 points)
  score += Math.min(bonusFound.length, 2);

  // STAR structure bonus
  if (hasSTAR) score += 1;

  // Red flags penalty
  score -= redFlagsFound.length;

  // Clamp 1-10
  score = Math.max(1, Math.min(10, score));

  let feedback: string;
  if (score >= 8) feedback = question.feedbackTemplates.good;
  else if (score >= 5) feedback = question.feedbackTemplates.average;
  else feedback = question.feedbackTemplates.poor;

  return { score, feedback, details: { requiredFound, bonusFound, redFlagsFound, wordCount, hasSTAR } };
}

interface Props {
  onComplete: () => void;
  onRetry: () => void;
}

type SimPhase = 'intro' | 'answering' | 'feedback' | 'scorecard';

const InterviewSimulator: React.FC<Props> = ({ onComplete, onRetry }) => {
  const [questions] = useState<InterviewQuestion[]>(() => selectQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<SimPhase>('intro');
  const [answerText, setAnswerText] = useState('');
  const [results, setResults] = useState<QuestionResult[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { isListening, transcript, interimTranscript, isSupported, startListening, stopListening, resetTranscript } = useSpeechToText('id-ID');

  // Auto-cleanup all data on unmount (security: no speech data persisted)
  useEffect(() => {
    return () => {
      setAnswerText('');
      setResults([]);
    };
  }, []);

  // Sync speech transcript to answer text
  useEffect(() => {
    if (transcript) {
      setAnswerText(prev => (prev ? prev + ' ' : '') + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [phase, currentIndex, results]);

  const handleSubmitAnswer = useCallback(() => {
    if (!answerText.trim() || phase !== 'answering') return;
    const q = questions[currentIndex];
    const analysis = analyzeAnswer(answerText, q);
    setResults(prev => [...prev, { question: q, answer: answerText, ...analysis }]);
    setAnswerText('');
    stopListening();
    setPhase('feedback');
  }, [answerText, phase, questions, currentIndex, stopListening]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setPhase('answering');
    } else {
      setPhase('scorecard');
    }
  };

  const averageScore = results.length > 0 ? results.reduce((sum, r) => sum + r.score, 0) / results.length : 0;
  const passed = averageScore >= 7;

  const handleFinish = () => {
    if (passed) {
      onComplete();
    } else {
      onRetry();
    }
  };

  const categoryLabel: Record<string, string> = {
    behavioral: '🧠 Behavioral',
    situational: '💡 Situational',
    'self-awareness': '🪞 Self-Awareness',
    motivational: '🔥 Motivational',
  };

  return (
    <div className="space-y-4">
      {/* Intro */}
      {phase === 'intro' && (
        <div className="border-4 border-foreground bg-card p-6 shadow-neoLg space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-neoLime w-10 h-10 border-2 border-foreground flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg uppercase">Interview Simulator</h3>
              <p className="font-body text-xs text-muted-foreground">Rule-based • Zero LLM • Data auto-hapus</p>
            </div>
          </div>

          <div className="bg-neoCyan/20 border-2 border-foreground p-4">
            <p className="font-body text-sm leading-relaxed">
              <strong>Selamat datang di sesi interview simulasi!</strong><br /><br />
              Saya akan mengajukan <strong>5 pertanyaan</strong> dari berbagai kategori. Jawab setiap pertanyaan seolah-olah kamu sedang interview sungguhan.<br /><br />
              Kamu bisa mengetik jawaban atau menggunakan <strong>tombol mikrofon</strong> untuk speech-to-text (Chrome/Edge).<br /><br />
              Setelah setiap jawaban, kamu akan mendapat feedback dan skor. Rata-rata skor <strong>≥ 7/10</strong> untuk menyelesaikan modul ini.
            </p>
          </div>

          <button
            onClick={() => setPhase('answering')}
            className="w-full bg-neoLime border-4 border-foreground p-4 font-display text-sm uppercase shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2"
          >
            Mulai Interview 🎯
          </button>
        </div>
      )}

      {/* Previous results (chat-like) */}
      {results.map((r, i) => (
        <div key={i} className="space-y-2">
          {/* Interviewer question */}
          <div className="bg-neoBlack text-white border-2 border-foreground p-4">
            <span className="font-display text-[10px] uppercase text-neoLime">{categoryLabel[r.question.category]} — Pertanyaan {i + 1}</span>
            <p className="font-body text-sm mt-1">{r.question.question}</p>
          </div>
          {/* User answer */}
          <div className="bg-neoCyan/10 border-2 border-foreground/40 p-4 ml-8">
            <span className="font-display text-[10px] uppercase text-muted-foreground">Jawaban Kamu</span>
            <p className="font-body text-sm mt-1">{r.answer}</p>
          </div>
          {/* Feedback */}
          <div className={`border-2 p-4 ml-4 ${r.score >= 8 ? 'border-neoLime bg-neoLime/10' : r.score >= 5 ? 'border-yellow-500 bg-yellow-500/10' : 'border-destructive bg-destructive/10'}`}>
            <div className="flex items-center gap-2 mb-2">
              {r.score >= 8 ? <CheckCircle size={16} className="text-neoLime" /> : r.score >= 5 ? <Award size={16} className="text-yellow-600" /> : <XCircle size={16} className="text-destructive" />}
              <span className="font-display text-xs uppercase">Skor: {r.score}/10</span>
            </div>
            <p className="font-body text-sm">{r.feedback}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {r.details.hasSTAR && <span className="bg-neoLime/20 text-[10px] px-2 py-0.5 border border-neoLime font-body">✓ STAR Detected</span>}
              <span className="bg-muted text-[10px] px-2 py-0.5 border font-body">{r.details.wordCount} kata</span>
              {r.details.redFlagsFound.length > 0 && <span className="bg-destructive/20 text-[10px] px-2 py-0.5 border border-destructive font-body">⚠ Red flags: {r.details.redFlagsFound.join(', ')}</span>}
            </div>
          </div>
        </div>
      ))}

      {/* Current question */}
      {phase === 'answering' && currentIndex < questions.length && (
        <div className="space-y-3">
          <div className="bg-neoBlack text-white border-4 border-foreground p-5 shadow-neo">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-[10px] uppercase text-neoLime">{categoryLabel[questions[currentIndex].category]} — Pertanyaan {currentIndex + 1}/{questions.length}</span>
              <span className="font-body text-[10px] text-gray-400">{questions[currentIndex].idealStructure}</span>
            </div>
            <p className="font-body text-sm leading-relaxed">{questions[currentIndex].question}</p>
            <p className="font-body text-xs text-gray-500 mt-2 italic">{questions[currentIndex].context}</p>
          </div>

          {/* Answer input */}
          <div className="border-4 border-foreground bg-card p-4 shadow-neo">
            <Textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Ketik jawaban kamu di sini... atau gunakan tombol mikrofon"
              className="min-h-[120px] border-2 border-foreground font-body text-sm"
            />
            {interimTranscript && (
              <p className="mt-1 font-body text-xs text-muted-foreground italic animate-pulse">
                🎙️ {interimTranscript}...
              </p>
            )}

            <div className="flex items-center gap-2 mt-3">
              {isSupported && !isListening && (
                <button
                  onClick={startListening}
                  className="border-2 border-foreground p-3 font-display text-xs uppercase bg-neoLime shadow-neoSm hover:shadow-none transition-all flex items-center gap-2"
                >
                  <Mic size={16} /> Mulai Rekam
                </button>
              )}
              {isSupported && isListening && (
                <button
                  onClick={stopListening}
                  className="border-2 border-foreground p-3 font-display text-xs uppercase bg-destructive text-white flex items-center gap-2 animate-pulse"
                >
                  <MicOff size={16} /> Stop Rekam
                </button>
              )}

              <button
                onClick={handleSubmitAnswer}
                disabled={!answerText.trim()}
                className="flex-1 bg-neoCyan border-2 border-foreground p-3 font-display text-xs uppercase shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send size={14} /> Kirim Jawaban
              </button>
            </div>

            {isListening && (
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-destructive animate-ping" />
                <p className="font-body text-xs text-destructive">🎙️ Merekam... bicara sekarang, klik "Stop Rekam" jika selesai</p>
              </div>
            )}
            {!isSupported && (
              <p className="font-body text-xs text-muted-foreground mt-2">ℹ️ Speech-to-text tidak didukung browser ini. Gunakan text input.</p>
            )}
          </div>
        </div>
      )}

      {/* Feedback phase — next button */}
      {phase === 'feedback' && (
        <button
          onClick={handleNext}
          className="w-full bg-neoCyan border-4 border-foreground p-4 font-display text-sm uppercase shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2"
        >
          {currentIndex < questions.length - 1 ? 'Pertanyaan Berikutnya →' : 'Lihat Scorecard 📊'}
        </button>
      )}

      {/* Scorecard */}
      {phase === 'scorecard' && (
        <div className="border-4 border-foreground bg-card p-6 shadow-neoLg space-y-4">
          <div className="text-center">
            <h3 className="font-display text-xl uppercase mb-2">📊 Scorecard Interview</h3>
            <div className={`inline-block px-6 py-3 border-4 border-foreground font-display text-3xl ${passed ? 'bg-neoLime' : 'bg-destructive/20 text-destructive'}`}>
              {averageScore.toFixed(1)}/10
            </div>
            <p className="font-body text-sm text-muted-foreground mt-2">
              {passed ? '🎉 Selamat! Kamu lulus Interview Simulator!' : '❌ Skor belum mencukupi. Coba lagi untuk mendapat ≥ 7/10.'}
            </p>
          </div>

          {/* Per-question breakdown */}
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border-2 border-foreground/30">
                <span className="font-display text-[10px] uppercase w-24 shrink-0">{categoryLabel[r.question.category]}</span>
                <div className="flex-1">
                  <Progress value={r.score * 10} className="h-3 bg-muted border border-foreground/20" />
                </div>
                <span className={`font-display text-sm ${r.score >= 8 ? 'text-neoLime' : r.score >= 5 ? 'text-yellow-600' : 'text-destructive'}`}>{r.score}/10</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleFinish}
            className={`w-full border-4 border-foreground p-4 font-display text-sm uppercase shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2 ${passed ? 'bg-neoLime' : 'bg-neoPink'}`}
          >
            {passed ? (
              <><CheckCircle size={16} /> Selesaikan Modul 🎉</>
            ) : (
              <><RotateCcw size={16} /> Coba Lagi</>
            )}
          </button>
        </div>
      )}

      <div ref={chatEndRef} />
    </div>
  );
};

export default InterviewSimulator;
