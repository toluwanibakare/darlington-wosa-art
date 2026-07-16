"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Bell, User, Search, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NotificationsPanel } from './NotificationsPanel';
import { useUser } from '@/lib/use-user';
import { api } from '@/lib/api';

interface DashboardHeaderProps {
  onToggleMenu: () => void;
  mobileOpen: boolean;
}

export function DashboardHeader({ onToggleMenu, mobileOpen }: DashboardHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const { user } = useUser();

  const fetchUnreadCount = useCallback(async () => {
    const { data } = await api.get<{ unread_count: number }>('/notifications/unread-count');
    if (data) setUnreadCount(data.unread_count);
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const pageTitle = (() => {
    if (pathname === '/dashboard') return 'Dashboard';
    const segment = pathname.split('/').filter(Boolean).pop();
    if (!segment) return 'Dashboard';
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
  })();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  useEffect(() => {
    if (notifOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [notifOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 right-0 z-30 transition-all duration-500 ease-[var(--ease-expo-out)] left-0 lg:left-[280px] ${
          scrolled ? 'bg-brand-surface/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between h-20 px-4 md:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={onToggleMenu}
              className="w-9 h-9 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-gold/50 transition-colors cursor-pointer"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={16} className="text-brand-black" /> : <Menu size={16} className="text-brand-black" />}
            </button>
            <span className="font-sans text-sm tracking-[0.05em] text-brand-black font-medium">{pageTitle}</span>
          </div>

          <div className="hidden md:flex items-center gap-3 px-4 py-2 border border-brand-border rounded-full w-72 transition-colors focus-within:border-brand-gold/50">
            <Search size={14} className="text-brand-gray/50" />
            <input
              type="text"
              placeholder="Search orders, bookings..."
              className="bg-transparent text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none font-sans w-full"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => { setNotifOpen(true); fetchUnreadCount(); }}
              className="relative w-9 h-9 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-gold/50 transition-colors group cursor-pointer"
            >
              <Bell size={15} className="text-brand-gray group-hover:text-brand-gold transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-brand-gold text-white text-[8px] flex items-center justify-center font-sans font-medium px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-full border border-brand-border hover:border-brand-gold/30 transition-colors group"
            >
              <div className="w-7 h-7 rounded-full bg-brand-gold/10 flex items-center justify-center">
                <User size={13} className="text-brand-gold" />
              </div>
              <span className="font-sans text-xs text-brand-black hidden sm:block">{user?.name?.split(' ')[0] || 'User'}</span>
            </Link>
          </div>
        </div>
      </motion.header>

      <NotificationsPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        unreadCount={unreadCount}
        onUnreadCountChange={setUnreadCount}
      />
    </>
  );
}
