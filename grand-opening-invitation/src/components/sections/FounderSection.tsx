import { ArrowRight } from 'lucide-react';
import { useInvitation } from '../../config/useInvitation';
import { scrollToSection } from '../../lib/dom';
import { Divider, Sparkle } from '../ui/Ornaments';
import { PremiumButton } from '../ui/PremiumButton';
import { Reveal } from '../ui/Reveal';
import { SmartImage } from '../ui/SmartImage';

export function FounderSection() {
  const { copy, config } = useInvitation();
  const { founder } = config;

  return (
    <section id="founder" className="section-alt relative overflow-hidden py-24 sm:py-32" aria-labelledby="founder-title">
      <div className="watermark" aria-hidden>
        {config.business.monogram}
      </div>
      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[5fr_6fr] lg:gap-20">
        <Reveal x={-40} y={0} className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="portrait">
            <span className="portrait-offset" aria-hidden />
            <div className="portrait-frame">
              {founder.photo ? (
                <SmartImage
                  image={founder.photo}
                  className="h-full w-full object-cover"
                  sizes="(min-width: 1024px) 420px, 80vw"
                  fallbackLabel={founder.name}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-bg-3">
                  <span className="font-display text-7xl text-gold">{founder.initials}</span>
                </div>
              )}
            </div>
            <span className="portrait-badge">
              <span className="block font-display text-[0.62rem] tracking-[0.34em] text-gold">{founder.role}</span>
              <span className="mt-1 block font-serif text-lg text-fg">{founder.name}</span>
            </span>
            <Sparkle className="float-slow absolute -right-3 top-8 text-gold" size={22} />
            <Sparkle className="float-slower absolute -left-4 bottom-24 text-gold-light" size={14} />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow">{copy.founder.eyebrow}</p>
            <h2 id="founder-title" data-section-focus className="section-title mt-4 outline-none">
              {copy.founder.heading}
            </h2>
            <Divider className="mt-6" />
          </Reveal>
          {copy.founder.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.1 + i * 0.1}>
              <p className={`mt-6 leading-relaxed text-muted sm:text-lg ${i === 0 ? 'lead-drop' : ''}`}>{p}</p>
            </Reveal>
          ))}
          <Reveal delay={0.3} className="mt-10">
            <p className="signature text-5xl sm:text-6xl">{founder.signature}</p>
            <svg className="mt-1 h-4 w-48 text-gold" viewBox="0 0 200 16" aria-hidden>
              <path d="M2 10 C40 2 90 14 130 8 C160 4 180 6 198 3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <p className="mt-3 text-sm uppercase tracking-[0.28em] text-muted">
              {founder.name} · {founder.role}
            </p>
          </Reveal>
          <Reveal delay={0.4} className="mt-10">
            <PremiumButton variant="outline" icon={ArrowRight} onClick={() => scrollToSection('showcase')}>
              Discover Our Journey
            </PremiumButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
