import React from 'react';
import Image from 'next/image';

type LogoVariant = 'default' | 'object';

interface LogoProps {
  className?: string;
  height?: number;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  variant?: LogoVariant;
}

export function Logo({
  className = '',
  height = 40,
  scale = 1.0,
  offsetX = 0,
  offsetY = 0,
  variant = 'default',
}: LogoProps) {
  if (variant === 'object') {
    const size = height;
    return (
      <div className={`relative flex items-center select-none ${className}`}>
        <div
          className="relative overflow-hidden rounded-full bg-brand-black flex items-center justify-center"
          style={{
            width: `${size}px`,
            height: `${size}px`,
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
              src="/object_logo.png"
              alt="Darlington Wosa Art & Frames"
              fill
              sizes={`${size}px`}
              className="object-contain p-[15%]"
              priority
            />
          </div>
        </div>
      </div>
    );
  }

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
