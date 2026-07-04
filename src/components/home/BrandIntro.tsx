"use client";

import React from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { label: 'Years Experience', value: '6+' },
  { label: 'Projects Completed', value: '450+' },
  { label: 'Happy Clients', value: '300+' },
  { label: 'Corporate Projects', value: '25+' },
];

export function BrandIntro() {
  return (
    <section className="relative w-full bg-brand-surface py-24 md:py-32 px-6 overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />
      
      <div className="max-w-[1200px] mx-auto">
        
        {/* Main Statement */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h2 className="font-display text-text-h2 md:text-[3.5rem] lg:text-[4.5rem] text-brand-black leading-[1.1] tracking-tight mb-8">
            I create custom portraits, fine artworks, and premium framing solutions that preserve memories and transform spaces.
          </h2>
        </motion.div>

        {/* Divider */}
        <motion.div 
          className="w-full h-[1px] bg-brand-black/10 my-16 md:my-24"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              <span className="font-display text-4xl md:text-5xl lg:text-6xl text-brand-gold mb-4">
                {stat.value}
              </span>
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gray/80">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
