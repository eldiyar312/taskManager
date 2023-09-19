import dayjs from 'dayjs';

import { getDateISO, isValidRange } from 'src/utils/dates';

const now = getDateISO();
const tomorrow = dayjs().startOf('day').add(1, 'day').toISOString();
const yesterday = dayjs().startOf('day').subtract(1, 'day').toISOString();

describe('Valid range', () => {
  test('valid dates = return true', () => {
    expect(isValidRange({ startAt: now, endAt: tomorrow })).toBe(true);
  });
  test('startAt > endAt = return false', () => {
    expect(isValidRange({ startAt: tomorrow, endAt: now })).toBe(false);
  });
  test('endAt missing = return true', () => {
    expect(isValidRange({ startAt: tomorrow })).toBe(true);
  });
  test('endAt missing and startAt < now = return false', () => {
    expect(isValidRange({ startAt: yesterday })).toBe(false);
  });
  test('startAt < now = return false', () => {
    expect(isValidRange({ startAt: yesterday, endAt: tomorrow })).toBe(false);
  });
});
