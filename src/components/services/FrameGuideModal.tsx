"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface FrameGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export function FrameGuideModal({ open, onClose }: FrameGuideModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 z-10 text-brand-white/70 hover:text-brand-white transition-colors cursor-pointer"
              aria-label="Close frame guide"
            >
              <X size={24} />
            </button>

            <div className="relative w-full h-full overflow-auto rounded-[8px] bg-brand-surface shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/frame_guide.jpg"
                alt="Frame size guide showing available dimensions for museum-grade framing"
                className="w-full h-auto object-contain"
                style={{ maxHeight: '85vh' }}
              />
            </div>

            <p className="text-brand-white/60 text-[10px] tracking-[0.15em] uppercase font-sans mt-3 text-center">
              Frame size guide, available dimensions and pricing
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
