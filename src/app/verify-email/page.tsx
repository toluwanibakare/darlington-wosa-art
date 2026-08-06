"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleOtpChange = (i: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(0, 1);
    }
    if (val && !/^\d$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) {
      inputRefs.current[i + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6 || !email) return;
    setOtpLoading(true);
    setOtpError('');

    try {
      const res = await api.post('/verify-otp', {
        email: email,
        otp: code
      });
      if (res.error) {
        setOtpError(res.error);
      } else {
        setOtpSuccess(true);
      }
    } catch {
      setOtpError('Network error. Please try again.');
    }
    setOtpLoading(false);
  };

  const handleResendOtp = async () => {
    if (!email) return;
    setResendCooldown(60);
    setOtpLoading(true);
    setOtpError('');
    try {
      const res = await api.post('/resend-otp', { email: email });
      if (res.error) {
        setOtpError(res.error);
      }
    } catch {
      setOtpError('Failed to send OTP code.');
    }
    setOtpLoading(false);
  };

  if (otpSuccess) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-8">
          <Check size={28} className="text-brand-gold" />
        </div>
        <h2 className="font-display text-2xl text-brand-black mb-4">Email Verified</h2>
        <p className="font-sans text-sm text-brand-gray max-w-sm mx-auto mb-8 leading-relaxed">
          Welcome to Darlington Wosa Art &amp; Frames. Your email has been verified. You can now log in to your account.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] group"
        >
          <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
            Go to Login <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">
          Verification Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans mb-4"
          placeholder="your@email.com"
        />
      </div>

      <p className="font-sans text-sm text-brand-gray mb-6 text-center">
        Enter the 6-digit verification code sent to your email.
      </p>

      {otpError && (
        <div className="mb-6 p-4 rounded-[6px] bg-red-50 border border-red-200">
          <p className="font-sans text-xs text-red-600 text-center">{otpError}</p>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 mb-8">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(i, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(i, e)}
            className="w-11 h-12 text-center bg-transparent border border-brand-border rounded-[6px] text-lg font-mono text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-all"
            autoFocus={i === 0}
          />
        ))}
      </div>

      <button
        onClick={handleVerifyOtp}
        disabled={otpLoading || otp.join('').length !== 6 || !email}
        className="w-full px-6 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase hover:shadow-[0_0_20px_rgba(158,101,27,0.15)] transition-all cursor-pointer disabled:opacity-40"
      >
        {otpLoading ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Verify Email'}
      </button>

      <div className="text-center mt-6">
        <button
          onClick={handleResendOtp}
          disabled={otpLoading || resendCooldown > 0 || !email}
          className="font-sans text-xs text-brand-gold hover:underline cursor-pointer disabled:opacity-40"
        >
          {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code'}
        </button>
      </div>

      <p className="mt-8 text-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-brand-gray/60 hover:text-brand-gold font-sans text-xs tracking-[0.15em] uppercase transition-colors">
          <ArrowLeft size={14} />
          Back to Login
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-brand-surface flex flex-col">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-[480px]">
          <div className="mb-12 text-center">
            <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-3">
              Verify Your Email
            </h1>
            <p className="font-sans text-sm text-brand-gray">
              Please enter the OTP verification code to access your account.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 md:p-12 border border-brand-border rounded-[8px] bg-brand-white/50"
          >
            <Suspense fallback={<div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin text-brand-gold" /></div>}>
              <VerifyEmailForm />
            </Suspense>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
