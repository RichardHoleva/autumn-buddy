export type WhenKey = 'after-class' | 'this-weekend' | 'flexible';

export const WHEN: Record<WhenKey, { label: string }> = {
  'after-class': { label: 'After class' },
  'this-weekend': { label: 'This weekend' },
  flexible: { label: 'Flexible' },
};

export const WHEN_KEYS = Object.keys(WHEN) as WhenKey[];

/**
 * Placeholder: there is no weather service wired up yet, so this is the same every day.
 * Replace with a real forecast lookup when one is added.
 */
export const WEATHER = {
  temperature: '11°',
};
