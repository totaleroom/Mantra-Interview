import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ children }) => {
  const { user, loading, isSubscriptionActive, isAdmin, refreshIfStale } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (loading) return;

      if (!user) {
        navigate('/');
        return;
      }

      // Force refresh if stale before deciding
      await refreshIfStale();
      setChecking(false);
    };
    check();
  }, [user, loading, refreshIfStale, navigate]);

  useEffect(() => {
    if (!loading && !checking && user && !isSubscriptionActive && !isAdmin) {
      toast({
        title: 'Langganan expired',
        description: 'Perpanjang langganan untuk mengakses fitur ini.',
        variant: 'destructive',
      });
      navigate('/dashboard');
    }
  }, [loading, checking, user, isSubscriptionActive, isAdmin, navigate, toast]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-display text-xl uppercase animate-pulse">Memverifikasi akses...</div>
      </div>
    );
  }

  if (!user || (!isSubscriptionActive && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
