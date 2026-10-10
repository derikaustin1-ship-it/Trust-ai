import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, role?: string) => Promise<void>;
  demoLogin: (role: 'user' | 'reviewer' | 'admin') => Promise<void>;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('trustiq_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('trustiq_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      api.getMe()
        .then((u) => {
          setUser(u);
          localStorage.setItem('trustiq_user', JSON.stringify(u));
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem('trustiq_token', res.access_token);
    localStorage.setItem('trustiq_user', JSON.stringify(res.user));
  };

  const register = async (email: string, password: string, displayName: string, role = 'user') => {
    const res = await api.register(email, password, displayName, role);
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem('trustiq_token', res.access_token);
    localStorage.setItem('trustiq_user', JSON.stringify(res.user));
  };


  const demoLogin = async (role: 'user' | 'reviewer' | 'admin') => {
    const emails = {
      user: 'user@trustiq.ai',
      reviewer: 'reviewer@trustiq.ai',
      admin: 'admin@trustiq.ai'
    };
    await login(emails[role], 'password123');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('trustiq_token');
    localStorage.removeItem('trustiq_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
