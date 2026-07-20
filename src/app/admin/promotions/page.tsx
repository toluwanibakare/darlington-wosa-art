"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket, Loader2, Plus, Edit2, Trash2, ChevronLeft, ChevronRight,
  Tag, Percent,
} from 'lucide-react';

interface Coupon {
  id: number;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  usage_limit: number;
  used_count: number;
  expires_at: string;
  status: 'active' | 'expired';
  created_at: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface CouponForm {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  usage_limit: number;
  expires_at: string;
  status: 'active' | 'expired';
}

const EMPTY_FORM: CouponForm = {
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: 0,
  usage_limit: 0,
  expires_at: '',
  status: 'active',
};

export default function PromotionsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationMeta>({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CouponForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

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

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await apiAdmin.get(`/coupons?page=${page}&per_page=15`);
      setCoupons(data.data || []);
      if (data.meta) setPagination(data.meta);
      else if (data.pagination) setPagination(data.pagination);
    } catch {
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [page]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      usage_limit: coupon.usage_limit,
      expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 10) : '',
      status: coupon.status,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await apiAdmin.put(`/coupons/${editingId}`, form);
      } else {
        await apiAdmin.post('/coupons', form);
      }
      setModalOpen(false);
      fetchCoupons();
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await apiAdmin.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch {
      // silent
    }
  };

  const formatDiscount = (c: Coupon) => {
    if (c.discount_type === 'percentage') return `${c.discount_value}%`;
    return `\u20A6${c.discount_value.toLocaleString()}`;
  };

  return (
    <div className="p-4 md:p-8 max-w-[1800px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-brand-black">Promotions & Coupons</h1>
            <p className="font-sans text-sm text-brand-gray mt-1">Create and manage discount coupons</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-3 bg-brand-black text-brand-white rounded-[8px] font-sans text-[11px] tracking-[0.1em] uppercase hover:bg-brand-gold transition-all duration-300 cursor-pointer"
          >
            <Plus size={14} />
            Add Coupon
          </button>
        </div>

        {/* Table */}
        <div className="border border-brand-border rounded-[8px] overflow-hidden bg-brand-white/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border bg-brand-surface">
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Code</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Description</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Discount</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Usage</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Expires</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Status</th>
                  <th className="text-right font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <Loader2 size={20} className="animate-spin mx-auto text-brand-gold" />
                    </td>
                  </tr>
                ) : coupons.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <Ticket size={32} className="mx-auto text-brand-gray/20 mb-3" />
                      <p className="font-sans text-sm text-brand-gray">No coupons yet</p>
                      <button
                        onClick={openCreate}
                        className="mt-4 px-5 py-2.5 bg-brand-black text-brand-white rounded-[6px] font-sans text-[11px] tracking-[0.1em] uppercase hover:bg-brand-gold transition-all duration-300 cursor-pointer"
                      >
                        Create First Coupon
                      </button>
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon, i) => (
                    <motion.tr
                      key={coupon.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                      className="border-b border-brand-border/50 last:border-b-0 hover:bg-brand-surface/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-brand-gold bg-brand-gold/5 px-3 py-1 rounded-[4px] border border-brand-gold/20">
                          <Tag size={11} />
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-sans text-xs text-brand-gray max-w-[200px] block truncate">{coupon.description || '--'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 font-sans text-xs text-brand-black">
                          {coupon.discount_type === 'percentage' ? <Percent size={11} /> : null}
                          {formatDiscount(coupon)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-sans text-xs text-brand-gray">
                          {coupon.used_count} / {coupon.usage_limit || 'Unlimited'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-sans text-xs text-brand-gray">
                          {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-sans text-[10px] tracking-[0.05em] uppercase ${
                          coupon.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {coupon.status === 'active' ? 'Active' : 'Expired'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(coupon)}
                            className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-all cursor-pointer"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-brand-border bg-brand-surface/50">
              <p className="font-sans text-[11px] text-brand-gray/60">
                Page {pagination.current_page} of {pagination.last_page} ({pagination.total} total)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setPage(Math.min(pagination.last_page, page + 1))}
                  disabled={page === pagination.last_page}
                  className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-brand-surface border border-brand-border rounded-[8px] p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg text-brand-black">
                {editingId ? 'Edit Coupon' : 'Add Coupon'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-gold transition-all cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Code</label>
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                  placeholder="SUMMER25"
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                  placeholder="25% off summer classes"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Discount Type</label>
                  <select
                    value={form.discount_type}
                    onChange={(e) => setForm({ ...form, discount_type: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-sans"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed (NGN)</option>
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Discount Value</label>
                  <input
                    type="number"
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                    className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                    placeholder="25"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Usage Limit</label>
                  <input
                    type="number"
                    value={form.usage_limit}
                    onChange={(e) => setForm({ ...form, usage_limit: Number(e.target.value) })}
                    className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                    placeholder="100"
                    min="0"
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'expired' })}
                    className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-sans"
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Expires At</label>
                <input
                  type="date"
                  value={form.expires_at}
                  onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                  className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-sans"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-5 py-3 border border-brand-border rounded-[6px] font-sans text-[11px] tracking-[0.1em] uppercase text-brand-gray hover:text-brand-black hover:border-brand-black transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-5 py-3 bg-brand-black text-brand-white rounded-[6px] font-sans text-[11px] tracking-[0.1em] uppercase hover:bg-brand-gold transition-all duration-300 cursor-pointer disabled:opacity-60"
                >
                  {saving ? <Loader2 size={14} className="animate-spin mx-auto" /> : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
