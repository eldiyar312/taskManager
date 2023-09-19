import { Handler, WsEchoPost } from 'src/_generated';
import { config } from 'src/utils/navigation';
import { sendMessage } from 'src/utils/webSocket';

// TODO: This endpoint is added as an example. Remove it in real project.
export const options = config('Send echo message via websocket', {
  tag: 'core',
  roles: ['guest'],
  schema: {
    body: {
      type: 'object',
      required: ['type', 'payload'],
      properties: {
        type: { type: 'string' },
        payload: { type: 'string' },
      },
      additionalProperties: false,
    },
    response: {
      200: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'boolean' },
        },
        additionalProperties: false,
      },
      401: { $ref: 'errors#/properties/simple' },
    },
  },
});

export const handler: Handler<WsEchoPost> = (request, reply) => {
  const status = sendMessage(request.user?._id.toString() || '', request.body);

  reply.send({ status });
};
