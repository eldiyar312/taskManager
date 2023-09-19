import { IntlMessageFormat } from 'intl-messageformat';

import { Locales, defaultLocale } from 'shared';

import { DictionaryKey, locales } from 'src/i18n';

export interface MsgProps {
  id: DictionaryKey;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values?: Record<string, any>;
}

export const msg = (
  locale: Locales = defaultLocale,
  { id, values }: MsgProps
): string =>
  new IntlMessageFormat(locales[locale].dictionary[id], locale).format(values);
