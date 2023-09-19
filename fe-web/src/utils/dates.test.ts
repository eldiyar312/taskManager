import { FORMAT, format, isValid } from 'src/utils/dates';

describe('Date validation', () => {
  test('should return false if the date is undefined', () => {
    expect(isValid(undefined)).toBeFalsy();
  });

  test('should return false if the date is wrong', () => {
    expect(isValid('wrong format date')).toBeFalsy();
  });

  test('should return true if the date is correct', () => {
    expect(isValid('2019-01-01T00:00:00.000Z')).toBeTruthy();
    expect(isValid('2022-09-15T10:41:18.580Z')).toBeTruthy();
  });
});

describe('Format dates', () => {
  test('should return null if the date is undefined', () => {
    expect(format(undefined)).toBeNull();
  });

  test('should return null if the date is wrong', () => {
    expect(format('wrong format date')).toBeNull();
  });

  test('should return formatted value if the date is correct', () => {
    expect(format('2019-01-01T00:00:00.000Z')).toBe('2019-01-01');
    expect(format('2022-09-15T10:41:18.580Z')).toBe('2022-09-15');
  });

  test('should return custom formatted value if formatter is specified', () => {
    expect(format('2019-01-01T00:00:00.000', FORMAT.DATETIME)).toBe(
      '2019-01-01 00:00'
    );
    expect(format('2022-09-15T10:41:18.580', FORMAT.DATETIME)).toBe(
      '2022-09-15 10:41'
    );
    expect(format('2019-01-01T00:00:00.000', FORMAT.TIME)).toBe('00:00');
    expect(format('2022-09-15T10:41:18.580', FORMAT.TIME)).toBe('10:41');
  });
});
