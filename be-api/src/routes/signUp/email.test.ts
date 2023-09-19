import { ENDPOINTS, ERRORS } from 'shared';

import { DEFAULT_USER_NAME } from 'src/constants/settings';
import { findUserByEmail } from 'src/storage/users';
import { generateRandomString } from 'src/utils/auth';
import {
  afterTests,
  beforeTests,
  createTestUser,
  randomUserOptions,
  server,
} from 'src/utils/tests';

const ENDPOINT = ENDPOINTS.SIGN_UP_EMAIL;

beforeAll(beforeTests);
afterAll(afterTests);

describe(`POST '${ENDPOINT}'`, () => {
  test('If the user is logged in, return an error', async () => {
    const options = randomUserOptions();
    const result = await server.post(ENDPOINT).send(options);

    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .set('Cookie', result.headers['set-cookie']?.[0])
      .send(options);

    expect(statusCode).toBe(401);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.ALREADY_LOGGED_IN });
  });

  test('If the email is invalid, return an error', async () => {
    const options = randomUserOptions();
    const result = await server.post(ENDPOINT).send(options);

    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .set('Cookie', result.headers['set-cookie']?.[0])
      .send({ ...options, email: generateRandomString() });

    expect(statusCode).toBe(400);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'body/email must match format "email"',
    });
  });

  test('If the user does not agree with the terms, registration is not possible', async () => {
    const options = {
      ...randomUserOptions(),
      isAgreeTerms: false,
    };

    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send(options);

    expect(statusCode).toBe(451);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.NEED_TO_ACCEPT_TERMS });
  });

  test('If the user does not exist, it will be created', async () => {
    const options = randomUserOptions();
    const oldUser = await findUserByEmail(options.email);

    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send(options);

    const newUser = await findUserByEmail(options.email);
    const newUserId = newUser?._id.toString();

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

    expect(oldUser).toBeUndefined();
    expect(newUserId).toBeDefined();
    expect(newUserId).toBe(body._id);
  });

  test('If the user exists but the password does not match, an error will be returned', async () => {
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

    expect(body).toEqual({ error: ERRORS.EMAIL_ALREADY_EXISTS });
  });

  test('If the user exists and his password matches, that user will be returned instead of being created', async () => {
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
