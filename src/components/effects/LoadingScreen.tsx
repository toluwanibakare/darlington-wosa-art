"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/ui';

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reveal done at 2.2s for a premium presentation
    const t = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] bg-brand-surface flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-10%', filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Canvas grain texture */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
            style={{ backgroundImage: 'var(--bg-noise)' }}
          />

          <div className="relative flex items-center justify-center">
            {/* Gold Paint Drop */}
            <motion.div
              className="absolute w-3 h-3 bg-brand-gold rounded-full blur-[1px]"
              initial={{ y: -150, opacity: 0, scaleY: 1.5 }}
              animate={{ 
                y: [ -150, 0, 0 ], 
                opacity: [ 0, 1, 0 ],
                scaleY: [ 1.5, 0.5, 2 ],
                scaleX: [ 0.8, 1.5, 3 ],
              }}
              transition={{ 
                duration: 0.7, 
                ease: "easeOut",
                times: [0, 0.7, 1]
              }}
            />

            {/* Logo Reveal */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.2, filter: 'blur(20px)' }}
              animate={{ 
                opacity: [0, 0.2, 1],
                scale: [0.2, 0.85, 1.05],
                filter: ['blur(20px)', 'blur(15px)', 'blur(0px)'],
              }}
              transition={{ 
                duration: 1.3, 
                ease: [0.16, 1, 0.3, 1],
                times: [0, 0.65, 1],
                delay: 0.25
              }}
            >
              <Logo height={96} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
