import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../api/auth';
import { setUnauthorizedHandler, TOKEN_KEY } from '../api/client';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
  }, [clearSession]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(TOKEN_KEY);
        if (stored) {
          setToken(stored);
          const res = await authApi.me();
          setUser(res.data.data);
        }
      } catch {
        await clearSession();
      } finally {
        setIsLoading(false);
      }
    })();
  }, [clearSession]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const { token: t, user: u } = res.data.data;
    await SecureStore.setItemAsync(TOKEN_KEY, t);
    setToken(t);
    setUser(u);
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await authApi.signup(name, email, password);
    const { token: t, user: u } = res.data.data;
    await SecureStore.setItemAsync(TOKEN_KEY, t);
    setToken(t);
    setUser(u);
  };

  const logout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    await clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
