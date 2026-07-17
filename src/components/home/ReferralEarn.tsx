"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Gift, Users, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui';

const BENEFITS = [
  {
    icon: Gift,
    title: 'Earn Per Referral',
    description: 'Get rewarded when someone you refer makes their first purchase or books a class.',
  },
  {
    icon: TrendingUp,
    title: 'Tiered Rewards',
    description: 'The more you refer, the higher your rewards. Top referrers earn exclusive bonuses.',
  },
  {
    icon: Award,
    title: 'Early Access',
    description: 'Referrers get first access to new workshops, limited editions, and private events.',
  },
];

export function ReferralEarn() {
  return (
    <section className="relative w-full bg-brand-surface py-24 md:py-32 px-6 overflow-hidden border-t border-brand-border">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal
          >
            <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
              Earn With Us
            </span>
            <h2 className="font-display text-text-h2 text-brand-black leading-tight mb-6">
              Share the Art. <br />
              <span className="text-brand-gold italic">Earn the Reward.</span>
            </h2>
            <p className="font-sans text-brand-gray text-text-body max-w-xl mb-10">
              Love what we do? Share it with your community. Every time someone you refer 
              books a service or joins a class, you earn rewards that grow with your impact.
            </p>

            <div className="space-y-8">
              {BENEFITS.map((benefit, i) => (
                <Reveal
                  key={benefit.title}
                  direction="left"
                  distance={20}
                  duration={0.6}
                  delay={i * 0.1}
                  viewportMargin="0px"
                  className="flex items-start gap-5"
                >
                  <div className="w-11 h-11 rounded-full border border-brand-gold/20 bg-brand-white flex items-center justify-center flex-shrink-0">
                    <benefit.icon size={18} className="text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-brand-black mb-1.5">{benefit.title}</h3>
                    <p className="font-sans text-sm text-brand-gray leading-relaxed">{benefit.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal
              delay={0.3}
              duration={0.6}
              distance={10}
              viewportMargin="0px"
              className="mt-10"
            >
              <Link
                href="/signup"
                className="relative inline-flex overflow-hidden px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] group"
              >
                <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
                  Start Referring
                  <ArrowRight size={14} />
                </span>
              </Link>
            </Reveal>
          </Reveal>

          <Reveal
            direction="scale"
            delay={0.2}
            className="relative"
          >
            <div className="p-10 md:p-14 border border-brand-gold/20 rounded-[12px] bg-brand-white/30 backdrop-blur-sm text-center">
              <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-8">
                <Users size={36} className="text-brand-gold" />
              </div>
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-gray/60 mb-3">
                Referral Tiers
              </p>
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between p-4 rounded-[8px] bg-brand-gold/[0.04] border border-brand-gold/10">
                  <span className="font-sans text-xs text-brand-black">1-5 Referrals</span>
                  <span className="font-display text-sm text-brand-gold">5% per referral</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-[8px] bg-brand-gold/[0.06] border border-brand-gold/15">
                  <span className="font-sans text-xs text-brand-black">6-15 Referrals</span>
                  <span className="font-display text-sm text-brand-gold">8% per referral</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-[8px] bg-brand-gold/[0.08] border border-brand-gold/20">
                  <span className="font-sans text-xs text-brand-black">16+ Referrals</span>
                  <span className="font-display text-sm text-brand-gold">12% per referral</span>
                </div>
              </div>
              <p className="font-sans text-[11px] text-brand-gray/50 mt-6 leading-relaxed">
                Rewards are credited to your wallet once the referral completes their first order.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
