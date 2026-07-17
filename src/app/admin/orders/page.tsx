"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Loader2, ChevronLeft, ChevronRight, ShoppingBag, Eye, X, Check,
} from 'lucide-react';

interface OrderUser {
  name: string;
  email: string;
}

interface OrderService {
  title: string;
}

interface Order {
  id: number;
  order_number: string;
  user: OrderUser;
  service: OrderService;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
}

interface PaginatedOrders {
  data: Order[];
  current_page: number;
  last_page: number;
  prev_page_url: string | null;
  next_page_url: string | null;
  total: number;
}

const STATUSES = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Production', value: 'in_production' },
  { label: 'Quality Check', value: 'quality_check' },
  { label: 'Design Review', value: 'design_review' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  in_production: 'bg-blue-50 text-blue-700 border-blue-200',
  quality_check: 'bg-purple-50 text-purple-700 border-purple-200',
  design_review: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const formatNaira = (amount: number) =>
  `₦${Number(amount).toLocaleString()}`;

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const apiAdmin = {
  get: async <T extends unknown>(endpoint: string): Promise<T> => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    return res.json();
  },
  put: async <T extends unknown>(endpoint: string, body: unknown): Promise<T> => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });
    return res.json();
  },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<Pick<PaginatedOrders, 'current_page' | 'last_page' | 'prev_page_url' | 'next_page_url' | 'total'> | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [saving, setSaving] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      params.set('page', String(page));

      const res = await apiAdmin.get<PaginatedOrders>(`/orders?${params.toString()}`);
      setOrders(res.data);
      setMeta({
        current_page: res.current_page,
        last_page: res.last_page,
        prev_page_url: res.prev_page_url,
        next_page_url: res.next_page_url,
        total: res.total,
      });
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const handleEdit = (order: Order) => {
    setEditingId(order.id);
    setEditStatus(order.status);
  };

  const handleSave = async (id: number) => {
    setSaving(id);
    try {
      const updated = await apiAdmin.put<Order>(`/orders/${id}`, { status: editStatus });
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      setEditingId(null);
    } catch {
      // silent
    } finally {
      setSaving(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditStatus('');
  };

  return (
    <div className="p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-8">
          <h1 className="font-display text-3xl text-brand-black">Orders</h1>
          <p className="font-sans text-sm text-brand-gray mt-1">
            {meta ? `${meta.total} total orders` : 'Manage customer orders'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-4 py-2 rounded-full font-sans text-[10px] tracking-[0.1em] uppercase border transition-all duration-300 cursor-pointer ${
                statusFilter === s.value
                  ? 'bg-brand-black text-brand-white border-brand-black'
                  : 'bg-transparent text-brand-gray border-brand-border hover:border-brand-gold/30 hover:text-brand-gold'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="text-brand-gold animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mb-4">
              <ShoppingBag size={24} className="text-brand-gold/60" />
            </div>
            <p className="font-display text-xl text-brand-black mb-1">No orders found</p>
            <p className="font-sans text-sm text-brand-gray">
              {statusFilter
                ? `No orders with status "${STATUSES.find((s) => s.value === statusFilter)?.label}".`
                : 'No orders have been placed yet.'}
            </p>
          </motion.div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-[8px] border border-brand-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-border/20">
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 text-left px-5 py-4">Order #</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 text-left px-5 py-4 hidden sm:table-cell">Customer</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 text-left px-5 py-4 hidden md:table-cell">Service</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 text-right px-5 py-4">Amount</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 text-left px-5 py-4">Status</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 text-left px-5 py-4 hidden lg:table-cell">Date</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 text-right px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
                      className="border-b border-brand-border/50 last:border-b-0 hover:bg-brand-border/10 transition-colors duration-200"
                    >
                      <td className="px-5 py-4">
                        <span className="font-sans text-sm font-medium text-brand-black">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <div>
                          <p className="font-sans text-sm text-brand-black">{order.user?.name}</p>
                          <p className="font-sans text-[11px] text-brand-gray/60">{order.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="font-sans text-sm text-brand-gray">{order.service?.title}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-sans text-sm font-medium text-brand-black">
                          {formatNaira(order.amount)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full font-sans text-[10px] tracking-[0.05em] border ${STATUS_STYLES[order.status] || 'bg-brand-border/30 text-brand-gray border-brand-border'}`}>
                          {order.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="font-sans text-sm text-brand-gray">{formatDate(order.created_at)}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {editingId === order.id ? (
                            <>
                              <button
                                onClick={() => handleSave(order.id)}
                                disabled={saving === order.id}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-green-200 text-green-600 hover:bg-green-50 transition-all duration-200 cursor-pointer disabled:opacity-40"
                              >
                                {saving === order.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Check size={14} />
                                )}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-brand-border text-brand-gray/50 hover:text-red-500 hover:border-red-200 transition-all duration-200 cursor-pointer"
                              >
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEdit(order)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-brand-border text-brand-gray/50 hover:text-brand-gold hover:border-brand-gold/30 transition-all duration-200 cursor-pointer"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AnimatePresence>
              {editingId && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-4 p-4 rounded-[8px] border border-brand-gold/20 bg-brand-gold/[0.03]"
                >
                  <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gold mb-3">
                    Update Status
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {STATUSES.filter((s) => s.value).map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setEditStatus(s.value)}
                        className={`px-3 py-1.5 rounded-full font-sans text-[10px] tracking-[0.05em] border transition-all duration-200 cursor-pointer ${
                          editStatus === s.value
                            ? 'bg-brand-black text-brand-white border-brand-black'
                            : 'bg-transparent text-brand-gray border-brand-border hover:border-brand-gold/30'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-brand-border">
                <p className="font-sans text-[11px] text-brand-gray/60">
                  Page {meta.current_page} of {meta.last_page}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!meta.prev_page_url}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] border border-brand-border font-sans text-[11px] tracking-[0.1em] uppercase text-brand-gray hover:text-brand-gold hover:border-brand-gold/30 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                    Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                    disabled={!meta.next_page_url}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] border border-brand-border font-sans text-[11px] tracking-[0.1em] uppercase text-brand-gray hover:text-brand-gold hover:border-brand-gold/30 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
