import { ENDPOINTS } from 'shared';

import { version } from 'package.json';

import {
  afterTests,
  beforeTests,
  randomUserOptions,
  requestWithSignUp,
  server,
} from 'src/utils/tests';

const ENDPOINT = ENDPOINTS.ROOT;

beforeAll(beforeTests);
afterAll(afterTests);

describe(`GET '${ENDPOINT}'`, () => {
  test('Works correctly for unauthorized users', async () => {
    const { statusCode, headers, body } = await server.get(ENDPOINT);

    expect(statusCode).toBe(200);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');

    expect(body).toEqual({
      environment: 'local',
      isAuthenticated: false,
      mode: 'test',
      version,
    });
  });

  test('Works correctly for authorized users', async () => {
    const options = randomUserOptions();

    const result = await requestWithSignUp({
      endpoint: ENDPOINT,
      signUpUserData: options,
      method: 'get',
      requestBody: options,
    });

    const { statusCode, headers, body } = result.response;

    expect(statusCode).toBe(200);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');

    expect(body).toEqual({
      environment: 'local',
      isAuthenticated: true,
      mode: 'test',
      version,
    });
  });
});
