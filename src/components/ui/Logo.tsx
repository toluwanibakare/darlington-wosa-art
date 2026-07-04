import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  height?: number; // Target height in pixels for the rendered logo
  scale?: number;  // Scale factor (default to 1.0 since new logo is pre-cropped)
  offsetX?: number; // Horizontal adjustment in percentage
  offsetY?: number; // Vertical adjustment in percentage
}

export function Logo({
  className = '',
  height = 40,
  scale = 1.0,
  offsetX = 0,
  offsetY = 0,
}: LogoProps) {
  // We compute a width that matches the proportions, e.g., a landscape logo.
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
            src="/logo.png"
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
