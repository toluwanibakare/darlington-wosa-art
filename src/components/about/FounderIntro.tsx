"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Quote } from 'lucide-react';

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
            <motion.div
              className="absolute left-0 top-0 w-[70%] h-[75%] overflow-hidden border border-brand-border bg-white shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
              style={{ y: yImage1 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/artist_image.jpg" alt="Darlington in studio" className="w-full h-full object-cover filter contrast-110 saturate-50" />
            </motion.div>
            <motion.div
              className="absolute right-0 bottom-0 w-[55%] h-[60%] overflow-hidden border border-brand-border bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-10"
              style={{ y: yImage2 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/projects/IMG_5032.JPG" alt="Charcoal artwork detail" className="w-full h-full object-cover filter contrast-125 sepia-[0.15]" />
            </motion.div>
          </div>

          {/* Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
                The Founder
              </span>
              <h1 className="font-display text-text-h1 text-brand-black leading-tight mb-8">
                Darlington <br />
                <span className="text-brand-gold italic">Wosa</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5 text-brand-gray text-text-body"
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 pl-6 border-l-2 border-brand-gold/40"
            >
              <Quote size={20} className="text-brand-gold/40 mb-3" />
              <p className="font-display text-lg md:text-xl text-brand-black italic leading-relaxed">
                &ldquo;Art is not what you see, but what you make others see. Every stroke tells a story.&rdquo;
              </p>
              <p className="font-sans text-sm text-brand-gray mt-3 tracking-wider uppercase">
                — Darlington Wosa
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
