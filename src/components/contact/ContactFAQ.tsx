"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '@/components/ui';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: 'How long does a typical portrait commission take?',
    a: 'A standard portrait (single subject, charcoal or pencil) typically takes 2–4 weeks from reference approval to completion. Larger or more complex pieces, corporate projects, and mixed-media works may take 4–8 weeks. We agree on a timeline before any work begins.',
  },
  {
    q: 'What do I need to provide as a reference?',
    a: 'High-resolution photographs with clear lighting and good contrast work best. I can work with multiple reference photos to compose the perfect image. For portraits, I recommend photos where the subject is well-lit and looking directly or slightly angled toward the camera.',
  },
  {
    q: 'Do you offer international shipping?',
    a: 'Yes, I ship artwork worldwide. Each piece is carefully packed using archival-grade materials to ensure it arrives in pristine condition. International shipping typically takes 5–14 business days depending on the destination. Shipping costs are calculated at checkout.',
  },
  {
    q: 'What is museum-grade framing, and why does it matter?',
    a: 'Museum-grade framing uses conservation-level materials - acid-free matting, UV-protective glass, and archival mounting techniques - to prevent fading, discoloration, and deterioration over time. It is the gold standard for preserving valuable artwork and is recommended for any piece intended to last generations.',
  },
  {
    q: 'Can I see progress updates during the creation process?',
    a: 'Absolutely. I provide photo updates at key milestones - after the initial sketch, mid-way through shading, and before final detailing. This ensures you are involved and satisfied at every stage. Revisions are welcome during these check-ins.',
  },
  {
    q: 'What is your revision policy?',
    a: 'I include up to two revision rounds during the creation process at no extra cost. Major changes after the piece is completed may incur additional charges. I always ensure you are happy before the final piece is sealed, signed, and delivered.',
  },
  {
    q: 'How do I care for my charcoal or pencil artwork?',
    a: 'Keep your artwork out of direct sunlight and away from humidity. If framed (which I highly recommend), clean the glass with a dry microfiber cloth. Charcoal and graphite works should never be touched directly - the oils from your skin can damage the surface over time.',
  },
  {
    q: 'Do you offer corporate discounts for bulk commissions?',
    a: 'Yes. For corporate clients commissioning multiple portraits, office-wide installations, or ongoing art programs, I offer discounted project-based pricing. Please reach out through the inquiry form with details about your project scope.',
  },
];

type FAQItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-brand-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left cursor-pointer group"
      >
        <span className="font-display text-lg text-brand-black pr-8 group-hover:text-brand-gold transition-colors duration-300">
          {question}
        </span>
        <span className="flex-shrink-0 w-8 h-8 rounded-full border border-brand-border flex items-center justify-center group-hover:border-brand-gold/50 transition-colors duration-300">
          {isOpen ? (
            <Minus size={12} className="text-brand-gold" />
          ) : (
            <Plus size={12} className="text-brand-gray group-hover:text-brand-gold transition-colors duration-300" />
          )}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="font-sans text-sm text-brand-gray leading-relaxed pb-6 max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="relative w-full bg-brand-surface py-32 md:py-40 px-6 overflow-hidden border-t border-brand-border">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="max-w-[900px] mx-auto">
        <Reveal className="mb-16"
        >
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
            FAQs
          </span>
          <h2 className="font-display text-text-h2 text-brand-black leading-tight">
            Commonly Asked <br />
            <span className="text-brand-gold italic">Questions</span>
          </h2>
        </Reveal>

        <Reveal
          distance={20}
          duration={0.8}
          viewportMargin="0px"
        >
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
