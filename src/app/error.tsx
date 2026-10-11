"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-brand-surface flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-4">Something Went Wrong</h1>
        <p className="font-sans text-sm text-brand-gray leading-relaxed mb-10 max-w-sm mx-auto">
          This page could not be loaded. Please try again, or return to the home page.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-4 border border-brand-gold/30 text-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase hover:border-brand-gold transition-all duration-500"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
