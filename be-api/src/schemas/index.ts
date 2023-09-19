import { FastifyInstance } from 'fastify';

import { enums } from 'src/schemas/enums';
import { errors } from 'src/schemas/errors';
import { models } from 'src/schemas/models';

export const schemas = (fastify: FastifyInstance) => {
  fastify.addSchema(enums);
  fastify.addSchema(errors);
  fastify.addSchema(models);
};
