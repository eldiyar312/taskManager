import { ENDPOINTS, ERRORS } from 'shared';

import { findUserById } from 'src/storage/users';
import { verifyPassword } from 'src/utils/auth';
import {
  afterTests,
  beforeTests,
  randomUserOptions,
  requestWithSignUp,
  server,
} from 'src/utils/tests';

const ENDPOINT = ENDPOINTS.PASSWORD_CHANGE;
const NEW_PASSWORD = 'yyyyxxxx';

beforeAll(beforeTests);
afterAll(afterTests);

describe(`POST '${ENDPOINT}'`, () => {
  test('If the user is not logged in, return an error', async () => {
    const options = randomUserOptions();

    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send({ password: options.password, newPassword: NEW_PASSWORD });

    expect(statusCode).toBe(401);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.NEED_TO_LOGIN });
  });

  test("If the user's password does not match, return an error", async () => {
    const options = randomUserOptions();

    const result = await requestWithSignUp({
      endpoint: ENDPOINT,
      signUpUserData: options,
      method: 'post',
      requestBody: {
        password: 'another_password',
        newPassword: NEW_PASSWORD,
      },
    });

    const { statusCode, headers, body } = result.response;

    expect(statusCode).toBe(401);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.INCORRECT_PASSWORD });
  });

  test("If the user's password matches, the password will be changed", async () => {
    const options = randomUserOptions();

    const result = await requestWithSignUp({
      endpoint: ENDPOINT,
      signUpUserData: options,
      method: 'post',
      requestBody: {
        password: options.password,
        newPassword: NEW_PASSWORD,
      },
    });

    const { statusCode, headers, body } = result.response;

    const newUser = await findUserById(result.user._id);

    expect(statusCode).toBe(200);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');

    expect(body).toEqual({ status: true });
    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      verifyPassword(NEW_PASSWORD, newUser!.private.password)
    ).toBeTruthy();
  });
});
