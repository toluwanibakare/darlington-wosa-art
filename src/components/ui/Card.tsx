import React from 'react';
import Image from 'next/image';

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  className?: string;
}

export function Card({ title, description, imageUrl, category, className = '' }: CardProps) {
  return (
    <div className={`group relative flex flex-col gap-4 cursor-pointer ${className}`}>
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[8px] transition-shadow duration-[1.5s] ease-[var(--ease-expo-out)] group-hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] bg-brand-surface">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={title}
            fill
            className="object-cover transition-transform duration-[1.5s] ease-[var(--ease-expo-out)] group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-surface border border-brand-border" />
        )}
        {/* Subtle glass overlay border to give it elevation */}
        <div className="absolute inset-0 border border-brand-black/5 rounded-[8px] pointer-events-none" />
      </div>
      <div>
        {category && <p className="text-xs text-brand-gray mb-1 uppercase tracking-widest font-sans">{category}</p>}
        <h3 className="font-display text-xl text-brand-black">{title}</h3>
        <p className="text-sm text-brand-gray mt-2 font-sans">{description}</p>
      </div>
    </div>
  );
}
