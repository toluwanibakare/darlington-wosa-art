import type { Metadata } from "next";
import React from 'react';
import { FounderIntro } from '@/components/about/FounderIntro';
import { BrandJourney } from '@/components/about/BrandJourney';
import { VisionMission } from '@/components/about/VisionMission';
import { Values } from '@/components/about/Values';
import { Achievements } from '@/components/about/Achievements';

export const metadata: Metadata = {
  title: "About | Darlington Wosa Art & Frames Ltd",
  description: "Meet Darlington Wosa — a Nigerian artist specializing in hyper-realistic pencil and charcoal portraiture. Learn the story behind Darlington Wosa Art & Frames Ltd, est. 2018.",
  openGraph: {
    title: "About | Darlington Wosa Art & Frames Ltd",
    description: "Meet Darlington Wosa — a Nigerian artist specializing in hyper-realistic pencil and charcoal portraiture. Learn the story behind Darlington Wosa Art & Frames Ltd, est. 2018.",
    url: "https://darlingtonwosaart.com/about",
    siteName: "Darlington Wosa Art & Frames Ltd",
    locale: "en_NG",
    type: "website",
    images: [{ url: "/object_logo.png", width: 512, height: 512, alt: "Darlington Wosa Art & Frames Ltd" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Darlington Wosa Art & Frames Ltd",
    description: "Meet Darlington Wosa — a Nigerian artist specializing in hyper-realistic pencil and charcoal portraiture.",
    images: ["/object_logo.png"],
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-brand-surface text-brand-black pt-28">
      <FounderIntro />
      <BrandJourney />
      <VisionMission />
      <Values />
      <Achievements />
    </div>
  );
}
