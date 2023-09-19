import { createArray } from 'src/utils/lib';

describe('Generating arrays of a given length', () => {
  const length = 4;

  test('Should return an empty array with length 1', () => {
    expect(createArray(undefined as never)).toEqual(['']);
  });

  test('Should return an empty array with length 4', () => {
    expect(createArray(length)).toEqual(['', '', '', '']);
  });
});
