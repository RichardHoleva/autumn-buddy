import type { Activity } from '../data/activities';

/** Widths of the two files kept for every photo: <name>.jpg and <name>-480.jpg. */
const LARGE_W = 1080;
const SMALL_W = 480;

/**
 * Turns a path like "images/activities/leaf-hunt.jpg" into a URL that works wherever the app is hosted.
 * The build uses a relative base, so this never starts with "/" (which would break under a GitHub Pages sub-path).
 */
export const assetUrl = (path: string) => import.meta.env.BASE_URL + path;

/** The photo's URL and its srcset, so the browser downloads the small file for thumbnails and the large one for cards. */
export function photoSources(activity: Activity) {
  const large = assetUrl(activity.image);
  const small = assetUrl(activity.image.replace(/\.jpg$/, `-${SMALL_W}.jpg`));
  return { src: large, srcSet: `${small} ${SMALL_W}w, ${large} ${LARGE_W}w` };
}

/** Starts downloading a photo ahead of time so the next card appears already loaded. */
export function preloadPhoto(activity: Activity, sizes: string) {
  const { src, srcSet } = photoSources(activity);
  const img = new Image();
  img.sizes = sizes;
  img.srcset = srcSet;
  img.src = src;
}
