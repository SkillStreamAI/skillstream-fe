'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'skillstream_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage after mount (localStorage unavailable during SSR)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      // corrupted storage — ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (u: User) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  // Mock login — any email/password succeeds
  const login = useCallback(async (email: string, _password: string) => {
    const mockUser: User = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0],
    };
    persist(mockUser);
  }, []);

  // Mock signup — same as login for now
  const signup = useCallback(
    async (email: string, _password: string, name?: string) => {
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        name: name ?? email.split('@')[0],
      };
      persist(mockUser);
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
