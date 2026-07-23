import type { Metadata } from "next";
import React from 'react';
import { ServicesHero } from '@/components/services/ServicesHero';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import { ServicesCTA } from '@/components/services/ServicesCTA';

export const metadata: Metadata = {
  title: "Services | Darlington Wosa Art & Frames Ltd",
  description: "Explore our premium art services: custom pencil and charcoal portraiture, museum-grade framing, art restoration, and commissioned artwork by Darlington Wosa.",
  openGraph: {
    title: "Services | Darlington Wosa Art & Frames Ltd",
    description: "Explore our premium art services: custom pencil and charcoal portraiture, museum-grade framing, art restoration, and commissioned artwork by Darlington Wosa.",
    url: "https://darlingtonwosaart.com/services",
    siteName: "Darlington Wosa Art & Frames Ltd",
    locale: "en_NG",
    type: "website",
    images: [{ url: "/object_logo.png", width: 512, height: 512, alt: "Darlington Wosa Art & Frames Ltd" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Darlington Wosa Art & Frames Ltd",
    description: "Custom portraiture, museum-grade framing, art restoration, and commissioned artwork by Darlington Wosa.",
    images: ["/object_logo.png"],
  },
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-brand-surface text-brand-black">
      <ServicesHero />
      <ServicesGrid />
      <ServicesCTA />
    </div>
  );
}
