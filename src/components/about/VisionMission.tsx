"use client";

import React from 'react';
import { motion } from 'framer-motion';

export function VisionMission() {
  return (
    <section className="relative w-full bg-brand-surface py-32 md:py-40 px-6 overflow-hidden border-t border-brand-border">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
            Our Purpose
          </span>
          <h2 className="font-display text-text-h2 text-brand-black leading-tight">
            What Drives <span className="text-brand-gold italic">Us</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="p-10 md:p-14 border border-brand-border rounded-[8px] bg-brand-white/50 group hover:border-brand-gold/30 transition-colors duration-500"
          >
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-brand-gold mb-6 block">
              Our Vision
            </span>
            <p className="font-display text-2xl md:text-3xl text-brand-black leading-relaxed">
              To be the most trusted name in premium African art and framing — 
              a brand synonymous with excellence, integrity, and timeless beauty.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="p-10 md:p-14 border border-brand-border rounded-[8px] bg-brand-white/50 group hover:border-brand-gold/30 transition-colors duration-500"
          >
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-brand-gold mb-6 block">
              Our Mission
            </span>
            <p className="font-display text-2xl md:text-3xl text-brand-black leading-relaxed">
              To transform memories into heirloom-quality artworks and provide 
              museum-grade framing that preserves them for generations to come.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
