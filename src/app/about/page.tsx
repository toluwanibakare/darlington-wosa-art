import React from 'react';
import { FounderIntro } from '@/components/about/FounderIntro';
import { BrandJourney } from '@/components/about/BrandJourney';
import { VisionMission } from '@/components/about/VisionMission';
import { Values } from '@/components/about/Values';
import { Achievements } from '@/components/about/Achievements';

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
