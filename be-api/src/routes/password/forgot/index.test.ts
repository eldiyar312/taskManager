import { ENDPOINTS, ERRORS } from 'shared';

import { findUserById } from 'src/storage/users';
import {
  afterTests,
  beforeTests,
  createTestUser,
  randomUserOptions,
  requestWithSignUp,
  server,
} from 'src/utils/tests';

const ENDPOINT = ENDPOINTS.PASSWORD_FORGOT;

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

  test('If the user does not exist, return false', async () => {
    const options = randomUserOptions();

    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send(options);

    expect(statusCode).toBe(200);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ status: false });
  });

  test('If the user is exist, return true', async () => {
    const options = randomUserOptions();
    const oldUser = await createTestUser(options);

    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send(options);

    const newUser = await findUserById(oldUser._id);

    expect(statusCode).toBe(200);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ status: true });

    expect(oldUser?.private.password.recovery?.code).toBeUndefined();
    expect(newUser?.private.password.recovery?.code).toBeDefined();
  });
});
