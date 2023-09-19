import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import passport from '@fastify/passport';
import session from '@fastify/session';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import websocket from '@fastify/websocket';
import { FastifyInstance } from 'fastify';
import extractor from 'fastify-extract-definitions';

import { MODE } from 'src/constants/env';
import { corsConfig } from 'src/plugins/cors';
import { extractorConfig } from 'src/plugins/extractor';
import { helmetConfig } from 'src/plugins/helmet';
import { multipartConfig } from 'src/plugins/multipart';
import { configureStrategies } from 'src/plugins/passport';
import { sessionConfig } from 'src/plugins/session';
import { swaggerConfig, swaggerUIConfig } from 'src/plugins/swagger';

export const plugins = (fastify: FastifyInstance) => {
  if (MODE === 'development') {
    fastify.register(extractor, extractorConfig);

    fastify.register(swagger, swaggerConfig);
    fastify.register(swaggerUI, swaggerUIConfig);
  }

  fastify.register(helmet, helmetConfig);
  fastify.register(cors, corsConfig);

  fastify.register(cookie);
  fastify.register(session, sessionConfig);

  fastify.register(passport.initialize());
  fastify.register(passport.secureSession());

  fastify.register(websocket);

  fastify.register(multipart, multipartConfig);

  configureStrategies();
};
