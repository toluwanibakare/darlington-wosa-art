"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui';

export function ClassesPreview() {
  return (
    <section className="relative w-full bg-brand-surface py-20 md:py-28 px-6 overflow-hidden border-t border-brand-border">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="max-w-[1400px] mx-auto text-center">
        <Reveal>
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
            Art Education
          </span>
          <h2 className="font-display text-text-h2 text-brand-black leading-tight mb-6">
            Learn from{' '}
            <span className="text-brand-gold italic">a Master</span>
          </h2>
          <p className="font-sans text-brand-gray text-text-body max-w-2xl mx-auto mb-10">
            Live mentorship or self-paced study. Choose the path that fits your journey.
          </p>
          <Link
            href="/classes"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[8px] font-sans text-[10px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)]"
          >
            Browse All Classes
            <ArrowRight size={14} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
