import { JSONSchema4 } from 'json-schema';

export const errors: JSONSchema4 = {
  $id: 'errors',
  type: 'object',
  title: 'errors',
  required: ['simple'],
  properties: {
    simple: {
      type: 'object',
      title: 'SimpleError',
      description: 'Error response',
      required: ['error'],
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};
