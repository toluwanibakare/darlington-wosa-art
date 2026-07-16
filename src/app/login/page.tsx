import React from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brand-surface flex flex-col">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-[520px]">
          <div className="mb-12 text-center">
            <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-3">
              Welcome Back
            </h1>
            <p className="font-sans text-sm text-brand-gray">
              Sign in to your Darlington Wosa Art & Frames account.
            </p>
          </div>

          <div className="p-8 md:p-12 border border-brand-border rounded-[8px] bg-brand-white/50">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
