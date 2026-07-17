"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit3, Trash2, X, Loader2, Search,
  ChevronLeft, ChevronRight, AlertCircle, CheckCircle, Users, Clock,
} from 'lucide-react';

interface ClassItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration: string;
  max_students: number;
  level: string;
  image: string;
  instructor: string;
  schedule: string;
  is_active: boolean;
  bookings_count: number;
  created_at: string;
}

interface PaginatedResponse {
  data: ClassItem[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const apiAdmin = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
    return res.json();
  },
  post: async (endpoint: string, body: unknown) => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  },
  put: async (endpoint: string, body: unknown) => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  },
  delete: async (endpoint: string) => {
    const token = localStorage.getItem('auth_token');
    await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
  },
};

const emptyClass: Partial<ClassItem> = {
  title: '', description: '', price: 0, duration: '', max_students: 20, level: 'Beginner', image: '', instructor: '', schedule: '', is_active: true,
};

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ClassItem | null>(null);
  const [form, setForm] = useState<Partial<ClassItem>>(emptyClass);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => { fetchClasses(); }, [page]);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await apiAdmin.get(`/classes?page=${page}`);
      const data: PaginatedResponse = res;
      setClasses(data.data || []);
      setPage(data.current_page || 1);
      setLastPage(data.last_page || 1);
      setTotal(data.total || 0);
    } catch {
      showToast('Failed to load classes', 'error');
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
    setForm(emptyClass);
    setModalOpen(true);
  };

  const openEdit = (cls: ClassItem) => {
    setEditing(cls);
    setForm({ ...cls });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await apiAdmin.put(`/classes/${editing.id}`, form);
        showToast('Class updated successfully', 'success');
      } else {
        await apiAdmin.post('/classes', form);
        showToast('Class created successfully', 'success');
      }
      setModalOpen(false);
      fetchClasses();
    } catch {
      showToast('Failed to save class', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    try {
      await apiAdmin.delete(`/classes/${id}`);
      showToast('Class deleted successfully', 'success');
      fetchClasses();
    } catch {
      showToast('Failed to delete class', 'error');
    }
  };

  const filtered = classes.filter(
    (c) => c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase()),
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
            <h1 className="font-display text-3xl text-brand-black">Classes</h1>
            <p className="font-sans text-sm text-brand-gray mt-1">{total} total classes</p>
          </div>
          <button
            onClick={openCreate}
            className="relative overflow-hidden group px-6 py-3 bg-brand-black text-brand-white border border-brand-gold rounded-[8px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] cursor-pointer"
          >
            <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
            <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
              <Plus size={14} /> Add Class
            </span>
          </button>
        </div>

        <div className="relative mb-6 max-w-xs">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classes..."
            className="w-full bg-brand-white/50 border border-brand-border rounded-[8px] py-3 pl-10 pr-4 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-brand-gold" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-brand-border rounded-[8px]">
            <p className="font-sans text-sm text-brand-gray/60">No classes found</p>
          </div>
        ) : (
          <div className="border border-brand-border rounded-[8px] overflow-hidden bg-brand-white/50">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border bg-brand-surface/50">
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 px-5 py-4">Title</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 px-5 py-4">Price</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 px-5 py-4">Duration</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 px-5 py-4">Level</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 px-5 py-4">Students</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 px-5 py-4">Instructor</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 px-5 py-4">Active</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 px-5 py-4">Bookings</th>
                  <th className="text-right font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cls, i) => (
                  <motion.tr
                    key={cls.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-brand-border/50 last:border-b-0 hover:bg-brand-black/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-sans text-sm text-brand-black">{cls.title}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-sans text-sm text-brand-black font-medium">&#8358;{Number(cls.price).toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 font-sans text-xs text-brand-gray">
                        <Clock size={12} /> {cls.duration}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] tracking-[0.1em] uppercase font-sans border ${
                        cls.level === 'Beginner' ? 'border-green-200 text-green-700 bg-green-50' :
                        cls.level === 'Intermediate' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                        cls.level === 'Advanced' ? 'border-purple-200 text-purple-700 bg-purple-50' :
                        'border-amber-200 text-amber-700 bg-amber-50'
                      }`}>
                        {cls.level}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 font-sans text-xs text-brand-gray">
                        <Users size={12} /> {cls.max_students}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-sans text-xs text-brand-gray">{cls.instructor}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] tracking-[0.1em] uppercase font-sans border ${
                        cls.is_active ? 'border-green-200 text-green-700 bg-green-50' : 'border-red-200 text-red-700 bg-red-50'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cls.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                        {cls.is_active ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-sans text-xs text-brand-gray font-medium">{cls.bookings_count || 0}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(cls)}
                          className="w-8 h-8 rounded-[6px] border border-brand-border flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-all cursor-pointer"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(cls.id)}
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
                  <h2 className="font-display text-xl text-brand-black">{editing ? 'Edit Class' : 'Add Class'}</h2>
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
                      placeholder="Class title"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Description</label>
                    <textarea
                      value={form.description || ''}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={4}
                      className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors resize-none"
                      placeholder="Class description"
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
                      <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Duration</label>
                      <input
                        type="text"
                        value={form.duration || ''}
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors"
                        placeholder="e.g. 8 weeks, 3 months"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Max Students</label>
                      <input
                        type="number"
                        value={form.max_students || 20}
                        onChange={(e) => setForm({ ...form, max_students: Number(e.target.value) })}
                        className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Level</label>
                      <select
                        value={form.level || 'Beginner'}
                        onChange={(e) => setForm({ ...form, level: e.target.value })}
                        className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors"
                      >
                        {LEVELS.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Instructor</label>
                      <input
                        type="text"
                        value={form.instructor || ''}
                        onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                        className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors"
                        placeholder="Instructor name"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Schedule</label>
                      <input
                        type="text"
                        value={form.schedule || ''}
                        onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                        className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors"
                        placeholder="e.g. Sat 10am-12pm"
                      />
                    </div>
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
                      {editing ? 'Update Class' : 'Create Class'}
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
