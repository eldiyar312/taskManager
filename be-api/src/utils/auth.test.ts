import {
  createPasswordHash,
  generateRandomString,
  generateRandomStringBasedOnString,
  verifyPassword,
} from 'src/utils/auth';

const passwordSalt = 'test-test-test';
const passwordHash =
  '28ebafa2308782bc58d2906129c1726449f72406002e6e6a15b66ccb8571916d';

describe('Generate random string', () => {
  test('string is not empty', () => {
    expect(generateRandomString()).toBeTruthy();
  });

  test('each new string is unique', () => {
    const randomStrings: string[] = [];

    for (let i = 0; i < 10; i++) {
      const randomString = generateRandomString();

      if (!randomStrings.includes(randomString)) {
        randomStrings.push(randomString);
      }
    }

    expect(randomStrings.length).toBe(10);
  });
});

describe('Generate random string based on string', () => {
  test('string is not empty', () => {
    expect(generateRandomStringBasedOnString('test')).toBeTruthy();
  });

  test('each new string is unique', () => {
    const randomStrings: string[] = [];

    for (let i = 0; i < 10; i++) {
      const randomString = generateRandomStringBasedOnString('test');

      if (!randomStrings.includes(randomString)) {
        randomStrings.push(randomString);
      }
    }

    expect(randomStrings.length).toBe(10);
  });
});

describe('Create password hash', () => {
  test('created correctly', () => {
    expect(createPasswordHash('password', passwordSalt)).toBe(passwordHash);
  });
});

describe('Verify password', () => {
  test('true if the password is correct', () => {
    expect(
      verifyPassword('password', {
        salt: passwordSalt,
        hash: passwordHash,
      })
    ).toBeTruthy();
  });

  test('false if the password is incorrect', () => {
    expect(
      verifyPassword('incorrectPassword', {
        salt: passwordSalt,
        hash: passwordHash,
      })
    ).toBeFalsy();
  });
});
