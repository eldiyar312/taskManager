import { FastifyHelmetOptions } from '@fastify/helmet';

export const helmetConfig: FastifyHelmetOptions = {
  frameguard: {
    action: 'deny',
  },
};
