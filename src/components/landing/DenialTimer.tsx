import React, { useState, useEffect, useRef } from 'react';
import { SectionWrapper } from './SectionWrapper';
import { AlertTriangle } from 'lucide-react';

const TIMER_KEY = 'denial_timer_deadline';
const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

const getRandomCount = () => Math.floor(Math.random() * (200 - 30 + 1)) + 30;

const getOrCreateDeadline = (): number => {
  const stored = localStorage.getItem(TIMER_KEY);
  if (stored) {
    const deadline = parseInt(stored, 10);
    if (deadline > Date.now()) return deadline;
  }
  const newDeadline = Date.now() + EIGHT_HOURS_MS;
  localStorage.setItem(TIMER_KEY, String(newDeadline));
  return newDeadline;
};

export const DenialTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 0, seconds: 0 });
  const [randomCount, setRandomCount] = useState(getRandomCount);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [fade, setFade] = useState(true);
  const deadlineRef = useRef<number>(0);

  const messages = [
  `Lo masih scroll. Sementara ${randomCount} orang lain udah mulai sprint hari ini.`,
  "Detik ini ada HRD yang lagi review CV. Apa CV lo udah siap?",
  "Waktu lo terus jalan. Masih mikir atau udah action?",
  "Lowongan impian lo expired besok. Udah apply belum?"];


  // Countdown timer — setiap 1 detik
  useEffect(() => {
    deadlineRef.current = getOrCreateDeadline();

    const tick = () => {
      const now = Date.now();
      let diff = deadlineRef.current - now;

      if (diff <= 0) {
        const newDeadline = now + EIGHT_HOURS_MS;
        localStorage.setItem(TIMER_KEY, String(newDeadline));
        deadlineRef.current = newDeadline;
        diff = EIGHT_HOURS_MS;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor(diff % (1000 * 60 * 60) / (1000 * 60)),
        seconds: Math.floor(diff % (1000 * 60) / 1000)
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Message rotation — setiap 5 detik dengan fade
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [messages.length]);

  // Update random count setiap 10 menit
  useEffect(() => {
    const interval = setInterval(() => {
      setRandomCount(getRandomCount());
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="bg-foreground text-background border-y-4 border-foreground py-12">
      <SectionWrapper>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-destructive text-white px-3 py-1 font-display text-xs uppercase mb-4 border-2 border-white shadow-neoSm">WAKTU MU YANG TERUS BERDETIK!
            <AlertTriangle size={14} />
            Reality Check
          </div>

          <div className="flex justify-center gap-4 mb-6">
            {[
            { val: pad(timeLeft.hours), label: "Jam" },
            { val: pad(timeLeft.minutes), label: "Menit" },
            { val: pad(timeLeft.seconds), label: "Detik" }].
            map((t, i) =>
            <div key={i} className="bg-background text-foreground border-2 border-background w-20 py-3 text-center">
                <div className="font-display text-3xl">{t.val}</div>
                <div className="font-body text-[10px] uppercase tracking-widest">{t.label}</div>
              </div>
            )}
          </div>

          <div className="min-h-[6rem] overflow-hidden flex items-center justify-center max-w-md mx-auto">
            <p
              className="font-body text-lg leading-relaxed text-gray-300 text-center transition-opacity duration-300"
              style={{ opacity: fade ? 1 : 0 }}>
              
              {messages[currentMessage]}
            </p>
          </div>
        </div>
      </SectionWrapper>
    </section>);

};