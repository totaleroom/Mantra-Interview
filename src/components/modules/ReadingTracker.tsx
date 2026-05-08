import { useState, useEffect, useRef, useCallback } from 'react';

interface ReadingState {
  scrollPercent: number;
  timeSpent: number;
  minTime: number;
  isSpeedScrolling: boolean;
  isReadingComplete: boolean;
}

interface UseReadingTrackerOptions {
  wordCount: number;
  isAdmin?: boolean;
}

export function useReadingTracker({ wordCount, isAdmin = false }: UseReadingTrackerOptions) {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSpeedScrolling, setIsSpeedScrolling] = useState(false);
  const scrollSpeedsRef = useRef<number[]>([]);
  const lastScrollRef = useRef<{ pos: number; time: number } | null>(null);
  const isVisibleRef = useRef(true);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  // Min time = wordCount / 3 seconds (180 wpm)
  const minTime = Math.max(30, Math.ceil(wordCount / 3));

  // Timer that only runs when tab is visible
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const timer = setInterval(() => {
      if (isVisibleRef.current) {
        setTimeSpent(prev => prev + 1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Scroll tracking
  const handleScroll = useCallback(() => {
    const el = container;
    if (!el) return;

    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight - el.clientHeight;
    const percent = scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 100;
    setScrollPercent(percent);

    // Speed detection
    const now = Date.now();
    if (lastScrollRef.current) {
      const dt = (now - lastScrollRef.current.time) / 1000;
      if (dt > 0) {
        const speed = Math.abs(scrollTop - lastScrollRef.current.pos) / dt;
        scrollSpeedsRef.current.push(speed);
        if (scrollSpeedsRef.current.length > 10) scrollSpeedsRef.current.shift();

        const avgSpeed = scrollSpeedsRef.current.reduce((a, b) => a + b, 0) / scrollSpeedsRef.current.length;
        if (avgSpeed > 2000) {
          setIsSpeedScrolling(true);
        } else {
          setIsSpeedScrolling(false);
        }
      }
    }
    lastScrollRef.current = { pos: scrollTop, time: now };
  }, [container]);

  useEffect(() => {
    if (!container) return;
    container.addEventListener('scroll', handleScroll);
    // Initial check in case content is small
    setTimeout(handleScroll, 100);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll, container]);

  const isReadingComplete = isAdmin || (scrollPercent >= 90 && timeSpent >= minTime && !isSpeedScrolling);

  return { scrollPercent, timeSpent, minTime, isSpeedScrolling, isReadingComplete, containerRef: setContainer };
}

interface ReadingIndicatorProps {
  scrollPercent: number;
  timeSpent: number;
  minTime: number;
  isSpeedScrolling: boolean;
  isAdmin?: boolean;
}

export function ReadingIndicator({ scrollPercent, timeSpent, minTime, isSpeedScrolling, isAdmin = false }: ReadingIndicatorProps) {
  const timeRemaining = Math.max(0, minTime - timeSpent);
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="sticky top-0 z-10 bg-card border-b-4 border-foreground p-3 space-y-2">
      {isAdmin && (
        <div className="bg-neoViolet/20 border-2 border-neoViolet text-foreground p-2 text-xs font-display uppercase text-center">
          ⚡ Admin Mode — Timer Bypass Aktif
        </div>
      )}
      {isSpeedScrolling && !isAdmin && (
        <div className="bg-destructive/20 border-2 border-destructive text-destructive p-2 text-xs font-display uppercase text-center animate-pulse">
          ⚠️ Kamu scroll terlalu cepat. Baca pelan-pelan ya.
        </div>
      )}
      <div className="flex items-center gap-4 text-xs font-body">
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <span className="font-display uppercase text-[10px]">Scroll Progress</span>
            <span>{Math.round(scrollPercent)}%</span>
          </div>
          <div className="h-2 bg-muted border border-foreground">
            <div
              className="h-full bg-neoLime transition-all"
              style={{ width: `${Math.min(100, scrollPercent)}%` }}
            />
          </div>
        </div>
        <div className="text-center min-w-[80px]">
          <span className="font-display uppercase text-[10px] block">Waktu Baca</span>
          <span className={`font-bold ${timeRemaining > 0 ? 'text-neoPink' : 'text-neoLime'}`}>
            {timeRemaining > 0 ? `${minutes}:${String(seconds).padStart(2, '0')}` : '✓ Cukup'}
          </span>
        </div>
      </div>
    </div>
  );
}
