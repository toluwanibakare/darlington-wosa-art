"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ShoppingBag,
  BookOpen,
  Wallet,
  Gift,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Award,
  Ticket,
  DollarSign,
  Activity,
} from 'lucide-react';

const STATS = [
  { label: 'Current Orders', value: '2', icon: ShoppingBag, color: 'text-brand-gold', bg: 'bg-brand-gold/5' },
  { label: 'Completed Orders', value: '12', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-500/5' },
  { label: 'Pending Payments', value: '1', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-500/5' },
  { label: 'Wallet Balance', value: '₦24,500', icon: Wallet, color: 'text-brand-gold', bg: 'bg-brand-gold/5' },
];

const FINANCIAL_STATS = [
  { label: 'Coupon Balance', value: '2', icon: Ticket, href: '/dashboard/rewards', sub: 'Active coupons' },
  { label: 'Cashback', value: '₦8,500', icon: DollarSign, href: '/dashboard/wallet', sub: 'Available balance' },
  { label: 'Referral Earnings', value: '₦25,000', icon: Award, href: '/dashboard/referrals', sub: '₦15,000 withdrawable' },
];

const RECENT_ORDERS = [
  { id: '#DWAF-2024-001', title: 'Charcoal Portrait', status: 'In Production', date: 'Mar 12, 2026', price: '₦250,000' },
  { id: '#DWAF-2024-002', title: 'Museum Frame - 24x36', status: 'Quality Check', date: 'Mar 08, 2026', price: '₦120,000' },
  { id: '#DWAF-2024-003', title: 'Corporate Portrait Series', status: 'Design Review', date: 'Feb 28, 2026', price: '₦450,000' },
];

const UPCOMING_BOOKINGS = [
  { title: 'Private Art Class', date: 'Mar 25, 2026', time: '10:00 AM', instructor: 'Darlington Wosa' },
];

const RECENT_ACTIVITY = [
  { action: 'Referral reward credited', detail: '₦5,000 from Chioma Okeke', time: '2 days ago', icon: Gift },
  { action: 'Cashback earned', detail: '₦2,000 for video testimonial', time: '3 days ago', icon: TrendingUp },
  { action: 'Order status updated', detail: 'Portrait moved to Production', time: '5 days ago', icon: ShoppingBag },
  { action: 'Class booking confirmed', detail: 'Private Art Class - Mar 25', time: '1 week ago', icon: BookOpen },
];

export default function DashboardOverview() {
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <div className="p-6 md:p-10">
      {/* Welcome */}
      <motion.div {...fadeUp(0)} className="mb-12">
        <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-2">
          Welcome back, Darlington
        </h1>
        <p className="font-sans text-sm text-brand-gray">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            {...fadeUp(0.1 + i * 0.05)}
            className="p-6 border border-brand-border rounded-[8px] bg-brand-white/50 hover:border-brand-gold/20 transition-all duration-500 group"
          >
            <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="font-display text-2xl md:text-3xl text-brand-black mb-1">{stat.value}</p>
            <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Financial Stats - Coupons, Cashback, Referral Earnings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
        {FINANCIAL_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            {...fadeUp(0.3 + i * 0.05)}
          >
            <Link
              href={stat.href}
              className="block p-5 border border-brand-border rounded-[8px] bg-brand-white/50 hover:border-brand-gold/20 hover:bg-brand-white/80 transition-all duration-500 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-full bg-brand-gold/10 flex items-center justify-center">
                  <stat.icon size={16} className="text-brand-gold" />
                </div>
                <ArrowRight size={12} className="text-brand-gray/30 group-hover:text-brand-gold transition-colors" />
              </div>
              <p className="font-display text-xl text-brand-black mb-1">{stat.value}</p>
              <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70">{stat.label}</p>
              <p className="font-sans text-[10px] text-brand-gray/40 mt-0.5">{stat.sub}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <motion.div {...fadeUp(0.4)} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-brand-black">Recent Orders</h2>
            <Link href="/dashboard/orders" className="flex items-center gap-1 text-brand-gold font-sans text-[10px] tracking-[0.15em] uppercase hover:text-brand-gold-light transition-colors">
              View All
              <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {RECENT_ORDERS.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${encodeURIComponent(order.id)}`}
                className="block p-5 border border-brand-border rounded-[8px] bg-brand-white/50 hover:border-brand-gold/20 hover:bg-brand-white/80 transition-all duration-500"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-display text-base text-brand-black">{order.title}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-brand-gray/50">{order.id}</span>
                      <span className="flex items-center gap-1.5 font-sans text-[10px] text-brand-gray/60">
                        <Clock size={10} />
                        {order.date}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-display text-sm text-brand-black">{order.price}</p>
                    <span className="inline-block mt-1 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold font-sans text-[9px] tracking-[0.1em] uppercase">
                      {order.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Right sidebar */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <motion.div {...fadeUp(0.45)} className="p-6 border border-brand-border rounded-[8px] bg-brand-white/50">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-base text-brand-black">Recent Activity</h3>
              <Activity size={16} className="text-brand-gold" />
            </div>
            <div className="space-y-4">
              {RECENT_ACTIVITY.map((act, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <act.icon size={12} className="text-brand-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-sans text-xs text-brand-black">{act.action}</p>
                    <p className="font-sans text-[10px] text-brand-gray/50">{act.detail}</p>
                    <p className="font-sans text-[9px] text-brand-gray/30 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Bookings */}
          <motion.div {...fadeUp(0.5)} className="p-6 border border-brand-border rounded-[8px] bg-brand-white/50">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-base text-brand-black">Next Class</h3>
              <BookOpen size={16} className="text-brand-gold" />
            </div>
            {UPCOMING_BOOKINGS.length > 0 ? (
              <div>
                <p className="font-display text-base text-brand-black">{UPCOMING_BOOKINGS[0].title}</p>
                <div className="flex items-center gap-4 mt-2 text-brand-gray/70">
                  <span className="font-sans text-xs">{UPCOMING_BOOKINGS[0].date}</span>
                  <span className="font-sans text-xs">{UPCOMING_BOOKINGS[0].time}</span>
                </div>
                <p className="font-sans text-xs text-brand-gray/50 mt-1">{UPCOMING_BOOKINGS[0].instructor}</p>
              </div>
            ) : (
              <p className="font-sans text-sm text-brand-gray/50">No upcoming classes.</p>
            )}
            <Link
              href="/classes"
              className="flex items-center justify-center gap-1 w-full mt-5 py-2.5 border border-brand-border rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray hover:text-brand-gold hover:border-brand-gold/30 transition-all duration-300"
            >
              Browse Classes
              <ArrowRight size={10} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
