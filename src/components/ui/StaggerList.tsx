'use client';

import { type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  staggerContainer,
  staggerContainerFast,
  staggerItem,
  staggerItemLeft,
  staggerItemRight,
  staggerItemScale,
  transitionTween,
} from '@/lib/animation';

type StaggerVariant = 'default' | 'left' | 'right' | 'scale';

interface StaggerListProps {
  children: ReactNode;
  className?: string;
  variant?: StaggerVariant;
  speed?: 'normal' | 'fast';
  delay?: number;
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

const containerVariants: Record<string, Variants> = {
  normal: staggerContainer,
  fast: staggerContainerFast,
};

const itemVariantsMap: Record<StaggerVariant, Variants> = {
  default: staggerItem,
  left: staggerItemLeft,
  right: staggerItemRight,
  scale: staggerItemScale,
};

export function StaggerList({
  children,
  className,
  variant = 'default',
  speed = 'normal',
  delay = 0.1,
}: StaggerListProps) {
  const container = containerVariants[speed];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
      transition={{ delayChildren: delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: StaggerItemProps) {
  return (
    <motion.div
      variants={staggerItem}
      transition={transitionTween}
      className={className}
    >
      {children}
    </motion.div>
  );
}
