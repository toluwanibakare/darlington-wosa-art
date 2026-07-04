import React from 'react';
import { ServicesHero } from '@/components/services/ServicesHero';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import { ServicesCTA } from '@/components/services/ServicesCTA';

export default function ServicesPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-brand-surface text-brand-black">
      <ServicesHero />
      <ServicesGrid />
      <ServicesCTA />
    </div>
  );
}
