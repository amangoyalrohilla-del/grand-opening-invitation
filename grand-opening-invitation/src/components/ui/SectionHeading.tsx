import type { ReactNode } from 'react';
import { Divider } from './Ornaments';
import { Reveal } from './Reveal';

interface Props {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'center' | 'left';
  tone?: 'dark' | 'paper';
  className?: string;
  id?: string;
}

export function SectionHeading({ eyebrow, title, intro, align = 'center', tone = 'dark', className = '', id }: Props) {
  const center = align === 'center';
  return (
    <Reveal className={`${center ? 'text-center mx-auto' : ''} max-w-3xl ${className}`}>
      {eyebrow && <p className={`eyebrow ${tone === 'paper' ? 'eyebrow-ink' : ''}`}>{eyebrow}</p>}
      <h2
        id={id}
        data-section-focus
        className={`section-title mt-4 ${tone === 'paper' ? 'text-ink' : 'text-fg'} outline-none`}
      >
        {title}
      </h2>
      <Divider className={`mt-6 ${center ? 'mx-auto' : ''}`} />
      {intro && (
        <p className={`mt-6 text-base leading-relaxed sm:text-lg ${tone === 'paper' ? 'text-ink-soft' : 'text-muted'}`}>{intro}</p>
      )}
    </Reveal>
  );
}
