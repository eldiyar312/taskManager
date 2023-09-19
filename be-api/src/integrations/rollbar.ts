import { FastifyError } from '@fastify/error';
import { FastifyRequest } from 'fastify';
import Rollbar from 'rollbar';

import { INTEGRATIONS, PUBLIC_ENV } from 'src/constants/env';

const rollbar =
  INTEGRATIONS.ROLLBAR.ENABLED &&
  new Rollbar({
    accessToken: INTEGRATIONS.ROLLBAR.TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: PUBLIC_ENV,
    },
  });

export const sendError = (error: FastifyError, payload: FastifyRequest) => {
  if (rollbar) {
    rollbar.error(error, payload);
  } else {
    console.error(`ROLLBAR: ${error}`, payload);
  }
};
