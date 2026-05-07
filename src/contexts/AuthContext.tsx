import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  module_progress: Record<string, boolean>;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: string | null, session?: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
  refreshIfStale: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcode API URL for now to allow development server tests, usually from env
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

  const getAuthHeaders = () => {
    const token = localStorage.getItem('mantra_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error(err);
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile();
  }, [user, fetchProfile]);

  const refreshIfStale = useCallback(async () => {
    // For custom backend, we can just fetch if we want.
    if (user) await fetchProfile();
  }, [user, fetchProfile]);

  // Load user from local storage on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('mantra_token');
      const storedUser = localStorage.getItem('mantra_user');
      
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        await fetchProfile();
      }
      setLoading(false);
    };

    initAuth();
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
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
    } catch (error: any) {
      return { error: error.message };
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
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('mantra_token');
    localStorage.removeItem('mantra_user');
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string) => {
    // TODO: Implement password reset logic in Express
    return { error: 'Not implemented in custom backend yet' };
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, signUp, signIn, signOut, resetPassword, refreshProfile, refreshIfStale }}>
      {children}
    </AuthContext.Provider>
  );
};
