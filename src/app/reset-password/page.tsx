import type { Metadata } from "next";
import React from 'react';
import Link from 'next/link';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Logo } from '@/components/ui';

export const metadata: Metadata = {
  title: "Set New Password | Darlington Wosa Art & Frames Ltd",
  description: "Set a new password for your Darlington Wosa Art & Frames account. Choose a strong password you have not used before.",
  openGraph: {
    title: "Set New Password | Darlington Wosa Art & Frames Ltd",
    description: "Set a new password for your Darlington Wosa Art & Frames account.",
    url: "https://darlingtonwosaart.com/reset-password",
    siteName: "Darlington Wosa Art & Frames Ltd",
    locale: "en_NG",
    type: "website",
    images: [{ url: "/object_logo.png", width: 512, height: 512, alt: "Darlington Wosa Art & Frames Ltd" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Set New Password | Darlington Wosa Art & Frames Ltd",
    description: "Set a new password for your Darlington Wosa Art & Frames account.",
    images: ["/object_logo.png"],
  },
};

export default function ResetPasswordPage() {
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
              Set New Password
            </h1>
            <p className="font-sans text-sm text-brand-gray">
              Choose a strong password you haven&apos;t used before.
            </p>
          </div>

          <div className="p-8 md:p-12 border border-brand-border rounded-[8px] bg-brand-white/50">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
