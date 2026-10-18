import { Palette, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';
import { presetList } from '../../config/presets';
import { themeList } from '../../config/themes';
import { useInvitation } from '../../config/useInvitation';

/**
 * Sales-demo panel: lets a prospective client preview every theme and event type live.
 * Disable with `demoControls: false` in event.config.ts before sending to guests.
 */
export function DemoControls({ onReplay }: { onReplay: () => void }) {
  const { themeId, eventType, setTheme, setEventType } = useInvitation();
  const [open, setOpen] = useState(false);

  return (
    <div className="demo-dock">
      {open && (
        <div className="demo-panel" role="dialog" aria-label="Preview options">
          <div className="flex items-center justify-between">
            <p className="font-display text-[0.7rem] uppercase tracking-[0.3em] text-gold">Template Preview</p>
            <button type="button" className="demo-close" onClick={() => setOpen(false)} aria-label="Close preview options">
              <X size={16} />
            </button>
          </div>

          <fieldset className="mt-5">
            <legend className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">Event type</legend>
            <div className="mt-3 grid grid-cols-1 gap-1.5">
              {presetList.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={eventType === p.id}
                  className={`demo-option ${eventType === p.id ? 'is-active' : ''}`}
                  onClick={() => setEventType(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">Colour theme</legend>
            <div className="mt-3 grid grid-cols-1 gap-1.5">
              {themeList.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={themeId === t.id}
                  className={`demo-option ${themeId === t.id ? 'is-active' : ''}`}
                  onClick={() => setTheme(t.id)}
                >
                  <span className="demo-swatch" style={{ background: `linear-gradient(135deg, ${t.vars['--bg']} 50%, ${t.vars['--gold']} 50%)` }} aria-hidden />
                  <span>
                    {t.label}
                    <span className="block text-[0.7rem] text-muted">{t.note}</span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            className="demo-option mt-5 w-full justify-center"
            onClick={() => {
              setOpen(false);
              onReplay();
            }}
          >
            <RotateCcw size={14} aria-hidden /> Replay opening
          </button>
        </div>
      )}
      <button type="button" className="demo-fab" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Preview themes and event types">
        <Palette size={20} strokeWidth={1.5} />
      </button>
    </div>
  );
}
