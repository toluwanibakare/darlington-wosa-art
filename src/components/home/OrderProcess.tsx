"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui';

export function OrderProcess() {
  return (
    <section className="relative w-full bg-brand-surface py-24 md:py-32 px-6 overflow-hidden border-t border-brand-border">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="max-w-[1400px] mx-auto text-center">
        <Reveal>
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
            How It Works
          </span>
          <h2 className="font-display text-text-h2 text-brand-black leading-tight mb-6">
            From Vision to <br />
            <span className="text-brand-gold italic">Masterpiece</span>
          </h2>
          <p className="font-sans text-brand-gray text-text-body max-w-xl mx-auto mb-10">
            Ordering a custom artwork is a collaborative journey. Consultation, creation, and delivery every step of the way.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 border border-brand-black/20 hover:border-brand-black rounded-[8px] font-sans text-[10px] tracking-[0.2em] uppercase text-brand-black hover:bg-brand-black hover:text-brand-white transition-all duration-500"
          >
            See the Full Process
            <ArrowRight size={14} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
