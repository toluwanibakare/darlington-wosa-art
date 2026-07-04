"use client";

import React from 'react';

/* ─────────────────────────────────────────────
   Charcoal Dust — Realistic Grain Effect
   
   Uses an SVG fractal noise filter to create a 
   hyper-realistic "powdery charcoal" texture that 
   jitters subtly like analog film grain.
   ───────────────────────────────────────────── */

export function CharcoalDust() {
  return (
    <div
      className="fixed inset-0 z-[1] pointer-events-none opacity-[0.08] mix-blend-multiply overflow-hidden"
      aria-hidden="true"
    >
      <div 
        className="absolute -inset-[100%] w-[300%] h-[300%]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          animation: 'noise-jitter 0.6s infinite steps(2)',
        }}
      />
    </div>
  );
}
