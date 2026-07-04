"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const IMG_ARTIST = "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80";
const IMG_HANDS = "https://images.unsplash.com/photo-1596548438137-d426f15e986a?auto=format&fit=crop&w=600&q=80";

export function ArtistJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax for the images
  const yArtistImg = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yHandsImg = useTransform(scrollYProgress, [0, 1], [-30, 80]);

  return (
    <section ref={sectionRef} className="relative w-full bg-brand-surface py-24 md:py-32 px-6 overflow-hidden border-t border-brand-black/5">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Images Column */}
        <div className="relative h-[600px] md:h-[800px] w-full flex items-center justify-center">
          
          {/* Main Artist / Studio Image */}
          <motion.div 
            className="absolute left-0 top-10 w-[70%] h-[70%] overflow-hidden border border-brand-border bg-white shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
            style={{ y: yArtistImg }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={IMG_ARTIST} 
              alt="Darlington in the studio" 
              className="w-full h-full object-cover filter contrast-110 saturate-50"
            />
          </motion.div>

          {/* Overlapping Hands / Sketching Image */}
          <motion.div 
            className="absolute right-0 bottom-10 w-[55%] h-[55%] overflow-hidden border border-brand-border bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-10"
            style={{ y: yHandsImg }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={IMG_HANDS} 
              alt="Hands sketching with charcoal" 
              className="w-full h-full object-cover filter contrast-125 sepia-[0.2]"
            />
          </motion.div>

        </div>

        {/* Text Column */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[11px] tracking-[0.2em] uppercase text-brand-gold font-sans block mb-6">
              The Artist's Journey
            </span>
            <h2 className="font-display text-text-h2 text-brand-black leading-tight mb-8">
              The Hands Behind <br/> The Artwork
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 text-brand-gray text-text-body"
          >
            <p>
              I believe that art is more than just pigment on paper—it is the distillation of a moment, a memory, or an emotion. 
              My journey began with a simple piece of charcoal and a relentless desire to capture the depth of the human spirit.
            </p>
            <p>
              Today, from my studio in Rivers State, I meticulously craft each portrait and frame entirely by hand. 
              Whether it’s a high-contrast pencil sketch or a towering corporate commission, I pour the same level of obsessive dedication into every piece.
            </p>
            
            <div className="pt-8">
              <Button variant="secondary">Read Full Story</Button>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
