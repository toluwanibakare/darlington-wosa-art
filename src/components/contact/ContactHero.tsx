"use client";

import React from 'react';
import { motion } from 'framer-motion';

export function ContactHero() {
  return (
    <section className="relative w-full bg-brand-surface min-h-[50vh] md:min-h-[45vh] flex items-center px-6 overflow-hidden pt-40">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,transparent_40%,rgba(0,0,0,0.02)_100%)]" />

      <div className="max-w-[1400px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
            Get in Touch
          </span>
          <h1 className="font-display text-text-h1 text-brand-black leading-tight mb-8">
            Let&apos;s Create Something <br />
            <span className="text-brand-gold italic">Extraordinary</span>
          </h1>
          <p className="font-sans text-brand-gray text-text-body max-w-2xl leading-relaxed">
            Whether you have a clear vision or are exploring possibilities, I am here to help. 
            Tell me about your project, and I will respond within 24 hours with guidance, 
            options, and a custom quote tailored to your needs.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
