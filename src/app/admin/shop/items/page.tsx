"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Plus, X, Loader2, Trash2, ChevronLeft, ChevronRight,
  Check, Search, Image as ImageIcon,
} from 'lucide-react';

interface ShopItem {
  id: number;
  category_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  width: number | null;
  height: number | null;
  is_negotiable: boolean;
  images: string[];
  is_active: boolean;
  is_sold: boolean;
  sort_order: number;
  category: { id: number; name: string } | null;
  created_at: string;
}

interface ShopCategory {
  id: number;
  name: string;
}

interface PaginatedResponse {
  data: ShopItem[];
  current_page: number;
  last_page: number;
  total: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.darlingtonwosa.art';

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

const defaultForm = {
  category_id: null as number | null,
  name: '',
  description: '',
  price: '' as string,
  width: '' as string,
  height: '' as string,
  is_negotiable: false,
  is_active: true,
  is_sold: false,
  sort_order: 0,
};

export default function AdminShopItems() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ShopItem | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const a = api();

  const fetch = useCallback(async () => {
    setLoading(true);
    const json: PaginatedResponse = await a.get(`/shop/items?page=${page}`);
    setItems(json.data);
    setLastPage(json.last_page);
    setTotal(json.total);
    setLoading(false);
  }, [page]);

  const fetchCats = useCallback(async () => {
    const json = await a.get('/shop/categories');
    setCategories(json?.data || json || []);
  }, []);

  useEffect(() => { fetch(); fetchCats(); }, [fetch, fetchCats]);

  const openAdd = () => { setEditing(null); setForm(defaultForm); setModalOpen(true); };
  const openEdit = (item: ShopItem) => {
    setEditing(item);
    setForm({
      category_id: item.category_id,
      name: item.name,
      description: item.description || '',
      price: item.price?.toString() || '',
      width: item.width?.toString() || '',
      height: item.height?.toString() || '',
      is_negotiable: item.is_negotiable,
      is_active: item.is_active,
      is_sold: item.is_sold,
      sort_order: item.sort_order,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        ...form,
        price: form.price ? Number(form.price) : null,
        width: form.width ? Number(form.width) : null,
        height: form.height ? Number(form.height) : null,
        category_id: form.category_id || null,
      };
      if (editing) {
        const json: { item: ShopItem } = await a.put(`/shop/items/${editing.id}`, body);
        setItems((prev) => prev.map((i) => (i.id === editing.id ? json.item : i)));
      } else {
        const json: { item: ShopItem } = await a.post('/shop/items', body);
        setItems((prev) => [json.item, ...prev]);
        setTotal((t) => t + 1);
      }
      setModalOpen(false);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    await a.delete(`/shop/items/${id}`);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setTotal((t) => t - 1);
    setDeleting(null);
  };

  return (
    <div className="px-4 md:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
              <Package size={18} className="text-brand-gold" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-brand-black">Shop Items</h1>
              <p className="font-sans text-xs text-brand-gray">{total} items</p>
            </div>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase hover:shadow-[0_0_20px_rgba(158,101,27,0.15)] transition-all cursor-pointer">
            <Plus size={14} /> Add Item
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-gold" /></div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center py-20 border border-brand-border rounded-[8px]">
            <Package size={40} className="text-brand-gray/30 mb-4" />
            <p className="font-sans text-sm text-brand-gray">No shop items yet</p>
            <button onClick={openAdd} className="mt-4 px-5 py-2.5 bg-brand-black text-brand-white rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase cursor-pointer"><Plus size={14} /> Add Your First</button>
          </div>
        ) : (
          <div className="overflow-x-auto border border-brand-border rounded-[8px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border bg-brand-white/50">
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Name</th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Category</th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Price</th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Dimensions</th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Status</th>
                  <th className="text-right px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-brand-border/50 hover:bg-brand-white/30 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-sans text-sm text-brand-black">{item.name}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-sans text-xs text-brand-gray">{item.category?.name || '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-sans text-sm text-brand-black">
                        {item.price ? `₦${Number(item.price).toLocaleString()}` : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-sans text-xs text-brand-gray">
                        {item.width && item.height ? `${item.width} x ${item.height} in` : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {item.is_sold && <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-sans text-[9px] uppercase">Sold</span>}
                        <span className={`px-2 py-0.5 rounded-full font-sans text-[9px] uppercase ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-brand-border text-brand-gray'}`}>{item.is_active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-[4px] text-brand-gray/50 hover:text-brand-gold hover:bg-brand-gold/10 transition-all cursor-pointer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="p-1.5 rounded-[4px] text-brand-gray/50 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-40">
                        {deleting === item.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {lastPage > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="font-sans text-xs text-brand-gray">Page {page} of {lastPage}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-[6px] border border-brand-border text-brand-gray hover:text-brand-gold disabled:opacity-30 cursor-pointer"><ChevronLeft size={16} /></button>
              <button onClick={() => setPage((p) => Math.min(lastPage, p + 1))} disabled={page === lastPage} className="p-2 rounded-[6px] border border-brand-border text-brand-gray hover:text-brand-gold disabled:opacity-30 cursor-pointer"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </motion.div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl bg-brand-surface border border-brand-border rounded-[8px] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border sticky top-0 bg-brand-surface z-10">
              <h2 className="font-display text-lg text-brand-black">{editing ? 'Edit Item' : 'Add Item'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-full hover:bg-brand-border/50 transition-colors cursor-pointer"><X size={16} className="text-brand-gray" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-sans" placeholder="Item name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Category</label>
                  <select value={form.category_id || ''} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value ? Number(e.target.value) : null }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-sans">
                    <option value="">None</option>
                    {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Price (₦)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-sans" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Width (inches)</label>
                  <input type="number" step="0.01" value={form.width} onChange={(e) => setForm((f) => ({ ...f, width: e.target.value }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-sans" placeholder="e.g. 24" />
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Height (inches)</label>
                  <input type="number" step="0.01" value={form.height} onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-sans" placeholder="e.g. 36" />
                </div>
              </div>
              <div>
                <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-sans resize-none" placeholder="Item description" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 rounded border-brand-border text-brand-gold focus:ring-brand-gold" />
                  <span className="font-sans text-sm text-brand-black">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_sold} onChange={(e) => setForm((f) => ({ ...f, is_sold: e.target.checked }))} className="w-4 h-4 rounded border-brand-border text-brand-gold focus:ring-brand-gold" />
                  <span className="font-sans text-sm text-brand-black">Sold</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_negotiable} onChange={(e) => setForm((f) => ({ ...f, is_negotiable: e.target.checked }))} className="w-4 h-4 rounded border-brand-border text-brand-gold focus:ring-brand-gold" />
                  <span className="font-sans text-sm text-brand-black">Negotiable</span>
                </label>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-brand-border">
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
