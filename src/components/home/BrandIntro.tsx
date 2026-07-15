"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { label: 'Years Experience', value: '6+' },
  { label: 'Projects Completed', value: '450+' },
  { label: 'Happy Clients', value: '300+' },
  { label: 'Corporate Projects', value: '25+' },
];

const CHARCOAL = '#1a1a1a';

export function BrandIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [hasAutoRevealed, setHasAutoRevealed] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      fillOverlay(ctx);
    };

    const fillOverlay = (c: CanvasRenderingContext2D) => {
      c.fillStyle = CHARCOAL;
      c.fillRect(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const getPos = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const scratch = (x: number, y: number) => {
      if (!ctx) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    };

    const onDown = (e: MouseEvent) => {
      isDrawing.current = true;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    };

    const onMove = (e: MouseEvent) => {
      if (!isDrawing.current) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    };

    const onUp = () => {
      isDrawing.current = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const pos = getPos(touch);
      scratch(pos.x, pos.y);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;
      const pos = getPos(touch);
      scratch(pos.x, pos.y);
    };

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup', onUp);
    canvas.addEventListener('mouseleave', onUp);
    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('mouseleave', onUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  useEffect(() => {
    if (hasAutoRevealed || isRevealing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRevealing(true);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let radius = 0;
    const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY) * 1.2;
    let animId: number;

    const reveal = () => {
      radius += 3;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      if (radius < maxRadius) {
        animId = requestAnimationFrame(reveal);
      } else {
        setHasAutoRevealed(true);
        setIsRevealing(false);
      }
    };

    animId = requestAnimationFrame(reveal);

    return () => cancelAnimationFrame(animId);
  }, [hasAutoRevealed, isRevealing]);

  return (
    <section className="relative w-full bg-brand-surface py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />
      
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <h2 className="font-display text-[clamp(1.8rem,4vw,3.2rem)] md:text-[2.8rem] lg:text-[3.5rem] text-brand-black leading-[1.15] tracking-tight mb-8">
              I create custom portraits, fine artworks, and premium framing solutions that preserve memories and transform spaces.
            </h2>
          </motion.div>

          {/* Scratch-to-Reveal Image Column */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative w-full aspect-[4/3] lg:aspect-[3/4] overflow-hidden border border-brand-border bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/artist_image.jpg"
              alt="Darlington Wosa studio portrait"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-crosshair"
              width={400}
              height={300}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <span className="text-[10px] tracking-[0.15em] uppercase text-white/60 bg-black/40 px-4 py-1.5 rounded-full font-sans">
                Scratch to reveal
              </span>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div 
          className="w-full h-[1px] bg-brand-black/10 my-16 md:my-24"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-display text-4xl md:text-5xl lg:text-6xl text-brand-gold mb-4 block">
                {stat.value}
              </span>
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gray/80">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
