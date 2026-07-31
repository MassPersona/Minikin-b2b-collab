/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';

// Demo credentials — will be removed once backend auth is live
const DEMO_EMAIL = 'demo@masspersona.com';
const DEMO_PASSWORD = 'Password123!';
const DEMO_USER: User = {
  id: 'user-001',
  name: 'Demo User',
  email: DEMO_EMAIL,
  organization: 'MassPersona',
};

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if we have a stored session
  useEffect(() => {
    const stored = localStorage.getItem('minikin_auth_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    // Demo login until backend auth is ready
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setUser(DEMO_USER);
      localStorage.setItem('minikin_auth_user', JSON.stringify(DEMO_USER));
      localStorage.setItem('minikin_auth_token', 'demo-token');
    } else {
      throw new Error('Invalid email or password.');
    }
  }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    localStorage.removeItem('minikin_auth_user');
    localStorage.removeItem('minikin_auth_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
