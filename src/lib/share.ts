/**
 * 'shared':    the share sheet finished. That is all we know; delivery happens in the chosen app.
 * 'cancelled': the user closed the sheet (or one was already open). Not an error.
 * 'failed':    sharing was refused or broke; the caller should offer a copy instead.
 */
export type ShareOutcome = 'shared' | 'cancelled' | 'failed';

export function canShareNatively(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Opens the device's own share sheet. Call it straight from a click handler: browsers only allow it
 * during a user gesture, so nothing may be awaited before this runs.
 */
export async function shareNatively(data: ShareData): Promise<ShareOutcome> {
  try {
    if (typeof navigator.canShare === 'function' && !navigator.canShare(data)) return 'failed';
    await navigator.share(data);
    return 'shared';
  } catch (e) {
    const name = e instanceof DOMException ? e.name : '';
    return name === 'AbortError' || name === 'InvalidStateError' ? 'cancelled' : 'failed';
  }
}

/** Copies text; resolves true only if the browser confirms it. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* denied, or not a secure context: try the older route below */
  }
  return legacyCopy(text);
}

function legacyCopy(text: string): boolean {
  const previous = document.activeElement as HTMLElement | null;
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  // 16px stops iOS zooming in; it is invisible and fixed so nothing shifts or scrolls.
  field.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;pointer-events:none';
  document.body.appendChild(field);
  field.select();
  field.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  field.remove();
  previous?.focus({ preventScroll: true });
  return ok;
}
