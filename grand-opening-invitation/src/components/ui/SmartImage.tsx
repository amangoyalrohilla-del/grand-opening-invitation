import { useEffect, useRef, useState } from 'react';
import type { ImageAsset } from '../../config/types';

interface Props {
  image: ImageAsset;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Text shown on the fallback artwork if the image can't load */
  fallbackLabel?: string;
}

const WIDTHS = [480, 768, 1080, 1440, 1920];

function srcSetFor(src: string) {
  if (!/images\.unsplash\.com/.test(src)) return undefined;
  return WIDTHS.map((w) => `${src.replace(/([?&])w=\d+/, `$1w=${w}`)} ${w}w`).join(', ');
}

/** Responsive, lazy-loaded image with an elegant on-brand fallback. */
export function SmartImage({ image, className = '', sizes = '100vw', priority, fallbackLabel }: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setFailed(false);
    // Images served from cache can finish before React attaches onLoad.
    const el = ref.current;
    setLoaded(Boolean(el && el.complete && el.naturalWidth > 0));
  }, [image.src]);

  if (failed || !image.src) {
    return <ImageFallback className={className} label={fallbackLabel ?? image.label ?? image.alt} />;
  }

  return (
    <img
      ref={ref}
      src={image.src}
      srcSet={srcSetFor(image.src)}
      sizes={sizes}
      alt={image.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`${className} smart-img ${loaded ? 'is-loaded' : ''}`}
      style={{ objectPosition: image.focus }}
    />
  );
}

/** Architectural line-art placeholder, used when a photo is missing or blocked. */
export function ImageFallback({ className = '', label }: { className?: string; label?: string }) {
  return (
    <div className={`${className} image-fallback`} role="img" aria-label={label ? `${label} (image placeholder)` : 'Image placeholder'}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="fb-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--gold-light)" />
            <stop offset="1" stopColor="var(--gold-deep)" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#fb-g)" strokeWidth="1" opacity="0.55">
          <path d="M120 270 V120 A80 80 0 0 1 280 120 V270" />
          <path d="M136 270 V124 A64 64 0 0 1 264 124 V270" />
          <path d="M200 60 V270" />
          <path d="M90 270 V110 M310 270 V110 M78 110 H122 M278 110 H322 M78 104 H122 M278 104 H322" />
          <path d="M60 270 H340 M50 280 H350 M40 290 H360" />
          <circle cx="200" cy="40" r="10" />
          <path d="M188 200 V214 M212 200 V214" strokeWidth="2.5" />
        </g>
      </svg>
      {label && <span className="image-fallback-label">{label}</span>}
    </div>
  );
}
