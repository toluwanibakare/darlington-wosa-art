"use client";

import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  {
    step: '01',
    title: 'Consultation',
    description: 'We discuss your vision, preferred medium, size, and timeline. I guide you through options and help refine your idea into a clear creative brief.',
  },
  {
    step: '02',
    title: 'Commission & Reference',
    description: 'You confirm the project and provide reference materials. I prepare a detailed quote with all specifications and estimated completion date.',
  },
  {
    step: '03',
    title: 'Creation Process',
    description: 'I craft your piece with meticulous attention, sharing progress updates and photos at key stages to ensure complete satisfaction.',
  },
  {
    step: '04',
    title: 'Delivery & Installation',
    description: 'Your finished artwork is professionally packed, delivered, and installed — whether it be a single portrait or a multi-piece corporate installation.',
  },
];

export function CommissionProcess() {
  return (
    <section className="relative w-full bg-brand-surface py-32 md:py-40 px-6 overflow-hidden border-t border-brand-border">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-20"
        >
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
            How It Works
          </span>
          <h2 className="font-display text-text-h2 text-brand-black leading-tight mb-6">
            From Vision to <br />
            <span className="text-brand-gold italic">Masterpiece</span>
          </h2>
          <p className="font-sans text-brand-gray text-text-body max-w-xl">
            Commissioning a custom artwork is a collaborative journey. 
            Here is how we bring your vision to life, step by step.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative z-10">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-sans text-sm font-medium text-brand-gold/70 tabular-nums">
                    {step.step}
                  </span>
                  <h3 className="font-display text-xl text-brand-black">
                    {step.title}
                  </h3>
                </div>
                <p className="font-sans text-sm text-brand-gray leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
