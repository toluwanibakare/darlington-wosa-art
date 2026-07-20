"use client";

import React from 'react';
import { Reveal } from '@/components/ui';

export function ShopHero() {
  return (
    <section className="relative w-full min-h-[50vh] flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'var(--bg-noise)' }} />
      <div className="max-w-[1400px] mx-auto w-full">
        <Reveal className="text-center max-w-3xl mx-auto">
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
            Gallery Shop
          </span>
          <h1 className="font-display text-text-hero text-brand-black leading-tight mb-6">
            Artworks for <br />
            <span className="text-brand-gold italic">Sale</span>
          </h1>
          <p className="font-sans text-brand-gray text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Browse original pieces available for purchase. Make an offer on negotiable works or add to cart for direct purchase.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
