import type { Variants, Transition, UseInViewOptions } from 'framer-motion';

export const easeExpoOut: Readonly<[number, number, number, number]> = [0.16, 1, 0.3, 1] as const;
export const easeExpoInOut: Readonly<[number, number, number, number]> = [0.76, 0, 0.24, 1] as const;

export const springSmooth: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 30,
  mass: 0.8,
};

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 80,
  damping: 25,
  mass: 0.6,
};

export const springStiff: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 35,
  mass: 0.5,
};

export const transitionTween: Transition = {
  duration: 0.9,
  ease: easeExpoOut,
};

export const transitionTweenFast: Transition = {
  duration: 0.6,
  ease: easeExpoOut,
};

export const transitionTweenSlow: Transition = {
  duration: 1.2,
  ease: easeExpoInOut,
};

export function fadeUp(y = 30): Variants {
  return {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0 },
  };
}

export function fadeDown(y = -30): Variants {
  return {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0 },
  };
}

export function fadeIn(): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
}

export function slideInLeft(x = -60): Variants {
  return {
    hidden: { opacity: 0, x },
    visible: { opacity: 1, x: 0 },
  };
}

export function slideInRight(x = 60): Variants {
  return {
    hidden: { opacity: 0, x },
    visible: { opacity: 1, x: 0 },
  };
}

export function scaleIn(scale = 0.95): Variants {
  return {
    hidden: { opacity: 0, scale },
    visible: { opacity: 1, scale: 1 },
  };
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeExpoOut },
  },
};

export const staggerItemLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: easeExpoOut },
  },
};

export const staggerItemRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: easeExpoOut },
  },
};

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: easeExpoOut },
  },
};

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export const pageTransition: Transition = {
  duration: 0.5,
  ease: easeExpoOut,
};

export const defaultViewport: UseInViewOptions = {
  once: true,
  margin: '-80px',
};

export const viewportLazy: UseInViewOptions = {
  once: true,
  margin: '-40px',
};

export const viewportEager: UseInViewOptions = {
  once: true,
  margin: '-120px',
};

export function fadeUpProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { duration: 0.8, delay, ease: easeExpoOut } as const,
  };
}
