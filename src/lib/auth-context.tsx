import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import { syncFromSupabase, getCurrentUser } from './supabase-storage';
import { loadProgress } from './storage';
import type { SavedProgress } from '@/src/types';
import type { User } from '@supabase/supabase-js';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  supabaseReady: boolean;
  progress: SavedProgress;
  refreshProgress: () => Promise<SavedProgress>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  supabaseReady: false,
  progress: loadProgress(),
  refreshProgress: async () => loadProgress(),
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<SavedProgress>(loadProgress());
  const supabaseReady = isSupabaseConfigured();

  const refreshProgress = useCallback(async (): Promise<SavedProgress> => {
    const data = supabaseReady && user ? await syncFromSupabase() : loadProgress();
    setProgress(data);
    return data;
  }, [supabaseReady, user]);

  useEffect(() => {
    if (!supabaseReady || !supabase) {
      setLoading(false);
      return;
    }

    // Check current session
    getCurrentUser().then(u => {
      setUser(u ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabaseReady]);

  // Sync from Supabase when user logs in
  useEffect(() => {
    if (user) {
      syncFromSupabase().then(setProgress);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, supabaseReady, progress, refreshProgress }}>
      {children}
    </AuthContext.Provider>
  );
}
