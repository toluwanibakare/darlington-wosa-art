"use client";

import React from 'react';
import { Reveal } from '@/components/ui';

export function PortfolioHero() {
  return (
    <section className="relative w-full bg-brand-surface min-h-[60vh] md:min-h-[50vh] flex items-center px-6 overflow-hidden pt-40">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,transparent_40%,rgba(0,0,0,0.02)_100%)]" />

      <div className="max-w-[1400px] mx-auto w-full">
        <Reveal viewportOnce={false} className="max-w-4xl"
        >
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
            Portfolio
          </span>
          <h1 className="font-display text-text-h1 text-brand-black leading-tight mb-8">
            A Collection of <br />
            <span className="text-brand-gold italic">Masterpieces</span>
          </h1>
          <p className="font-sans text-brand-gray text-text-body max-w-2xl leading-relaxed">
            Explore a curated selection of works spanning charcoal portraiture, pencil drawings, 
            mixed-media creations, museum-grade framing, and corporate art installations. 
            Each piece represents a story, a collaboration, and an uncompromising commitment to craft.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
