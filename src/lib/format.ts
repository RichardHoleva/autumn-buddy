export const pad2 = (n: number) => String(n).padStart(2, '0');

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** "MON 26 OCT" */
export function dateLine(d: Date = new Date()): string {
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function timeAgo(ts: number, now: number = Date.now()): string {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? 'yesterday' : `${d} days ago`;
}

export function newId(): string {
  // crypto.randomUUID is unavailable on plain-http LAN addresses, so avoid it.
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
