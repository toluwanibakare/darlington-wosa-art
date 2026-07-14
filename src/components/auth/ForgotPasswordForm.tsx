"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Check, ArrowLeft } from 'lucide-react';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  if (isSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-8">
          <Check size={28} className="text-brand-gold" />
        </div>
        <h3 className="font-display text-2xl text-brand-black mb-4">
          Check Your Email
        </h3>
        <p className="font-sans text-sm text-brand-gray max-w-sm mx-auto mb-8 leading-relaxed">
          We&apos;ve sent a password reset link to{' '}
          <span className="text-brand-black">{email}</span>. 
          It will expire in 60 minutes.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light font-sans text-xs tracking-[0.15em] uppercase transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Login
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      <p className="font-sans text-sm text-brand-gray leading-relaxed">
        Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
      </p>

      <div>
        <label htmlFor="resetEmail" className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">
          Email Address
        </label>
        <input
          id="resetEmail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
          placeholder="your@email.com"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="relative w-full overflow-hidden px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] cursor-pointer disabled:opacity-60 group"
      >
        <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
        <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>
              Send Reset Link
              <ArrowRight size={14} />
            </>
          )}
        </span>
      </button>

      <p className="text-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-brand-gray/60 hover:text-brand-gold font-sans text-xs tracking-[0.15em] uppercase transition-colors">
          <ArrowLeft size={14} />
          Back to Login
        </Link>
      </p>
    </motion.form>
  );
}
