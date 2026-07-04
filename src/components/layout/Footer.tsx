import React from 'react';
import Link from 'next/link';
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
          <div className="flex items-center gap-8">
            <a href="#" className="text-brand-gray/60 hover:text-brand-black transition-colors duration-300">
              Instagram
            </a>
            <a href="#" className="text-brand-gray/60 hover:text-brand-black transition-colors duration-300">
              Privacy
            </a>
            <a href="#" className="text-brand-gray/60 hover:text-brand-black transition-colors duration-300">
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
