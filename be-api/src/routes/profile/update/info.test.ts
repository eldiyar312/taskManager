import { ENDPOINTS, ERRORS } from 'shared';

import { findUserById } from 'src/storage/users';
import { generateRandomString } from 'src/utils/auth';
import {
  afterTests,
  beforeTests,
  randomUserOptions,
  requestWithSignUp,
  server,
} from 'src/utils/tests';

const ENDPOINT = ENDPOINTS.PROFILE;

beforeAll(beforeTests);
afterAll(afterTests);

describe(`PUT '${ENDPOINT}'`, () => {
  test('If the user is not logged in, return an error', async () => {
    const { statusCode, headers, body } = await server.get(ENDPOINT);

    expect(statusCode).toBe(401);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.NEED_TO_LOGIN });
  });

  test('If the user is logged in, personal name, return a updated user', async () => {
    const options = randomUserOptions();

    const newUserData = {
      personalName: generateRandomString(),
    };

    const result = await requestWithSignUp({
      endpoint: ENDPOINT,
      signUpUserData: options,
      method: 'put',
      requestBody: newUserData,
    });

    const { statusCode, headers, body } = result.response;

    const newUser = await findUserById(result.user._id);

    expect(statusCode).toBe(200);

    expect(headers['set-cookie']?.[0]).toBeUndefined();
    expect(headers['content-type']).toBe('application/json; charset=utf-8');

    expect(body).toEqual({
      _id: expect.any(String),
      role: 'contractor',
      contacts: {
        email: {
          isVerified: false,
          value: options.email,
        },
      },
      personal: { name: newUserData.personalName },
      private: {},
      regional: { locale: options.locale },
      settings: {},
      balance: 0,
    });

    expect(newUser?.personal.name).toBe(newUserData.personalName);
  });

  test('If the user is logged in, all data, return a updated user', async () => {
    const options = randomUserOptions();

    const newUserData = {
      personalName: generateRandomString(),
      locale: 'ru',
    };

    const result = await requestWithSignUp({
      endpoint: ENDPOINT,
      signUpUserData: options,
      method: 'put',
      requestBody: newUserData,
    });

    const { statusCode, headers, body } = result.response;

    const newUser = await findUserById(result.user._id);

    expect(statusCode).toBe(200);

    expect(headers['set-cookie']?.[0]).toBeUndefined();
    expect(headers['content-type']).toBe('application/json; charset=utf-8');

    expect(body).toEqual({
      _id: expect.any(String),
      role: 'contractor',
      contacts: {
        email: {
          isVerified: false,
          value: options.email,
        },
      },
      personal: { name: newUserData.personalName },
      private: {},
      regional: { locale: newUserData.locale },
      settings: {},
      balance: 0,
    });

    expect(newUser?.personal.name).toBe(newUserData.personalName);
    expect(newUser?.regional.locale).toBe(newUserData.locale);
  });
});
