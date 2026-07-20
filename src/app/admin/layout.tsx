"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, ShoppingBag, Palette, Image as ImageIcon,
  BookOpen, Calendar, Mail, Ticket, MessageSquare, Star,
  Video, Settings, LogOut, Menu, X, ChevronRight, Package, Layers, Gift, GitFork,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Shop Items', href: '/admin/shop/items', icon: Package },
  { label: 'Shop Categories', href: '/admin/shop/categories', icon: Layers },
  { label: 'Services', href: '/admin/services', icon: Palette },
  { label: 'Portfolio', href: '/admin/portfolio', icon: ImageIcon },
  { label: 'Classes', href: '/admin/classes', icon: BookOpen },
  { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { label: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { label: 'Promotions', href: '/admin/promotions', icon: Ticket },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { label: 'Referrals', href: '/admin/referrals', icon: GitFork },
  { label: 'Rewards', href: '/admin/rewards', icon: Gift },
  { label: 'Videos', href: '/admin/videos', icon: Video },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      router.push('/admin/login');
      return;
    }
    try {
      const parsed = JSON.parse(user);
      if (!parsed.is_admin) {
        router.push('/admin/login');
      }
    } catch {
      router.push('/admin/login');
    }
  }, [router]);

  if (!mounted) return null;
  if (pathname === '/admin/login') return <>{children}</>;

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      {/* Mobile floating menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-3 left-3 z-50 w-10 h-10 rounded-full bg-brand-black text-brand-white border border-brand-gold flex items-center justify-center shadow-lg lg:hidden cursor-pointer"
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-50 bg-brand-surface border-r border-brand-border w-[240px] transition-transform duration-500 ease-[var(--ease-expo-out)] ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full pb-4">
          <div className="px-4 py-4 border-b border-brand-border">
            <Link href="/admin" className="flex items-center gap-3">
              <img src="/logo.png" alt="Darlington Wosa" className="w-8 h-8 object-contain flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-display text-sm text-brand-black leading-tight truncate">Admin Panel</p>
                <p className="font-sans text-[8px] tracking-[0.15em] uppercase text-brand-gold/70 truncate">Darlington Wosa Art</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-all duration-300 ${
                    active
                      ? 'bg-brand-black text-brand-white'
                      : 'text-brand-gray/60 hover:text-brand-gold hover:bg-brand-border/30'
                  }`}
                >
                  <item.icon size={15} className="flex-shrink-0" />
                  <span className="font-sans text-[11px] tracking-[0.1em] uppercase flex-1">{item.label}</span>
                  {active && <span className="h-2 w-2 rounded-full bg-brand-gold ring-2 ring-brand-gold/30 flex-shrink-0" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-3 border-t border-brand-border px-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[8px] text-brand-gray hover:text-brand-gold hover:bg-brand-border/30 transition-all duration-300 cursor-pointer"
            >
              <LogOut size={15} className="flex-shrink-0" />
              <span className="font-sans text-[11px] tracking-[0.1em] uppercase">Sign Out</span>
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 mt-0.5 px-3 py-2.5 rounded-[8px] text-brand-gray/50 hover:text-brand-gold hover:bg-brand-border/30 transition-all duration-300"
            >
              <ChevronRight size={11} />
              <span className="font-sans text-[10px] tracking-[0.1em] uppercase">Back to Site</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-[240px] min-h-screen pt-14 lg:pt-0">
        <main className="pb-8">{children}</main>
      </div>
    </div>
  );
}
