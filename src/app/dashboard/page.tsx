"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { useUser } from '@/lib/use-user';
import { api } from '@/lib/api';
import { fadeUpProps } from '@/lib/animation';

interface Order {
  id: string;
  title?: string;
  status: string;
  date?: string;
  created_at?: string;
  price?: string | number;
  total?: string | number;
}

interface Booking {
  id?: string;
  title?: string;
  date?: string;
  time?: string;
  instructor?: string;
  status: string;
  class?: { title?: string; instructor?: string };
}

interface Transaction {
  id: string;
  amount?: string | number;
  description?: string;
  type?: string;
  created_at?: string;
  date?: string;
}

interface Notification {
  id: string;
  title?: string;
  message?: string;
  created_at?: string;
  date?: string;
}

interface DashboardData {
  orders: Order[];
  bookings: Booking[];
  transactions: Transaction[];
  notifications: Notification[];
  walletBalance: number;
  cashbackEarned: number;
  referralEarnings: number;
  rewardPoints: number;
}

function formatNaira(amount: number): string {
  return `\u20A6${amount.toLocaleString('en-NG')}`;
}

type LuceneIcon = React.ComponentType<{ size?: number; className?: string }>;

interface ActivityItem {
  action: string;
  detail: string;
  time: string;
  icon: LuceneIcon;
}

export default function DashboardOverview() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setDashboardLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      setDashboardLoading(true);

      const [ordersRes, bookingsRes, transactionsRes, referralsRes, rewardsRes, notificationsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/bookings'),
        api.get('/transactions'),
        api.get('/referrals'),
        api.get('/rewards/total'),
        api.get('/notifications'),
      ]);

      const orders = (ordersRes.data as { orders: Order[] })?.orders || [];
      const bookings = (bookingsRes.data as { bookings: Booking[] })?.bookings || [];
      const transactions = (transactionsRes.data as { transactions: Transaction[] })?.transactions || [];
      const notifications = (notificationsRes.data as { notifications: Notification[] })?.notifications || [];

      const transData = (transactionsRes.data as { wallet_balance?: number; cashback_earned?: number }) || {};
      const referralsData = (referralsRes.data as { stats?: { earnings?: number } }) || {};
      const rewardsData = (rewardsRes.data as { total_points?: number }) || {};

      setDashboardData({
        orders,
        bookings,
        transactions,
        notifications,
        walletBalance: transData.wallet_balance || 0,
        cashbackEarned: transData.cashback_earned || 0,
        referralEarnings: referralsData.stats?.earnings || 0,
        rewardPoints: rewardsData.total_points || 0,
      });

      setDashboardLoading(false);
    };

    fetchDashboardData();
  }, [user]);

  if (userLoading || (user && dashboardLoading)) return null;

  if (!user) {
    router.push('/login');
    return null;
  }

  if (!dashboardData) return null;

  const { orders, bookings, transactions, notifications, walletBalance, cashbackEarned, referralEarnings } = dashboardData;

  const currentOrdersCount = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'delivered').length;
  const pendingPaymentsCount = orders.filter((o) => o.status === 'pending').length;

  const STATS = [
    { label: 'Current Orders', value: String(currentOrdersCount), icon: ShoppingBag, color: 'text-brand-gold', bg: 'bg-brand-gold/5' },
    { label: 'Completed Orders', value: String(completedOrdersCount), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-500/5' },
    { label: 'Pending Payments', value: String(pendingPaymentsCount), icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-500/5' },
    { label: 'Wallet Balance', value: formatNaira(walletBalance), icon: Wallet, color: 'text-brand-gold', bg: 'bg-brand-gold/5' },
  ];

  const FINANCIAL_STATS = [
    { label: 'Coupon Balance', value: '0', icon: Ticket, href: '/dashboard/rewards', sub: 'No active coupons' },
    { label: 'Cashback', value: formatNaira(cashbackEarned), icon: DollarSign, href: '/dashboard/wallet', sub: 'Available balance' },
    { label: 'Referral Earnings', value: formatNaira(referralEarnings), icon: Award, href: '/dashboard/referrals', sub: 'Total earned' },
  ];

  const RECENT_ORDERS = orders.slice(0, 3).map((o) => ({
    id: o.id,
    title: o.title || 'Order',
    status: o.status,
    date: o.date || o.created_at || '',
    price: o.price ?? o.total ?? null,
  }));

  const UPCOMING_BOOKINGS = bookings
    .filter((b) => b.status === 'pending' || b.status === 'confirmed')
    .map((b) => ({
      title: b.title || b.class?.title || 'Class',
      date: b.date || '',
      time: b.time || '',
      instructor: b.instructor || b.class?.instructor || user.name,
    }));

  const rawActivity: { action: string; detail: string; time: string; sortDate: Date }[] = [
    ...notifications.map((n) => ({
      action: n.title || 'Notification',
      detail: n.message || '',
      time: n.date || n.created_at || '',
      sortDate: new Date(n.date || n.created_at || Date.now()),
    })),
    ...transactions.slice(0, 5).map((t) => ({
      action: t.description || (t.type ? `${t.type} transaction` : 'Transaction'),
      detail: t.amount ? formatNaira(Number(t.amount)) : '',
      time: t.date || t.created_at || '',
      sortDate: new Date(t.date || t.created_at || Date.now()),
    })),
  ];

  const activityItems: ActivityItem[] = rawActivity
    .sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())
    .slice(0, 4)
    .map((item) => {
      const actionLower = item.action.toLowerCase();
      let icon: LuceneIcon = Gift;
      if (actionLower.includes('referral')) icon = Gift;
      else if (actionLower.includes('cashback') || actionLower.includes('earned')) icon = TrendingUp;
      else if (actionLower.includes('order')) icon = ShoppingBag;
      else if (actionLower.includes('booking') || actionLower.includes('class')) icon = BookOpen;
      else if (actionLower.includes('payment') || actionLower.includes('wallet') || actionLower.includes('deposit')) icon = Wallet;
      return { ...item, icon };
    });

  return (
    <div className="p-6 md:p-10">
      <motion.div {...fadeUpProps(0)} className="mb-12">
        <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-2">
          Welcome back, {user.name}
        </h1>
        <p className="font-sans text-sm text-brand-gray">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            {...fadeUpProps(0.1 + i * 0.05)}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
        {FINANCIAL_STATS.map((stat, i) => (
          <motion.div key={stat.label} {...fadeUpProps(0.3 + i * 0.05)}>
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
        <motion.div {...fadeUpProps(0.4)} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-brand-black">Recent Orders</h2>
            <Link href="/dashboard/orders" className="flex items-center gap-1 text-brand-gold font-sans text-[10px] tracking-[0.15em] uppercase hover:text-brand-gold-light transition-colors">
              View All
              <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {RECENT_ORDERS.length > 0 ? (
              RECENT_ORDERS.map((order) => (
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
                      <p className="font-display text-sm text-brand-black">
                        {order.price !== null ? formatNaira(Number(order.price)) : ''}
                      </p>
                      <span className="inline-block mt-1 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold font-sans text-[9px] tracking-[0.1em] uppercase">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-10 border border-brand-border rounded-[8px] bg-brand-white/50 text-center">
                <p className="font-sans text-sm text-brand-gray/50">No orders yet.</p>
              </div>
            )}
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.div {...fadeUpProps(0.45)} className="p-6 border border-brand-border rounded-[8px] bg-brand-white/50">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-base text-brand-black">Recent Activity</h3>
              <Activity size={16} className="text-brand-gold" />
            </div>
            <div className="space-y-4">
              {activityItems.length > 0 ? (
                activityItems.map((act, i) => (
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
                ))
              ) : (
                <p className="font-sans text-sm text-brand-gray/50">No recent activity.</p>
              )}
            </div>
          </motion.div>

          <motion.div {...fadeUpProps(0.5)} className="p-6 border border-brand-border rounded-[8px] bg-brand-white/50">
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
