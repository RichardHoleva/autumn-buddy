import type { Activity } from '../data/activities';
import type { WhenKey } from '../data/when';

/** The last sentence of the message, and the only part that depends on the time chip. */
const CLOSING: Record<WhenKey, string> = {
  'after-class': 'Anyone up for going after class?',
  'this-weekend': 'Anyone up for going this weekend?',
  flexible: 'Anyone up for it? Happy to find a time that suits everyone.',
};

/** A friendly default that works for one friend or a group chat and makes sense without the app. */
export function buildMessage(a: Activity, when: WhenKey): string {
  const where = a.where === 'Outdoors' ? 'outdoors' : 'indoors';
  return `Hey! 🍂 Found a cozy autumn idea: ${a.title}. ${a.blurb} It's about ${a.minutes} minutes, ${where}. ${CLOSING[when]}`;
}

/**
 * Points an edited message at a new time. Only the suggested closing line is swapped, and only if the
 * sender left it in; anything they rewrote themselves is never touched.
 */
export function retimeMessage(text: string, from: WhenKey, to: WhenKey): string {
  return text.includes(CLOSING[from]) ? text.replace(CLOSING[from], () => CLOSING[to]) : text;
}

/** False for hosts a friend's phone could never reach: localhost, LAN addresses, bare machine names. */
function isPublicHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (!h.includes('.') || h.includes(':')) return false; // single-label names (localhost, my-pc) and IPv6 literals
  if (/\.(localhost|local|lan|internal|home\.arpa)$/.test(h)) return false;

  const v4 = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const a = Number(v4[1]);
    const b = Number(v4[2]);
    const reserved =
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168);
    return !reserved;
  }
  return true;
}

type Loc = Pick<Location, 'protocol' | 'hostname' | 'origin' | 'pathname'>;

function detailsUrl(id: string, loc: Loc): string {
  // A file: page reports its origin as the string "null", so build that one from the protocol instead.
  const base = loc.origin && loc.origin !== 'null' ? loc.origin : `${loc.protocol}//`;
  return `${base}${loc.pathname}#/details/${encodeURIComponent(id)}`;
}

/**
 * Link to an activity's details page, which the app already serves without any account (hash routing,
 * so it works on GitHub Pages). Returns undefined when this copy of the app is not publicly reachable,
 * because a link to localhost or a LAN address would just be broken in someone else's chat.
 */
export function activityUrl(id: string, loc: Loc = window.location): string | undefined {
  if (loc.protocol !== 'https:' && loc.protocol !== 'http:') return undefined;
  if (!isPublicHost(loc.hostname)) return undefined;
  return detailsUrl(id, loc);
}

/**
 * The same link for whoever is using this copy of the app, even when it only works on this device
 * (localhost, a LAN address, a local file). Used by "Copy link", which is always an explicit choice;
 * it is never added to a shared message unless activityUrl() approves it too.
 */
export function deviceActivityUrl(id: string, loc: Loc = window.location): string | undefined {
  if (loc.protocol !== 'https:' && loc.protocol !== 'http:' && loc.protocol !== 'file:') return undefined;
  return detailsUrl(id, loc);
}
