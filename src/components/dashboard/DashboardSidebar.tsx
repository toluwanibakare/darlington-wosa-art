"use client";

import React, { useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { useUser } from '@/lib/use-user';

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
  const [collapsed, setCollapsed] = useState(false);

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
        className={`fixed top-0 left-0 h-full z-50 bg-brand-surface border-r border-brand-border transition-all duration-500 ease-[var(--ease-expo-out)] ${
          collapsed ? 'w-[72px]' : 'w-[280px]'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Collapse toggle - desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="max-lg:hidden absolute -right-3.5 top-20 w-7 h-7 rounded-full bg-brand-surface border border-brand-border items-center justify-center hover:border-brand-gold/50 hover:text-brand-gold text-brand-gray transition-colors cursor-pointer z-[60] shadow-sm hidden lg:flex"
        >
          <ChevronLeft size={14} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex flex-col h-full pb-6">
          {/* Logo & Brand */}
          <div className={`pt-6 pb-5 border-b border-brand-border transition-all duration-500 ${collapsed ? 'px-3' : 'px-6'}`}>
            <Link href="/" className={`flex items-center gap-4 transition-opacity duration-300 hover:opacity-80 ${collapsed ? 'justify-center' : ''}`}>
              <img
                src="/logo.png"
                alt="Darlington Wosa"
                className="object-contain flex-shrink-0"
                style={{ width: collapsed ? '52px' : '72px', height: collapsed ? '52px' : '72px' }}
              />
              {!collapsed && (
                <div>
                  <p className="font-display text-base text-brand-black leading-tight">Darlington Wosa</p>
                  <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/50">Art & Frames</p>
                </div>
              )}
            </Link>
          </div>

          {/* Back to Home */}
          <div className={`${collapsed ? 'px-0' : 'px-3'} pt-3 pb-1`}>
            <Link
              href="/"
              className={`flex items-center rounded-[8px] text-brand-gray/60 hover:text-brand-gold hover:bg-brand-border/30 transition-all duration-300 ${
                collapsed
                  ? 'justify-center py-2.5 mx-2'
                  : 'gap-3 px-4 py-2'
              }`}
            >
              <Home size={16} className="flex-shrink-0" />
              {!collapsed && (
                <span className="font-sans text-[10px] tracking-[0.1em] uppercase">Back to Home</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 overflow-hidden space-y-0.5 ${collapsed ? 'px-0' : 'px-3'}`}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`relative flex items-center rounded-[8px] transition-all duration-300 group ${
                    collapsed
                      ? 'justify-center py-2.5'
                      : 'gap-3 px-4 py-2.5'
                  } ${
                    isActive
                      ? collapsed ? 'bg-brand-black text-brand-white mx-2' : 'bg-brand-black text-brand-white'
                      : collapsed ? 'text-brand-gray hover:text-brand-black mx-2' : 'text-brand-gray hover:text-brand-black hover:bg-brand-border/30'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-gold rounded-full"
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <item.icon size={18} className="flex-shrink-0" />
                  {!collapsed && (
                    <span className="font-sans text-[11px] tracking-[0.1em] uppercase whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sign out */}
          <div className={`mt-auto pt-4 border-t border-brand-border ${collapsed ? 'px-0' : 'px-3'}`}>
            <button
              onClick={handleLogout}
              className={`flex items-center rounded-[8px] text-brand-gray hover:text-brand-gold hover:bg-brand-border/30 transition-all duration-300 cursor-pointer w-full ${
                collapsed
                  ? 'justify-center py-2.5 mx-2'
                  : 'gap-3 px-4 py-2.5'
              }`}
            >
              <LogOut size={18} className="flex-shrink-0" />
              {!collapsed && (
                <span className="font-sans text-[11px] tracking-[0.1em] uppercase">Sign Out</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
