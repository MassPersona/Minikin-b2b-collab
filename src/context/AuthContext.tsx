/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, AuthSession } from '../types';
import { storageService } from '../services/storageService';

// ---------------------------------------------------------------------------
// IMPORTANT: Authentication is currently hardcoded for development purposes.
// Replace the `login` function body with a real API call before going to
// production. Never store credentials or passwords in localStorage.
// ---------------------------------------------------------------------------

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const session = storageService.getAuth();
    return session?.user ?? null;
  });

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    // TODO (pre-launch): Replace with real API call, e.g.:
    //   const session = await authApi.login(email, password);
    if (
      email.trim().toLowerCase() === DEMO_EMAIL &&
      password === DEMO_PASSWORD
    ) {
      const session: AuthSession = { user: DEMO_USER };
      storageService.setAuth(session);
      setUser(DEMO_USER);
    } else {
      throw new Error('Invalid email or password. Please try again.');
    }
  }, []);

  const logout = useCallback(() => {
    storageService.clearAuth();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
