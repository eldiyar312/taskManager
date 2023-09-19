import { Locales, defaultLocale } from 'shared';

import { ru } from 'src/i18n/dictionaries/ru';
import { events } from 'src/i18n/dictionaries/ru/events';

export type Dictionary = typeof ru;
export type DictionaryKey = keyof Dictionary;
export type Events = keyof typeof events;

/**
 * As keys are used BCP 47 locale identifiers
 * (see ECMAScript Intl standard)
 */
export const locales: Record<
  Locales,
  { title: string; dictionary: Dictionary }
> = {
  ru: {
    title: 'Русский',
    dictionary: ru,
  },
} as const;

export const defaultDictionary = locales[defaultLocale].dictionary;
