'use client';

import { forwardRef } from 'react';
import { motion, type HTMLMotionProps, type Transition } from 'framer-motion';
import {
  fadeUp,
  fadeDown,
  fadeIn,
  slideInLeft,
  slideInRight,
  scaleIn,
  transitionTween,
  transitionTweenFast,
  transitionTweenSlow,
  springSmooth,
  springGentle,
  defaultViewport,
} from '@/lib/animation';

type RevealDirection = 'up' | 'down' | 'fade' | 'left' | 'right' | 'scale';
type RevealAnimation = 'tween' | 'spring-smooth' | 'spring-gentle';

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'variants'> {
  direction?: RevealDirection;
  distance?: number;
  delay?: number;
  duration?: number;
  animation?: RevealAnimation;
  viewportMargin?: string;
  viewportOnce?: boolean;
  as?: 'div' | 'span' | 'section' | 'article';
}

const transitionMap: Record<RevealAnimation, Transition> = {
  'tween': transitionTween,
  'spring-smooth': springSmooth,
  'spring-gentle': springGentle,
};

export const Reveal = forwardRef<HTMLDivElement, RevealProps>(
  (
    {
      direction = 'up',
      distance = 24,
      delay = 0,
      duration,
      animation = 'spring-smooth',
      viewportMargin,
      viewportOnce = true,
      as = 'div',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const MotionTag = motion[as];

    const getVariants = () => {
      switch (direction) {
        case 'down':
          return fadeDown(distance);
        case 'fade':
          return fadeIn();
        case 'left':
          return slideInLeft(distance);
        case 'right':
          return slideInRight(distance);
        case 'scale':
          return scaleIn(distance / 100);
        default:
          return fadeUp(distance);
      }
    };

    const baseTransition = transitionMap[animation];

    return (
      <MotionTag
        ref={ref}
        variants={getVariants()}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: viewportOnce,
          margin: viewportMargin ?? defaultViewport.margin,
        }}
        transition={{
          ...baseTransition,
          ...(duration ? { duration } : {}),
          ...(delay ? { delay } : {}),
        }}
        className={className}
        {...props}
      >
        {children}
      </MotionTag>
    );
  }
);

Reveal.displayName = 'Reveal';
