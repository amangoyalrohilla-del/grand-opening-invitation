export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Smooth-scrolls to a section and moves keyboard focus there. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  const focusTarget = el.querySelector<HTMLElement>('[data-section-focus]') ?? el;
  if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
  window.setTimeout(() => focusTarget.focus({ preventScroll: true }), prefersReducedMotion() ? 0 : 700);
}

let lockCount = 0;
let savedOverflow = '';

/** Reference-counted page scroll lock (intro + lightbox can overlap safely). */
export function lockScroll() {
  if (lockCount === 0) {
    savedOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.documentElement.style.overflow = savedOverflow;
      document.body.style.overflow = '';
    }
  };
}

export const safeStorage = {
  get(key: string) {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      /* private mode etc. — the intro will simply show again */
    }
  },
};
