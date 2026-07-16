"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Package, Search, ChevronRight, Download, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface OrderService {
  title?: string;
}

interface Order {
  id: number;
  user_id: number;
  service_id: number;
  order_number: string;
  description?: string;
  amount: string | number;
  status: string;
  payment_method?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  service?: OrderService;
}

interface OrdersResponse {
  orders: Order[];
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  design_review: 'Design Review',
  in_production: 'In Production',
  quality_check: 'Quality Check',
  ready: 'Ready for Pickup',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-600',
  confirmed: 'bg-blue-500/10 text-blue-600',
  processing: 'bg-blue-500/10 text-blue-600',
  design_review: 'bg-purple-500/10 text-purple-600',
  in_production: 'bg-blue-500/10 text-blue-600',
  quality_check: 'bg-amber-500/10 text-amber-600',
  ready: 'bg-green-500/10 text-green-600',
  delivered: 'bg-green-500/10 text-green-600',
  cancelled: 'bg-red-500/10 text-red-600',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function formatAmount(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `NGN ${num.toLocaleString('en-US')}`;
}

function getOrderTitle(order: Order): string {
  return order.service?.title || order.description || `Order ${order.order_number}`;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get<OrdersResponse>('/orders').then((res) => {
      if (cancelled) return;
      if (res.error) {
        setError(res.error);
      } else {
        setOrders(res.data?.orders ?? []);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const statuses = ['All', ...new Set(orders.map((o) => o.status))];

  const filtered = orders.filter((o) => {
    if (filter !== 'All' && o.status !== filter) return false;
    const title = getOrderTitle(o);
    if (
      search &&
      !title.toLowerCase().includes(search.toLowerCase()) &&
      !o.order_number.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  if (loading) {
    return (
      <div className="p-6 md:p-10 flex items-center justify-center min-h-[400px]">
        <Loader2 size={24} className="animate-spin text-brand-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-10">
        <p className="font-sans text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-2">My Orders</h1>
            <p className="font-sans text-sm text-brand-gray">Track and manage all your artwork orders.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray/50" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-transparent border border-brand-border rounded-full text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold/50 transition-colors font-sans"
            />
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`font-sans text-[10px] tracking-[0.15em] uppercase px-5 py-2.5 rounded-full border transition-all duration-500 cursor-pointer ${
                filter === s
                  ? 'bg-brand-black text-brand-white border-brand-black'
                  : 'bg-transparent text-brand-gray border-brand-border hover:border-brand-gray/40 hover:text-brand-black'
              }`}
            >
              {STATUS_LABELS[s] || s}
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="space-y-3">
          {filtered.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/dashboard/orders/${order.id}`}
                className="block p-5 md:p-6 border border-brand-border rounded-[8px] bg-brand-white/50 hover:border-brand-gold/20 hover:bg-brand-white/80 transition-all duration-500 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Package size={14} className="text-brand-gold/60 flex-shrink-0" />
                      <p className="font-display text-base text-brand-black truncate">{getOrderTitle(order)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-brand-gray/50">{order.order_number}</span>
                      <span className="flex items-center gap-1.5 font-sans text-[10px] text-brand-gray/60">
                        <Clock size={10} />
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 flex items-center gap-4">
                    <div>
                      <p className="font-display text-sm text-brand-black">{formatAmount(order.amount)}</p>
                      <span className={`inline-block mt-1.5 px-3 py-1 rounded-full font-sans text-[9px] tracking-[0.1em] uppercase ${STATUS_COLORS[order.status] || 'bg-brand-border text-brand-gray'}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-brand-gray/30 group-hover:text-brand-gold transition-colors -ml-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex justify-center"
          >
            <button className="flex items-center gap-2 px-6 py-3 border border-brand-border rounded-full font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray hover:text-brand-gold hover:border-brand-gold/30 transition-all duration-300 cursor-pointer">
              <Download size={12} />
              Download Invoice History
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
