"use client";

import React from 'react';
import { Button, Reveal } from '@/components/ui';
import { ArrowRight, Clock } from 'lucide-react';

export function PromoBanner() {
  return (
    <section className="relative w-full bg-brand-black py-24 md:py-28 px-6 overflow-hidden border-t border-brand-white/5">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-gold/[0.03] blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <Reveal direction="left"
          >
            <div className="flex items-center gap-2 mb-6">
              <Clock size={14} className="text-brand-gold-light" />
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-gold-light">
                Limited Offer
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-white leading-tight mb-6">
              Free Consultation on <br />
              <span className="text-brand-gold-light italic">Your First Commission</span>
            </h2>
            <p className="font-sans text-brand-gray text-sm md:text-base max-w-lg leading-relaxed mb-8">
              Not sure which medium or size is right for your space? Book a complimentary 
              consultation and we will guide you through every option - from paper selection 
              to framing style - with zero obligation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary">
                Claim Your Free Session
                <ArrowRight size={14} className="ml-2 inline-block" />
              </Button>
              <Button variant="secondary" className="!border-brand-white/20 !text-brand-white hover:!border-brand-white/50">
                Learn More
              </Button>
            </div>
          </Reveal>

          {/* Right - Stats/Trust signals */}
          <Reveal direction="right" delay={0.15}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { stat: '450+', label: 'Projects Delivered' },
              { stat: '300+', label: 'Happy Clients' },
              { stat: '6+', label: 'Years Experience' },
              { stat: '3', label: 'ISO Certifications' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-6 md:p-8 border border-brand-white/5 rounded-[8px] bg-brand-white/[0.02] text-center"
              >
                <p className="font-display text-3xl md:text-4xl text-brand-gold-light mb-2">
                  {item.stat}
                </p>
                <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70">
                  {item.label}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
