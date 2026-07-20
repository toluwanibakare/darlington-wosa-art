"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { CartItem } from './ShopTypes';

interface CartContextType {
  items: CartItem[];
  total: number;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  refresh: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [], total: 0, count: 0, open: false, setOpen: () => {}, refresh: () => {},
});

export function useCart() {
  return useContext(CartContext);
}

function getSessionId() {
  if (typeof window === 'undefined') return '';
  let sid = localStorage.getItem('session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('session_id', sid);
  }
  return sid;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(0);

  const refresh = useCallback(() => setKey((k) => k + 1), []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (!token) {
      headers['X-Session-Id'] = getSessionId();
    }
    api.get<{ items: CartItem[]; total: number }>('/shop/cart').then((res) => {
      if (res.data) {
        setItems(res.data.items);
        setTotal(res.data.total);
      }
    });
  }, [key]);

  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, count, open, setOpen, refresh }}>
      {children}
    </CartContext.Provider>
  );
}
