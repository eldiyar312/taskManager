import Fastify from 'fastify';

import { BODY_LIMIT } from 'src/constants/settings';
import { plugins } from 'src/plugins';
import { routes } from 'src/routes';
import { schemas } from 'src/schemas';

export const app = (options: { logger: boolean }) => {
  const fastify = Fastify({
    ...options,
    bodyLimit: BODY_LIMIT,
    ajv: {
      customOptions: { coerceTypes: false },
    },
  });

  plugins(fastify);
  schemas(fastify);
  routes(fastify);

  return fastify;
};
