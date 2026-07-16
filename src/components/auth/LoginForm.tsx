"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await api.post('/login', {
      email: form.email,
      password: form.password,
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
      router.push('/dashboard');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      {error && (
        <div className="p-4 rounded-[6px] bg-red-50 border border-red-200">
          <p className="font-sans text-xs text-red-600">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans pr-10"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 bottom-3 text-brand-gray/50 hover:text-brand-gold transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            className={`w-4 h-4 rounded border transition-all duration-300 flex items-center justify-center ${
              rememberMe
                ? 'bg-brand-gold border-brand-gold'
                : 'border-brand-border group-hover:border-brand-gray/40'
            }`}
            onClick={() => setRememberMe(!rememberMe)}
          >
            {rememberMe && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5L4.5 7.5L8 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="font-sans text-xs text-brand-gray/70 group-hover:text-brand-gray transition-colors">
            Remember me
          </span>
        </label>
        <Link
          href="/forgot-password"
          className="font-sans text-xs text-brand-gold hover:text-brand-gold-light transition-colors"
        >
          Forgot Password?
        </Link>
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
              Sign In
              <ArrowRight size={14} />
            </>
          )}
        </span>
      </button>

      <p className="text-center font-sans text-xs text-brand-gray/60">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-brand-gold hover:text-brand-gold-light transition-colors">
          Create one
        </Link>
      </p>
    </motion.form>
  );
}
