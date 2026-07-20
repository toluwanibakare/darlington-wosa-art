"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Send } from 'lucide-react';
import { ShopItem } from './ShopTypes';
import { api } from '@/lib/api';

export function NegotiationModal({ item, open, onClose }: { item: ShopItem; open: boolean; onClose: () => void }) {
  const [price, setPrice] = useState(item.price ? String(item.price) : '');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price || Number(price) <= 0) return;
    setStatus('loading');
    const { data, error } = await api.post<{ message: string }>('/shop/negotiate', {
      shop_item_id: item.id,
      offered_price: Number(price),
      message,
    });
    if (data) {
      setStatus('success');
      setResult(data.message || 'Offer submitted!');
    } else {
      setStatus('error');
      setResult(error || 'Something went wrong.');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-brand-surface rounded-[12px] p-8 border border-brand-border z-10"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-brand-gray hover:text-brand-black transition-colors">
              <X size={18} />
            </button>

            <h3 className="font-display text-2xl text-brand-black mb-1">Make an Offer</h3>
            <p className="font-sans text-sm text-brand-gray mb-6">{item.name}</p>

            {status === 'success' ? (
              <p className="font-sans text-brand-gold">{result}</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-sans text-xs tracking-[0.15em] uppercase text-brand-gray mb-2">
                    Your Offer (&#8358;)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min={1}
                    required
                    className="w-full bg-transparent border-b border-brand-border py-2 text-brand-black font-sans text-lg focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs tracking-[0.15em] uppercase text-brand-gray mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Any comments about your offer..."
                    className="w-full bg-transparent border border-brand-border rounded-[6px] p-3 text-brand-black font-sans text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none"
                  />
                </div>
                {status === 'error' && <p className="font-sans text-sm text-red-400">{result}</p>}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold text-brand-black font-sans text-xs tracking-[0.15em] uppercase font-semibold rounded-[6px] hover:bg-brand-gold-light transition-colors disabled:opacity-40"
                >
                  {status === 'loading' && <Loader2 size={14} className="animate-spin" />}
                  <Send size={14} />
                  Submit Offer
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
