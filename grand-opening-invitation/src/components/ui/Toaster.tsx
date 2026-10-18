import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TOAST_EVENT } from '../../lib/toast';

export function Toaster() {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    let timer = 0;
    const onToast = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setMessage(null), 3600);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {message && (
        <div className="toast">
          <Check size={16} strokeWidth={2} className="shrink-0 text-gold" aria-hidden />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
