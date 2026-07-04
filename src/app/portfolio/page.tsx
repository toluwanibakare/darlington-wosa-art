import React from 'react';
import { PortfolioHero } from '@/components/portfolio/PortfolioHero';
import { PortfolioGallery } from '@/components/portfolio/PortfolioGallery';

export default function PortfolioPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-brand-surface text-brand-black">
      <PortfolioHero />
      <PortfolioGallery />
    </div>
  );
}
