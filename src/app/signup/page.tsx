import type { Metadata } from "next";
import React from 'react';
import Link from 'next/link';
import { SignUpForm } from '@/components/auth/SignUpForm';

export const metadata: Metadata = {
  title: "Create Account | Darlington Wosa Art & Frames Ltd",
  description: "Create a Darlington Wosa Art & Frames account to book classes, order commissions, and track your creative journey.",
  openGraph: {
    title: "Create Account | Darlington Wosa Art & Frames Ltd",
    description: "Create a Darlington Wosa Art & Frames account to book classes, order commissions, and track your creative journey.",
    url: "https://darlingtonwosaart.com/signup",
    siteName: "Darlington Wosa Art & Frames Ltd",
    locale: "en_NG",
    type: "website",
    images: [{ url: "/object_logo.png", width: 512, height: 512, alt: "Darlington Wosa Art & Frames Ltd" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Account | Darlington Wosa Art & Frames Ltd",
    description: "Create an account to book classes, order commissions, and track your creative journey.",
    images: ["/object_logo.png"],
  },
};

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

          <div className="p-8 md:p-12 border border-brand-border rounded-[8px] bg-brand-white/50">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
