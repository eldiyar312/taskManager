import { FastifyCorsOptions } from '@fastify/cors';

import { ORIGIN } from 'src/constants/env';

export const corsConfig: FastifyCorsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: ORIGIN,
};
