import { ENDPOINTS, ERRORS } from 'shared';

import { DEFAULT_USER_NAME } from 'src/constants/settings';
import { findUserById } from 'src/storage/users';
import {
  afterTests,
  beforeTests,
  generateRandomEmail,
  makeRequest,
  randomUserOptions,
} from 'src/utils/tests';

const ENDPOINT = ENDPOINTS.PROFILE_EMAIL;

beforeAll(beforeTests);
afterAll(afterTests);

describe(`PUT '${ENDPOINT}'`, () => {
  test('If the user is not logged in, return an error', async () => {
    // Created new user
    const newEmail = generateRandomEmail();

    const { response, cookie } = await makeRequest({
      endpoint: ENDPOINT,
      cookie: 'randomcookie',
      method: 'put',
      requestBody: { email: newEmail },
    });

    const { body } = response;

    // Check HTTP response
    expect(response.statusCode).toBe(401);

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(cookie).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.NEED_TO_LOGIN });
  });

  test('If the user logged in, email not confirmed, save old mail', async () => {
    // Created new user
    const options = randomUserOptions();

    const { response: responseSignUp, cookie } = await makeRequest({
      endpoint: ENDPOINTS.SIGN_UP_EMAIL,
      method: 'post',
      requestBody: options,
    });

    const userId = responseSignUp.body._id;
    // Set user before update
    const userBeforeUpdate = await findUserById(userId);

    const temporaryEmail = generateRandomEmail();

    // Make request for update email
    const { response: responseUpdateEmail, cookie: cookieUpdateEmail } =
      await makeRequest({
        endpoint: ENDPOINT,
        cookie,
        method: 'put',
        requestBody: { email: temporaryEmail },
      });

    const notConfirmedChangeEmailUser = await findUserById(userId);

    const oldConfirmCode = userBeforeUpdate?.private.email.confirm?.code;
    const newConfirmCode =
      notConfirmedChangeEmailUser?.private.email.confirm?.code;

    // Check HTTP response
    expect(responseSignUp.statusCode).toBe(200);

    expect(cookie?.includes('sessionId=')).toBeTruthy();
    expect(responseSignUp.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    // Check HTTP response
    expect(responseUpdateEmail.statusCode).toBe(200);

    expect(cookieUpdateEmail?.includes('sessionId=')).toBeUndefined();
    expect(responseUpdateEmail.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    expect(responseUpdateEmail.body).toEqual({
      _id: expect.any(String),
      role: 'contractor',
      contacts: {
        email: { isVerified: false, value: options.email },
      },
      personal: { name: DEFAULT_USER_NAME },
      private: {},
      regional: { locale: options.locale },
      settings: {},
      balance: 0,
    });

    expect(newConfirmCode).toBeTruthy();
    expect(oldConfirmCode).not.toBe(newConfirmCode);

    expect(
      notConfirmedChangeEmailUser?.private.email.temporaryEmail?.value
    ).toBe(temporaryEmail);

    expect(notConfirmedChangeEmailUser?.private.email.confirm).toEqual({
      _id: expect.anything(),
      code: newConfirmCode,
      expiredAt: notConfirmedChangeEmailUser?.private.email.confirm?.expiredAt,
    });
  });

  test('If the user logged in, email confirmed', async () => {
    // Created new user
    const options = randomUserOptions();

    const { response: responseSignUp, cookie } = await makeRequest({
      endpoint: ENDPOINTS.SIGN_UP_EMAIL,
      method: 'post',
      requestBody: options,
    });

    const userId = responseSignUp.body._id;
    // Set user before update
    const userBeforeUpdate = await findUserById(userId);

    const temporaryEmail = generateRandomEmail();

    // Make request for update email
    const { response: responseUpdateEmail, cookie: cookieUpdateEmail } =
      await makeRequest({
        endpoint: ENDPOINT,
        cookie,
        method: 'put',
        requestBody: { email: temporaryEmail },
      });

    // Set user after update
    const notConfirmedChangeEmailUser = await findUserById(userId);

    const oldConfirmCode = userBeforeUpdate?.private.email.confirm?.code;
    const newConfirmCode =
      notConfirmedChangeEmailUser?.private.email.confirm?.code;

    // Make request for confirm update email
    const { response: responseConfirmCode, cookie: cookieConfirmCode } =
      await makeRequest({
        endpoint: ENDPOINTS.CONFIRM_EMAIL,
        cookie,
        method: 'post',
        requestBody: { code: newConfirmCode },
      });

    const confirmedChangeEmailUser = await findUserById(userId);

    // Check HTTP response signUp
    expect(responseSignUp.statusCode).toBe(200);

    expect(cookie?.includes('sessionId=')).toBeTruthy();
    expect(responseSignUp.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    // Check HTTP response updateEmail
    expect(responseUpdateEmail.statusCode).toBe(200);

    expect(cookieUpdateEmail).toBeUndefined();
    expect(responseUpdateEmail.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    // Check HTTP response confirmCode
    expect(responseConfirmCode.statusCode).toBe(200);

    expect(cookieConfirmCode).toBeUndefined();
    expect(responseConfirmCode.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    expect(responseConfirmCode.body).toEqual({
      _id: expect.any(String),
      role: 'contractor',
      contacts: {
        email: { isVerified: true, value: temporaryEmail },
      },
      personal: { name: DEFAULT_USER_NAME },
      private: {},
      regional: { locale: options.locale },
      settings: {},
      balance: 0,
    });

    expect(responseUpdateEmail.body).toEqual({
      _id: expect.any(String),
      role: 'contractor',
      contacts: {
        email: { isVerified: false, value: options.email },
      },
      personal: { name: DEFAULT_USER_NAME },
      private: {},
      regional: { locale: options.locale },
      settings: {},
      balance: 0,
    });

    // Compare confirm code
    expect(oldConfirmCode).not.toBe(newConfirmCode);

    // Check cleaned fields
    expect(confirmedChangeEmailUser?.private.email.temporaryEmail).toBeNull();
    expect(confirmedChangeEmailUser?.contacts.email.isVerified).toBeTruthy();
    expect(confirmedChangeEmailUser?.private.email.confirm).toBeNull();
  });
});
