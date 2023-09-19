import { ENDPOINTS, ERRORS } from 'shared';

import {
  afterTests,
  beforeTests,
  randomUserOptions,
  requestWithSignUp,
  server,
} from 'src/utils/tests';

const ENDPOINT = ENDPOINTS.SIGN_OUT;

beforeAll(beforeTests);
afterAll(afterTests);

describe(`POST '${ENDPOINT}'`, () => {
  test('If the user is not logged in, return an error', async () => {
    const options = randomUserOptions();

    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send(options);

    expect(statusCode).toBe(401);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.NEED_TO_LOGIN });
  });

  test('If the user is logged in, log him out', async () => {
    const options = randomUserOptions();

    const result = await requestWithSignUp({
      endpoint: ENDPOINT,
      signUpUserData: options,
      method: 'post',
      requestBody: options,
    });

    const { statusCode, headers, body } = result.response;

    expect(statusCode).toBe(200);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ status: true });
  });
});
