"use client";

import React from 'react';
import { Trophy, Users as UsersIcon, Award as AwardIcon, Star } from 'lucide-react';
import { Reveal, StaggerList, StaggerItem } from '@/components/ui';

const ACHIEVEMENTS = [
  {
    icon: Trophy,
    stat: '300+',
    label: 'Projects Completed',
  },
  {
    icon: UsersIcon,
    stat: '50+',
    label: 'Clients Served',
  },
  {
    icon: AwardIcon,
    stat: '30+',
    label: 'Artists Trained',
  },
  {
    icon: Star,
    stat: '2009',
    label: 'Year Started Professionally',
  },
];

export function Achievements() {
  return (
    <section className="relative w-full bg-brand-black py-32 md:py-40 px-6 overflow-hidden border-t border-brand-white/5">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="max-w-[1400px] mx-auto">
        <Reveal className="max-w-3xl mb-20"
        >
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold-light block mb-6">
            Achievements
          </span>
          <h2 className="font-display text-text-h2 text-brand-white leading-tight">
            Milestones
          </h2>
        </Reveal>

        {/* Stats Grid */}
        <StaggerList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-24" speed="fast">
          {ACHIEVEMENTS.map((item, i) => (
            <StaggerItem
              key={item.label}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-brand-gold/20 bg-brand-gold/[0.04] mb-4">
                <item.icon size={18} className="text-brand-gold-light" />
              </div>
              <p className="font-display text-3xl md:text-4xl text-brand-white mb-2">
                {item.stat}
              </p>
              <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70">
                {item.label}
              </p>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
