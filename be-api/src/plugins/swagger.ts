import { SwaggerOptions } from '@fastify/swagger';
import { FastifySwaggerUiOptions } from '@fastify/swagger-ui';

import { description, name, version } from 'package.json';

import { Prefixify, Roles } from 'src/types';

export type EndpointTag = keyof typeof endpointGroups;

// roles
const roles: Record<Prefixify<Roles, 'role'>, string> = {
  'role:guest': 'This endpoint is available to guests',
  'role:customer': 'This endpoint is available to customer',
  'role:contractor': 'This endpoint is available to contractor',
} as const;

// endpoint groups
const endpointGroups = {
  access: 'Access endpoints',
  core: 'Core endpoints',
} as const;

export const swaggerConfig: SwaggerOptions = {
  mode: 'dynamic',
  openapi: {
    info: {
      title: name,
      description,
      version,
    },
    tags: Object.entries({ ...endpointGroups, ...roles }).map(
      ([name, description]) => ({ name, description })
    ),
  },
};

export const swaggerUIConfig: FastifySwaggerUiOptions = {
  routePrefix: '/swagger',
};
