import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
}

/** Scroll-triggered entrance. Plays once; reduced-motion users get a simple fade (via MotionConfig). */
export function Reveal({ children, delay = 0, y = 28, x = 0, scale = 1, className, as = 'div' }: Props) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.95, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}
