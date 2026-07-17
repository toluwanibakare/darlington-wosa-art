'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  offset?: [number, number];
  className?: string;
  as?: 'div' | 'section' | 'span' | 'figure';
}

export function Parallax({
  children,
  speed = 0.3,
  offset = [0, 0],
  className,
  as = 'div',
}: ParallaxProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const translateY = useTransform(
    scrollYProgress,
    [0, 1],
    [offset[0] - speed * 100, offset[1] + speed * 100]
  );

  const MotionTag = motion[as];

  return (
    <MotionTag
      ref={ref}
      style={{ y: translateY }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
