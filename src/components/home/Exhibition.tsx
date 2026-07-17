"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, Reveal } from '@/components/ui';

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "The Visionary",
    category: "Charcoal Portrait",
    description: "A highly detailed charcoal portrait capturing intense emotion and depth.",
    imageUrl: '/images/projects/393a2db0-c36d-4f6a-8dfd-0ded87b3743d.JPG'
  },
  {
    id: 2,
    title: "Corporate Excellence",
    category: "Pencil Sketch",
    description: "A refined pencil sketch commissioned for a corporate boardroom.",
    imageUrl: '/images/projects/601b5547-6a1e-41fd-a757-8fae98b6d6c1.jpg'
  },
  {
    id: 3,
    title: "Eternal Bond",
    category: "Mixed Media",
    description: "A beautiful fusion of graphite and gold leaf detailing.",
    imageUrl: '/images/projects/ff27c515-de9c-4644-bc7f-96584864a96b.JPG'
  },
  {
    id: 4,
    title: "The Thinker",
    category: "Charcoal & Ink",
    description: "Deep shadows and sharp ink lines create a striking contrast.",
    imageUrl: '/images/projects/IMG_5029.JPG'
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
          <Reveal>
            <p className="text-brand-gold uppercase tracking-widest text-sm font-sans">
              The Exhibition
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-text-h2 text-brand-black leading-tight">
              Featured Masterpieces
            </h2>
          </Reveal>
        </div>
        
        <Reveal direction="right" delay={0.2}
        >
          <button className="text-brand-black border-b border-brand-gold pb-1 font-sans text-sm hover:text-brand-gold transition-colors duration-[400ms] cursor-pointer">
            View Complete Gallery
          </button>
        </Reveal>
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
