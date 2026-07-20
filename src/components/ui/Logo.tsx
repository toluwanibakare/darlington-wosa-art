"use client";

import React from 'react';
import Image from 'next/image';
import { useTheme } from '@/components/providers';

interface LogoProps {
  className?: string;
  height?: number;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
}

export function Logo({
  className = '',
  height = 40,
  scale = 1.0,
  offsetX = 0,
  offsetY = 0,
}: LogoProps) {
  const { theme } = useTheme();
  const width = height * 3.5;

  return (
    <div className={`relative flex items-center select-none ${className}`}>
      <div
        className="relative overflow-hidden"
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `scale(${scale}) translate(${offsetX}%, ${offsetY}%)`,
            transformOrigin: 'center center',
          }}
        >
          <Image
            src={theme === 'dark' ? '/logo_white.png' : '/logo.png'}
            alt="Darlington Wosa Art & Frames"
            fill
            sizes={`${width}px`}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
