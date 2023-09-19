import { WebsocketHandler } from '@fastify/websocket';
import {
  RawRequestDefaultExpression,
  RawServerDefault,
  RequestGenericInterface,
} from 'fastify';

import { config } from 'src/utils/navigation';
import { addConnection } from 'src/utils/webSocket';

export * as echo from 'src/routes/ws/echo';

export const options = config('WS service', {
  tag: 'core',
  roles: ['guest'],
  schema: {},
  websocket: true,
});

export const handler: WebsocketHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RequestGenericInterface
> = (connection, request) => {
  const { sessionId } = request.session;
  const userId = request.user?._id.toString();

  if (sessionId && userId) {
    addConnection({ sessionId, userId, socket: connection.socket });
  }

  connection.socket.on('message', (message) => {
    // TODO: handle message from client
    console.log('WS message:', message.toString());
  });
};
