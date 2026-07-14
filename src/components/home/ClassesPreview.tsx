"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GraduationCap, BookOpen, ArrowRight, Users, Clock } from 'lucide-react';

export function ClassesPreview() {
  return (
    <section className="relative w-full bg-brand-surface py-24 md:py-32 px-6 overflow-hidden border-t border-brand-border">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_right,transparent_40%,rgba(0,0,0,0.02)_100%)]" />

      <div className="max-w-[1400px] mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-16"
        >
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
            Art Education
          </span>
          <h2 className="font-display text-text-h2 text-brand-black leading-tight mb-6">
            Learn from{' '}
            <span className="text-brand-gold italic">a Master</span>
          </h2>
          <p className="font-sans text-brand-gray text-text-body max-w-2xl leading-relaxed">
            Whether you prefer live mentorship or self-paced study, choose the path that fits your journey.
          </p>
        </motion.div>

        {/* Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Live Classes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group"
          >
            <div className="p-10 md:p-12 border border-brand-border rounded-[12px] bg-brand-white/50 hover:border-brand-gold/30 hover:shadow-[0_0_40px_rgba(158,101,27,0.06)] transition-all duration-500 h-full flex flex-col">
              <div className="w-14 h-14 rounded-full border border-brand-gold/30 bg-brand-white flex items-center justify-center mb-8 group-hover:border-brand-gold/70 transition-colors duration-500">
                <GraduationCap size={24} className="text-brand-gold" />
              </div>

              <h3 className="font-display text-2xl md:text-3xl text-brand-black mb-4">
                Live Classes
              </h3>
              <p className="font-sans text-brand-gray text-sm leading-relaxed mb-8 flex-1">
                Hands-on mentorship with Darlington himself. Choose from single sessions, 
                monthly packages, workshops, group experiences, or private one-on-one coaching — 
                online or at the studio in Rivers State.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-brand-gray/60">
                  <Clock size={14} />
                  <span className="font-sans text-xs">Flexible scheduling</span>
                </div>
                <div className="flex items-center gap-3 text-brand-gray/60">
                  <Users size={14} />
                  <span className="font-sans text-xs">1-on-1 or small groups</span>
                </div>
              </div>

              <Link
                href="/classes"
                className="flex items-center justify-center gap-3 w-full py-3.5 border border-brand-black/20 hover:border-brand-black rounded-[8px] font-sans text-[10px] tracking-[0.2em] uppercase text-brand-black hover:bg-brand-black hover:text-brand-white transition-all duration-500"
              >
                Browse Classes
                <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>

          {/* E-Book Courses */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group"
          >
            <div className="p-10 md:p-12 border border-brand-border rounded-[12px] bg-brand-white/50 hover:border-brand-gold/30 hover:shadow-[0_0_40px_rgba(158,101,27,0.06)] transition-all duration-500 h-full flex flex-col">
              <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center mb-8">
                <BookOpen size={24} className="text-brand-gold" />
              </div>

              <h3 className="font-display text-2xl md:text-3xl text-brand-black mb-4">
                E-Book Courses
              </h3>
              <p className="font-sans text-brand-gray text-sm leading-relaxed mb-8 flex-1">
                Downloadable guides and reference materials covering hyper-realism, charcoal 
                mastery, drawing fundamentals, and portrait anatomy. Study at your own pace 
                with step-by-step tutorials and exclusive content.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-brand-gray/60">
                  <BookOpen size={14} />
                  <span className="font-sans text-xs">85–150 pages each</span>
                </div>
                <div className="flex items-center gap-3 text-brand-gray/60">
                  <Users size={14} />
                  <span className="font-sans text-xs">Self-paced learning</span>
                </div>
              </div>

              <Link
                href="/classes"
                className="flex items-center justify-center gap-3 w-full py-3.5 bg-brand-black text-brand-white border border-brand-gold rounded-[8px] font-sans text-[10px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)]"
              >
                View E-Books
                <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
