import { ArrowRight, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { useInvitation } from '../../config/useInvitation';
import { scrollToSection } from '../../lib/dom';
import { PremiumButton } from '../ui/PremiumButton';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { SmartImage } from '../ui/SmartImage';
import { Lightbox } from './Lightbox';

const AREAS = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'];
const SIZES = [
  '(min-width: 1024px) 58vw, 100vw',
  '(min-width: 1024px) 40vw, 50vw',
  '(min-width: 1024px) 40vw, 50vw',
  '(min-width: 1024px) 33vw, 50vw',
  '(min-width: 1024px) 33vw, 50vw',
  '(min-width: 1024px) 33vw, 100vw',
];

export function ShowcaseGallery() {
  const { copy, images } = useInvitation();
  const [open, setOpen] = useState<number | null>(null);
  const items = images.gallery.slice(0, 6);

  return (
    <section id="showcase" className="section-dark relative overflow-hidden py-24 sm:py-32" aria-labelledby="showcase-title">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading id="showcase-title" eyebrow={copy.gallery.eyebrow} title={copy.gallery.heading} intro={copy.gallery.intro} />

        <ul className="gallery-grid mt-16" role="list">
          {items.map((img, i) => (
            <Reveal as="li" key={`${img.src}-${i}`} delay={(i % 3) * 0.08} y={40} className={`gallery-item gallery-${AREAS[i]}`}>
              <button
                type="button"
                className="gallery-tile group"
                onClick={() => setOpen(i)}
                aria-label={`View ${img.label ?? img.alt} in full screen`}
              >
                <SmartImage image={img} sizes={SIZES[i]} className="gallery-img" />
                <span className="gallery-shade" aria-hidden />
                <span className="gallery-caption">
                  <span className="gallery-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="gallery-label">{img.label}</span>
                </span>
                <span className="gallery-zoom" aria-hidden>
                  <Maximize2 size={16} strokeWidth={1.5} />
                </span>
              </button>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-14 flex justify-center">
          <PremiumButton variant="outline" icon={ArrowRight} onClick={() => scrollToSection('details')}>
            See the Grand Opening Details
          </PremiumButton>
        </Reveal>
      </div>

      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  );
}
