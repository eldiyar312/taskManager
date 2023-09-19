import dayjs from 'dayjs';
import { HTTPMethods } from 'fastify';
import supertest, { Response } from 'supertest';

import { ENDPOINTS, Locales } from 'shared';

import { EnumsRole } from 'src/_generated';
import { app } from 'src/app';
import { DEFAULT_USER_NAME } from 'src/constants/settings';
import { User, UserConfirmation } from 'src/models/user';
import { createUser, updateUserById } from 'src/storage/users';
import { Email } from 'src/types';
import {
  createPasswordHash,
  generateRandomString,
  generateRandomStringBasedOnString,
} from 'src/utils/auth';
import { rollNowDateForward } from 'src/utils/dates';
import { connect, db, disconnect } from 'src/utils/db';

type RandomUserOptions = typeof randomUserOptions;

jest.mock('src/integrations/sendgrid');

const fastify = app({ logger: false });

export const beforeTests = async () => {
  await connect();
  await fastify.ready();
};

export const afterTests = async () => {
  await db.drop();
  await disconnect();
  await fastify.close();
};

export const server = supertest(fastify.server);

export const notExpiredDate = rollNowDateForward();
export const expiredDate = dayjs('2020-01-01').format();

export const generateRandomEmail = () =>
  `${generateRandomString()}@example.com`;

export const randomUserOptions = (options?: { role?: EnumsRole }) =>
  ({
    email: generateRandomEmail(),
    isAgreeTerms: true,
    locale: 'ru',
    password: 'xxxyyy111',
    name: DEFAULT_USER_NAME,
    role: options?.role || 'contractor',
  } as const);

export const createTestUser = async ({
  email,
  password,
  locale,
  expiredAt = dayjs().add(5, 'day').format(),
  role,
}: {
  email: Email;
  password: string;
  locale: Locales;
  expiredAt?: string;
  role: EnumsRole;
}) => {
  const salt = generateRandomString();
  const hash = createPasswordHash(password, salt);

  const code = generateRandomStringBasedOnString(email);

  return createUser({
    agreements: { terms: true },
    confirm: { expiredAt, code },
    personal: { name: DEFAULT_USER_NAME },
    email,
    hash,
    locale,
    salt,
    role,
  });
};

export const updateTestUser = async (
  _id: User['id'],
  {
    temporaryEmail,
    confirm,
  }: {
    temporaryEmail: NonNullable<
      User['private']['email']['temporaryEmail']
    >['value'];
    confirm: UserConfirmation;
  }
) => updateUserById(_id, { temporaryEmail, confirm });

const methodsWithBody = ['post', 'put', 'patch'];

export const makeRequest = async ({
  endpoint,
  method = 'get',
  cookie,
  querystring,
  requestBody,
}: {
  endpoint: ENDPOINTS | `${ENDPOINTS}/${string}`;
  cookie?: string;
  querystring?: Record<string, unknown>;
  method?: Lowercase<HTTPMethods>;
  requestBody?: Record<string, unknown>;
}) => {
  const handlerWithMethod = server[method](endpoint);

  const handlerAfterCookie = cookie
    ? handlerWithMethod.set('Cookie', cookie)
    : handlerWithMethod;

  const handlerAfterQuerystring = querystring
    ? handlerAfterCookie.query(querystring)
    : handlerAfterCookie;

  const response: Response = await (methodsWithBody.includes(method)
    ? handlerAfterQuerystring.send(requestBody)
    : handlerAfterQuerystring);

  const headerSetCookie: string | undefined =
    response.headers['set-cookie']?.[0];

  return {
    response,
    cookie: headerSetCookie,
  };
};

export const signUpRequest = async (
  signUpUserData: ReturnType<RandomUserOptions>
) => {
  const signUpResponse = await server
    .post(ENDPOINTS.SIGN_UP_EMAIL)
    .send(signUpUserData);

  const authCookie = signUpResponse.headers['set-cookie']?.[0];

  return {
    cookie: authCookie,
    user: signUpResponse.body,
  };
};

/**
 *
 * Calls a request to the specified ENDPOINT after the signUp has occurred.
 * Returns the request response to the specified ENDPOINT, cookies, and the response from signUp
 *
 * const result = await requestWithSignUp( ENDPOINT, signUpUserData);
 * const { statusCode, headers, body } = result.response - The main fields that interest us
 *
 * @param ENDPOINT - The endpoint to which the request will go after signUp
 * @param signUpUserData - Parameter with data about the new user
 * @param {string} [httpMethod=GET] - Method for request after signUp
 * @param {object} [requestBody] - Data for request after signUp
 * @returns response with statusCode, headers, body and etc.
 */
export const requestWithSignUp = async ({
  endpoint,
  method = 'get',
  signUpUserData,
  requestBody,
}: {
  endpoint: ENDPOINTS;
  signUpUserData: ReturnType<RandomUserOptions>;
  method?: Lowercase<HTTPMethods>;
  requestBody?: Record<string, unknown>;
}): Promise<{
  response: Response;
  cookie?: string;
  user: User;
}> => {
  const { cookie: authCookie, user } = await signUpRequest(signUpUserData);

  const targetResponse = await makeRequest({
    cookie: authCookie,
    endpoint,
    method,
    requestBody,
  });

  return {
    response: targetResponse.response,
    cookie: targetResponse.cookie,
    user,
  };
};
