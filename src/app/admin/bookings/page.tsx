"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Loader2, Search, X, Edit2, Trash2, ChevronLeft, ChevronRight,
  CheckCircle, Clock, AlertCircle, XCircle,
} from 'lucide-react';

interface BookingUser {
  name: string;
  email: string;
}

interface BookingClass {
  title: string;
  instructor: string;
}

interface Booking {
  id: number;
  booking_number: string;
  user: BookingUser;
  class: BookingClass;
  status: string;
  attendees: number;
  notes: string;
  created_at: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const STATUSES = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  Completed: 'bg-green-50 text-green-700 border-green-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  Pending: <Clock size={12} />,
  Confirmed: <CheckCircle size={12} />,
  Completed: <CheckCircle size={12} />,
  Cancelled: <XCircle size={12} />,
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<PaginationMeta>({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
  const [page, setPage] = useState(1);

  const [editModal, setEditModal] = useState<Booking | null>(null);
  const [editStatus, setEditStatus] = useState('');
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

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: '15' });
      if (activeTab !== 'All') params.append('status', activeTab.toLowerCase());
      if (search) params.append('search', search);
      const data = await apiAdmin.get(`/bookings?${params}`);
      setBookings(data.data || []);
      if (data.meta) setPagination(data.meta);
      else if (data.pagination) setPagination(data.pagination);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, activeTab]);

  const handleSearch = () => {
    setPage(1);
    fetchBookings();
  };

  const handleUpdateStatus = async () => {
    if (!editModal) return;
    setSaving(true);
    try {
      await apiAdmin.put(`/bookings/${editModal.id}`, { status: editStatus });
      setEditModal(null);
      fetchBookings();
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await apiAdmin.delete(`/bookings/${id}`);
      fetchBookings();
    } catch {
      // silent
    }
  };

  const filtered = activeTab === 'All' ? bookings : bookings.filter((b) => b.status === activeTab);

  return (
    <div className="p-4 md:p-8 max-w-[1800px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-brand-black">Bookings</h1>
            <p className="font-sans text-sm text-brand-gray mt-1">Manage class bookings and reservations</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-brand-border pb-4">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setActiveTab(s); setPage(1); }}
              className={`px-4 py-2 rounded-[8px] font-sans text-[11px] tracking-[0.1em] uppercase transition-all duration-300 cursor-pointer ${
                activeTab === s
                  ? 'bg-brand-black text-brand-white'
                  : 'text-brand-gray/60 hover:text-brand-gold hover:bg-brand-border/30'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search bookings..."
              className="w-full pl-9 pr-4 py-2.5 bg-transparent border border-brand-border rounded-[8px] text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 bg-brand-black text-brand-white rounded-[8px] font-sans text-[11px] tracking-[0.1em] uppercase hover:bg-brand-gold transition-colors duration-300 cursor-pointer"
          >
            Search
          </button>
        </div>

        {/* Table */}
        <div className="border border-brand-border rounded-[8px] overflow-hidden bg-brand-white/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border bg-brand-surface">
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Booking #</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Customer</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Class</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Instructor</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Attendees</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Status</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Date</th>
                  <th className="text-right font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <Loader2 size={20} className="animate-spin mx-auto text-brand-gold" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <Calendar size={32} className="mx-auto text-brand-gray/20 mb-3" />
                      <p className="font-sans text-sm text-brand-gray">No bookings found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((booking, i) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                      className="border-b border-brand-border/50 last:border-b-0 hover:bg-brand-surface/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="font-sans text-xs text-brand-black font-medium">{booking.booking_number}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-sans text-xs text-brand-black">{booking.user?.name || 'N/A'}</p>
                        <p className="font-sans text-[10px] text-brand-gray/60 mt-0.5">{booking.user?.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-sans text-xs text-brand-black">{booking.class?.title || 'N/A'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-sans text-xs text-brand-gray">{booking.class?.instructor || 'N/A'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-sans text-xs text-brand-black">{booking.attendees}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-sans text-[10px] tracking-[0.05em] uppercase ${STATUS_STYLES[booking.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                          {STATUS_ICONS[booking.status]}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-sans text-xs text-brand-gray">{new Date(booking.created_at).toLocaleDateString()}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setEditModal(booking); setEditStatus(booking.status); }}
                            className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-all cursor-pointer"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(booking.id)}
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

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-brand-surface border border-brand-border rounded-[8px] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg text-brand-black">Edit Booking</h2>
              <button onClick={() => setEditModal(null)} className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-gold transition-all cursor-pointer">
                <X size={14} />
              </button>
            </div>
            <div className="space-y-4">
              <p className="font-sans text-xs text-brand-gray">Booking: <span className="text-brand-black font-medium">{editModal.booking_number}</span></p>
              <p className="font-sans text-xs text-brand-gray">Customer: <span className="text-brand-black">{editModal.user?.name}</span></p>
              <div>
                <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-sans"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={() => setEditModal(null)}
                className="flex-1 px-5 py-3 border border-brand-border rounded-[6px] font-sans text-[11px] tracking-[0.1em] uppercase text-brand-gray hover:text-brand-black hover:border-brand-black transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={saving}
                className="flex-1 px-5 py-3 bg-brand-black text-brand-white rounded-[6px] font-sans text-[11px] tracking-[0.1em] uppercase hover:bg-brand-gold transition-all duration-300 cursor-pointer disabled:opacity-60"
              >
                {saving ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Update'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
