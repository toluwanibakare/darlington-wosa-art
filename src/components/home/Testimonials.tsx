"use client";

import React from 'react';
import { Quote } from 'lucide-react';
import { Reveal, StaggerList, StaggerItem } from '@/components/ui';

const TESTIMONIALS = [
  {
    quote: "Darlington transformed a simple family photograph into a breathtaking charcoal portrait that left us speechless. The level of detail in the eyes and expression is nothing short of remarkable.",
    author: "Chioma A.",
    role: "Private Collector, Lagos",
  },
  {
    quote: "We commissioned a series of corporate portraits for our boardroom and the results exceeded every expectation. Professional, timely, and genuinely world-class artistry.",
    author: "Emeka O.",
    role: "CEO, Crestview Holdings",
  },
  {
    quote: "The framing work on my vintage art collection is flawless. Museum-grade quality delivered with the care and precision of a true master of the craft.",
    author: "Folake B.",
    role: "Interior Designer, Abuja",
  },
  {
    quote: "I commissioned a wedding portrait as a gift and the recipient was moved to tears. Darlington captured the joy and intimacy of the day in a way a photograph never could.",
    author: "Tunde M.",
    role: "Architect, Port Harcourt",
  },
];

export function Testimonials() {
  return (
    <section className="relative w-full bg-brand-black py-32 md:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="max-w-[1400px] mx-auto">
        <Reveal className="max-w-3xl mb-20"
        >
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold-light block mb-6">
            Testimonials
          </span>
          <h2 className="font-display text-text-h2 text-brand-white leading-tight">
            What Clients <br />
            <span className="text-brand-gold-light italic">Say</span>
          </h2>
        </Reveal>

        <StaggerList className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((item, i) => (
            <StaggerItem
              key={i}
              className="relative p-8 md:p-10 border border-brand-white/5 rounded-[8px] bg-brand-white/[0.02] hover:bg-brand-white/[0.04] transition-colors duration-500"
            >
              <Quote size={24} className="text-brand-gold/30 mb-6" />
              <blockquote className="font-sans text-brand-white/80 text-sm md:text-base leading-relaxed mb-8">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center">
                  <span className="font-sans text-sm font-medium text-brand-gold-light">
                    {item.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-sans text-sm text-brand-white font-medium">
                    {item.author}
                  </p>
                  <p className="font-sans text-xs text-brand-gray">
                    {item.role}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
