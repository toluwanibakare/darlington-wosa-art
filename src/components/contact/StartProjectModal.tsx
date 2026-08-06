"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Frame, Calendar, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StartProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function StartProjectModal({ open, onClose }: StartProjectModalProps) {
  const router = useRouter();

  const handleSelect = (tab: string) => {
    onClose();
    router.push(`/contact?tab=${tab}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-lg bg-brand-surface border border-brand-border rounded-[12px] p-6 md:p-8 overflow-hidden shadow-2xl z-10 text-brand-black"
          >
            {/* Canvas Noise */}
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

            <div className="relative z-10">
              <button
                onClick={onClose}
                className="absolute -top-2 -right-2 p-2 text-brand-gray hover:text-brand-black transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="text-center mb-8">
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-gold block mb-2">
                  Start a Project
                </span>
                <h3 className="font-display text-2xl text-brand-black">What would you like to create?</h3>
                <p className="font-sans text-xs text-brand-gray mt-1">Select an option to customize your request flow</p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    id: 'drawing',
                    title: 'Buy a Painting / Get Drawing',
                    description: 'Commission a custom hand-drawn pencil portrait or charcoal artwork.',
                    icon: Palette,
                  },
                  {
                    id: 'frame',
                    title: 'Select a Frame',
                    description: 'Get custom museum-grade framing sizing and quotes.',
                    icon: Frame,
                  },
                  {
                    id: 'event',
                    title: 'Book an Event',
                    description: 'Book Darlington Wosa Art for private events, workshops, or exhibitions.',
                    icon: Calendar,
                  },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className="w-full flex items-start gap-4 p-4 border border-brand-border hover:border-brand-gold/40 hover:bg-brand-white/40 rounded-[8px] transition-all duration-300 text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/20 transition-colors">
                      <option.icon size={18} className="text-brand-gold" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display text-sm text-brand-black flex items-center gap-1.5">
                        {option.title}
                        <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </h4>
                      <p className="font-sans text-xs text-brand-gray mt-1 leading-relaxed">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
