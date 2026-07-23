import type { Metadata } from "next";
import React from 'react';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Logo } from '@/components/ui';

export const metadata: Metadata = {
  title: "Reset Password | Darlington Wosa Art & Frames Ltd",
  description: "Reset your Darlington Wosa Art & Frames account password. We will send you a link to create a new one.",
  openGraph: {
    title: "Reset Password | Darlington Wosa Art & Frames Ltd",
    description: "Reset your Darlington Wosa Art & Frames account password.",
    url: "https://darlingtonwosaart.com/forgot-password",
    siteName: "Darlington Wosa Art & Frames Ltd",
    locale: "en_NG",
    type: "website",
    images: [{ url: "/object_logo.png", width: 512, height: 512, alt: "Darlington Wosa Art & Frames Ltd" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reset Password | Darlington Wosa Art & Frames Ltd",
    description: "Reset your Darlington Wosa Art & Frames account password.",
    images: ["/object_logo.png"],
  },
};

export default function ForgotPasswordPage() {
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
              Reset Password
            </h1>
            <p className="font-sans text-sm text-brand-gray">
              We&apos;ll send you a link to reset your password.
            </p>
          </div>

          <div className="p-8 md:p-12 border border-brand-border rounded-[8px] bg-brand-white/50">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
