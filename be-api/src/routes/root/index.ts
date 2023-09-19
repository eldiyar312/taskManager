import { version } from 'package.json';

import { Handler, RootGet } from 'src/_generated';
import { MODE, PUBLIC_ENV } from 'src/constants/env';
import { config } from 'src/utils/navigation';

export const options = config('Get API status', {
  tag: 'core',
  roles: ['guest', 'customer', 'contractor'],
  schema: {
    response: {
      200: {
        type: 'object',
        required: ['environment', 'isAuthenticated', 'mode', 'version'],
        properties: {
          environment: { $ref: 'enums#/properties/environment' },
          isAuthenticated: { type: 'boolean' },
          mode: { $ref: 'enums#/properties/mode' },
          version: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
  },
});

export const handler: Handler<RootGet> = (request) => ({
  environment: PUBLIC_ENV,
  isAuthenticated: request.isAuthenticated(),
  mode: MODE,
  version,
});
