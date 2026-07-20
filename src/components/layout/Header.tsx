"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Logo } from '@/components/ui';
import { User, LayoutDashboard, UserCircle, Gift, LogOut } from 'lucide-react';
import { useUser } from '@/lib/use-user';
import { api } from '@/lib/api';
import { ThemeToggle } from '@/components/providers';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const easeExpoOut = [0.16, 1, 0.3, 1] as const;

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Services', href: '/services' },
    { label: 'Classes', href: '/classes' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Shop', href: '/shop' },
  ] as const;

  const isActiveCheck = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const activePage = navItems.find(item => isActiveCheck(item.href))?.label || '';
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <>
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: easeExpoOut, delay: 0.1 }}
      className={`fixed left-1/2 -translate-x-1/2 z-[200] transition-all duration-500 ease-[var(--ease-expo-out)] ${
        scrolled
          ? 'top-2 sm:top-4 md:top-6 w-[98%] sm:w-[95%] md:w-[1100px]'
          : 'top-0 w-full'
      }`}
    >
      <div 
        onClick={() => { if (mobileMenuOpen) setMobileMenuOpen(false); }}
        className={`pl-0 sm:pl-2 md:pl-10 pr-4 sm:pr-6 md:pr-10 h-16 sm:h-20 flex items-center justify-between transition-all duration-500 ease-[var(--ease-expo-out)] ${
          scrolled && !mobileMenuOpen
            ? 'rounded-full bg-brand-surface/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-brand-border/10' 
            : mobileMenuOpen
            ? 'bg-transparent'
            : 'bg-brand-surface/30 md:bg-brand-surface/5'
        }`}
      >
        {/* Desktop Logo */}
        <div className={`flex-1 flex justify-start ${mobileMenuOpen ? 'max-md:invisible max-md:pointer-events-none' : ''}`}>
          <Link href="/" className="transition-transform duration-300 hover:scale-105 active:scale-95 flex items-center shrink-0">
            <Logo height={44} className="hidden md:block origin-left transition-transform duration-300" />
            <Logo height={40} className="md:hidden origin-left transition-transform duration-300 ml-4" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-10 flex-1 mt-0.5">
          {!isAuthPage && navItems.map((item) => {
            const isActive = isActiveCheck(item.href);
            return (
            <Link
              key={item.label}
              href={item.href}
              className={`font-sans tracking-[0.15em] uppercase font-semibold transition-all duration-300 relative pb-1 ${
                isActive ? 'text-brand-gold' : 'text-brand-black/60 hover:text-brand-black'
              } ${scrolled ? 'text-[10px] sm:text-[11px]' : 'text-[11px] sm:text-xs'}`}
            >
              {item.label}
              {isActive && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-brand-gold rounded-full"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </Link>
            );
          })}
        </nav>

        {/* Mobile Active Page */}
        <span className={`md:hidden flex-1 text-left pl-2 font-sans text-sm sm:text-base tracking-[0.15em] uppercase text-brand-gold font-medium ${mobileMenuOpen ? 'invisible pointer-events-none' : ''}`}>
          {isAuthPage ? (pathname === '/login' ? 'Sign In' : 'Sign Up') : activePage}
        </span>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center justify-end whitespace-nowrap transition-all duration-700 flex-1 gap-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: easeExpoOut }}
            className="flex items-center gap-3"
          >
            <Link
              href="/contact"
              className="flex items-center text-[11px] tracking-[0.15em] uppercase font-sans text-brand-gold hover:text-brand-gold-light transition-all duration-300"
            >
              {!scrolled && (
                <span className="relative flex items-center justify-center h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-40" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold" />
                </span>
              )}
              Get in Touch
            </Link>

            <ThemeToggle />

            <span className="inline-block h-4 w-[1px] bg-brand-border" />

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center h-8 w-8 rounded-full border border-brand-gold/30 hover:border-brand-gold bg-brand-surface hover:shadow-[0_0_15px_rgba(158,101,27,0.2)] transition-all duration-300 cursor-pointer"
                  aria-label="User profile"
                >
                  <User size={14} className="text-brand-black" />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 mt-3 w-48 bg-brand-surface border border-brand-border rounded-[10px] shadow-xl overflow-hidden z-50 py-1.5 font-sans"
                    >
                      <div className="px-4 py-2.5 border-b border-brand-border text-[10px] tracking-[0.15em] text-brand-gray/60 uppercase">
                        {user.name}
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-brand-black hover:bg-brand-gold/5 transition-colors" onClick={() => setDropdownOpen(false)}>
                        <LayoutDashboard size={13} className="text-brand-gold/70" />
                        Dashboard
                      </Link>
                      <Link href="/dashboard/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-brand-black hover:bg-brand-gold/5 transition-colors" onClick={() => setDropdownOpen(false)}>
                        <UserCircle size={13} className="text-brand-gold/70" />
                        Profile
                      </Link>
                      <Link href="/dashboard/referrals" className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-brand-black hover:bg-brand-gold/5 transition-colors" onClick={() => setDropdownOpen(false)}>
                        <Gift size={13} className="text-brand-gold/70" />
                        Referrals
                      </Link>
                      <button onClick={async () => { await api.post('/logout', {}); logout(); setDropdownOpen(false); router.push('/'); }} className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs text-brand-gray hover:text-brand-gold hover:bg-brand-gold/5 transition-colors cursor-pointer border-t border-brand-border/50 mt-1 pt-2.5">
                        <LogOut size={13} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : isAuthPage ? (
              <Link
                href={pathname === '/login' ? '/signup' : '/login'}
                className="px-6 py-2.5 rounded-full bg-brand-black text-brand-white font-sans text-[11px] tracking-[0.15em] uppercase hover:bg-brand-black/90 transition-all duration-300"
              >
                {pathname === '/login' ? 'Sign Up' : 'Sign In'}
              </Link>
            ) : (
              <Link href="/login" className="text-[11px] tracking-[0.15em] uppercase font-sans text-brand-gray hover:text-brand-black transition-colors">
                Sign In
              </Link>
            )}
          </motion.div>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); }}
          className="md:hidden text-brand-black p-1 cursor-pointer hover:text-brand-black/70 transition-colors relative z-[200]"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          ) : (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )}
        </button>
      </div>
    </motion.header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); }}
              className="md:hidden fixed inset-0 bg-black/40 z-[150]"
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
               className="md:hidden fixed top-0 right-0 bottom-0 w-[75vw] sm:w-[280px] z-[150] bg-brand-surface border-l border-brand-border px-6 sm:px-8 overflow-y-auto"
               onClick={(e) => e.stopPropagation()}>
               <div className="flex flex-col gap-1 pt-20">
                {[...navItems, { label: 'Contact', href: '/contact' }].map((item) => {
                  const active = isActiveCheck(item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-sans text-sm tracking-[0.15em] uppercase py-3 px-4 rounded-[8px] transition-all duration-300 flex items-center justify-between ${
                        active
                          ? 'bg-brand-black text-brand-white'
                          : 'text-brand-black/70 hover:text-brand-black hover:bg-brand-border/30'
                      }`}
                    >
                      {item.label}
                      {active && (
                        <span className="h-2.5 w-2.5 rounded-full bg-brand-gold ring-2 ring-brand-gold/30" />
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-brand-border space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-brand-gray font-sans">Appearance</span>
                  <ThemeToggle />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-brand-border space-y-3">
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center px-6 py-3 rounded-full border border-brand-gold/30 text-brand-gold font-sans text-xs tracking-[0.15em] uppercase hover:bg-brand-gold/5 hover:border-brand-gold transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center px-6 py-3 rounded-full bg-brand-black text-brand-white font-sans text-xs tracking-[0.15em] uppercase hover:bg-brand-black/90 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-6 py-3 rounded-full bg-brand-black text-brand-white font-sans text-xs tracking-[0.15em] uppercase hover:bg-brand-black/90 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
