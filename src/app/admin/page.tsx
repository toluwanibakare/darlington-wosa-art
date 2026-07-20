"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users, ShoppingBag, Calendar, MessageSquare, TrendingUp, ArrowUpRight,
  Package, Palette, Star, GitFork, Plus, ChevronRight,
} from 'lucide-react';

interface DashboardStats {
  total_users: number; total_orders: number; total_revenue: number;
  total_bookings: number; unread_messages: number; total_subscribers: number;
  total_classes: number;
  users?: number; orders?: number; revenue?: number; bookings?: number;
  subscribers?: number; classes?: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.darlingtonwosa.art';
const formatNaira = (a: number) => `₦${a.toLocaleString()}`;

const quickActions = [
  { label: 'New Shop Item', href: '/admin/shop/items', icon: Package, color: 'bg-blue-100 text-blue-700' },
  { label: 'Add Service', href: '/admin/services', icon: Palette, color: 'bg-purple-100 text-purple-700' },
  { label: 'Manage Testimonials', href: '/admin/testimonials', icon: Star, color: 'bg-amber-100 text-amber-700' },
  { label: 'View Referrals', href: '/admin/referrals', icon: GitFork, color: 'bg-emerald-100 text-emerald-700' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem('auth_token');
      const h = { Authorization: `Bearer ${token}`, Accept: 'application/json' };

      try {
        const [statsRes, ordersRes, msgsRes] = await Promise.allSettled([
          fetch(`${API_BASE}/admin/dashboard/stats`, { headers: h }),
          fetch(`${API_BASE}/admin/orders?per_page=5`, { headers: h }),
          fetch(`${API_BASE}/admin/messages?per_page=5`, { headers: h }),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
          const raw = await statsRes.value.json();
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
        }
        if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
          const j = await ordersRes.value.json();
          setRecentOrders(j?.data?.slice(0, 5) || []);
        }
        if (msgsRes.status === 'fulfilled' && msgsRes.value.ok) {
          const j = await msgsRes.value.json();
          setRecentMessages(j?.data?.slice(0, 5) || []);
        }
      } catch {} finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const s = stats;

  const chartData = [
    { label: 'Users', value: s?.users ?? 0, icon: Users, color: '#9E651B' },
    { label: 'Orders', value: s?.orders ?? 0, icon: ShoppingBag, color: '#111111' },
    { label: 'Bookings', value: s?.bookings ?? 0, icon: Calendar, color: '#5C5C5C' },
    { label: 'Classes', value: s?.classes ?? 0, icon: TrendingUp, color: '#9E651B' },
    { label: 'Subs', value: s?.subscribers ?? 0, icon: Users, color: '#111111' },
  ];
  const maxVal = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <div className="p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-brand-black">Dashboard</h1>
            <p className="font-sans text-sm text-brand-gray mt-1">Platform overview at a glance</p>
          </div>
          <Link href="/admin/shop/items" className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase hover:shadow-[0_0_20px_rgba(158,101,27,0.15)] transition-all">
            <Plus size={14} /> Quick Add
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-[120px] rounded-[8px] bg-brand-border/30 animate-pulse" />)}
          </div>
        ) : s ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { key: 'users', label: 'Users', value: (s.users ?? 0).toLocaleString(), icon: Users, extra: `${s.subscribers ?? 0} subscribed` },
                { key: 'revenue', label: 'Revenue', value: formatNaira(s.revenue ?? 0), icon: TrendingUp, extra: `${s.orders ?? 0} orders` },
                { key: 'bookings', label: 'Bookings', value: (s.bookings ?? 0).toLocaleString(), icon: Calendar, extra: `${s.classes ?? 0} classes` },
                { key: 'messages', label: 'Messages', value: s.unread_messages.toLocaleString(), icon: MessageSquare, extra: 'unread' },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <motion.div key={card.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[8px] border border-brand-border bg-brand-white/60 p-5 hover:shadow-[0_8px_32px_rgba(158,101,27,0.08)] hover:border-brand-gold/30 transition-all duration-500 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-full bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                        <Icon size={16} className="text-brand-gold" />
                      </div>
                    </div>
                    <p className="font-display text-2xl text-brand-black tracking-tight">{card.value}</p>
                    <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 mt-1">{card.label}</p>
                    <p className="font-sans text-[10px] text-brand-gold/70 mt-1">{card.extra}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Chart + Quick Actions Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Bar Chart */}
              <div className="lg:col-span-2 border border-brand-border rounded-[8px] bg-brand-white/60 p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display text-base text-brand-black">Distribution</h3>
                  <span className="font-sans text-[9px] tracking-[0.15em] uppercase text-brand-gray/50">Overview</span>
                </div>
                <div className="flex items-end justify-between gap-3 h-40">
                  {chartData.map((d) => {
                    const pct = (d.value / maxVal) * 100;
                    return (
                      <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <span className="font-sans text-[10px] text-brand-black font-medium">{d.value}</span>
                        <div className="w-full rounded-[4px] bg-brand-border/30 relative overflow-hidden" style={{ height: '100%', maxHeight: '120px' }}>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(pct, 4)}%` }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="absolute bottom-0 w-full rounded-[4px]"
                            style={{ backgroundColor: d.color }}
                          />
                        </div>
                        <span className="font-sans text-[9px] tracking-[0.1em] uppercase text-brand-gray/60">{d.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border border-brand-border rounded-[8px] bg-brand-white/60 p-5">
                <h3 className="font-display text-base text-brand-black mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {quickActions.map((a) => {
                    const Icon = a.icon;
                    return (
                      <Link key={a.label} href={a.href}
                        className="flex items-center gap-3 px-3 py-3 rounded-[6px] hover:bg-brand-border/30 transition-all group"
                      >
                        <div className={`w-8 h-8 rounded-full ${a.color} flex items-center justify-center`}>
                          <Icon size={14} />
                        </div>
                        <span className="font-sans text-xs text-brand-black flex-1">{a.label}</span>
                        <ChevronRight size={14} className="text-brand-gray/30 group-hover:text-brand-gold transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="border border-brand-border rounded-[8px] bg-brand-white/60 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-base text-brand-black">Recent Orders</h3>
                  <Link href="/admin/orders" className="font-sans text-[9px] tracking-[0.15em] uppercase text-brand-gold hover:underline">View All</Link>
                </div>
                {recentOrders.length === 0 ? (
                  <p className="font-sans text-xs text-brand-gray/50 text-center py-8">No orders yet</p>
                ) : (
                  <div className="space-y-2">
                    {recentOrders.map((o: any) => (
                      <div key={o.id} className="flex items-center justify-between py-2 border-b border-brand-border/30 last:border-0">
                        <div>
                          <p className="font-sans text-xs text-brand-black">#{o.order_number || o.id}</p>
                          <p className="font-sans text-[10px] text-brand-gray/60">{o.user?.name || 'Guest'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-sans text-xs text-brand-black">{o.amount ? formatNaira(Number(o.amount)) : '-'}</p>
                          <span className={`px-1.5 py-0.5 rounded-full font-sans text-[8px] uppercase ${o.status === 'paid' || o.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Messages */}
              <div className="border border-brand-border rounded-[8px] bg-brand-white/60 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-base text-brand-black">Recent Messages</h3>
                  <Link href="/admin/messages" className="font-sans text-[9px] tracking-[0.15em] uppercase text-brand-gold hover:underline">View All</Link>
                </div>
                {recentMessages.length === 0 ? (
                  <p className="font-sans text-xs text-brand-gray/50 text-center py-8">No messages yet</p>
                ) : (
                  <div className="space-y-2">
                    {recentMessages.map((m: any) => (
                      <div key={m.id} className="flex items-start gap-3 py-2 border-b border-brand-border/30 last:border-0">
                        <div className="w-7 h-7 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="font-sans text-[10px] font-medium text-brand-gold">{(m.name || '?').charAt(0)}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-xs text-brand-black truncate">{m.name}</p>
                          <p className="font-sans text-[10px] text-brand-gray/60 truncate">{m.message || m.content || m.subject || ''}</p>
                        </div>
                        <span className="font-sans text-[9px] text-brand-gray/40 flex-shrink-0">{new Date(m.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20 border border-brand-border rounded-[8px]">
            <p className="font-sans text-sm text-brand-gray">Unable to load dashboard data.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
