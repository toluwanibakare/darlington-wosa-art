"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Reveal, Parallax } from '@/components/ui';

export function FounderIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yImage1 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const yImage2 = useTransform(scrollYProgress, [0, 1], [-20, 40]);

  return (
    <section ref={sectionRef} className="relative w-full bg-brand-surface py-32 md:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Images */}
          <div className="relative h-[500px] md:h-[650px] w-full">
          <Parallax speed={0.3} offset={[30, -30]}
            className="absolute left-0 top-0 w-[70%] h-[75%] overflow-hidden border border-brand-border bg-white shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
          >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/artist_image.jpg" alt="Darlington in studio" className="w-full h-full object-cover filter contrast-110 saturate-50" />
            </Parallax>
          <Parallax speed={0.2} offset={[-20, 40]}
            className="absolute right-0 bottom-0 w-[55%] h-[60%] overflow-hidden border border-brand-border bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-10"
          >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/artist_image.jpg" alt="Darlington in studio" className="w-full h-full object-cover filter contrast-125 sepia-[0.15]" />
            </Parallax>
          </div>

          {/* Content */}
          <div>
          <Reveal
          >
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
                The Founder
              </span>
              <h1 className="font-display text-text-h1 text-brand-black leading-tight mb-8">
                Darlington <br />
                <span className="text-brand-gold italic">Wosa</span>
              </h1>
            </Reveal>

          <Reveal
            delay={0.15}
            className="space-y-5 text-brand-gray text-text-body"
          >
              <p>
                My journey into art began in primary school, where I first discovered the joy of creating with my hands. After completing secondary school in 2009, I made a conscious decision to develop my skills intentionally, practicing daily and pushing the boundaries of what I could achieve with charcoal and pencil. What started as a childhood passion grew into a lifelong commitment to the craft.
              </p>
              <p>
                Today, I have completed over 300 art projects, including creating charcoal portraits of all the past Vice Chancellors of the University of Port Harcourt from inception to 2015, painting a portrait of the current Governor of Akwa Ibom State, and producing artworks for many other prominent individuals. My studio specializes in hyper-realistic charcoal, alongside work in pastel and acrylic, and I serve over 50 clients ranging from individuals to institutions and notable personalities.
              </p>
              <p>
                Parallel to my studio practice, my mission is rooted in the belief that excellence is a learned discipline. As an active art educator and course creator, I provide the structured mentorship and devotion necessary for aspiring artists to scale up their skills. Driven by an unwavering pursuit of creativity and perfection, I don't just create art — I preserve moments, elevate spaces, and mentor the next generation of creative mastery.
              </p>
            </Reveal>

          <Reveal
            delay={0.3}
            distance={20}
            duration={1}
            viewportMargin="0px"
            className="mt-10 pl-6 border-l-2 border-brand-gold/40"
          >
              <Quote size={20} className="text-brand-gold/40 mb-3" />
              <p className="font-display text-lg md:text-xl text-brand-black italic leading-relaxed">
                &ldquo;Practice makes it easier, while making you better.&rdquo;
              </p>
              <p className="font-sans text-sm text-brand-gray mt-3 tracking-wider uppercase">
                — Darlington Wosa
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
