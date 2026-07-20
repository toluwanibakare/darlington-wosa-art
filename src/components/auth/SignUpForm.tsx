"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2, Check, X, Mail } from 'lucide-react';
import { api } from '@/lib/api';

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await api.post('/register', {
      name: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      password_confirmation: form.password,
    });

    setIsLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    if (res.data) {
      const data = res.data as { token: string; user: unknown };
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    setShowOtp(true);
  };

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
    if (code.length !== 6) return;
    setOtpLoading(true);
    setOtpError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.darlingtonwosa.art'}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ otp: code }),
      });
      const json = await res.json();
      if (!res.ok) {
        setOtpError(json.message || 'Invalid code');
        setOtpLoading(false);
        return;
      }
      localStorage.setItem('user', JSON.stringify(json.user));
      setShowOtp(false);
      setIsComplete(true);
    } catch {
      setOtpError('Network error. Please try again.');
    }
    setOtpLoading(false);
  };

  const handleResendOtp = async () => {
    setOtpLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.darlingtonwosa.art'}/resend-otp`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
    } catch {}
    setOtpLoading(false);
  };

  if (isComplete) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-8">
          <Check size={28} className="text-brand-gold" />
        </div>
        <h3 className="font-display text-2xl text-brand-black mb-4">Account Created</h3>
        <p className="font-sans text-sm text-brand-gray max-w-sm mx-auto mb-8 leading-relaxed">
          Welcome to Darlington Wosa Art & Frames. Your email has been verified. You can now browse services, book classes, and track orders.
        </p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] group">
          <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
            Go to Dashboard <ArrowRight size={14} />
          </span>
        </Link>
      </motion.div>
    );
  }

  const inputClass = "w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans";
  const labelClass = "font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3";

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 rounded-[6px] bg-red-50 border border-red-200">
          <p className="font-sans text-xs text-red-600">{error}</p>
        </div>
      )}

      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-6">
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
          <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+234 800 000 0000" />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <div className="relative">
            <input id="password" type={showPassword ? 'text' : 'password'} required minLength={8}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`${inputClass} pr-10`} placeholder="Create a strong password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-3 text-brand-gray/50 hover:text-brand-gold transition-colors cursor-pointer" aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="font-sans text-[10px] text-brand-gray/40 mt-2">Minimum 8 characters</p>
        </div>

        <button type="submit" disabled={isLoading}
          className="relative w-full overflow-hidden px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] cursor-pointer disabled:opacity-60 group mt-2">
          <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
          <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <>Create Account <ArrowRight size={14} /></>}
          </span>
        </button>
      </motion.form>

      <p className="text-center font-sans text-xs text-brand-gray/60 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-gold hover:text-brand-gold-light transition-colors">Sign in</Link>
      </p>

      {/* OTP Modal */}
      <AnimatePresence>
        {showOtp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-brand-surface border border-brand-border rounded-[8px] shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
                <h2 className="font-display text-lg text-brand-black">Verify Your Email</h2>
                <button onClick={() => setShowOtp(false)} className="p-2 rounded-full hover:bg-brand-border/50 cursor-pointer">
                  <X size={16} className="text-brand-gray" />
                </button>
              </div>
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Mail size={20} className="text-brand-gold" />
                </div>
                <p className="font-sans text-sm text-brand-gray mb-6">
                  Enter the 6-digit code sent to <strong className="text-brand-black">{form.email}</strong>
                </p>
                {otpError && (
                  <div className="mb-4 p-3 rounded-[6px] bg-red-50 border border-red-200">
                    <p className="font-sans text-xs text-red-600">{otpError}</p>
                  </div>
                )}
                <div className="flex items-center justify-center gap-2 mb-6">
                  {otp.map((digit, i) => (
                    <input key={i} ref={(el) => { inputRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-11 h-12 text-center bg-transparent border border-brand-border rounded-[6px] text-lg font-mono text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-all"
                      autoFocus={i === 0} />
                  ))}
                </div>
                <button onClick={handleVerifyOtp} disabled={otpLoading || otp.join('').length !== 6}
                  className="w-full px-6 py-3 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase hover:shadow-[0_0_20px_rgba(158,101,27,0.15)] transition-all cursor-pointer disabled:opacity-40">
                  {otpLoading ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Verify Email'}
                </button>
                <button onClick={handleResendOtp} disabled={otpLoading}
                  className="mt-4 font-sans text-xs text-brand-gold hover:underline cursor-pointer disabled:opacity-40">
                  Resend code
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
