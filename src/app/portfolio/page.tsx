import type { Metadata } from "next";
import React from 'react';
import { PortfolioHero } from '@/components/portfolio/PortfolioHero';
import { PortfolioGallery } from '@/components/portfolio/PortfolioGallery';

export const metadata: Metadata = {
  title: "Portfolio | Darlington Wosa Art & Frames Ltd",
  description: "Browse the portfolio of Darlington Wosa — hyper-realistic pencil sketches, charcoal portraits, and commissioned artwork from Rivers State, Nigeria.",
  openGraph: {
    title: "Portfolio | Darlington Wosa Art & Frames Ltd",
    description: "Browse the portfolio of Darlington Wosa — hyper-realistic pencil sketches, charcoal portraits, and commissioned artwork.",
    url: "https://darlingtonwosaart.com/portfolio",
    siteName: "Darlington Wosa Art & Frames Ltd",
    locale: "en_NG",
    type: "website",
    images: [{ url: "/object_logo.png", width: 512, height: 512, alt: "Darlington Wosa Art & Frames Ltd" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Darlington Wosa Art & Frames Ltd",
    description: "Hyper-realistic pencil sketches, charcoal portraits, and commissioned artwork by Darlington Wosa.",
    images: ["/object_logo.png"],
  },
};

export default function PortfolioPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-brand-surface text-brand-black">
      <PortfolioHero />
      <PortfolioGallery />
    </div>
  );
}
