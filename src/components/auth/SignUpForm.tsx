"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';

const STEPS = ['Account', 'Profile', 'Referral'];

export function SignUpForm() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    dateOfBirth: '',
    referralCode: '',
    acceptTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsComplete(true);
    }, 2000);
  };

  if (isComplete) {
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
          Account Created
        </h3>
        <p className="font-sans text-sm text-brand-gray max-w-sm mx-auto mb-8 leading-relaxed">
          Welcome to Darlington Wosa Art & Frames. We&apos;ve sent a verification email to{' '}
          <span className="text-brand-black">{form.email}</span>.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] group"
        >
          <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
            Proceed to Login
            <ArrowRight size={14} />
          </span>
        </Link>
      </motion.div>
    );
  }

  const inputClass = "w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans";
  const labelClass = "font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3";

  return (
    <div>
      {/* Steps indicator */}
      <div className="flex items-center gap-3 mb-12">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`flex items-center gap-2`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                i <= step ? 'bg-brand-gold text-white' : 'bg-brand-border text-brand-gray/50'
              }`}>
                <span className="font-sans text-[10px] font-medium">{i + 1}</span>
              </div>
              <span className={`font-sans text-[10px] tracking-[0.15em] uppercase hidden sm:block transition-colors duration-500 ${
                i <= step ? 'text-brand-black' : 'text-brand-gray/40'
              }`}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-[1px] transition-colors duration-500 ${i < step ? 'bg-brand-gold' : 'bg-brand-border'}`} />
            )}
          </div>
        ))}
      </div>

      <motion.form
        onSubmit={handleSubmit}
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-8"
      >
        {step === 0 && (
          <>
            <div>
              <label htmlFor="fullName" className={labelClass}>Full Name</label>
              <input id="fullName" type="text" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>Email Address</label>
              <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="your@email.com" />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>Phone Number</label>
              <input id="phone" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+234 800 000 0000" />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <label htmlFor="password" className={labelClass}>Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${inputClass} pr-10`}
                  placeholder="Create a strong password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-3 text-brand-gray/50 hover:text-brand-gold transition-colors cursor-pointer" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="dateOfBirth" className={labelClass}>Date of Birth</label>
              <input id="dateOfBirth" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className={inputClass} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label htmlFor="referral" className={labelClass}>Referral Code (Optional)</label>
              <input id="referral" type="text" value={form.referralCode} onChange={(e) => setForm({ ...form, referralCode: e.target.value })} className={inputClass} placeholder="DWAF10382" />
              <p className="font-sans text-[10px] text-brand-gray/50 mt-2">Enter a referral code if you were referred by an existing customer.</p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded border mt-0.5 transition-all duration-300 flex items-center justify-center flex-shrink-0 ${
                  form.acceptTerms
                    ? 'bg-brand-gold border-brand-gold'
                    : 'border-brand-border group-hover:border-brand-gray/40'
                }`}
                onClick={() => setForm({ ...form, acceptTerms: !form.acceptTerms })}
              >
                {form.acceptTerms && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4.5 7.5L8 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="font-sans text-xs text-brand-gray/70 leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-brand-gold hover:text-brand-gold-light">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-brand-gold hover:text-brand-gold-light">Privacy Policy</Link>
              </span>
            </label>
          </>
        )}

        <div className="flex gap-4">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 px-8 py-4 bg-transparent text-brand-black border border-brand-black/20 hover:border-brand-black rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || (step === 2 && !form.acceptTerms)}
            className={`relative overflow-hidden px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] cursor-pointer disabled:opacity-60 group ${step > 0 ? 'flex-1' : 'w-full'}`}
          >
            <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : step < 2 ? (
                'Continue'
              ) : (
                <>
                  Create Account
                  <ArrowRight size={14} />
                </>
              )}
            </span>
          </button>
        </div>
      </motion.form>

      <p className="text-center font-sans text-xs text-brand-gray/60 mt-8">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-gold hover:text-brand-gold-light transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
