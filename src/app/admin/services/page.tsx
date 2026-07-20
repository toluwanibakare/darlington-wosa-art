"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit3, Trash2, X, Loader2, Search,
  ChevronLeft, ChevronRight, AlertCircle, CheckCircle,
} from 'lucide-react';

interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image: string;
  is_active: boolean;
  created_at: string;
}

interface PaginatedResponse {
  data: Service[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

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

const emptyService: Partial<Service> = {
  title: '', description: '', price: 0, category: '', image: '', is_active: true,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<Partial<Service>>(emptyService);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => { fetchServices(); }, [page]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await apiAdmin.get(`/services?page=${page}`);
      const data: PaginatedResponse = res;
      setServices(data.data || []);
      setPage(data.current_page || 1);
      setLastPage(data.last_page || 1);
      setTotal(data.total || 0);
    } catch {
      showToast('Failed to load services', 'error');
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
    setForm(emptyService);
    setModalOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setForm({ ...service });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await apiAdmin.put(`/services/${editing.id}`, form);
        showToast('Service updated successfully', 'success');
      } else {
        await apiAdmin.post('/services', form);
        showToast('Service created successfully', 'success');
      }
      setModalOpen(false);
      fetchServices();
    } catch {
      showToast('Failed to save service', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await apiAdmin.delete(`/services/${id}`);
      showToast('Service deleted successfully', 'success');
      fetchServices();
    } catch {
      showToast('Failed to delete service', 'error');
    }
  };

  const filtered = services.filter(
    (s) => s.title.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()),
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
            <h1 className="font-display text-3xl text-brand-black">Services</h1>
            <p className="font-sans text-sm text-brand-gray mt-1">{total} total services</p>
          </div>
          <button
            onClick={openCreate}
            className="relative overflow-hidden group px-6 py-3 bg-brand-black text-brand-white border border-brand-gold rounded-[8px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] cursor-pointer"
          >
            <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
            <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
              <Plus size={14} /> Add Service
            </span>
          </button>
        </div>

        <div className="relative mb-6 max-w-xs">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full bg-brand-white/50 border border-brand-border rounded-[8px] py-3 pl-10 pr-4 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-brand-gold" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-brand-border rounded-[8px]">
            <p className="font-sans text-sm text-brand-gray/60">No services found</p>
          </div>
        ) : (
          <div className="border border-brand-border rounded-[8px] overflow-hidden bg-brand-white/50">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border bg-brand-surface/50">
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 px-5 py-4">Title</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 px-5 py-4">Category</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 px-5 py-4">Price</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 px-5 py-4">Status</th>
                  <th className="text-right font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((service, i) => (
                  <motion.tr
                    key={service.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-brand-border/50 last:border-b-0 hover:bg-brand-black/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-sans text-sm text-brand-black">{service.title}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-sans text-xs text-brand-gray">{service.category}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-sans text-sm text-brand-black font-medium">&#8358;{Number(service.price).toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] tracking-[0.1em] uppercase font-sans ${
                        service.is_active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${service.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                        {service.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(service)}
                          className="w-8 h-8 rounded-[6px] border border-brand-border flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-all cursor-pointer"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="w-8 h-8 rounded-[6px] border border-brand-border flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {lastPage > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-brand-border">
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
                  <h2 className="font-display text-xl text-brand-black">{editing ? 'Edit Service' : 'Add Service'}</h2>
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
                      placeholder="Service title"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Description</label>
                    <textarea
                      value={form.description || ''}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={4}
                      className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors resize-none"
                      placeholder="Service description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Price (&#8358;)</label>
                      <input
                        type="number"
                        value={form.price || 0}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Category</label>
                      <input
                        type="text"
                        value={form.category || ''}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors"
                        placeholder="e.g. Framing, Restoration"
                      />
                    </div>
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
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={form.is_active || false}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="w-4 h-4 rounded border-brand-border accent-brand-gold"
                    />
                    <label htmlFor="is_active" className="font-sans text-sm text-brand-black cursor-pointer">Active</label>
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
                      {editing ? 'Update Service' : 'Create Service'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
