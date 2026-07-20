"use client";

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from './CartContext';

export function CartFloatingButton() {
  const { count, setOpen } = useCart();

  if (count === 0) return null;

  return (
    <button
      onClick={() => setOpen(true)}
      className="md:hidden fixed left-1/2 -translate-x-1/2 bottom-8 z-[250] flex items-center gap-3 px-6 py-3 rounded-full bg-brand-gold text-brand-black shadow-[0_8px_30px_rgba(158,101,27,0.3)] hover:shadow-[0_8px_40px_rgba(158,101,27,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
    >
      <ShoppingCart size={18} />
      <span className="font-sans text-xs tracking-[0.15em] uppercase font-semibold">
        Cart ({count})
      </span>
    </button>
  );
}
