"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, Logo } from '@/components/ui';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';

const QUICK_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

const SERVICES_LINKS = [
  { label: 'Custom Portraits', href: '/services#portraits' },
  { label: 'Museum Framing', href: '/services#framing' },
  { label: 'Corporate Art', href: '/services#corporate' },
  { label: 'Restoration', href: '/services#restoration' },
];

export function Footer() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) {
    return (
      <footer className="border-t border-brand-border bg-brand-surface transition-all duration-500 ease-[var(--ease-expo-out)] lg:ml-[280px]" style={{ marginLeft: '0px' }}>
        <div className="px-6 md:px-10 py-6">
          <div className="flex items-center justify-between gap-4 font-sans text-[10px] tracking-[0.15em] uppercase">
            <p className="text-brand-gray/50">
              &copy; {new Date().getFullYear()} Darlington Wosa Art & Frames Ltd.
            </p>
            <a
              href="https://www.tmb.it.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gold/50 hover:text-brand-gold transition-colors duration-300"
            >
              Built by <span className="font-medium">TMB</span>
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative w-full bg-brand-surface border-t border-brand-border">
      {/* Main Footer Content */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-16 pt-32 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-16 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Logo height={80} offsetX={-35} className="opacity-80 hover:opacity-100 transition-opacity duration-300 w-fit mb-4" />
            <p className="font-sans text-sm text-brand-gray max-w-xs leading-relaxed mb-8">
              Premium art, portraiture, and museum-grade framing services 
              based in Rivers State, Nigeria. Est. 2018.
            </p>
            <div className="flex flex-col gap-3 font-sans text-sm">
              <a href="tel:+2348137744824" className="flex items-center gap-2 text-brand-gray hover:text-brand-black transition-colors duration-300 w-fit">
                <Phone size={12} className="text-brand-gold/60" />
                +234 813 774 4824
              </a>
              <a href="https://wa.me/2348137744824" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-gray hover:text-brand-black transition-colors duration-300 w-fit">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="text-brand-gold/60">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                +234 813 774 4824
              </a>
              <a href="mailto:hello@darlingtonwosa.art" className="flex items-center gap-2 text-brand-gray hover:text-brand-black transition-colors duration-300 w-fit">
                <Mail size={12} className="text-brand-gold/60" />
                hello@darlingtonwosa.art
              </a>
              <span className="flex items-center gap-2 text-brand-gray/60">
                <MapPin size={12} className="text-brand-gold/60" />
                Rivers State, Nigeria
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold mb-8">
              Navigate
            </h4>
            <ul className="space-y-5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-brand-gray hover:text-brand-black transition-colors duration-300 flex items-center gap-1 w-fit group"
                  >
                    {link.label}
                    <ArrowUpRight size={10} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold mb-8">
              Services
            </h4>
            <ul className="space-y-5">
              {SERVICES_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-brand-gray hover:text-brand-black transition-colors duration-300 flex items-center gap-1 w-fit group"
                  >
                    {link.label}
                    <ArrowUpRight size={10} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold mb-8">
              Stay Connected
            </h4>
            <p className="font-sans text-sm text-brand-gray mb-6 leading-relaxed">
              Receive updates on new works, exhibitions, and exclusive commission opportunities.
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-transparent border-b border-brand-border pb-2 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
              />
              <Button variant="text" className="text-xs !p-0 !justify-start">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-32 pt-8 border-t border-brand-border flex flex-col md:flex-row items-center justify-between gap-6 font-sans text-xs tracking-wider uppercase">
          <p className="text-brand-gray/60">
            &copy; {new Date().getFullYear()} Darlington Wosa Art & Frames Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://www.instagram.com/darlingtonwosa/" target="_blank" rel="noopener noreferrer" className="text-brand-gray/60 hover:text-brand-black transition-colors duration-300" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@darlingtonwosa" target="_blank" rel="noopener noreferrer" className="text-brand-gray/60 hover:text-brand-black transition-colors duration-300" aria-label="TikTok">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
            <a href="/privacy" className="text-brand-gray/60 hover:text-brand-black transition-colors duration-300">
              Privacy
            </a>
            <a href="/terms" className="text-brand-gray/60 hover:text-brand-black transition-colors duration-300">
              Terms
            </a>
            <span className="text-brand-border hidden md:inline">|</span>
            <a
              href="https://www.tmb.it.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gold/60 hover:text-brand-gold transition-colors duration-300 tracking-[0.15em]"
            >
              Built by <span className="font-medium">TMB</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
