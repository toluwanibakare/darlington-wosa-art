"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui';
import { Loader2, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-[480px]">
          <div className="mb-12 text-center">
            <Link href="/" className="inline-block mb-8">
              <Logo height={48} />
            </Link>
            <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-3">
              {isVerified ? 'Email Verified' : 'Verify Your Email'}
            </h1>
            <p className="font-sans text-sm text-brand-gray">
              {isVerified
                ? 'Your email has been verified successfully.'
                : 'Please verify your email address to access your account.'
              }
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 md:p-12 border border-brand-border rounded-[8px] bg-brand-white/50 text-center"
          >
            {isVerified ? (
              <div>
                <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-8">
                  <Check size={28} className="text-brand-gold" />
                </div>
                <p className="font-sans text-sm text-brand-gray mb-8 leading-relaxed">
                  Your account is now active. You can proceed to sign in and start exploring.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] group"
                >
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
                    Sign In
                    <ArrowRight size={14} />
                  </span>
                </Link>
              </div>
            ) : (
              <div>
                <p className="font-sans text-sm text-brand-gray mb-8 leading-relaxed">
                  We sent a verification link to{' '}
                  <span className="text-brand-black">your@email.com</span>.
                  Click the link in the email to verify your account.
                </p>

                <button
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="relative w-full overflow-hidden px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] cursor-pointer disabled:opacity-60 group"
                >
                  <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
                  <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
                    {isVerifying ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      'I\'ve Verified My Email'
                    )}
                  </span>
                </button>

                <p className="mt-6">
                  <Link href="/login" className="inline-flex items-center gap-2 text-brand-gray/60 hover:text-brand-gold font-sans text-xs tracking-[0.15em] uppercase transition-colors">
                    <ArrowLeft size={14} />
                    Back to Login
                  </Link>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
