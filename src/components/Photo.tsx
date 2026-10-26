import type { CSSProperties, ReactNode } from 'react';
import type { Activity } from '../data/activities';

interface Props {
  activity: Activity;
  /** Stripe width of the placeholder pattern, in px. */
  stripe?: number;
  className?: string;
  /** Overrides the default "photo: ..." caption. */
  caption?: ReactNode;
  label?: string;
  children?: ReactNode;
}

/** Striped placeholder in the activity's tint, or the activity's real image when one is set. */
export function Photo({ activity, stripe = 8, className, caption, label, children }: Props) {
  const [a, b] = activity.tint;
  const style: CSSProperties = {
    color: activity.ink,
    background: activity.image
      ? `center / cover no-repeat url(${activity.image})`
      : `repeating-linear-gradient(135deg, ${a} 0 ${stripe}px, ${b} ${stripe}px ${stripe * 2}px)`,
  };
  return (
    <div className={className} style={style} role="img" aria-label={label ?? activity.photo}>
      {caption !== undefined ? caption : <span>photo: {activity.photo}</span>}
      {children}
    </div>
  );
}
