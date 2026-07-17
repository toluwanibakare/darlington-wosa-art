"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Reveal, StaggerList, StaggerItem } from '@/components/ui';

const STATS = [
  { label: 'Years Experience', value: '17+' },
  { label: 'Projects Completed', value: '300+' },
  { label: 'Happy Clients', value: '50+' },
  { label: 'Artists Taught', value: '30+' },
];

const CHARCOAL = '#1a1a1a';

export function BrandIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scratchCount = 0;
    let revealAnimId = 0;
    let lastX = 0;
    let lastY = 0;

    const fillOverlay = () => {
      ctx.fillStyle = CHARCOAL;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      if (!revealed) fillOverlay();
    };

    resize();
    window.addEventListener('resize', resize);

    const getPos = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const startReveal = (fromX: number, fromY: number) => {
      if (revealAnimId) return;
      const maxRadius = Math.sqrt(
        Math.max(fromX, canvas.width - fromX) ** 2 +
        Math.max(fromY, canvas.height - fromY) ** 2
      ) * 1.2;
      let radius = 0;

      const animate = () => {
        radius += 6;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(fromX, fromY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';

        if (radius < maxRadius) {
          revealAnimId = requestAnimationFrame(animate);
        } else {
          revealAnimId = 0;
          setRevealed(true);
        }
      };

      revealAnimId = requestAnimationFrame(animate);
    };

    const scratch = (x: number, y: number) => {
      if (revealed) return;
      lastX = x;
      lastY = y;
      scratchCount++;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      if (scratchCount >= 3) {
        startReveal(x, y);
      }
    };

    const onDown = (e: MouseEvent) => {
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    };

    const onMove = (e: MouseEvent) => {
      if (revealed) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    };

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch || revealed) return;
      const pos = getPos(touch);
      scratch(pos.x, pos.y);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch || revealed) return;
      const pos = getPos(touch);
      scratch(pos.x, pos.y);
    };

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(revealAnimId);
    };
  }, [revealed]);

  return (
    <section className="relative w-full bg-brand-surface py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />
      
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <Reveal
            direction="up"
            distance={40}
            className="lg:col-span-7"
          >
            <h2 className="font-display text-[clamp(1.8rem,4vw,3.2rem)] md:text-[2.8rem] lg:text-[3.5rem] text-brand-black leading-[1.15] tracking-tight mb-8">
              I create custom portraits, fine artworks, and premium framing solutions that preserve memories and transform spaces.
            </h2>
          </Reveal>

          <Reveal
            direction="scale"
            distance={5}
            delay={0.2}
            className="lg:col-span-5 relative w-full overflow-hidden border border-brand-border bg-brand-surface shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
            style={{ minHeight: 'clamp(280px, 50vw, 480px)' }}
          >
            <img
              src="/images/artist_image.jpg"
              alt="Darlington Wosa studio portrait"
              className="absolute inset-0 w-full h-full object-contain bg-brand-surface"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-crosshair"
            />
            {!revealed && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <span className="text-[10px] tracking-[0.15em] uppercase text-white/60 bg-black/40 px-4 py-1.5 rounded-full font-sans">
                  Scratch to reveal
                </span>
              </div>
            )}
          </Reveal>
        </div>

        <Reveal
          direction="scale"
          distance={100}
          duration={1.2}
          viewportMargin="0px"
          className="w-full h-[1px] bg-brand-black/10 my-16 md:my-24"
        />

        <StaggerList speed="fast" className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 justify-items-center">
          {STATS.map((stat, i) => (
            <StaggerItem
              key={stat.label}
              className="text-center"
            >
              <span className="font-display text-4xl md:text-5xl lg:text-6xl text-brand-gold mb-3 block">
                {stat.value}
              </span>
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gray/80">
                {stat.label}
              </span>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
