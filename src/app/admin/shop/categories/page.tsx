"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Layers, Plus, X, Loader2, Trash2, Check,
} from 'lucide-react';

interface ShopCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
  sort_order: number;
  items_count: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

function api() {
  const token = localStorage.getItem('auth_token');
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' };
  return {
    get: async (url: string) => { const r = await fetch(`${API_BASE}/admin${url}`, { headers }); return r.json(); },
    post: async (url: string, body: unknown) => { const r = await fetch(`${API_BASE}/admin${url}`, { method: 'POST', headers, body: JSON.stringify(body) }); return r.json(); },
    put: async (url: string, body: unknown) => { const r = await fetch(`${API_BASE}/admin${url}`, { method: 'PUT', headers, body: JSON.stringify(body) }); return r.json(); },
    delete: async (url: string) => { await fetch(`${API_BASE}/admin${url}`, { method: 'DELETE', headers }); },
  };
}

const defaultForm = { name: '', description: '', is_active: true, sort_order: 0 };

export default function AdminShopCategories() {
  const [cats, setCats] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ShopCategory | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const a = api();

  const fetch = useCallback(async () => {
    setLoading(true);
    const json = await a.get('/shop/categories');
    setCats(json?.data || json || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openAdd = () => { setEditing(null); setForm(defaultForm); setModalOpen(true); };
  const openEdit = (c: ShopCategory) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description || '', is_active: c.is_active, sort_order: c.sort_order });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await a.put(`/shop/categories/${editing.id}`, form);
      } else {
        await a.post('/shop/categories', form);
      }
      fetch();
      setModalOpen(false);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    await a.delete(`/shop/categories/${id}`);
    setCats((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
  };

  return (
    <div className="px-4 md:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
              <Layers size={18} className="text-brand-gold" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-brand-black">Shop Categories</h1>
              <p className="font-sans text-xs text-brand-gray">{cats.length} categories</p>
            </div>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase hover:shadow-[0_0_20px_rgba(158,101,27,0.15)] transition-all cursor-pointer">
            <Plus size={14} /> Add Category
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-gold" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cats.map((c) => (
              <motion.div key={c.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 border border-brand-border rounded-[8px] bg-brand-white/40 hover:border-brand-gold/30 transition-all duration-500 group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-sans text-sm font-medium text-brand-black">{c.name}</p>
                    <p className="font-sans text-[10px] text-brand-gray/50">{c.slug}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-[4px] text-brand-gray/50 hover:text-brand-gold hover:bg-brand-gold/10 transition-all cursor-pointer">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id} className="p-1.5 rounded-[4px] text-brand-gray/50 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-40">
                      {deleting === c.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
                {c.description && <p className="font-sans text-xs text-brand-gray/70 mb-3 line-clamp-2">{c.description}</p>}
                <div className="flex items-center justify-between pt-3 border-t border-brand-border/50">
                  <span className="font-sans text-[11px] text-brand-gray/60">{c.items_count || 0} items</span>
                  <span className={`px-2 py-0.5 rounded-full font-sans text-[9px] uppercase ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-brand-border text-brand-gray'}`}>{c.is_active ? 'Active' : 'Inactive'}</span>
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
              <h2 className="font-display text-lg text-brand-black">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-full hover:bg-brand-border/50 transition-colors cursor-pointer"><X size={16} className="text-brand-gray" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-sans" placeholder="Category name" />
              </div>
              <div>
                <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-sans resize-none" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 rounded border-brand-border text-brand-gold focus:ring-brand-gold" />
                <span className="font-sans text-sm text-brand-black">Active</span>
              </label>
              <div className="flex justify-end gap-3 pt-2 border-t border-brand-border">
                <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 border border-brand-border rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray hover:text-brand-black transition-all cursor-pointer">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.name} className="flex items-center gap-2 px-5 py-2.5 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase hover:shadow-[0_0_20px_rgba(158,101,27,0.15)] transition-all cursor-pointer disabled:opacity-40">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
