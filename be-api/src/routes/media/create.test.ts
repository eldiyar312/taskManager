import fs from 'fs';
import path from 'path';

import { ENDPOINTS } from 'shared';

import {
  afterTests,
  beforeTests,
  randomUserOptions,
  server,
  signUpRequest,
} from 'src/utils/tests';

const ENDPOINT = ENDPOINTS.MEDIA;

beforeAll(beforeTests);
afterAll(afterTests);

describe(`POST '${ENDPOINT}'`, () => {
  test('Upload user media file', async () => {
    const options = randomUserOptions();

    const fileName = 'image.jpeg';
    const filePath = path.join('src/static', fileName);

    const { cookie, user } = await signUpRequest(options);

    const { body } = await server
      .post(ENDPOINT)
      .set('Cookie', cookie)
      .attach('file', filePath);

    const mimeType = fileName.split('.').pop();
    const mediaPath = path.join(`media/${user._id}`, `${body._id}.${mimeType}`);
    expect(fs.existsSync(mediaPath)).toBeTruthy();

    expect(body).toEqual({
      _id: expect.any(String),
      type: mimeType,
      name: fileName,
      size: body.size,
      userId: user._id,
    });
  });
});
