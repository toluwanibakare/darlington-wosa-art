"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Gift, Plus, X, Loader2, Trash2, Check,
} from 'lucide-react';

interface Reward {
  id: number;
  name: string;
  description: string | null;
  points_required: number;
  reward_type: string;
  reward_value: string | null;
  is_active: boolean;
  quantity: number | null;
  expires_at: string | null;
  created_at: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

function api() {
  const token = localStorage.getItem('auth_token');
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' };
  return {
    get: async (url: string) => { const r = await fetch(`${API_BASE}/admin${url}`, { headers }); return r.json(); },
    post: async (url: string, body: unknown) => { const r = await fetch(`${API_BASE}/admin${url}`, { method: 'POST', headers, body: JSON.stringify(body) }); return r.json(); },
    delete: async (url: string) => { await fetch(`${API_BASE}/admin${url}`, { method: 'DELETE', headers }); },
  };
}

const defaultForm = {
  name: '',
  description: '',
  points_required: 100,
  reward_type: 'discount',
  reward_value: '',
  is_active: true,
  quantity: null as number | null,
  expires_at: '',
};

export default function AdminRewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const a = api();

  const fetch = useCallback(async () => {
    setLoading(true);
    const json = await a.get('/rewards');
    setRewards(json?.data || json || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        ...form,
        quantity: form.quantity || null,
        expires_at: form.expires_at || null,
      };
      await a.post('/rewards', body);
      fetch();
      setModalOpen(false);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    await a.delete(`/rewards/${id}`);
    setRewards((prev) => prev.filter((r) => r.id !== id));
    setDeleting(null);
  };

  const typeColors: Record<string, string> = {
    discount: 'bg-blue-100 text-blue-700',
    free_shipping: 'bg-purple-100 text-purple-700',
    item: 'bg-emerald-100 text-emerald-700',
    voucher: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="px-4 md:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
              <Gift size={18} className="text-brand-gold" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-brand-black">Rewards</h1>
              <p className="font-sans text-xs text-brand-gray">{rewards.length} rewards</p>
            </div>
          </div>
          <button onClick={() => { setForm(defaultForm); setModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase hover:shadow-[0_0_20px_rgba(158,101,27,0.15)] transition-all cursor-pointer">
            <Plus size={14} /> Add Reward
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-gold" /></div>
        ) : rewards.length === 0 ? (
          <div className="flex flex-col items-center py-20 border border-brand-border rounded-[8px]">
            <Gift size={40} className="text-brand-gray/30 mb-4" />
            <p className="font-sans text-sm text-brand-gray">No rewards created yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rewards.map((r) => (
              <motion.div key={r.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 border border-brand-border rounded-[8px] bg-brand-white/40 relative group">
                <button onClick={() => handleDelete(r.id)} disabled={deleting === r.id} className="absolute top-3 right-3 p-1.5 rounded-[4px] text-brand-gray/50 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-40 opacity-0 group-hover:opacity-100">
                  {deleting === r.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
                <div className="flex items-center justify-between mb-3 pr-8">
                  <div>
                    <p className="font-sans text-sm font-medium text-brand-black">{r.name}</p>
                    <span className={`mt-1 inline-block px-2 py-0.5 rounded-full font-sans text-[9px] uppercase ${typeColors[r.reward_type] || 'bg-brand-border text-brand-gray'}`}>{r.reward_type.replace('_', ' ')}</span>
                  </div>
                </div>
                {r.description && <p className="font-sans text-xs text-brand-gray/70 mb-3 line-clamp-2">{r.description}</p>}
                <div className="flex items-center justify-between pt-3 border-t border-brand-border/50">
                  <span className="font-sans text-[11px] text-brand-gold font-medium">{r.points_required} pts</span>
                  <span className={`px-2 py-0.5 rounded-full font-sans text-[9px] uppercase ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-brand-border text-brand-gray'}`}>{r.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg bg-brand-surface border border-brand-border rounded-[8px] shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <h2 className="font-display text-lg text-brand-black">Add Reward</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-full hover:bg-brand-border/50 transition-colors cursor-pointer"><X size={16} className="text-brand-gray" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans" placeholder="e.g. 10% Discount" />
              </div>
              <div>
                <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Points Required</label>
                  <input type="number" value={form.points_required} onChange={(e) => setForm((f) => ({ ...f, points_required: Number(e.target.value) }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans" />
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Type</label>
                  <select value={form.reward_type} onChange={(e) => setForm((f) => ({ ...f, reward_type: e.target.value }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans">
                    <option value="discount">Discount</option>
                    <option value="free_shipping">Free Shipping</option>
                    <option value="item">Free Item</option>
                    <option value="voucher">Voucher</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Value (e.g. 10)</label>
                  <input type="text" value={form.reward_value} onChange={(e) => setForm((f) => ({ ...f, reward_value: e.target.value }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans" />
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Quantity (unlimited if empty)</label>
                  <input type="number" value={form.quantity || ''} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value ? Number(e.target.value) : null }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans" />
                </div>
              </div>
              <div>
                <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Expires At (optional)</label>
                <input type="date" value={form.expires_at} onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 rounded border-brand-border text-brand-gold focus:ring-brand-gold" />
                <span className="font-sans text-sm text-brand-black">Active</span>
              </label>
              <div className="flex justify-end gap-3 pt-2 border-t border-brand-border">
                <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 border border-brand-border rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray hover:text-brand-black transition-all cursor-pointer">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.name} className="flex items-center gap-2 px-5 py-2.5 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase hover:shadow-[0_0_20px_rgba(158,101,27,0.15)] transition-all cursor-pointer disabled:opacity-40">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Create
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
