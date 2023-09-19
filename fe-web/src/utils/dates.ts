import 'dayjs/locale/en';
import 'dayjs/locale/ru';

import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';

export { Dayjs } from 'dayjs';

dayjs.extend(localeData);

export const dt = dayjs;

export enum FORMAT {
  DEFAULT = 'YYYY-MM-DD',
  DATETIME = 'YYYY-MM-DD HH:mm',
  TIME = 'HH:mm',
}

export const changeLocale = (locale: string) => dayjs.locale(locale);

export const isValid = (date?: string | number): boolean =>
  date ? dayjs(date).isValid() : false;

export const format = (
  date?: string,
  format: FORMAT = FORMAT.DEFAULT
): string | null => (isValid(date) ? dayjs(date).format(format) : null);
