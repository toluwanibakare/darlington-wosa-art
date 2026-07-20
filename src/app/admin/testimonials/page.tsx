"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Star, Plus, X, Loader2, Trash2, ChevronLeft, ChevronRight, Quote,
  Check, AlertCircle, ThumbsUp, ThumbsDown, MessageSquare,
} from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  is_featured: boolean;
  is_active: boolean;
  status: string;
  admin_reply: string | null;
  created_at: string;
}

interface PaginatedResponse {
  data: Testimonial[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

interface FormData {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  is_featured: boolean;
  is_active: boolean;
  status: string;
  admin_reply: string;
}

const api = {
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.darlingtonwosa.art';

const defaultForm: FormData = {
  name: '', role: '', content: '', rating: 5, image: '', is_featured: false, is_active: true,
  status: 'pending', admin_reply: '',
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    const qs = statusFilter ? `?status=${statusFilter}` : '';
    const json: PaginatedResponse = await api.get(`/testimonials${qs ? qs + '&' : '?'}page=${page}`);
    setTestimonials(json.data);
    setLastPage(json.last_page);
    setTotal(json.total);
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const openAdd = () => {
    setEditing(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      name: t.name,
      role: t.role,
      content: t.content,
      rating: t.rating,
      image: t.image || '',
      is_featured: t.is_featured,
      is_active: t.is_active,
      status: t.status,
      admin_reply: t.admin_reply || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        const json: { data: Testimonial } = await api.put(`/testimonials/${editing.id}`, form);
        setTestimonials((prev) =>
          prev.map((t) => (t.id === editing.id ? json.data : t))
        );
      } else {
        const json: { data: Testimonial } = await api.post('/testimonials', form);
        setTestimonials((prev) => [json.data, ...prev]);
        setTotal((t) => t + 1);
      }
      setModalOpen(false);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    await api.delete(`/testimonials/${id}`);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    setTotal((t) => t - 1);
    setDeleting(null);
  };

  const handleApprove = async (id: number) => {
    const json: { data: Testimonial } = await api.post(`/testimonials/${id}/approve`, {});
    setTestimonials((prev) => prev.map((t) => (t.id === id ? json.data : t)));
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Rejection reason (optional):');
    const json: { data: Testimonial } = await api.post(`/testimonials/${id}/reject`, { reason: reason || '' });
    setTestimonials((prev) => prev.map((t) => (t.id === id ? json.data : t)));
  };

  const handleReply = async (id: number) => {
    if (!replyText.trim()) return;
    const json: { data: Testimonial } = await api.put(`/testimonials/${id}`, { admin_reply: replyText.trim() });
    setTestimonials((prev) => prev.map((t) => (t.id === id ? json.data : t)));
    setReplyingId(null);
    setReplyText('');
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < rating ? 'text-brand-gold fill-brand-gold' : 'text-brand-border'}
        />
      ))}
    </div>
  );

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="px-4 md:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
              <Star size={18} className="text-brand-gold" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-brand-black">Testimonials</h1>
              <p className="font-sans text-xs text-brand-gray">{total} testimonials</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold font-sans"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase hover:shadow-[0_0_20px_rgba(158,101,27,0.15)] transition-all cursor-pointer"
            >
              <Plus size={14} />
              Add Testimonial
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-brand-gold" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-brand-border rounded-[8px]">
            <Quote size={40} className="text-brand-gray/30 mb-4" />
            <p className="font-sans text-sm text-brand-gray">No testimonials yet</p>
            <button
              onClick={openAdd}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-brand-black text-brand-white rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase cursor-pointer"
            >
              <Plus size={14} />
              Add Your First
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group p-6 border border-brand-border rounded-[8px] bg-brand-white/40 hover:border-brand-gold/30 hover:shadow-[0_0_20px_rgba(158,101,27,0.06)] transition-all duration-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center overflow-hidden">
                      {t.image ? (
                        <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-sans text-sm font-medium text-brand-gold">
                          {t.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-sans text-sm font-medium text-brand-black">{t.name}</p>
                      <p className="font-sans text-[11px] text-brand-gray">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(t)}
                      className="p-1.5 rounded-[4px] text-brand-gray/50 hover:text-brand-gold hover:bg-brand-gold/10 transition-all cursor-pointer"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={deleting === t.id}
                      className="p-1.5 rounded-[4px] text-brand-gray/50 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-40"
                    >
                      {deleting === t.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {renderStars(t.rating)}
                  <span className={`ml-auto px-2 py-0.5 rounded-full font-sans text-[9px] uppercase ${statusColor[t.status] || 'bg-brand-border text-brand-gray'}`}>
                    {t.status}
                  </span>
                </div>

                <p className="font-sans text-sm text-brand-gray leading-relaxed line-clamp-4 mb-4">
                  {t.content}
                </p>

                {t.admin_reply && (
                  <div className="mb-4 p-3 bg-brand-gold/5 border border-brand-border rounded-[6px]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MessageSquare size={11} className="text-brand-gold" />
                      <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-brand-gold">Admin Reply</span>
                    </div>
                    <p className="font-sans text-xs text-brand-gray">{t.admin_reply}</p>
                  </div>
                )}

                {t.status === 'pending' && (
                  <div className="flex items-center gap-2 pt-3 border-t border-brand-border/50">
                    <button
                      onClick={() => handleApprove(t.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-green-100 text-green-700 hover:bg-green-200 font-sans text-[10px] uppercase tracking-[0.1em] transition-all cursor-pointer"
                    >
                      <ThumbsUp size={11} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(t.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-red-100 text-red-700 hover:bg-red-200 font-sans text-[10px] uppercase tracking-[0.1em] transition-all cursor-pointer"
                    >
                      <ThumbsDown size={11} /> Reject
                    </button>
                    <button
                      onClick={() => { setReplyingId(t.id); setReplyText(t.admin_reply || ''); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 font-sans text-[10px] uppercase tracking-[0.1em] transition-all cursor-pointer ml-auto"
                    >
                      <MessageSquare size={11} /> Reply
                    </button>
                  </div>
                )}

                {replyingId === t.id && (
                  <div className="mt-3 space-y-2 pt-3 border-t border-brand-border/50">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                      className="w-full bg-transparent border border-brand-border rounded-[6px] px-3 py-2 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans resize-none"
                      placeholder="Write your reply..."
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => { setReplyingId(null); setReplyText(''); }}
                        className="px-3 py-1.5 rounded-[4px] border border-brand-border font-sans text-[10px] uppercase tracking-[0.1em] text-brand-gray hover:text-brand-black transition-all cursor-pointer"
                      >Cancel</button>
                      <button
                        onClick={() => handleReply(t.id)}
                        className="px-3 py-1.5 rounded-[4px] bg-brand-gold text-brand-white font-sans text-[10px] uppercase tracking-[0.1em] hover:shadow-[0_0_15px_rgba(158,101,27,0.2)] transition-all cursor-pointer"
                      >Send</button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-brand-border/50">
                  <div className="flex items-center gap-2">
                    {t.is_featured && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold font-sans text-[9px] tracking-[0.1em] uppercase">
                        <Check size={10} />
                        Featured
                      </span>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-sans text-[9px] tracking-[0.1em] uppercase ${
                    t.is_active ? 'bg-green-100 text-green-700' : 'bg-brand-border text-brand-gray'
                  }`}>
                    {t.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {lastPage > 1 && (
          <div className="flex items-center justify-between mt-8">
            <p className="font-sans text-xs text-brand-gray">Page {page} of {lastPage}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-[6px] border border-brand-border text-brand-gray hover:text-brand-gold hover:border-brand-gold/50 transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page === lastPage}
                className="p-2 rounded-[6px] border border-brand-border text-brand-gray hover:text-brand-gold hover:border-brand-gold/50 transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl bg-brand-surface border border-brand-border rounded-[8px] shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border sticky top-0 bg-brand-surface z-10">
              <h2 className="font-display text-lg text-brand-black">
                {editing ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-brand-border/50 transition-colors cursor-pointer"
              >
                <X size={16} className="text-brand-gray" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                    placeholder="Client name"
                  />
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Role</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                    placeholder="e.g. Client, Collector"
                  />
                </div>
              </div>

              <div>
                <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={4}
                  className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans resize-none"
                  placeholder="Testimonial content"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Rating (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={form.rating}
                    onChange={(e) => setForm((f) => ({ ...f, rating: Math.min(5, Math.max(1, Number(e.target.value))) }))}
                    className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                  />
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Image URL</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Admin Reply</label>
                  <input
                    type="text"
                    value={form.admin_reply}
                    onChange={(e) => setForm((f) => ({ ...f, admin_reply: e.target.value }))}
                    className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                    placeholder="Reply to testimonial"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                    className="w-4 h-4 rounded border-brand-border text-brand-gold focus:ring-brand-gold"
                  />
                  <span className="font-sans text-sm text-brand-black">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded border-brand-border text-brand-gold focus:ring-brand-gold"
                  />
                  <span className="font-sans text-sm text-brand-black">Active</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-brand-border">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-brand-border rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray hover:text-brand-black transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.name || !form.content}
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase hover:shadow-[0_0_20px_rgba(158,101,27,0.15)] transition-all cursor-pointer disabled:opacity-40"
                >
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
