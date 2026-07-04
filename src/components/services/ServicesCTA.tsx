"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

export function ServicesCTA() {
  return (
    <section className="relative w-full bg-brand-black py-32 md:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="max-w-[900px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
            Not Sure Where to Start?
          </span>
          <h2 className="font-display text-text-h2 text-brand-white leading-tight mb-8">
            Let&apos;s Find the Perfect Service <br />
            <span className="text-brand-gold italic">For Your Vision</span>
          </h2>
          <p className="font-sans text-brand-gray text-text-body max-w-xl mx-auto mb-12 leading-relaxed">
            Every project begins with a conversation. Tell me about what you have in mind, 
            and I will guide you toward the service, medium, and approach that brings your 
            vision to life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary">
              Book a Free Consultation
              <ArrowRight size={14} className="ml-2 inline-block" />
            </Button>
            <Button variant="secondary" className="!border-brand-white/20 !text-brand-white hover:!border-brand-white/50">
              View Portfolio
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
