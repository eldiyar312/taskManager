import 'src/plugins/env';

import { version } from 'package.json';

import { app } from 'src/app';
import { MODE, PORT, PUBLIC_ENV } from 'src/constants/env';
import { sendError } from 'src/integrations/rollbar';
import { connect, disconnect } from 'src/utils/db';

const fastify = app({ logger: PUBLIC_ENV === 'local' });

fastify.addHook('onError', (request, reply, error, done) => {
  sendError(error, request);
  done();
});

fastify.addHook('onClose', async () => {
  await disconnect();
});

fastify.listen({ host: '0.0.0.0', port: PORT }, async (error, address) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }

  if (MODE === 'development') {
    fastify.swagger();
  }

  await connect();

  console.log(`🚀 Server ${version} ready at: ${address}`);
});
