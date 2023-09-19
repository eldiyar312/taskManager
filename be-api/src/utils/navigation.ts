import { FastifyInstance, HTTPMethods, RouteShorthandOptions } from 'fastify';

import {
  ENDPOINTS,
  FeScheme,
  makeHierarchicalPath,
  makeSimplePath,
} from 'shared';

import { Handler } from 'src/_generated';
import { CLIENT_URL } from 'src/constants/env';
import { roles as rolesMiddleware } from 'src/middlewares/passport';
import { validateMongoId } from 'src/middlewares/validateMongoId';
import { EndpointTag } from 'src/plugins/swagger';
import { Roles } from 'src/types';

type EndpointConfig = {
  options: RouteShorthandOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: Handler<any>;
};

type ConfigOptions = {
  tag: EndpointTag;
  roles: Roles[];
  preValidation?: ROptions['preValidation'];
  preHandler?: ROptions['preHandler'];
  websocket?: boolean;
  schema: Omit<ROptions['schema'], 'description' | 'tags'>;
};

type Routes = Record<ENDPOINTS, Partial<Record<HTTPMethods, EndpointConfig>>>;
type ROptions = Required<RouteShorthandOptions>;

export const router = (routes: Routes) => (fastify: FastifyInstance) =>
  fastify.register(async (fastify) => {
    Object.entries(routes).forEach(([url, config]) => {
      Object.entries(config).forEach(([_method, { options, handler }]) => {
        const method = _method as HTTPMethods;
        fastify.route({ ...options, method, url, handler });
      });
    });
  });

export const config = (
  description: string,
  { tag, roles, preHandler = [], preValidation = [], schema }: ConfigOptions
): RouteShorthandOptions => ({
  schema: {
    description,
    tags: [tag, ...roles.map((role) => `role:${role}`)],
    ...schema,
  },
  preValidation: [
    ...(Array.isArray(preValidation) ? preValidation : [preValidation]),
  ],
  preHandler: [
    rolesMiddleware(...roles),
    validateMongoId,
    ...(Array.isArray(preHandler) ? preHandler : [preHandler]),
  ],
});

export const makeApiUrl = makeSimplePath<ENDPOINTS>;

export const makeWebUrl = (scheme: FeScheme) => {
  const result = makeHierarchicalPath(
    undefined,
    Array.isArray(scheme) ? scheme : [scheme],
    'replace'
  );

  if (!result) {
    throw new Error(`Invalid url scheme: ${JSON.stringify(scheme)}`);
  }

  return CLIENT_URL + result.pathname + (result.search ?? '');
};
