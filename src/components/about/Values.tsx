"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Gem, Shield, Heart, Leaf, Award, Users } from 'lucide-react';

const VALUES = [
  {
    icon: Gem,
    title: 'Excellence',
    description: 'We never compromise on quality. Every stroke, every cut, every frame must meet the highest standard before it leaves our studio.',
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'Honest communication, fair pricing, and transparent processes. Our word is our bond, and our reputation is everything.',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'We pour our hearts into every project. This is not just a business — it is a calling, and every artwork is a labour of love.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'We source materials responsibly, minimize waste, and use conservation-grade techniques that protect both art and the environment.',
  },
  {
    icon: Award,
    title: 'Craftsmanship',
    description: 'Centuries-old techniques meet modern precision. Our artisans are masters of their craft, trained in both tradition and innovation.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We believe in uplifting local talent and contributing to the cultural fabric of Nigeria through mentorship and creative partnerships.',
  },
];

export function Values() {
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
            Our Values
          </span>
          <h2 className="font-display text-text-h2 text-brand-black leading-tight">
            The Principles That <br />
            <span className="text-brand-gold italic">Guide Us</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {VALUES.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div className="w-12 h-12 rounded-full border border-brand-gold/30 bg-brand-white flex items-center justify-center mb-6 group-hover:border-brand-gold/70 transition-colors duration-500">
                <value.icon size={20} className="text-brand-gold" />
              </div>
              <h3 className="font-display text-xl text-brand-black mb-4">
                {value.title}
              </h3>
              <p className="font-sans text-sm text-brand-gray leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
