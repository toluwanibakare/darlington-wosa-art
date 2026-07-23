import type { Metadata } from "next";
import React from 'react';
import { Hero } from '@/components/home/Hero';
import { BrandIntro } from '@/components/home/BrandIntro';
import { ArtistJourney } from '@/components/home/ArtistJourney';
import { Services } from '@/components/home/Services';
import { FramingProcess } from '@/components/home/FramingProcess';
import { Exhibition } from '@/components/home/Exhibition';
import { PromoBanner } from '@/components/home/PromoBanner';
import { Testimonials } from '@/components/home/Testimonials';
import { OrderProcess } from '@/components/home/OrderProcess';
import { ClassesPreview } from '@/components/home/ClassesPreview';
import { ReferralEarn } from '@/components/home/ReferralEarn';
import { ContactCTA } from '@/components/home/ContactCTA';

export const metadata: Metadata = {
  title: "Darlington Wosa Art & Frames Ltd | Premium Art, Framing & Creative Services",
  description: "Discover premium handcrafted portraiture, museum-grade framing, and art education by Darlington Wosa. Based in Rivers State, Nigeria since 2018.",
  openGraph: {
    title: "Darlington Wosa Art & Frames Ltd",
    description: "Premium handcrafted portraiture, bespoke museum-grade framing, and art education by Darlington Wosa. Based in Rivers State, Nigeria since 2018.",
    url: "https://darlingtonwosaart.com",
    siteName: "Darlington Wosa Art & Frames Ltd",
    locale: "en_NG",
    type: "website",
    images: [{ url: "/object_logo.png", width: 512, height: 512, alt: "Darlington Wosa Art & Frames Ltd" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Darlington Wosa Art & Frames Ltd",
    description: "Premium handcrafted portraiture, bespoke museum-grade framing, and art education by Darlington Wosa.",
    images: ["/object_logo.png"],
  },
};

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-brand-surface text-brand-black">
      <Hero />
      <BrandIntro />
      <ArtistJourney />
      <Services />
      <FramingProcess />
      <Exhibition />
      <PromoBanner />
      <Testimonials />
      <ClassesPreview />
      <OrderProcess />
      <ReferralEarn />
      <ContactCTA />
    </div>
  );
}
