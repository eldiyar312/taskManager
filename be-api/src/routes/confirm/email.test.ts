import { ENDPOINTS, ERRORS } from 'shared';

import { DEFAULT_USER_NAME } from 'src/constants/settings';
import { findUserById } from 'src/storage/users';
import { generateRandomStringBasedOnString } from 'src/utils/auth';
import {
  afterTests,
  beforeTests,
  createTestUser,
  expiredDate,
  generateRandomEmail,
  notExpiredDate,
  randomUserOptions,
  server,
  updateTestUser,
} from 'src/utils/tests';

const ENDPOINT = ENDPOINTS.CONFIRM_EMAIL;

beforeAll(beforeTests);
afterAll(afterTests);

describe(`POST '${ENDPOINT}'`, () => {
  test('If the user or code does not exist, return an error', async () => {
    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send({ code: 'xxxyyy' });

    expect(statusCode).toBe(401);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.CONFIRMATION_CODE_NOT_VALID });
  });

  test('If the user is confirms their email for the second time and the code is not expired, return an error', async () => {
    const options = randomUserOptions();

    const user = await createTestUser(options);

    const code = user.private.email.confirm?.code;

    // Make request confirm primary email
    const first = await server.post(ENDPOINT).send({ code });

    const userAfterConfirmPrimaryEmail = await findUserById(user._id);

    // Make request confirm primary email (error)
    const second = await server.post(ENDPOINT).send({ code });

    expect(first.statusCode).toBe(200);
    expect(second.statusCode).toBe(401);

    expect(first.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(second.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    expect(
      first.headers['set-cookie']?.[0]?.includes('sessionId=')
    ).toBeTruthy();
    expect(second.headers['set-cookie']).toBeUndefined();

    expect(first.body).toEqual({
      _id: expect.any(String),
      role: 'contractor',
      contacts: {
        email: { isVerified: true, value: options.email },
      },
      personal: { name: DEFAULT_USER_NAME },
      private: {},
      regional: { locale: options.locale },
      settings: {},
      balance: 0,
    });

    // Check before confirm - temporaryEmail is undefined
    expect(user?.private.email.temporaryEmail).toBeNull();

    // Start check before confirm user
    expect(userAfterConfirmPrimaryEmail?.contacts.email.value).toBe(
      options.email
    );
    expect(
      userAfterConfirmPrimaryEmail?.contacts.email.isVerified
    ).toBeTruthy();
    expect(
      userAfterConfirmPrimaryEmail?.private.email.temporaryEmail
    ).toBeNull();
    expect(userAfterConfirmPrimaryEmail?.private.email.confirm).toBeNull();
    // End check before confirm user

    // Check body second
    expect(second.body).toEqual({
      error: ERRORS.CONFIRMATION_CODE_NOT_VALID,
    });
  });

  test('If the user is confirms their email for the first time and the code is expired, return an error', async () => {
    const options = randomUserOptions();

    const user = await createTestUser({
      ...options,
      expiredAt: expiredDate,
    });

    const code = user.private.email.confirm?.code;

    // Make request confirm primary email
    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send({ code });

    const userAfterConfirmPrimaryEmail = await findUserById(user._id);

    expect(statusCode).toBe(401);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.CONFIRMATION_CODE_EXPIRED });

    // Check before confirm - temporaryEmail is null
    expect(user?.private.email.temporaryEmail).toBeNull();

    // Start check before confirm user
    expect(userAfterConfirmPrimaryEmail?.contacts.email.value).toBe(
      options.email
    );
    expect(userAfterConfirmPrimaryEmail?.contacts.email.isVerified).toBeFalsy();
    expect(
      userAfterConfirmPrimaryEmail?.private.email.temporaryEmail
    ).toBeNull();
    expect(userAfterConfirmPrimaryEmail?.private.email.confirm).toEqual({
      _id: expect.anything(),
      code,
      expiredAt: user?.private.email.confirm?.expiredAt,
    });
  });

  test('If the user is confirms change their email and the code is expired, return an error', async () => {
    const options = randomUserOptions();

    const user = await createTestUser(options);

    // Set change email
    const temporaryEmail = generateRandomEmail();

    // Set code for change email
    const newCode = generateRandomStringBasedOnString(temporaryEmail);

    // Update user temporary email
    const userBeforeConfirmChangeEmail = await updateTestUser(user._id, {
      temporaryEmail,
      confirm: { code: newCode, expiredAt: expiredDate },
    });

    // Make request confirm primary email
    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send({ code: newCode });

    const userAfterConfirmChangeEmail = await findUserById(user._id);

    expect(statusCode).toBe(401);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.CONFIRMATION_CODE_EXPIRED });

    // Start check before confirm user
    expect(userAfterConfirmChangeEmail?.contacts.email.value).toBe(
      options.email
    );
    expect(userAfterConfirmChangeEmail?.contacts.email.isVerified).toBeFalsy();
    expect(
      userAfterConfirmChangeEmail?.private.email.temporaryEmail?.value
    ).toBe(temporaryEmail);
    expect(userAfterConfirmChangeEmail?.private.email.confirm).toEqual({
      _id: expect.anything(),
      code: newCode,
      expiredAt: userBeforeConfirmChangeEmail?.private.email.confirm?.expiredAt,
    });
  });

  test('If the email is not verified, change email, using primary code return a error', async () => {
    const options = randomUserOptions();

    const user = await createTestUser(options);

    const oldCode = user?.private.email.confirm?.code;

    // Set change email
    const temporaryEmail = generateRandomEmail();

    // Set code for change email
    const newCode = generateRandomStringBasedOnString(temporaryEmail);

    // Update user temporary email
    const userBeforeConfirmChangeEmail = await updateTestUser(user._id, {
      temporaryEmail,
      confirm: { code: newCode, expiredAt: notExpiredDate },
    });

    // Make request confirm change email
    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send({ code: oldCode });

    const userAfterConfirmPrimaryEmailWithOldCode = await findUserById(
      user._id
    );

    expect(statusCode).toBe(401);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']).toBeUndefined();

    expect(body).toEqual({ error: ERRORS.CONFIRMATION_CODE_NOT_VALID });

    // Start check before confirm user
    expect(userAfterConfirmPrimaryEmailWithOldCode?.contacts.email.value).toBe(
      options.email
    );
    expect(
      userAfterConfirmPrimaryEmailWithOldCode?.contacts.email.isVerified
    ).toBeFalsy();
    expect(
      userAfterConfirmPrimaryEmailWithOldCode?.private.email.temporaryEmail
        ?.value
    ).toBe(temporaryEmail);
    expect(
      userAfterConfirmPrimaryEmailWithOldCode?.private.email.confirm
    ).toEqual({
      _id: expect.anything(),
      code: newCode,
      expiredAt: userBeforeConfirmChangeEmail?.private.email.confirm?.expiredAt,
    });
  });

  test('If the user is confirms their email for the first time and the code valid and not expired, return user', async () => {
    const options = randomUserOptions();

    const user = await createTestUser(options);

    const code = user.private.email.confirm?.code;

    // Make request confirm primary email
    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send({ code });

    const userAfterConfirmPrimaryEmail = await findUserById(user._id);

    expect(statusCode).toBe(200);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']?.[0]?.includes('sessionId=')).toBeTruthy();

    // Check body
    expect(body).toEqual({
      _id: expect.any(String),
      role: 'contractor',
      contacts: {
        email: { isVerified: true, value: options.email },
      },
      personal: { name: DEFAULT_USER_NAME },
      private: {},
      regional: { locale: options.locale },
      settings: {},
      balance: 0,
    });

    // Check before confirm - temporaryEmail is undefined
    expect(user?.private.email.temporaryEmail).toBeNull();

    // Start check before confirm user
    expect(userAfterConfirmPrimaryEmail?.contacts.email.value).toBe(
      options.email
    );
    expect(
      userAfterConfirmPrimaryEmail?.contacts.email.isVerified
    ).toBeTruthy();
    expect(
      userAfterConfirmPrimaryEmail?.private.email.temporaryEmail
    ).toBeNull();
    expect(userAfterConfirmPrimaryEmail?.private.email.confirm).toBeNull();
  });

  test('If the user is confired their email, confirm change email return a user', async () => {
    const options = randomUserOptions();

    const user = await createTestUser(options);

    const code = user.private.email.confirm?.code;

    // Make request confirm primary email
    const first = await server.post(ENDPOINT).send({ code });

    const userAfterFirst = await findUserById(user._id);

    // Set change email
    const temporaryEmail = generateRandomEmail();

    // Set code for change email
    const newCode = generateRandomStringBasedOnString(temporaryEmail);

    // Update user temporary email
    await updateTestUser(user._id, {
      temporaryEmail,
      confirm: { code: newCode, expiredAt: notExpiredDate },
    });

    // Make request confirm change email
    const second = await server.post(ENDPOINT).send({ code: newCode });

    const userAfterSecond = await findUserById(user._id);

    expect(user?.private.email.temporaryEmail).toBeNull();

    expect(first.statusCode).toBe(200);
    expect(second.statusCode).toBe(200);

    expect(first.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(second.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    expect(
      first.headers['set-cookie']?.[0]?.includes('sessionId=')
    ).toBeTruthy();
    expect(
      second.headers['set-cookie']?.[0]?.includes('sessionId=')
    ).toBeTruthy();

    expect(first.body).toEqual({
      _id: expect.any(String),
      role: 'contractor',
      contacts: {
        email: { isVerified: true, value: options.email },
      },
      personal: { name: DEFAULT_USER_NAME },
      private: {},
      regional: { locale: options.locale },
      settings: {},
      balance: 0,
    });
    expect(second.body).toEqual({
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

    // Start check before confirm user
    expect(userAfterFirst?.contacts.email.value).toBe(options.email);
    expect(userAfterFirst?.contacts.email.isVerified).toBeTruthy();
    expect(userAfterFirst?.private.email.temporaryEmail).toBeNull();
    expect(userAfterFirst?.private.email.confirm).toBeNull();

    // Start check before confirm user
    expect(userAfterSecond?.contacts.email.value).toBe(temporaryEmail);
    expect(userAfterSecond?.contacts.email.isVerified).toBeTruthy();
    expect(userAfterSecond?.private.email.temporaryEmail).toBeNull();
    expect(userAfterSecond?.private.email.confirm).toBeNull();
  });

  test('If the email is not verified, confirm change email return a user', async () => {
    const options = randomUserOptions();

    const user = await createTestUser(options);

    // Set change email
    const temporaryEmail = generateRandomEmail();

    // Set code for change email
    const newCode = generateRandomStringBasedOnString(temporaryEmail);

    // Update user temporary email
    await updateTestUser(user._id, {
      temporaryEmail,
      confirm: { code: newCode, expiredAt: notExpiredDate },
    });

    // Make request confirm change email
    const { statusCode, headers, body } = await server
      .post(ENDPOINT)
      .send({ code: newCode });

    const userAfterConfirmChangeEmail = await findUserById(user._id);

    expect(statusCode).toBe(200);

    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['set-cookie']?.[0]?.includes('sessionId=')).toBeTruthy();

    expect(body).toEqual({
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

    // Start check before confirm user
    expect(userAfterConfirmChangeEmail?.contacts.email.value).toBe(
      temporaryEmail
    );
    expect(userAfterConfirmChangeEmail?.contacts.email.isVerified).toBeTruthy();
    expect(
      userAfterConfirmChangeEmail?.private.email.temporaryEmail
    ).toBeNull();
    expect(userAfterConfirmChangeEmail?.private.email.confirm).toBeNull();
  });
});
