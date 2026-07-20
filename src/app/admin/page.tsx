"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Calendar, MessageSquare, BookOpen, Mail } from 'lucide-react';

interface DashboardStats {
  total_users: number;
  total_orders: number;
  total_revenue: number;
  total_bookings: number;
  unread_messages: number;
  total_subscribers: number;
  total_classes: number;
  // aliases for frontend
  users?: number;
  orders?: number;
  revenue?: number;
  bookings?: number;
  subscribers?: number;
  classes?: number;
}

const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString()}`;

const easeAdmin = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, ease: easeAdmin },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeAdmin },
  },
};

const statCards = [
  {
    key: 'users',
    label: 'Total Users',
    icon: Users,
    value: (s: DashboardStats) => (s.users ?? 0).toLocaleString(),
  },
  {
    key: 'orders',
    label: 'Total Orders',
    icon: ShoppingBag,
    value: (s: DashboardStats) => (s.orders ?? 0).toLocaleString(),
    extra: (s: DashboardStats) => (
      <span className="font-sans text-[11px] text-brand-gold">
        Revenue: {formatNaira(s.revenue ?? 0)}
      </span>
    ),
  },
  {
    key: 'bookings',
    label: 'Total Bookings',
    icon: Calendar,
    value: (s: DashboardStats) => (s.bookings ?? 0).toLocaleString(),
  },
  {
    key: 'messages',
    label: 'Unread Messages',
    icon: MessageSquare,
    value: (s: DashboardStats) => s.unread_messages.toLocaleString(),
    extra: (s: DashboardStats) => (
      <span className="font-sans text-[11px] text-brand-gold">
        {s.subscribers ?? 0} Subscribers
      </span>
    ),
  },
];

export default function AdminDashboard() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`${API_BASE}/admin/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        if (!res.ok) return;
        const raw = await res.json();
        setStats({
          ...raw,
          users: raw.total_users ?? raw.users ?? 0,
          orders: raw.total_orders ?? raw.orders ?? 0,
          revenue: raw.total_revenue ?? raw.revenue ?? 0,
          bookings: raw.total_bookings ?? raw.bookings ?? 0,
          unread_messages: raw.unread_messages ?? 0,
          subscribers: raw.total_subscribers ?? raw.subscribers ?? 0,
          classes: raw.total_classes ?? raw.classes ?? 0,
        });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <h1 className="font-display text-3xl md:text-4xl text-brand-black">
          Admin Dashboard
        </h1>
        <p className="font-sans text-sm text-brand-gray mt-2">
          Overview of your platform
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-[140px] rounded-[8px] bg-brand-border/30 animate-pulse"
            />
          ))}
        </div>
      ) : stats ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.key}
                variants={cardVariants}
                className="relative overflow-hidden rounded-[8px] border border-brand-border bg-brand-white/60 p-6 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(158,101,27,0.08)] hover:border-brand-gold/30 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors duration-300">
                    <Icon size={18} className="text-brand-gold" />
                  </div>
                </div>
                <p className="font-display text-3xl text-brand-black tracking-tight">
                  {card.value(stats)}
                </p>
                <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 mt-1">
                  {card.label}
                </p>
                {card.extra && (
                  <div className="mt-2 pt-2 border-t border-brand-border/50">
                    {card.extra(stats)}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="text-center py-20">
          <p className="font-sans text-sm text-brand-gray">
            Unable to load dashboard data.
          </p>
        </div>
      )}
    </div>
  );
}
