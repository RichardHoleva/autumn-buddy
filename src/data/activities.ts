export type Where = 'Outdoors' | 'Indoors';

export interface Activity {
  id: string;
  no: number;
  title: string;
  minutes: number;
  where: Where;
  /** Short line shown on the Discover card. */
  blurb: string;
  /** Subtitle on the Details screen. */
  tagline: string;
  steps: string[];
  /** Placeholder-photo captions. Set `image` to a URL to show a real photo instead. */
  photo: string;
  detailPhoto: string;
  image?: string;
  tint: [string, string];
  ink: string;
  /** Fits "Fancy ___ after class?" in the default invite message. */
  invitePhrase: string;
  near: string;
  meet: string;
  /** Quick-info chip on Details. Only set where it is worth saying; never implies a fixed party size. */
  group?: string;
  /** Indoor backup if it rains. Indoor activities have none. */
  rainyAlt?: string;
}

export const ACTIVITIES: Activity[] = [
  {
    id: 'hot-drink-walk',
    no: 1,
    title: 'Hot Drink Walk',
    minutes: 15,
    where: 'Outdoors',
    blurb: 'Take the scenic route with something warm to drink.',
    tagline: 'A simple fifteen-minute reset, together.',
    steps: ['Pick a warm drink.', 'Meet near campus.', 'Walk for 15 minutes. No destination needed.'],
    photo: 'steaming cup, park path',
    detailPhoto: 'steaming cup on a park path',
    tint: ['#EFD9C6', '#E8CDB6'],
    ink: '#8A4A28',
    invitePhrase: 'a quick hot drink walk',
    near: 'NEAR CAMPUS',
    meet: 'Campus café entrance',
    group: 'Great with friends',
    rainyAlt: 'rainy-day-swap',
  },
  {
    id: 'leaf-hunt',
    no: 2,
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
    photo: 'hands holding leaves',
    detailPhoto: 'hands holding autumn leaves',
    tint: ['#DDE3CC', '#D3DBBF'],
    ink: '#55603F',
    invitePhrase: 'a little leaf hunt',
    near: 'NEAR CAMPUS',
    meet: 'Main quad, by the big oak',
    group: 'Great with friends',
    rainyAlt: 'rainy-day-swap',
  },
  {
    id: 'rainy-day-swap',
    no: 3,
    title: 'Rainy Day Swap',
    minutes: 20,
    where: 'Indoors',
    blurb: 'Grab a warm drink and trade five questions in a quiet spot.',
    tagline: 'The same easy feeling, somewhere dry.',
    steps: ['Grab a warm drink.', 'Find a quiet corner.', 'Trade five questions each. Skip any you like.'],
    photo: 'two mugs, rainy window',
    detailPhoto: 'two mugs by a rainy window',
    tint: ['#E3DDD3', '#DAD3C7'],
    ink: '#6E655A',
    invitePhrase: 'a cozy rainy day swap',
    near: 'INDOORS',
    meet: 'Library café, back corner',
  },
  {
    id: 'golden-hour-bench',
    no: 4,
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
    photo: 'bench at sunset',
    detailPhoto: 'a bench in low golden light',
    tint: ['#F1DFC0', '#EAD4AE'],
    ink: '#86602A',
    invitePhrase: 'a golden hour bench sit',
    near: 'NEAR CAMPUS',
    meet: 'West-facing bench by the pond',
    rainyAlt: 'cinnamon-bake',
  },
  {
    id: 'cinnamon-bake',
    no: 5,
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
    photo: 'flour, cinnamon rolls',
    detailPhoto: 'cinnamon rolls on a floury counter',
    tint: ['#EFD9C6', '#E8CDB6'],
    ink: '#8A4A28',
    invitePhrase: 'a cinnamon bake',
    near: 'INDOORS',
    meet: 'Whoever has the better oven',
    group: 'Great with friends',
  },
  {
    id: 'market-wander',
    no: 6,
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
    photo: 'pumpkins at a stall',
    detailPhoto: 'pumpkins stacked at a market stall',
    tint: ['#DDE3CC', '#D3DBBF'],
    ink: '#55603F',
    invitePhrase: 'a market wander',
    near: 'TOWN CENTRE',
    meet: 'Market entrance, by the flower stall',
    group: 'Great with friends',
    rainyAlt: 'cinnamon-bake',
  },
];

export const TOTAL = ACTIVITIES.length;

export function getActivity(id: string | undefined): Activity | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}
