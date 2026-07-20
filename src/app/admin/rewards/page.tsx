"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Gift, Plus, X, Loader2, Trash2, Check, User,
} from 'lucide-react';

interface RewardEntry {
  id: number;
  user_id: number;
  points: number;
  type: string;
  description: string | null;
  created_at: string;
  user: { id: number; name: string; email: string } | null;
}

interface UserOption {
  id: number;
  name: string;
  email: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.darlingtonwosa.art';

function api() {
  const token = localStorage.getItem('auth_token');
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
  const jsonHeaders = { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' };
  return {
    get: async (url: string) => { const r = await fetch(`${API_BASE}/admin${url}`, { headers }); return r.json(); },
    post: async (url: string, body: unknown) => { const r = await fetch(`${API_BASE}/admin${url}`, { method: 'POST', headers: jsonHeaders, body: JSON.stringify(body) }); return r.json(); },
    delete: async (url: string) => { await fetch(`${API_BASE}/admin${url}`, { method: 'DELETE', headers }); },
  };
}

const defaultForm = {
  user_id: '' as string,
  points: 10,
  type: 'earned',
  description: '',
};

export default function AdminRewards() {
  const [entries, setEntries] = useState<RewardEntry[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const a = api();

  const fetch = useCallback(async () => {
    setLoading(true);
    const json = await a.get('/rewards');
    const data = json?.data || [];
    setEntries(data);
    setLoading(false);
  }, []);

  const fetchUsers = useCallback(async () => {
    const json = await a.get('/users');
    setUsers(json?.data || []);
  }, []);

  useEffect(() => { fetch(); fetchUsers(); }, [fetch, fetchUsers]);

  const handleSave = async () => {
    if (!form.user_id) return;
    setSaving(true);
    try {
      await a.post('/rewards', {
        user_id: Number(form.user_id),
        points: form.points,
        type: form.type,
        description: form.description || undefined,
      });
      fetch();
      setModalOpen(false);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    await a.delete(`/rewards/${id}`);
    setEntries((prev) => prev.filter((r) => r.id !== id));
    setDeleting(null);
  };

  const typeColors: Record<string, string> = {
    earned: 'bg-green-100 text-green-700',
    redeemed: 'bg-blue-100 text-blue-700',
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
              <h1 className="font-display text-2xl text-brand-black">Rewards Ledger</h1>
              <p className="font-sans text-xs text-brand-gray">{entries.length} entries</p>
            </div>
          </div>
          <button onClick={() => { setForm(defaultForm); setModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase hover:shadow-[0_0_20px_rgba(158,101,27,0.15)] transition-all cursor-pointer">
            <Plus size={14} /> Add Entry
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-gold" /></div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center py-20 border border-brand-border rounded-[8px]">
            <Gift size={40} className="text-brand-gray/30 mb-4" />
            <p className="font-sans text-sm text-brand-gray">No reward entries yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-brand-border rounded-[8px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border bg-brand-white/50">
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">User</th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Points</th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Type</th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Description</th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Date</th>
                  <th className="text-right px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((r) => (
                  <tr key={r.id} className="border-b border-brand-border/50 hover:bg-brand-white/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-brand-gray/50" />
                        <span className="font-sans text-sm text-brand-black">{r.user?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-sans text-sm font-medium text-brand-black">{r.points}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-full font-sans text-[9px] uppercase ${typeColors[r.type] || 'bg-brand-border text-brand-gray'}`}>{r.type}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-sans text-xs text-brand-gray">{r.description || '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-sans text-[11px] text-brand-gray">{new Date(r.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button onClick={() => handleDelete(r.id)} disabled={deleting === r.id} className="p-1.5 rounded-[4px] text-brand-gray/50 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-40">
                        {deleting === r.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg bg-brand-surface border border-brand-border rounded-[8px] shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <h2 className="font-display text-lg text-brand-black">Add Reward Entry</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-full hover:bg-brand-border/50 transition-colors cursor-pointer"><X size={16} className="text-brand-gray" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">User</label>
                <select value={form.user_id} onChange={(e) => setForm((f) => ({ ...f, user_id: e.target.value }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans">
                  <option value="">Select user...</option>
                  {users.map((u) => (<option key={u.id} value={u.id}>{u.name} ({u.email})</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Points</label>
                  <input type="number" value={form.points} onChange={(e) => setForm((f) => ({ ...f, points: Number(e.target.value) }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans" />
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Type</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans">
                    <option value="earned">Earned</option>
                    <option value="redeemed">Redeemed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Description</label>
                <input type="text" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans" placeholder="e.g. Referral bonus" />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-brand-border">
                <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 border border-brand-border rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray hover:text-brand-black transition-all cursor-pointer">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.user_id || form.points < 1} className="flex items-center gap-2 px-5 py-2.5 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase hover:shadow-[0_0_20px_rgba(158,101,27,0.15)] transition-all cursor-pointer disabled:opacity-40">
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
