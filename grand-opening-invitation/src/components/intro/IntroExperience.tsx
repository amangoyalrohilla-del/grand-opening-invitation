import { useEffect, useState } from 'react';
import { useInvitation } from '../../config/useInvitation';
import { lockScroll } from '../../lib/dom';
import { IntroGate } from './IntroGate';
import { RibbonCutting } from './RibbonCutting';

interface Props {
  onFinish: () => void;
}

/** Orchestrates gate → ribbon → site. Always escapable (Skip / Esc), never traps the visitor. */
export function IntroExperience({ onFinish }: Props) {
  const { config } = useInvitation();
  const [stage, setStage] = useState<'gate' | 'ribbon'>('gate');

  useEffect(() => lockScroll(), []);

  return (
    <div className="intro-root">
      {stage === 'gate' && (
        <IntroGate onSkip={onFinish} onComplete={() => (config.intro.ribbon ? setStage('ribbon') : onFinish())} />
      )}
      {stage === 'ribbon' && <RibbonCutting onSkip={onFinish} onComplete={onFinish} />}
    </div>
  );
}
