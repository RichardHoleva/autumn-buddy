export type WhenKey = 'after-class' | 'this-weekend' | 'flexible';

export const WHEN: Record<WhenKey, { label: string; phrase: string; plan: string }> = {
  'after-class': { label: 'After class', phrase: 'after class', plan: 'After class, 4:15 PM' },
  'this-weekend': { label: 'This weekend', phrase: 'this weekend', plan: 'Saturday, 11:00 AM' },
  flexible: { label: 'Flexible', phrase: 'sometime soon', plan: 'Flexible, you two pick' },
};

export const WHEN_KEYS = Object.keys(WHEN) as WhenKey[];

/**
 * Placeholder values: there is no weather service wired up yet.
 * Replace with a real forecast lookup when one is added.
 */
export const WEATHER = {
  temperature: '11°',
  sunset: '17:42',
  rainFrom: '15:00',
};
