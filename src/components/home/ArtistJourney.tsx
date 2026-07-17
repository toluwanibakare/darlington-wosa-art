"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, Parallax } from '@/components/ui';

const easeExpoOut = [0.16, 1, 0.3, 1] as const;

export function ArtistJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={sectionRef} className="relative w-full bg-brand-surface py-24 md:py-32 px-6 overflow-hidden border-t border-brand-black/5">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Images Column */}
        <div className="relative h-[600px] md:h-[800px] w-full flex items-center justify-center">
          
          {/* Main Artist Image */}
          <Parallax speed={0.3} offset={[50, -50]}
            className="absolute left-0 top-10 w-[70%] h-[70%] overflow-hidden border border-brand-border bg-white shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/artist.jpeg" 
              alt="Darlington Wosa - Portrait Artist & Custom Framer" 
              className="w-full h-full object-cover"
            />
          </Parallax>

          {/* Overlapping Hands / Sketching Image */}
          <Parallax speed={0.2} offset={[-30, 80]}
            className="absolute right-0 bottom-10 w-[55%] h-[55%] overflow-hidden border border-brand-border bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/artist.jpeg" 
              alt="Artist at work" 
              className="w-full h-full object-cover filter contrast-125 sepia-[0.2]"
            />
          </Parallax>

        </div>

        {/* Text Column */}
        <div className="flex flex-col justify-center">
          <Reveal
          >
            <span className="text-[11px] tracking-[0.2em] uppercase text-brand-gold font-sans block mb-6">
              The Artist's Journey
            </span>
            <h2 className="font-display text-text-h2 text-brand-black leading-tight mb-8">
              The Hands Behind <br/> The Artwork
            </h2>
          </Reveal>

          <Reveal
            delay={0.2}
            className="space-y-6 text-brand-gray text-text-body"
          >
            <p>
              True luxury lies in the details. As a self-taught portrait artist, custom framer, and art educator, I blend meticulous technical skill with an uncompromising commitment to premium presentation. My journey into fine art began in childhood, evolving through a lifelong dedication to the craft and a deep passion for hyper-realism.
            </p>
            <p>
              Specializing primarily in hyper-realistic charcoal, alongside vibrant work in pastel and acrylic, my studio crafts timeless, priceless masterpieces for high-profile individuals and discerning collectors. These works are designed to honor leadership, celebrate milestones, and gift loved ones with a legacy that transcends generations. Every piece is handled with extreme attention to detail, paired with bespoke luxury framing solutions, and delivered with absolute reliability.
            </p>
            <p>
              Parallel to my studio practice, my mission is rooted in the belief that excellence is a learned discipline. As an active art educator and course creator, I provide the structured mentorship and devotion necessary for aspiring artists to scale up their skills. Driven by an unwavering pursuit of creativity and perfection, I don't just create art — I preserve moments, elevate spaces, and mentor the next generation of creative mastery.
            </p>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold hover:text-brand-gold-light transition-colors duration-300 relative pb-1 group"
              >
                Read More
                <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span className="absolute -bottom-0.5 left-0 right-0 h-[1px] bg-brand-gold/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-[var(--ease-expo-out)]" />
              </Link>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
