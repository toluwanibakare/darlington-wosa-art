"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, LogIn, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message || json.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      localStorage.setItem('auth_token', json.token);
      localStorage.setItem('user', JSON.stringify(json.user));
      router.push('/admin');
    } catch {
      setError('Network error. Make sure the server is running.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center px-6 py-20 relative">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-6">
            <Lock size={24} className="text-brand-gold" />
          </div>
          <h1 className="font-display text-3xl text-brand-black mb-2">Admin Access</h1>
          <p className="font-sans text-sm text-brand-gray">Sign in to manage your platform</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 border border-brand-border rounded-[8px] bg-brand-white/50">
          {error && (
            <div className="flex items-center gap-2 p-4 mb-6 border border-red-200 bg-red-50 rounded-[6px]">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <p className="font-sans text-xs text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans pr-8"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-3 cursor-pointer text-brand-gray/40 hover:text-brand-gray"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative w-full overflow-hidden mt-8 px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] cursor-pointer disabled:opacity-60 group"
          >
            <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
              {loading ? <><Loader2 size={14} className="animate-spin" /> Signing In...</> : <><LogIn size={14} /> Sign In</>}
            </span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
