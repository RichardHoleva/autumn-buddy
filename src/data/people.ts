export interface Person {
  id: string;
  name: string;
  first: string;
  initials: string;
  tint: string;
}

/** The person using the app. */
export const ME: Person = { id: 'me', name: 'Sam', first: 'Sam', initials: 'S', tint: '#F6F2EA' };

export const FRIENDS: Person[] = [
  { id: 'alex', name: 'Alex Morgan', first: 'Alex', initials: 'AM', tint: '#DDE3CC' },
  { id: 'jo', name: 'Jo Bennett', first: 'Jo', initials: 'JO', tint: '#DDE3CC' },
  { id: 'priya', name: 'Priya Nair', first: 'Priya', initials: 'PR', tint: '#E3DDD3' },
];

export function getFriend(id: string | undefined): Person | undefined {
  return FRIENDS.find((f) => f.id === id);
}
