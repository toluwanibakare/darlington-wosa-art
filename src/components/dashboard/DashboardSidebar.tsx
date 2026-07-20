"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  BookOpen,
  User,
  Gift,
  Wallet,
  Ticket,
  LogOut,
  ChevronLeft,
  Home,
  Sun,
  Moon,
} from 'lucide-react';
import { useUser } from '@/lib/use-user';
import { useTheme } from '@/components/providers';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { label: 'My Bookings', href: '/dashboard/bookings', icon: BookOpen },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
  { label: 'Referrals', href: '/dashboard/referrals', icon: Gift },
  { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
  { label: 'Rewards', href: '/dashboard/rewards', icon: Ticket },
];

interface DashboardSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ mobileOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 bg-black/30 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-brand-surface border-r border-brand-border transition-all duration-500 ease-[var(--ease-expo-out)] w-[280px] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full pb-6">
          {/* Logo & Brand */}
          <div className="pt-6 pb-5 border-b border-brand-border px-6">
            <Link href="/" className="flex items-center gap-4 transition-opacity duration-300 hover:opacity-80">
              <div className="relative flex-shrink-0" style={{ width: '72px', height: '72px' }}>
                <Image
                  src={theme === 'dark' ? '/logo_white.png' : '/logo.png'}
                  alt="Darlington Wosa"
                  fill
                  sizes="72px"
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-display text-base text-brand-black leading-tight">Darlington Wosa</p>
                <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/50">Art & Frames</p>
              </div>
            </Link>
          </div>

          {/* Back to Home */}
          <div className="px-3 pt-3 pb-1">
            <Link
              href="/"
              className="flex items-center rounded-[8px] text-brand-gray/60 hover:text-brand-gold hover:bg-brand-border/30 transition-all duration-300 gap-3 px-4 py-2"
            >
              <Home size={16} className="flex-shrink-0" />
              <span className="font-sans text-[11px] tracking-[0.1em] uppercase">Back to Home</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center rounded-[8px] transition-all duration-300 px-4 py-2.5 ${
                    isActive
                      ? 'bg-brand-black text-brand-white'
                      : 'text-brand-gray/60 hover:text-brand-gold hover:bg-brand-border/30'
                  }`}
                >
                  <item.icon size={16} className="flex-shrink-0" />
                  <span className="font-sans text-[11px] tracking-[0.1em] uppercase ml-3 flex-1">{item.label}</span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-brand-gold ring-2 ring-brand-gold/30 flex-shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <div className="pt-2 pb-2 border-t border-brand-border px-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center rounded-[8px] text-brand-gray hover:text-brand-gold hover:bg-brand-border/30 transition-all duration-300 cursor-pointer w-full gap-3 px-4 py-2.5"
            >
              {theme === 'dark' ? <Sun size={16} className="flex-shrink-0" /> : <Moon size={16} className="flex-shrink-0" />}
              <span className="font-sans text-[11px] tracking-[0.1em] uppercase">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
          </div>

          {/* Sign out */}
          <div className="pt-2 pb-4 border-t border-brand-border px-3">
            <button
              onClick={handleLogout}
              className="flex items-center rounded-[8px] text-brand-gray hover:text-brand-gold hover:bg-brand-border/30 transition-all duration-300 cursor-pointer w-full gap-3 px-4 py-2.5"
            >
              <LogOut size={18} className="flex-shrink-0" />
              <span className="font-sans text-[11px] tracking-[0.1em] uppercase">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
