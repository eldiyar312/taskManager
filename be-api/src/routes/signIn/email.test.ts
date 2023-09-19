import { ENDPOINTS, ERRORS } from 'shared';

import { DEFAULT_USER_NAME } from 'src/constants/settings';
import {
  afterTests,
  beforeTests,
  createTestUser,
  randomUserOptions,
  requestWithSignUp,
  server,
} from 'src/utils/tests';

const ENDPOINT = ENDPOINTS.SIGN_IN_EMAIL;

beforeAll(beforeTests);
afterAll(afterTests);

describe(`POST '${ENDPOINT}'`, () => {
  test('If the user is logged in, return an error', async () => {
    const options = randomUserOptions();

    const result = await requestWithSignUp({
      endpoint: ENDPOINT,
      signUpUserData: options,
      method: 'post',
      requestBody: options,
    });

    const { statusCode, headers, body } = result.response;

    expect(statusCode).toBe(401);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.ALREADY_LOGGED_IN });
  });

  test('If the user does not exist, an error will be returned', async () => {
    const options = randomUserOptions();

    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send(options);

    expect(statusCode).toBe(401);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.INVALID_EMAIL_OR_PASSWORD });
  });

  test('If the password is incorrect, an error will be returned', async () => {
    const options = randomUserOptions();
    await createTestUser({
      ...options,
      password: 'another_password',
    });

    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send(options);

    expect(statusCode).toBe(401);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.INVALID_EMAIL_OR_PASSWORD });
  });

  test('If the user is valid, log him in', async () => {
    const options = randomUserOptions();
    const oldUser = await createTestUser(options);
    const oldUserId = oldUser._id.toString();

    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send(options);

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

    expect(oldUserId).toBeDefined();
    expect(oldUserId).toBe(body._id);
  });
});
