import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-surface flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-gold/[0.02] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-brand-gold/[0.03] blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        <div className="mb-8">
          <span className="font-display text-[180px] md:text-[220px] leading-none text-brand-black/5 select-none">
            404
          </span>
        </div>

        <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-4 -mt-16">
          Page Not Found
        </h1>

        <p className="font-sans text-sm text-brand-gray leading-relaxed mb-10 max-w-sm mx-auto">
          The page you are looking for does not exist, has been moved, or is no longer available. Every missing stroke finds its place elsewhere.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="relative overflow-hidden px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] group"
          >
            <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
            <span className="relative z-10 group-hover:text-brand-black transition-colors duration-[400ms]">
              Return Home
            </span>
          </Link>

          <Link
            href="/contact"
            className="px-8 py-4 border border-brand-gold/30 text-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase hover:bg-brand-gold/5 hover:border-brand-gold transition-all duration-500"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
