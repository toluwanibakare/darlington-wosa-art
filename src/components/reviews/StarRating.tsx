"use client";

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({ rating, size = 16, interactive = false, onChange }: StarRatingProps) {
  const [hovered, setHovered] = React.useState(0);

  return (
    <div className={`flex items-center gap-0.5 ${interactive ? 'cursor-pointer' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          onMouseEnter={interactive ? () => setHovered(star) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
          onClick={interactive ? () => onChange?.(star) : undefined}
          className={`transition-all duration-200 ${
            interactive ? 'hover:scale-110' : ''
          } ${
            star <= (hovered || rating)
              ? 'fill-brand-gold text-brand-gold'
              : 'fill-none text-brand-border'
          }`}
        />
      ))}
    </div>
  );
}
