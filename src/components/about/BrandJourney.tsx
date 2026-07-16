"use client";

import React from 'react';
import { motion } from 'framer-motion';

const MILESTONES = [
  {
    year: '2009',
    title: 'The Beginning',
    description: 'After completing secondary school, I began actively developing and refining my artistic skills with daily practice and unwavering dedication.',
  },
  {
    year: '2018',
    title: 'Studio Founded',
    description: 'Darlington Wosa Art & Frames was established in Rivers State, Nigeria, offering premium portraiture and custom framing services.',
  },
  {
    year: '2022',
    title: 'National Recognition',
    description: 'Won a national online art competition, gaining wider recognition for hyper-realistic charcoal portraiture and technical excellence.',
  },
  {
    year: '2024',
    title: '300+ Projects Milestone',
    description: 'Surpassed 300 completed projects including a portrait of the Governor of Akwa Ibom State and a complete collection of all past Vice Chancellors of the University of Port Harcourt.',
  },
  {
    year: '2026',
    title: 'Mentorship & Community',
    description: 'Successfully trained over 30 artists through mentorship programs and launched a thriving Telegram learning community for aspiring artists.',
  },
];

export function BrandJourney() {
  return (
    <section className="relative w-full bg-brand-black py-32 md:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-20"
        >
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
            The Journey
          </span>
          <h2 className="font-display text-text-h2 text-brand-white leading-tight">
            From Primary School Strokes to <br />
            <span className="text-brand-gold italic">National Recognition</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-[1px] bg-brand-white/10 -translate-x-1/2" />

          {MILESTONES.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex flex-col md:flex-row items-start gap-8 md:gap-12 pb-16 md:pb-20 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-2.5 md:left-1/2 top-1 w-[9px] h-[9px] rounded-full bg-brand-gold -translate-x-1/2 z-10 shadow-[0_0_12px_rgba(158,101,27,0.4)]" />

              {/* Content */}
              <div className={`pl-12 md:pl-0 md:w-[calc(50%-3rem)] ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                <span className="font-display text-4xl md:text-5xl text-brand-gold/30 block mb-3">
                  {item.year}
                </span>
                <h3 className="font-display text-xl text-brand-white mb-4">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-brand-gray leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Spacer for the other side */}
              <div className="hidden md:block md:w-[calc(50%-3rem)]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
