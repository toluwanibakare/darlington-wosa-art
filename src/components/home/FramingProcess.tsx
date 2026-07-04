"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui';

export function FramingProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  // Custom expo-out easing from our Animation Bible
  const easeExpoOut = [0.16, 1, 0.3, 1] as const;

  const frameVariants = {
    hidden: (direction: 'top' | 'bottom' | 'left' | 'right') => {
      switch (direction) {
        case 'top': return { y: -150, opacity: 0 };
        case 'bottom': return { y: 150, opacity: 0 };
        case 'left': return { x: -150, opacity: 0 };
        case 'right': return { x: 150, opacity: 0 };
      }
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { duration: 1.2, ease: easeExpoOut, delay: 0.1 }
    }
  };

  return (
    <section className="relative w-full py-40 bg-brand-surface overflow-hidden flex flex-col items-center justify-center border-t border-brand-border">
      <div className="max-w-6xl w-full px-8 flex flex-col lg:flex-row items-center justify-between gap-20">
        
        {/* Left Text Column */}
        <div className="flex-1 space-y-8 z-20">
          <h2 className="font-display text-text-h2 text-brand-black leading-tight">
            Museum-Grade <br/>
            <span className="text-brand-gold italic">Framing</span>
          </h2>
          <p className="text-brand-gray text-text-body max-w-lg">
            Every masterpiece deserves a stage. I meticulously cut, assemble, and finish my frames by hand using premium woods and anti-reflective museum glass to preserve your art for generations.
          </p>
          <div className="pt-4">
            <Button variant="secondary">Explore Frames</Button>
          </div>
        </div>

        {/* Right Animation Canvas */}
        <div ref={ref} className="flex-1 relative w-full aspect-square flex items-center justify-center [perspective:1200px]">
          
          <motion.div 
            initial={{ scale: 1.15, rotateY: -20, rotateX: 10 }}
            animate={isInView ? { scale: 1, rotateY: -10, rotateX: 5 } : { scale: 1.15, rotateY: -20, rotateX: 10 }}
            transition={{ duration: 1.5, ease: easeExpoOut }}
            className="relative w-64 h-[340px] bg-brand-surface flex items-center justify-center [transform-style:preserve-3d] shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
          >
            {/* Inner Art Canvas */}
            <div className="w-[90%] h-[92%] bg-brand-white shadow-[inset_0_4px_20px_rgba(0,0,0,0.05)] border border-brand-border" />

            {/* Frame Pieces attached directly to the canvas edges */}
            <motion.div
              custom="top"
              variants={frameVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="absolute -top-4 -left-4 -right-4 h-4 bg-gradient-to-b from-[#8B5A19] to-[#9E651B] shadow-[0_4px_10px_rgba(0,0,0,0.2)] z-20"
            />
            <motion.div
              custom="bottom"
              variants={frameVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="absolute -bottom-4 -left-4 -right-4 h-4 bg-gradient-to-t from-[#5A3810] to-[#8B5A19] shadow-[0_-4px_10px_rgba(0,0,0,0.2)] z-20"
            />
            <motion.div
              custom="left"
              variants={frameVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="absolute -top-4 -bottom-4 -left-4 w-4 bg-gradient-to-r from-[#7A4D15] to-[#9E651B] shadow-[4px_0_10px_rgba(0,0,0,0.2)] z-20"
            />
            <motion.div
              custom="right"
              variants={frameVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="absolute -top-4 -bottom-4 -right-4 w-4 bg-gradient-to-l from-[#5A3810] to-[#8B5A19] shadow-[-4px_0_10px_rgba(0,0,0,0.2)] z-20"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
