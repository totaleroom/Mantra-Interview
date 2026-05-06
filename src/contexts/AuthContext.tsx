import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { useInactivityLogout } from '@/hooks/useInactivityLogout';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  license_key: string | null;
  license_expires_at: string | null;
  module_progress: Record<string, boolean>;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isSubscriptionActive: boolean;
  isAdmin: boolean;
  daysRemaining: number;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
  refreshIfStale: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const lastFetchedAt = useRef<number>(0);
  const { toast } = useToast();

  const fetchProfile = useCallback(async (userId: string) => {
    const [profileRes, roleRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', userId).eq('role', 'admin').maybeSingle(),
    ]);
    if (profileRes.data) {
      setProfile({
        ...profileRes.data,
        module_progress: (profileRes.data.module_progress as Record<string, boolean>) ?? {},
      });
    }
    setIsAdmin(!!roleRes.data);
    lastFetchedAt.current = Date.now();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const refreshIfStale = useCallback(async () => {
    if (user && Date.now() - lastFetchedAt.current > STALE_THRESHOLD_MS) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let initialSessionHandled = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        if (initialSessionHandled) {
          // Only fetch on subsequent auth changes (login, token refresh)
          setTimeout(() => fetchProfile(session.user.id), 0);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      initialSessionHandled = true;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Periodic refresh every 5 minutes
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      fetchProfile(user.id);
    }, STALE_THRESHOLD_MS);
    return () => clearInterval(interval);
  }, [user, fetchProfile]);

  // Re-fetch on tab visibility change
  useEffect(() => {
    if (!user) return;
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastFetchedAt.current > STALE_THRESHOLD_MS) {
        fetchProfile(user.id);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [user, fetchProfile]);

  // Listen for session-expired event to show toast
  useEffect(() => {
    const handler = () => {
      toast({ title: 'Sesi berakhir', description: 'Kamu otomatis logout setelah 8 jam tidak aktif.' });
    };
    window.addEventListener('session-expired', handler);
    return () => window.removeEventListener('session-expired', handler);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone: phone || undefined },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) return { error: error.message };
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    localStorage.removeItem('denial_timer_deadline');
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setIsAdmin(false);
  };

  useInactivityLogout(signOut, !!user);

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const daysRemaining = profile?.license_expires_at
    ? Math.max(0, Math.ceil((new Date(profile.license_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const isSubscriptionActive = !!profile?.license_key && daysRemaining > 0;

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, isSubscriptionActive, isAdmin, daysRemaining, signUp, signIn, signOut, resetPassword, refreshProfile, refreshIfStale }}>
      {children}
    </AuthContext.Provider>
  );
};
