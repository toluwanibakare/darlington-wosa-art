"use client";

import React from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform, AnimatePresence } from 'framer-motion';

export function ScrollToTop() {
  const [visible, setVisible] = React.useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 600);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = useTransform(scrollYProgress, [0, 1], [circumference, 0]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-24 right-8 z-50 w-14 h-14 rounded-full bg-white/40 backdrop-blur-lg border border-white/20 hover:border-brand-gold/50 shadow-lg hover:shadow-[0_0_30px_rgba(158,101,27,0.2)] flex items-center justify-center cursor-pointer group transition-all duration-500"
          aria-label="Scroll to top"
        >
          {/* Progress Ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 48 48"
            fill="none"
          >
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-brand-border/50"
            />
            <motion.circle
              cx="24"
              cy="24"
              r={radius}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-brand-gold"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
              }}
            />
          </svg>

          {/* Arrow Icon */}
          <motion.svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative text-brand-gray group-hover:text-brand-gold transition-colors duration-500"
            animate={visible ? { y: [0, -3, 0] } : { y: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </motion.svg>

          {/* Label on hover */}
          <span className="absolute -top-7 right-1/2 translate-x-1/2 font-sans text-[9px] tracking-[0.15em] uppercase text-brand-gold/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 whitespace-nowrap">
            Back to Top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
