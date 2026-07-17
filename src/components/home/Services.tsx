"use client";

import React from 'react';
import {
  Palette,
  Frame,
  Building2,
  Camera,
  ArrowRight
} from 'lucide-react';
import { Button, Reveal, StaggerList, StaggerItem } from '@/components/ui';

const SERVICES = [
  {
    icon: Palette,
    title: 'Custom Portraiture',
    description: 'Hand-drawn pencil, charcoal, and mixed-media portraits that capture the essence of your subject with striking realism.',
    features: ['Pencil Sketching', 'Charcoal Portraiture', 'Mixed Media', 'Pet Portraits'],
  },
  {
    icon: Frame,
    title: 'Museum-Grade Framing',
    description: 'Premium handcrafted framing using anti-reflective museum glass, acid-free matting, and sustainably sourced woods.',
    features: ['Custom Frame Design', 'Museum Glass', 'Conservation Matting', 'Canvas Stretching'],
  },
  {
    icon: Building2,
    title: 'Corporate Art Solutions',
    description: 'Full-service art consulting and installation for offices, hotels, and commercial spaces seeking distinctive visual identities.',
    features: ['Boardroom Portraits', 'Lobby Installations', 'Brand Storytelling', 'Art Consulting'],
  },
  {
    icon: Camera,
    title: 'Creative Events & Workshops',
    description: 'Live art performances, hands-on sketching workshops, and curated creative experiences for private events, corporate gatherings, and brand activations.',
    features: ['Live Art Performances', 'Sketching Workshops', 'Event Branding', 'Private Parties'],
  },
];

export function Services() {
  return (
    <section className="relative w-full bg-brand-surface py-32 md:py-40 px-6 overflow-hidden border-t border-brand-border">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="max-w-[1400px] mx-auto">
        <Reveal className="max-w-3xl mb-20"
        >
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
            What I Offer
          </span>
          <h2 className="font-display text-text-h2 text-brand-black leading-tight mb-6">
            Premium Art Services <br />
            <span className="text-brand-gold italic">Crafted for You</span>
          </h2>
          <p className="font-sans text-brand-gray text-text-body max-w-xl">
            From a single charcoal sketch to a full corporate art installation, 
            every service is delivered with the same obsessive attention to detail 
            that defines my work.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {SERVICES.map((service, i) => (
            <Reveal
              key={service.title}
              delay={i * 0.1}
              duration={0.8}
              viewportMargin="-50px"
              className="group"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full border border-brand-border bg-brand-white flex items-center justify-center group-hover:border-brand-gold/50 transition-colors duration-500">
                  <service.icon size={20} className="text-brand-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl text-brand-black mb-3">
                    {service.title}
                  </h3>
                  <p className="font-sans text-brand-gray text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 font-sans text-xs text-brand-gray/70">
                        <span className="w-1 h-1 rounded-full bg-brand-gold/60" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              </Reveal>
            ))}
          </div>

        <Reveal
          delay={0.3}
          viewportMargin="0px"
          className="mt-16 text-center"
        >
          <Button variant="secondary">
            View All Services
            <ArrowRight size={14} className="ml-2 inline-block" />
          </Button>
        </Reveal>

        <Reveal
          delay={0.4}
          viewportMargin="0px"
          className="mt-20 pt-16 border-t border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <p className="font-sans text-brand-gray text-sm">
              Not sure which service fits your vision?
            </p>
            <p className="font-display text-lg text-brand-black mt-1">
              Let&apos;s talk about your project.
            </p>
          </div>
          <Button variant="secondary">
            Book a Consultation
            <ArrowRight size={14} className="ml-2 inline-block" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
