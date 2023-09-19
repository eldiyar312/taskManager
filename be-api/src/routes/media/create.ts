import fs from 'fs';
import path from 'path';

import { ERRORS, MEDIA_TYPE } from 'shared';

import { Handler, MediaPost, ModelsMedia } from 'src/_generated';
import { MediaModel } from 'src/models/media';
import { multipartConfig } from 'src/plugins/multipart';
import { createMedia } from 'src/storage/media';
import { getFileData } from 'src/utils/media';
import { config } from 'src/utils/navigation';

export const options = config('Create media', {
  tag: 'core',
  roles: ['customer', 'contractor'],
  schema: {
    consumes: ['multipart/form-data'],
    body: {
      required: ['file', 'fileName'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          contentEncoding: '7bit',
          contentMediaType: 'multipart/form-data',
        },
        fileName: { type: 'string' },
      },
      additionalProperties: false,
    },
    response: {
      200: { $ref: 'models#/properties/media' },
      400: { $ref: 'errors#/properties/simple' },
      401: { $ref: 'errors#/properties/simple' },
      413: { $ref: 'errors#/properties/simple' },
      507: { $ref: 'errors#/properties/simple' },
    },
  },
});

export const handler: Handler<MediaPost> = async (request, reply) => {
  const data = await request.file();
  if (!data) return reply.code(401).send({ error: ERRORS.INVALID_FORM_DATA });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const size = parseInt(request.headers['content-length']!);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (size > multipartConfig.limits.fileSize!)
    return reply.code(413).send({ error: ERRORS.MEDIA_SIZE_TOO_LARGE });

  const { name, type } = getFileData(data);

  if (!MEDIA_TYPE.includes(type))
    return reply.code(401).send({ error: ERRORS.INVALID_MEDIA_TYPE });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userId = request.user!._id;

  const mediaData: Omit<ModelsMedia, '_id'> = { size, type, name, userId };

  const media = await createMedia({ mediaData });

  try {
    const dir = `media/${request.user?._id}`;
    const fileName = `${media._id}.${type}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(path.join(dir + '/' + fileName));
      const readStream = data.file;
      readStream.pipe(writeStream);

      readStream.on('error', (err) => reject(err));
      writeStream.on('error', (err) => reject(err));
      writeStream.on('close', () => resolve(true));
    });
  } catch (error) {
    await MediaModel.findByIdAndRemove(media._id);
    return reply.code(507).send({ error: ERRORS.INSUFFICIENT_STORAGE });
  }

  return media;
};
