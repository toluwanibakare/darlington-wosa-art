"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ─────────────────────────────────────────────
   Artwork images for the marquee — sourced from
   the studio's own portfolio.
   ───────────────────────────────────────────── */

const ARTWORK_IMAGES = [
  { src: '/images/projects/IMG_5028.JPG', alt: 'Charcoal portrait study' },
  { src: '/images/projects/IMG_5030.JPG', alt: 'Graphite realism drawing' },
  { src: '/images/projects/IMG_5032.JPG', alt: 'Commission portrait piece' },
  { src: '/images/projects/IMG_5033.JPG', alt: 'Fine art pencil work' },
  { src: '/images/projects/IMG_5035.JPG', alt: 'Portraiture in progress' },
  { src: '/images/projects/IMG_5036.JPG', alt: 'Artist portfolio piece' },
  { src: '/images/projects/IMG_5037.JPG', alt: 'Studio artwork collection' },
];

/* ─────────────────────────────────────────────
   Hero Component
   
   - Brand name on one line
   - Concave arc marquee: edges are higher & 
     bigger, center dips down & smaller — like 
     a ruler bent inward
   - No hover pause, no zoom, sharp corners
   ───────────────────────────────────────────── */

export function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Continuously update each panel's Y offset + scale based on
  // its horizontal distance from viewport center (concave arc)
  const updateArc = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const viewportCenter = window.innerWidth / 2;
    const maxDist = window.innerWidth / 2;
    const panels = track.querySelectorAll<HTMLElement>('[data-panel]');

    panels.forEach((panel) => {
      const rect = panel.getBoundingClientRect();
      const panelCenter = rect.left + rect.width / 2;

      // Normalize distance from center: 0 = center, 1 = edge
      const dist = Math.abs(panelCenter - viewportCenter) / maxDist;
      const clampedDist = Math.min(dist, 1.2);

      // Concave arc: center dips DOWN, edges rise UP
      // Parabolic: y = amplitude * (dist² - 1) → center = -amplitude, edges = 0
      const yOffset = 50 * (clampedDist * clampedDist - 1); // center: -50px, edges: ~0px

      // Scale: edges bigger (1.05), center smaller (0.88)
      const scale = 0.88 + clampedDist * 0.17;

      panel.style.transform = `translateY(${yOffset}px) scale(${scale})`;
    });

    rafRef.current = requestAnimationFrame(updateArc);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(updateArc);
    return () => cancelAnimationFrame(rafRef.current);
  }, [updateArc]);

  const { scrollY } = useScroll();
  const yMarquee = useTransform(scrollY, [0, 1000], [0, 100]);
  const yText = useTransform(scrollY, [0, 600], [0, -100]);
  const opacityText = useTransform(scrollY, [0, 400], [1, 0]);

  const darlingtonText = "Darlington";
  const wosaText = "Wosa";
  const artText = "Art";

  const [animationState, setAnimationState] = useState("visible");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const runAnimationLoop = () => {
      if (animationState === "visible") {
        // Keep text visible for 8.0 seconds for comfortable reading
        timeoutId = setTimeout(() => {
          setAnimationState("hidden");
        }, 8000);
      } else {
        // Keep text erased for 1.8 seconds, then rewrite
        timeoutId = setTimeout(() => {
          setAnimationState("visible");
        }, 1800);
      }
    };

    runAnimationLoop();

    return () => clearTimeout(timeoutId);
  }, [animationState]);

  const containerVariants = {
    hidden: {
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1, // Erases backward (from Art to Darlington)
      }
    },
    visible: {
      transition: {
        staggerChildren: 0.045, // Snappy pen speed
        delayChildren: 0.15,
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      rotate: -12,
      scale: 0.65,
      y: 12,
      skewX: -15,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    visible: { 
      opacity: 1, 
      rotate: 0,
      scale: 1,
      y: 0,
      skewX: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 14
      }
    }
  } as const;

  return (
    <section className="relative min-h-screen bg-brand-surface w-full flex flex-col items-center justify-center overflow-hidden pt-28">

      {/* Background Charcoal Art Drawing */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.28] filter contrast-130 brightness-110 saturate-50"
        style={{
          backgroundImage: 'url("/charcoal_hero_bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          transform: 'scaleX(1.12)', // Stretches the width by 12%
          transformOrigin: 'center center',
        }}
      />

      {/* Canvas grain texture */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20"
        style={{ backgroundImage: 'var(--bg-noise)' }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.03)_100%)]" />

      {/* ── Brand Name ── */}
      <motion.div 
        className="relative z-10 text-center mb-8 md:mb-12 px-4"
        style={{ y: yText, opacity: opacityText }}
      >
        <motion.h1
          className="leading-[0.85] select-none py-4"
          style={{ 
            fontFamily: "var(--font-signature)", 
            fontSize: 'clamp(4.5rem, 11vw, 8.5rem)',
            fontWeight: 'normal'
          }}
          variants={containerVariants}
          initial="hidden"
          animate={animationState}
        >
          {/* Darlington (Black) */}
          {Array.from(darlingtonText).map((char, i) => (
            <motion.span
              key={`c-d-${i}`}
              variants={letterVariants}
              className="inline-block origin-bottom-left text-brand-black"
              style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
            >
              {char}
            </motion.span>
          ))}

          {/* Space */}
          <span className="inline-block">&nbsp;</span>

          {/* Wosa (Gold) */}
          {Array.from(wosaText).map((char, i) => (
            <motion.span
              key={`c-w-${i}`}
              variants={letterVariants}
              className="inline-block origin-bottom-left text-brand-gold"
              style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
            >
              {char}
            </motion.span>
          ))}

          <br className="md:hidden" />
          {/* Space on desktop */}
          <span className="hidden md:inline-block">&nbsp;</span>

          {/* Art (Black) */}
          {Array.from(artText).map((char, i) => (
            <motion.span
              key={`c-a-${i}`}
              variants={letterVariants}
              className="inline-block origin-bottom-left text-brand-black"
              style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
      </motion.div>

      {/* ── Concave Arc Marquee ── */}
      <motion.div 
        className="relative z-10 w-screen overflow-hidden py-6 md:py-10"
        style={{ y: yMarquee }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-brand-surface to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-brand-surface to-transparent z-20 pointer-events-none" />

        {/* Scrolling track — no flex gap, spacing baked into each panel */}
        <div
          ref={trackRef}
          className="flex w-max animate-marquee-fast items-center"
        >
          {/* Two identical sets — translateX(-50%) resets seamlessly */}
          {[...ARTWORK_IMAGES, ...ARTWORK_IMAGES].map((img, i) => (
            <div
              key={`p-${i}`}
              data-panel
              className="flex-shrink-0 will-change-transform transition-transform duration-100 ease-linear px-2.5 md:px-3"
            >
              <div className="w-[180px] h-[240px] md:w-[200px] md:h-[260px] lg:w-[220px] lg:h-[280px] overflow-hidden border border-brand-border shadow-[0_12px_40px_rgba(0,0,0,0.15)] bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  loading="eager"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Tagline ── */}
      <motion.div 
        className="relative z-10 text-center mt-6 md:mt-10 px-6 max-w-xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
      >
        <p className="text-brand-gray text-[12px] md:text-[13px] tracking-[0.08em] leading-relaxed uppercase">
          I specialize in the art of pencil sketching, charcoal portraiture,
          and museum-grade framing. I create timeless pieces that
          captivate and inspire.
        </p>
      </motion.div>

      {/* ── Bottom Bar ── */}
      <motion.div 
        className="relative z-10 w-full max-w-[1800px] mx-auto px-6 md:px-16 mt-auto pb-8 pt-12 flex items-end justify-between text-[11px] tracking-[0.2em] uppercase text-brand-gray/50 font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      >
        <span>Rivers State, Nigeria</span>
        <div className="flex flex-col items-center gap-1">
          <span className="text-brand-gray/40 tracking-[0.5em] text-[10px]">· · · · · · ·</span>
        </div>
        <span className="tabular-nums">Est. 2018</span>
      </motion.div>
    </section>
  );
}
