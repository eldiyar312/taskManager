import * as WebSocket from 'ws';

import { ID } from 'src/types';

type Connection = {
  userId: ID;
  sessionId: ID;
  socket: WebSocket;
};

type Message = {
  type: string;
  payload: string | number | boolean | Record<string, unknown>;
};

const map = new Map<Connection['sessionId'], Omit<Connection, 'sessionId'>>();

export const addConnection = ({ sessionId, userId, socket }: Connection) => {
  map.set(sessionId, { userId, socket });

  socket.on('close', () => {
    removeConnection(sessionId);
  });
};

export const removeConnection = (sessionId: Connection['sessionId']) => {
  map.delete(sessionId);
};

export const sendMessage = (id: Connection['userId'], message: Message) => {
  let status = false;

  map.forEach(({ userId, socket }) => {
    if (userId === id && socket) {
      socket.send(JSON.stringify(message));
      status = true;
    }
  });

  return status;
};
