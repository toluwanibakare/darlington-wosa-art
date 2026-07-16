"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';
import { api } from '@/lib/api';

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
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

    setIsComplete(true);
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
          Welcome to Darlington Wosa Art & Frames. You can now browse services, book classes, and track orders.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] group"
        >
          <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
            Go to Dashboard
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
      {error && (
        <div className="mb-6 p-4 rounded-[6px] bg-red-50 border border-red-200">
          <p className="font-sans text-xs text-red-600">{error}</p>
        </div>
      )}

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-6"
      >
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
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`${inputClass} pr-10`}
              placeholder="Create a strong password"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-3 text-brand-gray/50 hover:text-brand-gold transition-colors cursor-pointer" aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="font-sans text-[10px] text-brand-gray/40 mt-2">Minimum 8 characters</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="relative w-full overflow-hidden px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] cursor-pointer disabled:opacity-60 group mt-2"
        >
          <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
          <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight size={14} />
              </>
            )}
          </span>
        </button>
      </motion.form>

      <p className="text-center font-sans text-xs text-brand-gray/60 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-gold hover:text-brand-gold-light transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
