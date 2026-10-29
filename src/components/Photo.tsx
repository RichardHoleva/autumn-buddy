import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { Activity } from '../data/activities';
import { photoSources } from '../lib/images';

interface Props {
  activity: Activity;
  className?: string;
  /** How wide the photo is shown, as an <img sizes> value, so the browser can pick the small or large file. */
  sizes: string;
  /** Load straight away (for what is on screen first) instead of when it nears the viewport. */
  eager?: boolean;
  /** Overlays such as the swipe stamps. */
  children?: ReactNode;
}

/**
 * An activity's photo, cropped with object-fit: cover so it never distorts. The box (set by `className`) decides the
 * shape, so nothing shifts while the image loads; until then, and if it fails, the activity's soft tint shows instead.
 */
export function Photo({ activity, className, sizes, eager, children }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  // A cached photo can finish before React has attached onLoad, so check once on mount as well.
  useEffect(() => {
    if (img.current?.complete && img.current.naturalWidth > 0) setLoaded(true);
  }, []);
  const [a, b] = activity.tint;
  const style: CSSProperties = { background: `linear-gradient(135deg, ${a}, ${b})` };
  const { src, srcSet } = photoSources(activity);

  return (
    // If the file can't load, the box itself carries the description so the screen still makes sense to a screen reader.
    <div className={className ? `photo ${className}` : 'photo'} style={style} {...(failed ? { role: 'img', 'aria-label': activity.imageAlt } : {})}>
      {!failed && (
        <img
          ref={img}
          className={loaded ? 'photo__img photo__img--on' : 'photo__img'}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={activity.imageAlt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          style={activity.imageFocus ? { objectPosition: activity.imageFocus } : undefined}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
      {children}
    </div>
  );
}
