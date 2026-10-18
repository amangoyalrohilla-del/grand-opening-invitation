import { Share2 } from 'lucide-react';
import { useInvitation } from '../../config/useInvitation';
import { shareInvitation } from '../../lib/share';
import { Divider, FloralSprig } from '../ui/Ornaments';
import { PremiumButton } from '../ui/PremiumButton';
import { Reveal } from '../ui/Reveal';

export function InvitationMessage() {
  const { copy, config, shareUrl } = useInvitation();
  return (
    <section id="message" className="section-paper relative overflow-hidden py-24 sm:py-36" aria-labelledby="message-title">
      <div className="paper-pattern" aria-hidden />
      <FloralSprig className="floral floral-tl" />
      <FloralSprig className="floral floral-br" />

      <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
        <Reveal>
          <p className="eyebrow eyebrow-ink">A Personal Note</p>
          <h2 id="message-title" data-section-focus className="section-title mt-5 text-ink outline-none">
            {copy.message.heading}
          </h2>
          <Divider className="mx-auto mt-7" />
        </Reveal>

        <div className="mt-10 space-y-6">
          {copy.message.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.12 * i}>
              <p className="font-serif text-xl leading-relaxed text-ink sm:text-2xl">{p}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.35} className="mt-12">
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-ink-soft">With love and gratitude</p>
          <p className="signature mt-3 text-5xl sm:text-6xl">{config.founder.signature}</p>
          <p className="mt-2 font-serif text-lg text-ink-soft">{config.hosts}</p>
        </Reveal>

        <Reveal delay={0.45} className="mt-12 flex justify-center">
          <PremiumButton
            variant="ink"
            icon={Share2}
            iconMotion="none"
            onClick={() => shareInvitation({ title: config.share.title, text: config.share.text, url: shareUrl })}
          >
            Share This Invitation
          </PremiumButton>
        </Reveal>
      </div>
    </section>
  );
}
