export type Where = 'Outdoors' | 'Indoors';

export interface Activity {
  id: string;
  title: string;
  minutes: number;
  where: Where;
  /** Short line shown on the Discover card and in the invitation message. */
  blurb: string;
  /** Subtitle on the Details screen. */
  tagline: string;
  steps: string[];
  /**
   * Photo, relative to the site root (no leading slash, so it also works under a GitHub Pages sub-path):
   * public/images/activities/<id>.jpg (1080px wide). Its small twin <id>-480.jpg sits beside it; see src/lib/images.ts.
   */
  image: string;
  /** What the photo shows, written for someone who can't see it. */
  imageAlt: string;
  /** CSS object-position, to keep the subject in frame when a card crops the photo. Defaults to the centre. */
  imageFocus?: string;
  /** Soft colours shown for a moment while the photo loads (and if it can't). */
  tint: [string, string];
  /** Quick-info chip on Details. Only set where it is worth saying; never implies a fixed party size. */
  group?: string;
  /** Indoor backup if it rains. Indoor activities have none. */
  rainyAlt?: string;
}

export const ACTIVITIES: Activity[] = [
  {
    id: 'hot-drink-walk',
    title: 'Hot Drink Walk',
    minutes: 15,
    where: 'Outdoors',
    blurb: 'Take the scenic route with something warm to drink.',
    tagline: 'A simple fifteen-minute reset, together.',
    steps: ['Pick a warm drink.', 'Meet near campus.', 'Walk for 15 minutes. No destination needed.'],
    image: 'images/activities/hot-drink-walk.jpg',
    imageAlt: 'A paper takeaway cup of hot coffee lying on a striped sweater beside deep red and golden autumn leaves',
    imageFocus: '50% 62%',
    tint: ['#EFD9C6', '#E8CDB6'],
    group: 'Great with friends',
    rainyAlt: 'rainy-day-swap',
  },
  {
    id: 'leaf-hunt',
    title: 'Leaf Hunt',
    minutes: 10,
    where: 'Outdoors',
    blurb: 'Each find the reddest, biggest and strangest leaf. Compare.',
    tagline: 'Ten minutes, pockets full of leaves, one winner.',
    steps: [
      'Head to the nearest tree-lined path.',
      'Each find the reddest, strangest leaf.',
      'Compare finds. Keep the best one.',
    ],
    image: 'images/activities/leaf-hunt.jpg',
    imageAlt: 'A hand holding a small stack of green, yellow and golden autumn leaves over a ground of fallen leaves',
    imageFocus: '50% 55%',
    tint: ['#DDE3CC', '#D3DBBF'],
    group: 'Great with friends',
    rainyAlt: 'rainy-day-swap',
  },
  {
    id: 'rainy-day-swap',
    title: 'Rainy Day Swap',
    minutes: 20,
    where: 'Indoors',
    blurb: 'Grab a warm drink and trade five questions in a quiet spot.',
    tagline: 'The same easy feeling, somewhere dry.',
    steps: ['Grab a warm drink.', 'Find a quiet corner.', 'Trade five questions each. Skip any you like.'],
    image: 'images/activities/rainy-day-swap.jpg',
    imageAlt: 'A steaming mug of tea on a stack of books next to reading glasses, in front of a rain-speckled window',
    imageFocus: '50% 70%',
    tint: ['#E3DDD3', '#DAD3C7'],
  },
  {
    id: 'golden-hour-bench',
    title: 'Golden Hour Bench',
    minutes: 20,
    where: 'Outdoors',
    blurb: 'Find a bench facing west. Stay until the light goes orange.',
    tagline: 'Twenty minutes of slow, golden light.',
    steps: [
      'Check sunset time and arrive a little early.',
      'Find a bench facing west.',
      'Stay until the light goes orange.',
    ],
    image: 'images/activities/golden-hour-bench.jpg',
    imageAlt: 'A wooden park bench among autumn trees with the low golden sun glowing behind a tree trunk',
    imageFocus: '60% 72%',
    tint: ['#F1DFC0', '#EAD4AE'],
    rainyAlt: 'cinnamon-bake',
  },
  {
    id: 'cinnamon-bake',
    title: 'Cinnamon Bake',
    minutes: 45,
    where: 'Indoors',
    blurb: 'One recipe, one oven, plenty of hands. Mess allowed.',
    tagline: 'One recipe, one warm kitchen, flour everywhere.',
    steps: [
      'Pick an easy cinnamon roll recipe.',
      'Split the dough and filling between you.',
      'Bake, wait, and eat them warm.',
    ],
    image: 'images/activities/cinnamon-bake.jpg',
    imageAlt: 'Rolled cinnamon buns in a white baking dish on a linen-covered table, with eggs, cinnamon and a rolling pin nearby',
    imageFocus: '50% 40%',
    tint: ['#EFD9C6', '#E8CDB6'],
    group: 'Great with friends',
  },
  {
    id: 'market-wander',
    title: 'Market Wander',
    minutes: 30,
    where: 'Outdoors',
    blurb: 'Walk a farmers market and each pick one thing under €3.',
    tagline: 'Half an hour, a small budget, one surprise each.',
    steps: [
      'Do a full lap before buying anything.',
      'Each pick one thing under €3.',
      'Swap and share what you found.',
    ],
    image: 'images/activities/market-wander.jpg',
    imageAlt: 'Bright orange pumpkins piled in a weathered wooden crate at an autumn market stall',
    imageFocus: '50% 50%',
    tint: ['#DDE3CC', '#D3DBBF'],
    group: 'Great with friends',
    rainyAlt: 'cinnamon-bake',
  },
];

export function getActivity(id: string | undefined): Activity | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}
