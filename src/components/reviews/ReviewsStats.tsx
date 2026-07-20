"use client";

import React from 'react';
import { Star } from 'lucide-react';

interface StatsData {
  average_rating: number;
  total_reviews: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
}

function Bar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="font-sans text-xs text-brand-gray w-6 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-brand-border/30 overflow-hidden">
        <div className="h-full rounded-full bg-brand-gold transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="font-sans text-xs text-brand-gray w-6 text-right shrink-0">{count}</span>
    </div>
  );
}

export function ReviewsStats({ stats }: { stats: StatsData | null }) {
  if (!stats || stats.total_reviews === 0) return null;

  const total = stats.total_reviews;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
      <div className="text-center md:text-left">
        <div className="text-5xl md:text-6xl font-display text-brand-black leading-none mb-2">
          {Number(stats.average_rating).toFixed(1)}
        </div>
        <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={16}
              className={s <= Math.round(stats.average_rating) ? 'fill-brand-gold text-brand-gold' : 'fill-none text-brand-border'}
            />
          ))}
        </div>
        <p className="font-sans text-xs text-brand-gray">
          Based on {total} review{total !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="md:col-span-2 space-y-2">
        <Bar label="5" count={stats.five_star} total={total} />
        <Bar label="4" count={stats.four_star} total={total} />
        <Bar label="3" count={stats.three_star} total={total} />
        <Bar label="2" count={stats.two_star} total={total} />
        <Bar label="1" count={stats.one_star} total={total} />
      </div>
    </div>
  );
}
