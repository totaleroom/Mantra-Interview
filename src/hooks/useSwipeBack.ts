import { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseSwipeBackOptions {
  edgeThreshold?: number;   // px from left edge to start
  swipeThreshold?: number;  // % of screen width to trigger nav
  enabled?: boolean;
}

export function useSwipeBack(options: UseSwipeBackOptions = {}) {
  const { edgeThreshold = 30, swipeThreshold = 0.3, enabled = true } = options;
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const isTracking = useRef(false);
  const directionLocked = useRef<'horizontal' | 'vertical' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    const touch = e.touches[0];
    if (touch.clientX > edgeThreshold) return;

    // Skip if Safari non-standalone (has native swipe-back)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isStandalone = (navigator as any).standalone === true;
    if (isSafari && !isStandalone) return;

    startX.current = touch.clientX;
    startY.current = touch.clientY;
    isTracking.current = true;
    directionLocked.current = null;
  }, [enabled, edgeThreshold]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isTracking.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX.current;
    const deltaY = touch.clientY - startY.current;

    // Lock direction on first significant move
    if (!directionLocked.current) {
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        directionLocked.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
      }
      if (directionLocked.current !== 'horizontal') {
        isTracking.current = false;
        return;
      }
    }

    if (deltaX < 0) {
      setProgress(0);
      return;
    }

    e.preventDefault();
    const p = Math.min(deltaX / window.innerWidth, 1);
    setProgress(p);
    if (!isSwiping) setIsSwiping(true);
  }, [isSwiping]);

  const handleTouchEnd = useCallback(() => {
    if (!isTracking.current && !isSwiping) return;
    isTracking.current = false;

    if (progress > swipeThreshold) {
      setProgress(1);
      setTimeout(() => {
        navigate(-1);
      }, 200);
    } else {
      setProgress(0);
    }
    setTimeout(() => setIsSwiping(false), 300);
  }, [progress, swipeThreshold, navigate, isSwiping]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled]);

  return { containerRef, progress, isSwiping };
}
