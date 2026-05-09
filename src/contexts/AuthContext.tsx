import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  role?: string;
  license_key?: string;
  license_expires_at?: string;
  module_progress: Record<string, boolean>;
  // Server-computed fields
  subscription_active?: boolean;
  days_remaining?: number;
  server_time?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isSubscriptionActive: boolean;
  daysRemaining: number;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: string | null, session?: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
  refreshIfStale: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Use a ref to prevent race conditions during initialization
  const initCompleteRef = useRef(false);
  const fetchingRef = useRef(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('mantra_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchProfile = useCallback(async () => {
    // Guard against concurrent fetches (race condition fix)
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      const res = await fetch(`${API_URL}/profile`, { headers: getAuthHeaders() });
      if (res.ok) {
        const profileData: Profile = await res.json();
        if (profileData) {
          setProfile(profileData);
          setIsAdmin(profileData.role === 'admin');
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error(err);
      setProfile(null);
      setIsAdmin(false);
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile();
  }, [user, fetchProfile]);

  const refreshIfStale = useCallback(async () => {
    if (user) await fetchProfile();
  }, [user, fetchProfile]);

  // Derive subscription status from server-computed values (not client clock)
  const isSubscriptionActive = isAdmin || (profile?.subscription_active === true);
  const daysRemaining = profile?.days_remaining ?? 0;

  // Initialize auth on mount — single execution, no race condition
  useEffect(() => {
    if (initCompleteRef.current) return;
    initCompleteRef.current = true;

    const initAuth = async () => {
      const token = localStorage.getItem('mantra_token');
      const storedUser = localStorage.getItem('mantra_user');
      
      if (token && storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          // fetchProfile will use the token from localStorage directly
          await fetchProfile();
        } catch {
          // Corrupted localStorage — clean up
          localStorage.removeItem('mantra_token');
          localStorage.removeItem('mantra_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, fullName: string, _phone?: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('mantra_token', data.token);
      localStorage.setItem('mantra_user', JSON.stringify(data.user));
      
      setUser(data.user);
      await fetchProfile();
      
      return { error: null, session: data.token };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Terjadi kesalahan' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('mantra_token', data.token);
      localStorage.setItem('mantra_user', JSON.stringify(data.user));
      
      setUser(data.user);
      await fetchProfile();
      
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Terjadi kesalahan' };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('mantra_token');
    localStorage.removeItem('mantra_user');
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  };

  const resetPassword = async (_email: string) => {
    // TODO: Implement password reset logic in Express
    return { error: 'Not implemented in custom backend yet' };
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, isSubscriptionActive, daysRemaining, signUp, signIn, signOut, resetPassword, refreshProfile, refreshIfStale }}>
      {children}
    </AuthContext.Provider>
  );
};
