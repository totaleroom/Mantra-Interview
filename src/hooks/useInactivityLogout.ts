import { useEffect, useRef } from 'react';

const EVENTS = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'] as const;

export function useInactivityLogout(
  signOut: () => void,
  isLoggedIn: boolean,
  durationMs = 8 * 60 * 60 * 1000 // 8 jam default
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const signOutRef = useRef(signOut);
  signOutRef.current = signOut;

  useEffect(() => {
    if (!isLoggedIn) return;

    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        signOutRef.current();
        window.dispatchEvent(new CustomEvent('session-expired'));
      }, durationMs);
    };

    reset();
    EVENTS.forEach(event => window.addEventListener(event, reset, { passive: true }));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      EVENTS.forEach(event => window.removeEventListener(event, reset));
    };
  }, [isLoggedIn, durationMs]);
}
