"use client";

import React, { useEffect, useState } from 'react';
import { Quote, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/ui';
import { api } from '@/lib/api';

interface Review {
  id: number;
  name: string;
  role: string | null;
  quote: string;
  rating: number;
  image: string | null;
}

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ testimonials: Review[] }>('/testimonials').then((res) => {
      if (res.data) {
        setReviews(res.data.testimonials.slice(0, 4));
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="relative w-full bg-brand-black py-32 md:py-40 px-6 overflow-hidden">
        <div className="flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-brand-gold" />
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="relative w-full bg-brand-black py-32 md:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="max-w-[1400px] mx-auto">
        <Reveal className="max-w-3xl mb-20">
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold-light block mb-6">
            Testimonials
          </span>
          <h2 className="font-display text-text-h2 text-brand-white leading-tight">
            What Clients <br />
            <span className="text-brand-gold-light italic">Say</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((item) => (
            <div
              key={item.id}
              className="relative p-8 md:p-10 border border-brand-white/5 rounded-[8px] bg-brand-white/[0.02] hover:bg-brand-white/[0.04] transition-colors duration-500"
            >
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    className={s <= item.rating ? 'fill-brand-gold-light text-brand-gold-light' : 'fill-none text-brand-white/10'}
                  />
                ))}
              </div>
              <Quote size={20} className="text-brand-gold/30 mb-4" />
              <blockquote className="font-sans text-brand-white/80 text-sm md:text-base leading-relaxed mb-8">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center">
                  <span className="font-sans text-sm font-medium text-brand-gold-light">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-sans text-sm text-brand-white font-medium">{item.name}</p>
                  {item.role && <p className="font-sans text-xs text-brand-gray">{item.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Reveal className="text-center mt-12">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.15em] uppercase text-brand-gold-light hover:text-brand-gold transition-colors"
          >
            Read all reviews
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
