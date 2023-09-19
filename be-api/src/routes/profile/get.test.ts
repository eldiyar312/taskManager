import { ENDPOINTS, ERRORS } from 'shared';

import { DEFAULT_USER_NAME } from 'src/constants/settings';
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

describe(`GET '${ENDPOINT}'`, () => {
  test('If the user is not logged in, return an error', async () => {
    const { statusCode, headers, body } = await server.get(ENDPOINT);

    expect(statusCode).toBe(401);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.NEED_TO_LOGIN });
  });

  test('If the user logged in, ROLE: user, return a user', async () => {
    const options = randomUserOptions();

    const result = await requestWithSignUp({
      endpoint: ENDPOINT,
      signUpUserData: options,
    });

    const { statusCode, headers, body } = result.response;

    expect(statusCode).toBe(200);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

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
  });
});
