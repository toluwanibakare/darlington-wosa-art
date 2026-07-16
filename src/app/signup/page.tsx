import React from 'react';
import Link from 'next/link';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-brand-surface flex flex-col">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-[520px]">
          <div className="mb-12 text-center">
            <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-3">
              Create Your Account
            </h1>
            <p className="font-sans text-sm text-brand-gray">
              Join Darlington Wosa Art & Frames and start your creative journey.
            </p>
          </div>

          <div className="mb-6">
            <Link
              href="/?demo=1"
              className="group relative w-full overflow-hidden flex items-center justify-center gap-3 px-6 py-3.5 rounded-full border border-brand-gold/30 text-brand-gold font-sans text-[11px] tracking-[0.2em] uppercase hover:border-brand-gold hover:bg-brand-gold/5 transition-all duration-500"
            >
              <span className="relative z-10 flex items-center gap-2">
                Try Demo Account
              </span>
            </Link>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-brand-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-brand-surface px-4 font-sans text-[10px] tracking-[0.15em] text-brand-gray/50">or</span>
            </div>
          </div>

          <div className="p-8 md:p-12 border border-brand-border rounded-[8px] bg-brand-white/50">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
