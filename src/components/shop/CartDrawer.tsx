"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from './CartContext';
import { api } from '@/lib/api';

export function CartDrawer() {
  const { items, total, count, open, setOpen, refresh } = useCart();

  const updateQty = async (id: number, qty: number) => {
    if (qty < 1) return;
    await api.patch(`/shop/cart/${id}`, { quantity: qty });
    refresh();
  };

  const removeItem = async (id: number) => {
    await api.delete(`/shop/cart/${id}`);
    refresh();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[300]"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md z-[300] bg-brand-surface border-l border-brand-border flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-brand-gold" />
                <span className="font-sans text-sm font-medium text-brand-black">Cart ({count})</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-brand-gray hover:text-brand-black transition-colors">
                <X size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="font-sans text-sm text-brand-gray">Your cart is empty.</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {items.map((ci) => (
                    <div key={ci.id} className="flex gap-4 p-3 rounded-[8px] border border-brand-border bg-brand-white">
                      <div className="relative w-20 h-20 shrink-0 rounded-[6px] overflow-hidden">
                        {ci.item?.images?.[0] ? (
                          <Image src={ci.item.images[0]} alt={ci.item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-brand-border/30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm text-brand-black font-medium truncate">{ci.item?.name}</p>
                        {ci.item?.width && ci.item?.height && (
                          <p className="font-sans text-[10px] text-brand-gray tracking-wide mt-0.5">
                            {ci.item.width} x {ci.item.height} in
                          </p>
                        )}
                        {ci.item?.price !== null && (
                          <p className="font-sans text-xs text-brand-gold mt-1">
                            &#8358;{Number(ci.item?.price || 0).toLocaleString()}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(ci.id, ci.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded border border-brand-border text-brand-gray hover:text-brand-black transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-sans text-sm text-brand-black w-5 text-center">{ci.quantity}</span>
                          <button
                            onClick={() => updateQty(ci.id, ci.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded border border-brand-border text-brand-gray hover:text-brand-black transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(ci.id)}
                        className="text-brand-gray hover:text-red-400 transition-colors self-start mt-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-5 border-t border-brand-border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm text-brand-gray">Total</span>
                    <span className="font-sans text-lg text-brand-gold font-semibold">
                      &#8358;{total.toLocaleString()}
                    </span>
                  </div>
                  <button className="w-full py-3 bg-brand-black text-brand-white font-sans text-xs tracking-[0.15em] uppercase rounded-[6px] hover:bg-brand-black/90 transition-colors">
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
