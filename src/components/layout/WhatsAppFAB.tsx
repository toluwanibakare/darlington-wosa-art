"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function WhatsAppFAB() {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappNumber = '2348137744824';
  const defaultMessage = encodeURIComponent('Hello Darlington Wosa Art, I would like to make an enquiry.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:flex items-center gap-2 bg-brand-black/90 backdrop-blur-md text-brand-surface px-3.5 py-2 rounded-full border border-brand-gold/30 shadow-xl text-xs font-sans tracking-wide"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Chat with us on WhatsApp
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp (+234 813 774 4824)"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative group flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white rounded-full shadow-2xl hover:shadow-emerald-500/25 border border-white/20 transition-all duration-300"
      >
        {/* Pulse animation ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none group-hover:opacity-0 transition-opacity" />

        {/* Official WhatsApp SVG Icon */}
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 fill-current drop-shadow-sm transition-transform duration-300 group-hover:rotate-6"
          aria-hidden="true"
        >
          <path d="M16 2A13 13 0 0 0 4.68 21.31L3 27.5a1 1 0 0 0 1.22 1.22l6.19-1.68A13 13 0 1 0 16 2zm0 24a11 11 0 0 1-5.6-1.53 1 1 0 0 0-.74-.11l-4.14 1.13 1.13-4.14a1 1 0 0 0-.11-.74A11 11 0 1 1 16 26zm6.34-8.24c-.35-.18-2.07-1.02-2.39-1.14s-.55-.18-.78.18-.9 1.14-1.1 1.37-.4.26-.75.09a9.46 9.46 0 0 1-2.78-1.72 10.42 10.42 0 0 1-1.92-2.39c-.2-.35-.02-.54.15-.71.16-.16.35-.41.53-.61s.24-.35.35-.58a.72.72 0 0 0 0-.69c-.09-.18-.78-1.88-1.07-2.58s-.57-.59-.78-.6h-.67a1.3 1.3 0 0 0-.94.44A3.94 3.94 0 0 0 9.8 11.2a6.85 6.85 0 0 0 1.44 3.63A15.68 15.68 0 0 0 17.3 20c2.51 1.08 3.02.87 3.57.81a3 3 0 0 0 2-1.42 2.47 2.47 0 0 0 .17-1.42c-.07-.12-.26-.19-.6-.37z" />
        </svg>
      </motion.a>
    </div>
  );
}
