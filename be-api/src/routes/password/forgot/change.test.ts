import dayjs from 'dayjs';

import { ENDPOINTS, ERRORS } from 'shared';

import { DEFAULT_USER_NAME } from 'src/constants/settings';
import { findUserById, updateUserPassword } from 'src/storage/users';
import { verifyPassword } from 'src/utils/auth';
import { rollNowDateForward } from 'src/utils/dates';
import {
  afterTests,
  beforeTests,
  createTestUser,
  randomUserOptions,
  requestWithSignUp,
  server,
} from 'src/utils/tests';

const ENDPOINT = ENDPOINTS.PASSWORD_FORGOT_CHANGE;
const NEW_PASSWORD = 'yyyyxxxx';

beforeAll(beforeTests);
afterAll(afterTests);

describe(`POST '${ENDPOINT}'`, () => {
  test('If the user is logged in, return an error', async () => {
    const options = randomUserOptions();

    const result = await requestWithSignUp({
      endpoint: ENDPOINT,
      signUpUserData: options,
      method: 'post',
      requestBody: {
        code: 'xxxxyyyy',
        newPassword: NEW_PASSWORD,
      },
    });

    const { statusCode, headers, body } = result.response;

    expect(statusCode).toBe(401);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.ALREADY_LOGGED_IN });
  });

  test('If the user or code does not exist, return an error', async () => {
    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send({ code: 'xxxxyyyy', newPassword: NEW_PASSWORD });

    expect(statusCode).toBe(401);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.CONFIRMATION_CODE_NOT_VALID });
  });

  test('If the code has expired, return an error', async () => {
    const CODE = 'yyyyxxxxzzzz1';
    const options = randomUserOptions();
    const user = await createTestUser(options);

    await updateUserPassword(user._id, {
      confirm: { code: CODE, expiredAt: dayjs('2020-01-01').format() },
      hash: user.private.password.hash,
      salt: user.private.password.salt,
    });

    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send({ code: CODE, newPassword: NEW_PASSWORD });

    expect(statusCode).toBe(401);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.CONFIRMATION_CODE_EXPIRED });
  });

  test('If the code is valid, the password will be changed', async () => {
    const CODE = 'yyyyxxxxzzzz2';
    const options = randomUserOptions();

    const user = await createTestUser(options);

    await updateUserPassword(user._id, {
      confirm: { code: CODE, expiredAt: rollNowDateForward() },
      hash: user.private.password.hash,
      salt: user.private.password.salt,
    });

    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send({ code: CODE, newPassword: NEW_PASSWORD });

    const newUser = await findUserById(user._id);

    expect(statusCode).toBe(200);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']?.[0]?.includes('sessionId=')).toBeTruthy();

    expect(body).toEqual({
      _id: expect.any(String),
      role: 'contractor',
      contacts: { email: { isVerified: false, value: options.email } },
      personal: { name: DEFAULT_USER_NAME },
      private: {},
      regional: { locale: options.locale },
      settings: {},
      balance: 0,
    });

    expect(options.password).not.toBe(NEW_PASSWORD);
    expect(
      verifyPassword(options.password, user.private.password)
    ).toBeTruthy();
    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      verifyPassword(NEW_PASSWORD, newUser!.private.password)
    ).toBeTruthy();
  });
});
