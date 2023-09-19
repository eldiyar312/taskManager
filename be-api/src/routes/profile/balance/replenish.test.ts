import { ENDPOINTS } from 'shared';

import { DEFAULT_USER_NAME } from 'src/constants/settings';
import {
  afterTests,
  beforeTests,
  randomUserOptions,
  requestWithSignUp,
} from 'src/utils/tests';

const ENDPOINT = ENDPOINTS.PROFILE_BALANCE_REPLENISH;

beforeAll(beforeTests);
afterAll(afterTests);

describe(`POST '${ENDPOINT}'`, () => {
  test('Replenish user profile balance', async () => {
    const options = randomUserOptions({ role: 'customer' });

    const amount = 100.01;

    const result = await requestWithSignUp({
      endpoint: ENDPOINT,
      method: 'post',
      signUpUserData: options,
      requestBody: { amount, paymentMethod: 'invoice' },
    });

    const { statusCode, headers, body } = result.response;

    expect(statusCode).toBe(200);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({
      _id: expect.any(String),
      role: 'customer',
      balance: amount,
      contacts: { email: { isVerified: false, value: options.email } },
      personal: { name: DEFAULT_USER_NAME },
      private: {},
      regional: { locale: options.locale },
      settings: {},
    });
  });
});
