import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, type KeyboardEvent } from 'react';
import type { ImageAsset } from '../../config/types';
import { lockScroll } from '../../lib/dom';
import { SmartImage } from '../ui/SmartImage';

interface Props {
  items: ImageAsset[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}

export function Lightbox({ items, index, onClose, onIndex }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const isOpen = index !== null;

  const go = (dir: 1 | -1) => {
    if (index === null) return;
    onIndex((index + dir + items.length) % items.length);
  };

  useEffect(() => {
    if (!isOpen) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const release = lockScroll();
    const t = window.setTimeout(() => closeRef.current?.focus(), 30);
    return () => {
      window.clearTimeout(t);
      release();
      returnFocus.current?.focus?.({ preventScroll: true });
    };
  }, [isOpen]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'Tab') {
      // keep focus inside the dialog
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button');
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const current = index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          ref={dialogRef}
          key="lightbox"
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${index! + 1} of ${items.length}: ${current.label ?? current.alt}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onKeyDown={onKeyDown}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
          onTouchEnd={(e) => {
            const start = touch.current;
            touch.current = null;
            if (!start) return;
            const dx = e.changedTouches[0].clientX - start.x;
            const dy = e.changedTouches[0].clientY - start.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
            else if (dy > 90) onClose();
          }}
        >
          <button ref={closeRef} type="button" className="lightbox-btn lightbox-close" onClick={onClose} aria-label="Close gallery">
            <X size={22} strokeWidth={1.5} />
          </button>
          <button type="button" className="lightbox-btn lightbox-prev" onClick={() => go(-1)} aria-label="Previous photo">
            <ChevronLeft size={26} strokeWidth={1.5} />
          </button>
          <button type="button" className="lightbox-btn lightbox-next" onClick={() => go(1)} aria-label="Next photo">
            <ChevronRight size={26} strokeWidth={1.5} />
          </button>

          <motion.figure
            key={index}
            className="lightbox-figure"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <SmartImage image={current} className="lightbox-img" sizes="100vw" priority />
            <figcaption className="lightbox-caption">
              <span className="font-display text-xs tracking-[0.3em] text-gold">
                {String(index! + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </span>
              <span className="mt-2 block font-serif text-2xl text-white">{current.label ?? current.alt}</span>
              {current.caption && <span className="mt-1 block text-sm text-white/70">{current.caption}</span>}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
