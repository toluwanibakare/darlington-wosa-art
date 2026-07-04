"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function ServicesHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={ref} className="relative w-full bg-brand-surface min-h-[70vh] md:min-h-[60vh] flex items-center px-6 overflow-hidden pt-40">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,transparent_40%,rgba(0,0,0,0.02)_100%)]" />

      <motion.div style={{ y }} className="max-w-[1400px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
            What I Do
          </span>
          <h1 className="font-display text-text-h1 text-brand-black leading-tight mb-8">
            Art Services <br />
            <span className="text-brand-gold italic">Crafted for You</span>
          </h1>
          <p className="font-sans text-brand-gray text-text-body max-w-2xl leading-relaxed">
            From the first stroke of charcoal to the final installation of a framed masterpiece, 
            every service is delivered with uncompromising quality and an artist&apos;s eye for detail. 
            Whether you need a single portrait or a complete corporate art solution, I bring the 
            same dedication to every project.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
