"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, X, ShoppingBag, BookOpen, Wallet, Gift,
  Video, Star, Megaphone, CheckCircle, Clock, CheckCheck,
} from 'lucide-react';

const NOTIFICATIONS = [
  { id: 1, title: 'Order Update', message: 'Your charcoal portrait "The Visionary" has moved to Production.', time: '2 hours ago', type: 'order', icon: ShoppingBag, read: false },
  { id: 2, title: 'Booking Confirmed', message: 'Your Private Art Class on Mar 25, 2026 at 10:00 AM has been confirmed.', time: '5 hours ago', type: 'booking', icon: BookOpen, read: false },
  { id: 3, title: 'Cashback Reward', message: 'You earned N2,000 cashback for your video testimonial.', time: '1 day ago', type: 'reward', icon: Wallet, read: true },
  { id: 4, title: 'Referral Reward', message: 'Chioma Okeke made a purchase using your referral code. You earned N5,000!', time: '2 days ago', type: 'referral', icon: Gift, read: true },
  { id: 5, title: 'Birthday Wishes', message: 'Happy Birthday! Enjoy a special 15% discount on your next order.', time: '3 days ago', type: 'promo', icon: Star, read: true },
  { id: 6, title: 'Video Approved', message: 'Your unboxing video has been approved. N1,500 cashback credited.', time: '5 days ago', type: 'video', icon: Video, read: true },
  { id: 7, title: 'Payment Confirmed', message: 'Your payment of N250,000 has been confirmed.', time: '1 week ago', type: 'order', icon: CheckCircle, read: true },
  { id: 8, title: 'Class Reminder', message: 'Your Beginner Workshop starts tomorrow at 2:00 PM at the Studio.', time: '1 week ago', type: 'booking', icon: Clock, read: true },
  { id: 9, title: 'New Promotion', message: 'Spring Sale! Get 20% off all museum-grade framing services this month.', time: '2 weeks ago', type: 'promo', icon: Megaphone, read: true },
];

const TYPE_ICONS: Record<string, string> = {
  order: 'bg-blue-500/10 text-blue-600',
  booking: 'bg-purple-500/10 text-purple-600',
  reward: 'bg-green-500/10 text-green-600',
  referral: 'bg-brand-gold/10 text-brand-gold',
  promo: 'bg-amber-500/10 text-amber-600',
  video: 'bg-rose-500/10 text-rose-600',
};

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Orders', value: 'order' },
  { label: 'Rewards', value: 'reward' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  unreadCount: number;
}

export function NotificationsPanel({ open, onClose, unreadCount: _unreadCount }: Props) {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllAsRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));
  const markAsRead = (id: number) => setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter((n) => !n.read) : notifications.filter((n) => n.type === filter);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-brand-surface border-l border-brand-border z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-20 border-b border-brand-border flex-shrink-0">
              <div>
                <h2 className="font-display text-lg text-brand-black">Notifications</h2>
                <p className="font-sans text-[10px] text-brand-gray/50">
                  {notifications.filter((n) => !n.read).length} unread
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-gold/50 transition-colors cursor-pointer text-brand-gray hover:text-brand-gold"
              >
                <X size={14} />
              </button>
            </div>

            {/* Mark all read + Filters */}
            <div className="px-6 pt-5 pb-3 border-b border-brand-border/50 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1.5">
                  {FILTERS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFilter(f.value)}
                      className={`font-sans text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                        filter === f.value
                          ? 'bg-brand-black text-brand-white border-brand-black'
                          : 'bg-transparent text-brand-gray border-brand-border hover:text-brand-black'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-brand-gold font-sans text-[9px] tracking-[0.1em] uppercase hover:text-brand-gold-light transition-colors cursor-pointer flex-shrink-0"
                >
                  <CheckCheck size={11} />
                  Mark Read
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <Bell size={28} className="text-brand-gray/20 mx-auto mb-3" />
                  <p className="font-sans text-xs text-brand-gray/50">No notifications found.</p>
                </div>
              )}
              {filtered.map((n) => {
                const Icon = n.icon;
                const iconColor = TYPE_ICONS[n.type] || 'bg-brand-border text-brand-gray';
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => markAsRead(n.id)}
                    className={`p-4 border rounded-[8px] transition-all duration-300 cursor-pointer ${
                      n.read
                        ? 'border-brand-border bg-brand-white/30 hover:bg-brand-white/50'
                        : 'border-brand-gold/20 bg-brand-gold/[0.02]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className={`font-sans text-xs ${n.read ? 'text-brand-black' : 'text-brand-black font-medium'}`}>
                            {n.title}
                          </p>
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0" />}
                        </div>
                        <p className="font-sans text-[11px] text-brand-gray/60 leading-relaxed line-clamp-2">{n.message}</p>
                        <p className="font-sans text-[9px] text-brand-gray/30 mt-1.5">{n.time}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
