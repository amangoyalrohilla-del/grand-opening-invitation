import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type Variant = 'gold' | 'outline' | 'ghost' | 'ink';

interface Props {
  children: ReactNode;
  variant?: Variant;
  size?: 'md' | 'lg';
  icon?: LucideIcon;
  /** Icon animation on hover */
  iconMotion?: 'slide' | 'bob' | 'spin' | 'none';
  href?: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

/** The single button component used for every CTA in the invitation. */
export function PremiumButton({
  children,
  variant = 'gold',
  size = 'md',
  icon: Icon,
  iconMotion = 'slide',
  href,
  external,
  onClick,
  className = '',
  ariaLabel,
  disabled,
}: Props) {
  const cls = `btn btn-${variant} btn-${size} icon-${iconMotion} ${className}`;
  const inner = (
    <>
      {variant === 'gold' && <span className="btn-shine" aria-hidden />}
      <span className="btn-label">{children}</span>
      {Icon && (
        <span className="btn-icon" aria-hidden>
          <Icon size={size === 'lg' ? 18 : 16} strokeWidth={1.75} />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        className={cls}
        href={href}
        aria-label={ariaLabel}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick} aria-label={ariaLabel} disabled={disabled}>
      {inner}
    </button>
  );
}
