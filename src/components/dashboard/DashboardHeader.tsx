"use client";

import React from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Bell, User, Search } from 'lucide-react';
import Link from 'next/link';
import { NotificationsPanel } from './NotificationsPanel';

export function DashboardHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  React.useEffect(() => {
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
        className={`fixed top-0 right-0 z-30 transition-all duration-500 ease-[var(--ease-expo-out)] lg:left-[280px] ${
          scrolled ? 'bg-brand-surface/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'
        }`}
        style={{ left: '0px' }}
      >
        <div className="flex items-center justify-between h-20 px-8">
          {/* Search */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 border border-brand-border rounded-full w-72 transition-colors focus-within:border-brand-gold/50">
            <Search size={14} className="text-brand-gray/50" />
            <input
              type="text"
              placeholder="Search orders, bookings..."
              className="bg-transparent text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none font-sans w-full"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setNotifOpen(true)}
              className="relative w-9 h-9 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-gold/50 transition-colors group cursor-pointer"
            >
              <Bell size={15} className="text-brand-gray group-hover:text-brand-gold transition-colors" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-gold text-white text-[8px] flex items-center justify-center font-sans font-medium">
                3
              </span>
            </button>

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-full border border-brand-border hover:border-brand-gold/30 transition-colors group"
            >
              <div className="w-7 h-7 rounded-full bg-brand-gold/10 flex items-center justify-center">
                <User size={13} className="text-brand-gold" />
              </div>
              <span className="font-sans text-xs text-brand-black hidden sm:block">Darlington</span>
            </Link>
          </div>
        </div>
      </motion.header>

      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} unreadCount={3} />
    </>
  );
}
