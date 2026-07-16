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
