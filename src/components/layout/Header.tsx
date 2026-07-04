"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Logo } from '@/components/ui';
import { User } from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const easeExpoOut = [0.16, 1, 0.3, 1] as const;

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: easeExpoOut, delay: 0.1 }}
      className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-[var(--ease-expo-out)] ${
        scrolled
          ? 'top-4 md:top-6 w-[95%] md:w-[960px]'
          : 'top-6 md:top-8 w-[95%] md:w-[1200px]'
      }`}
    >
      <div 
        className="relative px-6 md:px-10 h-20 flex items-center justify-between rounded-full overflow-hidden transition-all duration-700"
        style={{
          boxShadow: scrolled ? '0 12px 40px rgba(0,0,0,0.06)' : '0 0px 0px rgba(0,0,0,0)',
          border: scrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(0,0,0,0)',
        }}
      >
        {/* Dedicated Blur Layer to prevent Safari/Chrome glitches */}
        <div 
          className="absolute inset-0 -z-10 transition-all duration-700 pointer-events-none"
          style={{
            backgroundColor: scrolled ? 'rgba(245,242,235,0.7)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
          }}
        />

        {/* Logo */}
        <Link href="/" className="transition-transform duration-300 hover:scale-105 active:scale-95 flex items-center">
          <Logo height={80} className="scale-[0.75] md:scale-100 origin-left transition-transform duration-300" />
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Portfolio', href: '/portfolio' },
            { label: 'Services', href: '/services' },
          ].map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: easeExpoOut }}
              >
                <Link
                  href={item.href}
                  className={`font-sans text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 relative pb-1 ${
                    isActive 
                      ? 'text-brand-black' 
                      : 'text-brand-gray hover:text-brand-black'
                  }`}
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
              </motion.div>
            );
          })}
        </nav>

        {/* Actions (CTA & Auth) */}
        <div className={`flex items-center whitespace-nowrap transition-all duration-700 ${scrolled ? 'gap-1.5' : 'gap-2 sm:gap-6'}`}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: easeExpoOut }}
            className={`flex items-center transition-all duration-700 ${scrolled ? 'gap-1.5' : 'gap-1.5 sm:gap-6'}`}
          >
            <Link
              href="/contact"
              className={`flex items-center text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] uppercase font-sans text-brand-gold hover:text-brand-gold-light transition-all duration-300 ${scrolled ? 'hidden sm:flex' : ''}`}
            >
              <span className={`relative h-1.5 w-1.5 sm:h-2 sm:w-2 mr-2 transition-all duration-300 ${scrolled ? 'hidden' : 'hidden sm:flex'}`}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-40" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-brand-gold" />
              </span>
              <span>Get in Touch</span>
            </Link>

            <span className="h-4 w-[1px] bg-brand-border" />

            {/* Interactive Auth State */}
            {isSignedIn ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center h-8 w-8 rounded-full border border-brand-gold/30 hover:border-brand-gold bg-brand-surface hover:shadow-[0_0_15px_rgba(158,101,27,0.2)] transition-all duration-300 cursor-pointer"
                  aria-label="User profile"
                >
                  <User size={14} className="text-brand-black" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-44 sm:w-48 bg-brand-surface border border-brand-border rounded-lg shadow-xl overflow-hidden z-50 py-1 font-sans">
                    <div className="px-4 py-2 border-b border-brand-border text-[10px] sm:text-[11px] tracking-wide text-brand-gray uppercase">
                      Client Portal
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-brand-black hover:bg-brand-border/30 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Submissions
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-brand-black hover:bg-brand-border/30 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => {
                        setIsSignedIn(false);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-brand-gold hover:bg-brand-border/30 transition-colors cursor-pointer border-t border-brand-border/50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsSignedIn(true)}
                className="text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] uppercase font-sans text-brand-gray hover:text-brand-black transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}
          </motion.div>

          {/* Hamburger Menu Icon (Tablet & Mobile only) */}
          <button
            className="md:hidden text-brand-black/70 p-2 cursor-pointer hover:text-brand-black transition-colors"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
