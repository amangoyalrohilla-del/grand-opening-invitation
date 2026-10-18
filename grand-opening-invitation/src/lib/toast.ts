export const TOAST_EVENT = 'invitation:toast';

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }));
}
