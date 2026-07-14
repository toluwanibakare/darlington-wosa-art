"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Package, Search, ChevronRight, Download } from 'lucide-react';

const ALL_ORDERS = [
  { id: '#DWAF-2024-001', title: 'Charcoal Portrait - "The Visionary"', status: 'In Production', date: 'Mar 12, 2026', price: '₦250,000', type: 'Portrait' },
  { id: '#DWAF-2024-002', title: 'Museum Frame - 24x36', status: 'Quality Check', date: 'Mar 08, 2026', price: '₦120,000', type: 'Framing' },
  { id: '#DWAF-2024-003', title: 'Corporate Portrait Series', status: 'Design Review', date: 'Feb 28, 2026', price: '₦450,000', type: 'Corporate' },
  { id: '#DWAF-2024-004', title: 'Pencil Sketch - "Family Portrait"', status: 'Delivered', date: 'Feb 15, 2026', price: '₦180,000', type: 'Portrait' },
  { id: '#DWAF-2024-005', title: 'Mixed Media - "Eternal Bond"', status: 'Delivered', date: 'Jan 20, 2026', price: '₦320,000', type: 'Custom' },
  { id: '#DWAF-2024-006', title: 'Canvas Stretching Service', status: 'Delivered', date: 'Jan 05, 2026', price: '₦80,000', type: 'Framing' },
];

const STATUSES = ['All', 'In Production', 'Quality Check', 'Design Review', 'Delivered'];

const STATUS_COLORS: Record<string, string> = {
  'In Production': 'bg-blue-500/10 text-blue-600',
  'Quality Check': 'bg-amber-500/10 text-amber-600',
  'Design Review': 'bg-purple-500/10 text-purple-600',
  'Delivered': 'bg-green-500/10 text-green-600',
};

export default function OrdersPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = ALL_ORDERS.filter((o) => {
    if (filter !== 'All' && o.status !== filter) return false;
    if (search && !o.title.toLowerCase().includes(search.toLowerCase()) && !o.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`font-sans text-[10px] tracking-[0.15em] uppercase px-5 py-2.5 rounded-full border transition-all duration-500 cursor-pointer ${
                filter === s
                  ? 'bg-brand-black text-brand-white border-brand-black'
                  : 'bg-transparent text-brand-gray border-brand-border hover:border-brand-gray/40 hover:text-brand-black'
              }`}
            >
              {s}
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
                href={`/dashboard/orders/${encodeURIComponent(order.id)}`}
                className="block p-5 md:p-6 border border-brand-border rounded-[8px] bg-brand-white/50 hover:border-brand-gold/20 hover:bg-brand-white/80 transition-all duration-500 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Package size={14} className="text-brand-gold/60 flex-shrink-0" />
                      <p className="font-display text-base text-brand-black truncate">{order.title}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-brand-gray/50">{order.id}</span>
                      <span className="flex items-center gap-1.5 font-sans text-[10px] text-brand-gray/60">
                        <Clock size={10} />
                        {order.date}
                      </span>
                      <span className="font-sans text-[10px] text-brand-gray/50">{order.type}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 flex items-center gap-4">
                    <div>
                      <p className="font-display text-sm text-brand-black">{order.price}</p>
                      <span className={`inline-block mt-1.5 px-3 py-1 rounded-full font-sans text-[9px] tracking-[0.1em] uppercase ${STATUS_COLORS[order.status] || 'bg-brand-border text-brand-gray'}`}>
                        {order.status}
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-brand-gray/30 group-hover:text-brand-gold transition-colors -ml-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Download invoice button */}
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
