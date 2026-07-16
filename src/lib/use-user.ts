'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  is_admin: boolean;
  referral_code: string | null;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  bio: string | null;
  wallet_balance: number | null;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');

    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    }

    setLoading(false);
  }, []);

  const refreshUser = useCallback(async () => {
    const { data, error } = await api.get<{ user: User }>('/user');
    if (data?.user) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return { data, error };
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return { user, loading, logout, refreshUser };
}
