"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, X, ShoppingBag, BookOpen, Wallet, Gift,
  Video, Star, Megaphone, CheckCircle, Clock, CheckCheck,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api';

const TYPE_ICONS: Record<string, string> = {
  order: 'bg-blue-500/10 text-blue-600',
  booking: 'bg-purple-500/10 text-purple-600',
  reward: 'bg-green-500/10 text-green-600',
  referral: 'bg-brand-gold/10 text-brand-gold',
  promo: 'bg-amber-500/10 text-amber-600',
  video: 'bg-rose-500/10 text-rose-600',
  welcome: 'bg-brand-gold/10 text-brand-gold',
  info: 'bg-brand-border text-brand-gray',
};

const TYPE_ICON_MAP: Record<string, typeof Bell> = {
  order: ShoppingBag,
  booking: BookOpen,
  reward: Wallet,
  referral: Gift,
  promo: Megaphone,
  video: Video,
  welcome: Sparkles,
  info: Bell,
};

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Orders', value: 'order' },
  { label: 'Rewards', value: 'reward' },
];

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  unreadCount: number;
  onUnreadCountChange?: (count: number) => void;
}

export function NotificationsPanel({ open, onClose, unreadCount: _unreadCount, onUnreadCountChange }: Props) {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const { data, error } = await api.get<{ notifications: Notification[]; unread_count: number }>('/notifications');
    if (data) {
      setNotifications(data.notifications);
      onUnreadCountChange?.(data.unread_count);
    }
    setLoading(false);
  }, [onUnreadCountChange]);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  const markAllAsRead = async () => {
    await api.post('/notifications/mark-all-read', {});
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
    onUnreadCountChange?.(0);
  };

  const markAsRead = async (id: number) => {
    const n = notifications.find((n) => n.id === id);
    if (n?.is_read) return;
    await api.patch(`/notifications/${id}/read`, {});
    const updated = notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n));
    setNotifications(updated);
    onUnreadCountChange?.(updated.filter((n) => !n.is_read).length);
  };

  const filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter((n) => !n.is_read)
      : notifications.filter((n) => n.type === filter);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-brand-surface border-l border-brand-border z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-brand-border flex-shrink-0">
              <div>
                <h2 className="font-display text-lg text-brand-black">Notifications</h2>
                <p className="font-sans text-[10px] text-brand-gray/50">
                  {notifications.filter((n) => !n.is_read).length} unread
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-gold/50 transition-colors cursor-pointer text-brand-gray hover:text-brand-gold"
              >
                <X size={14} />
              </button>
            </div>

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

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin w-6 h-6 border-2 border-brand-gold border-t-transparent rounded-full mx-auto mb-3" />
                  <p className="font-sans text-xs text-brand-gray/50">Loading...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                  <Bell size={28} className="text-brand-gray/20 mx-auto mb-3" />
                  <p className="font-sans text-xs text-brand-gray/50">No notifications found.</p>
                </div>
              ) : (
                filtered.map((n) => {
                  const Icon = TYPE_ICON_MAP[n.type] || Bell;
                  const iconColor = TYPE_ICONS[n.type] || 'bg-brand-border text-brand-gray';
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => markAsRead(n.id)}
                      className={`p-4 border rounded-[8px] transition-all duration-300 cursor-pointer ${
                        n.is_read
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
                            <p className={`font-sans text-xs ${n.is_read ? 'text-brand-black' : 'text-brand-black font-medium'}`}>
                              {n.title}
                            </p>
                            {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0" />}
                          </div>
                          <p className="font-sans text-[11px] text-brand-gray/60 leading-relaxed line-clamp-2">{n.message}</p>
                          <p className="font-sans text-[9px] text-brand-gray/30 mt-1.5">{timeAgo(n.created_at)}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
