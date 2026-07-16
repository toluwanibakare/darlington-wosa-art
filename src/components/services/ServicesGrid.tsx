"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { 
  Pen, 
  Pencil, 
  Brush, 
  Frame, 
  Building2, 
  LayoutDashboard, 
  Palette,
  Camera,
  ArrowRight,
  Check
} from 'lucide-react';

const SERVICES_LIST = [
  {
    icon: Pen,
    title: 'Charcoal Portraits',
    tagline: 'Deep, expressive, and strikingly realistic.',
    description: 'Charcoal allows me to capture the deepest shadows and the softest highlights. Each portrait is built layer by layer, creating a luminous depth that photographs simply cannot replicate. Ideal for dramatic, high-contrast pieces that command attention.',
    suited: ['Gift portraits', 'Memorial tributes', 'Statement wall pieces', 'Art collectors'],
    price: 'Starts at ₦150,000',
  },
  {
    icon: Pencil,
    title: 'Pencil Drawings',
    tagline: 'Precision and elegance in every line.',
    description: 'Fine graphite work demands patience and a steady hand. I use a range of graphite grades — from delicate 2H to deep 8B — to render textures, skin tones, and expressions with museum-quality precision. Perfect for timeless, heirloom portraits.',
    suited: ['Family portraits', 'Professional headshots', 'Commissioned gifts', 'Editorial work'],
    price: 'Starts at ₦120,000',
  },
  {
    icon: Brush,
    title: 'Custom Artwork',
    tagline: 'Your vision, my hands, one-of-a-kind results.',
    description: 'Not every idea fits into a box. Whether you want a mixed-media piece, a large-format abstract, or something entirely unconventional, I collaborate with you from concept to completion to create a bespoke artwork that is uniquely yours.',
    suited: ['Mixed media projects', 'Large-format works', 'Themed collections', 'Experimental art'],
    price: 'Varies by project',
  },
  {
    icon: Frame,
    title: 'Framing Services',
    tagline: 'Museum-grade protection. Gallery-worthy presentation.',
    description: 'A great frame does not just surround art — it elevates it. I handcraft every frame using premium woods, acid-free conservation matting, and anti-reflective museum glass. Your artwork is preserved exactly as it was created, for generations.',
    suited: ['Fine art framing', 'Photography mounting', 'Canvas stretching', 'Conservation framing'],
    price: 'Starts at ₦80,000',
  },
  {
    icon: Building2,
    title: 'Corporate Art Solutions',
    tagline: 'Brand storytelling through visual art.',
    description: 'Your workspace should reflect your brand identity. I work with businesses to create custom portraiture, branded artwork, and curated collections that communicate professionalism, warmth, and vision. From CEO portraits to full reception installations.',
    suited: ['Boardroom portraiture', 'Reception features', 'Brand narrative art', 'Executive gifts'],
    price: 'Project-based pricing',
  },
  {
    icon: LayoutDashboard,
    title: 'Interior Art Installations',
    tagline: 'Complete spaces, curated stories.',
    description: 'Art has the power to transform a room. I provide end-to-end art consulting and installation for interior designers, architects, and homeowners — selecting or creating pieces that harmonize with your space, lighting, and design language.',
    suited: ['Residential projects', 'Hotel & hospitality', 'Office environments', 'Gallery walls'],
    price: 'Project-based pricing',
  },
  {
    icon: Palette,
    title: 'Custom Design Projects',
    tagline: 'Beyond the frame — creative collaborations.',
    description: 'Have a creative project that defies categorization? I take on selected custom design collaborations — from book illustrations and album art to product design and branded content — bringing an artist\'s sensibility to every medium.',
    suited: ['Book illustration', 'Album & branding art', 'Product design', 'Creative direction'],
    price: 'Varies by project',
  },
  {
    icon: Camera,
    title: 'Creative Events & Workshops',
    tagline: 'Live art experiences that inspire and connect.',
    description: 'From live portrait sessions at corporate events to hands-on art workshops for teams and communities, I bring the creative process directly to your audience. Guests watch portraits come to life in real time, or pick up a pencil and create alongside me. Every event is a memorable, interactive experience.',
    suited: ['Corporate galas & launches', 'Team-building workshops', 'Private parties & receptions', 'Art exhibitions & pop-ups'],
    price: 'Starts at ₦250,000',
  },
];

export function ServicesGrid() {
  return (
    <section className="relative w-full bg-brand-surface py-24 md:py-32 px-6 overflow-hidden border-t border-brand-border">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="max-w-[1400px] mx-auto">
        <div className="space-y-32 md:space-y-40">
          {SERVICES_LIST.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start ${
                i % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Icon & Title Column */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full border border-brand-gold/30 bg-brand-white flex items-center justify-center flex-shrink-0">
                    <service.icon size={24} className="text-brand-gold" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl text-brand-black">
                      {service.title}
                    </h2>
                    <p className="font-sans text-sm text-brand-gold italic mt-1">
                      {service.tagline}
                    </p>
                  </div>
                </div>

                {/* Price Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-brand-gold/20 rounded-full bg-brand-gold/[0.03] font-sans text-xs tracking-wide text-brand-gold">
                  {service.price}
                </div>
              </div>

              {/* Description Column */}
              <div className="lg:col-span-3">
                <p className="font-sans text-brand-gray text-text-body leading-relaxed mb-8">
                  {service.description}
                </p>

                <div className="mb-10">
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-gray/60 mb-4">
                    Best suited for
                  </p>
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    {service.suited.map((item) => (
                      <span key={item} className="flex items-center gap-2 font-sans text-sm text-brand-black">
                        <Check size={12} className="text-brand-gold/70 flex-shrink-0" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <Button variant="secondary" className="text-xs">
                  Inquire About This Service
                  <ArrowRight size={12} className="ml-2 inline-block" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
