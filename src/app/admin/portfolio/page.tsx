"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit3, Trash2, X, Loader2, Search,
  ChevronLeft, ChevronRight, AlertCircle, CheckCircle,
} from 'lucide-react';

interface PortfolioItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  client: string;
  year: number;
  medium: string;
  is_featured: boolean;
  created_at: string;
}

interface PaginatedResponse {
  data: PortfolioItem[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

const CATEGORIES = ['All', 'Charcoal Portraits', 'Pencil Drawings', 'Mixed Media', 'Corporate', 'Creative Events'];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.darlingtonwosa.art';

const apiAdmin = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/admin${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
    return res.json();
  },
  post: async (endpoint: string, body: unknown) => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/admin${endpoint}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  },
  put: async (endpoint: string, body: unknown) => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/admin${endpoint}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  },
  delete: async (endpoint: string) => {
    const token = localStorage.getItem('auth_token');
    await fetch(`${API_BASE}/admin${endpoint}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
  },
};

const emptyItem: Partial<PortfolioItem> = {
  title: '', category: 'Charcoal Portraits', description: '', image: '', client: '', year: new Date().getFullYear(), medium: '', is_featured: false,
};

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState<Partial<PortfolioItem>>(emptyItem);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [detailItem, setDetailItem] = useState<PortfolioItem | null>(null);

  useEffect(() => { fetchItems(); }, [page, activeCategory]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const catParam = activeCategory === 'All' ? '' : `&category=${encodeURIComponent(activeCategory)}`;
      const res = await apiAdmin.get(`/portfolio?page=${page}${catParam}`);
      const data: PaginatedResponse = res;
      setItems(data.data || []);
      setPage(data.current_page || 1);
      setLastPage(data.last_page || 1);
      setTotal(data.total || 0);
    } catch {
      showToast('Failed to load portfolio', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyItem);
    setModalOpen(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setEditing(item);
    setForm({ ...item });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await apiAdmin.put(`/portfolio/${editing.id}`, form);
        showToast('Portfolio item updated successfully', 'success');
      } else {
        await apiAdmin.post('/portfolio', form);
        showToast('Portfolio item created successfully', 'success');
      }
      setModalOpen(false);
      fetchItems();
    } catch {
      showToast('Failed to save portfolio item', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;
    try {
      await apiAdmin.delete(`/portfolio/${id}`);
      showToast('Portfolio item deleted successfully', 'success');
      if (detailItem?.id === id) setDetailItem(null);
      fetchItems();
    } catch {
      showToast('Failed to delete portfolio item', 'error');
    }
  };

  const filtered = items.filter(
    (item) => item.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6 md:p-8">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-[8px] border text-sm font-sans ${
            toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl text-brand-black">Portfolio</h1>
            <p className="font-sans text-sm text-brand-gray mt-1">{total} total items</p>
          </div>
          <button
            onClick={openCreate}
            className="relative overflow-hidden group px-6 py-3 bg-brand-black text-brand-white border border-brand-gold rounded-[8px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] cursor-pointer"
          >
            <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
            <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
              <Plus size={14} /> Add Item
            </span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative max-w-xs flex-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="w-full bg-brand-white/50 border border-brand-border rounded-[8px] py-3 pl-10 pr-4 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={`whitespace-nowrap px-4 py-2 rounded-[6px] border font-sans text-[10px] tracking-[0.15em] uppercase transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-brand-black text-brand-white border-brand-black'
                    : 'border-brand-border text-brand-gray/70 hover:text-brand-gold hover:border-brand-gold/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-brand-gold" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-brand-border rounded-[8px]">
            <p className="font-sans text-sm text-brand-gray/60">No portfolio items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setDetailItem(item)}
                className="group cursor-pointer border border-brand-border rounded-[8px] overflow-hidden bg-brand-white/50 hover:shadow-[0_0_25px_rgba(158,101,27,0.08)] transition-all duration-500"
              >
                <div className="relative aspect-[4/3] bg-brand-surface overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-brand-gray/30 font-sans text-xs">No image</div>
                  )}
                  {item.is_featured && (
                    <span className="absolute top-3 left-3 bg-brand-gold/90 text-brand-black px-2.5 py-1 rounded-full text-[8px] tracking-[0.15em] uppercase font-sans font-medium">Featured</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gold mb-1.5">{item.category}</p>
                  <h3 className="font-display text-base text-brand-black truncate">{item.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-sans text-[11px] text-brand-gray/60">{item.year}</span>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                        className="w-7 h-7 rounded-[4px] border border-brand-border flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-all cursor-pointer"
                      >
                        <Edit3 size={11} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        className="w-7 h-7 rounded-[4px] border border-brand-border flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all cursor-pointer"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {lastPage > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-border">
            <p className="font-sans text-xs text-brand-gray/60">Page {page} of {lastPage}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-[8px] border border-brand-border flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-[8px] border font-sans text-xs transition-all cursor-pointer ${
                    p === page ? 'bg-brand-black text-brand-white border-brand-black' : 'border-brand-border hover:border-brand-gold hover:text-brand-gold'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(lastPage, page + 1))}
                disabled={page === lastPage}
                className="w-9 h-9 rounded-[8px] border border-brand-border flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/30 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
            >
              <div className="w-full max-w-xl bg-brand-surface border border-brand-border rounded-[8px] shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-8 py-5 border-b border-brand-border">
                  <h2 className="font-display text-xl text-brand-black">{editing ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</h2>
                  <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-all cursor-pointer">
                    <X size={14} />
                  </button>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Title</label>
                    <input
                      type="text"
                      value={form.title || ''}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors"
                      placeholder="Portfolio item title"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Category</label>
                    <select
                      value={form.category || 'Charcoal Portraits'}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors"
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Description</label>
                    <textarea
                      value={form.description || ''}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={4}
                      className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors resize-none"
                      placeholder="Item description"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Image URL</label>
                    <input
                      type="text"
                      value={form.image || ''}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Client</label>
                      <input
                        type="text"
                        value={form.client || ''}
                        onChange={(e) => setForm({ ...form, client: e.target.value })}
                        className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors"
                        placeholder="Client name"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Year</label>
                      <input
                        type="number"
                        value={form.year || ''}
                        onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                        className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Medium</label>
                      <input
                        type="text"
                        value={form.medium || ''}
                        onChange={(e) => setForm({ ...form, medium: e.target.value })}
                        className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors"
                        placeholder="e.g. Charcoal, Pencil"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={form.is_featured || false}
                      onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                      className="w-4 h-4 rounded border-brand-border accent-brand-gold"
                    />
                    <label htmlFor="is_featured" className="font-sans text-sm text-brand-black cursor-pointer">Featured</label>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-brand-border">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-6 py-3 border border-brand-border rounded-[6px] font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray hover:text-brand-black transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="relative overflow-hidden group px-6 py-3 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] cursor-pointer disabled:opacity-60"
                  >
                    <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
                    <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
                      {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                      {editing ? 'Update Item' : 'Create Item'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {detailItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailItem(null)}
              className="fixed inset-0 bg-black/30 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
            >
              <div className="w-full max-w-2xl bg-brand-surface border border-brand-border rounded-[8px] shadow-2xl overflow-hidden">
                <div className="relative aspect-[16/9] bg-brand-surface">
                  {detailItem.image && (
                    <img src={detailItem.image} alt={detailItem.title} className="w-full h-full object-cover" />
                  )}
                  <button
                    onClick={() => setDetailItem(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-black/60 text-brand-white flex items-center justify-center hover:bg-brand-black transition-all cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                  {detailItem.is_featured && (
                    <span className="absolute top-4 left-4 bg-brand-gold text-brand-black px-3 py-1.5 rounded-full text-[10px] tracking-[0.15em] uppercase font-sans font-medium">Featured</span>
                  )}
                </div>
                <div className="p-8">
                  <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gold mb-2">{detailItem.category}</p>
                  <h2 className="font-display text-2xl text-brand-black mb-4">{detailItem.title}</h2>
                  <p className="font-sans text-sm text-brand-gray leading-relaxed mb-6">{detailItem.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-center py-5 border-t border-b border-brand-border">
                    {detailItem.client && (
                      <div>
                        <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 mb-1">Client</p>
                        <p className="font-sans text-sm text-brand-black">{detailItem.client}</p>
                      </div>
                    )}
                    {detailItem.year && (
                      <div>
                        <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 mb-1">Year</p>
                        <p className="font-sans text-sm text-brand-black">{detailItem.year}</p>
                      </div>
                    )}
                    {detailItem.medium && (
                      <div>
                        <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 mb-1">Medium</p>
                        <p className="font-sans text-sm text-brand-black">{detailItem.medium}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-end gap-3 mt-6">
                    <button
                      onClick={() => { setEditing(detailItem); setForm({ ...detailItem }); setDetailItem(null); setModalOpen(true); }}
                      className="relative overflow-hidden group px-5 py-2.5 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] cursor-pointer"
                    >
                      <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
                      <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
                        <Edit3 size={12} /> Edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(detailItem.id)}
                      className="px-5 py-2.5 border border-red-300 text-red-600 rounded-[6px] font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2"><Trash2 size={12} /> Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
