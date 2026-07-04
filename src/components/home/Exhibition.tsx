"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card } from '@/components/ui';

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "The Visionary",
    category: "Charcoal Portrait",
    description: "A highly detailed charcoal portrait capturing intense emotion and depth.",
    imageUrl: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Corporate Excellence",
    category: "Pencil Sketch",
    description: "A refined pencil sketch commissioned for a corporate boardroom.",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Eternal Bond",
    category: "Mixed Media",
    description: "A beautiful fusion of graphite and gold leaf detailing.",
    imageUrl: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "The Thinker",
    category: "Charcoal & Ink",
    description: "Deep shadows and sharp ink lines create a striking contrast.",
    imageUrl: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=800&q=80"
  }
];

export function Exhibition() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const easeExpoOut = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="relative w-full py-40 bg-brand-surface overflow-hidden border-t border-brand-border">
      
      {/* Header */}
      <div className="max-w-[1800px] mx-auto w-full px-8 md:px-16 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div ref={ref} className="space-y-4">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, ease: easeExpoOut }}
            className="text-brand-gold uppercase tracking-widest text-sm font-sans"
          >
            The Exhibition
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, ease: easeExpoOut, delay: 0.1 }}
            className="font-display text-text-h2 text-brand-black leading-tight"
          >
            Featured Masterpieces
          </motion.h2>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 1, ease: easeExpoOut, delay: 0.2 }}
        >
          <button className="text-brand-black border-b border-brand-gold pb-1 font-sans text-sm hover:text-brand-gold transition-colors duration-[400ms] cursor-pointer">
            View Complete Gallery
          </button>
        </motion.div>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="w-full relative px-8 md:px-16">
        {/* CSS hiding scrollbar but retaining scroll function */}
        <style dangerouslySetInnerHTML={{__html: `
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />
        
        <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-12 no-scrollbar">
          {PORTFOLIO_ITEMS.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: easeExpoOut, delay: 0.2 + (index * 0.1) }}
              className="min-w-[85vw] md:min-w-[400px] lg:min-w-[450px] snap-center shrink-0"
            >
              <Card 
                title={item.title}
                category={item.category}
                description={item.description}
                imageUrl={item.imageUrl}
              />
            </motion.div>
          ))}
          {/* Spacer at the end for scroll padding */}
          <div className="min-w-[8vw] md:min-w-[16px] shrink-0" />
        </div>
      </div>
      
    </section>
  );
}
