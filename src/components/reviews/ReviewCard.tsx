"use client";

import React from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';
import { StarRating } from './StarRating';

interface ReviewCardProps {
  name: string;
  role?: string | null;
  quote: string;
  rating: number;
  image?: string | null;
}

export function ReviewCard({ name, role, quote, rating, image }: ReviewCardProps) {
  return (
    <div className="relative p-8 md:p-10 border border-brand-border rounded-[8px] bg-brand-white transition-all duration-500 group">
      {image && (
        <div className="relative w-full aspect-[4/3] rounded-[6px] overflow-hidden mb-6">
          <Image
            src={image}
            alt={`Review by ${name}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}
      <StarRating rating={rating} size={14} />
      <Quote size={20} className="text-brand-gold/30 my-4" />
      <blockquote className="font-sans text-brand-black/80 text-sm md:text-base leading-relaxed mb-6">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0">
          <span className="font-sans text-sm font-medium text-brand-gold-light">
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-sans text-sm text-brand-black font-medium">{name}</p>
          {role && <p className="font-sans text-xs text-brand-gray">{role}</p>}
        </div>
      </div>
    </div>
  );
}
