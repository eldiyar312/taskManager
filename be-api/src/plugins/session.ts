import FastifySessionPlugin from '@fastify/session';
import connectMongodbSession from 'connect-mongodb-session';

import { DB_CONNECTION, HOST, SESSION_SECRET } from 'src/constants/env';
import { tlsConfigs } from 'src/utils/db';

const expires = 1000 * 60 * 60 * 24 * 30; // 30 days

const MongoDBStore = connectMongodbSession(FastifySessionPlugin);

const store = new MongoDBStore({
  connectionOptions: tlsConfigs,
  uri: DB_CONNECTION,
  collection: 'sessions',
  expires,
});

store.on('error', console.error);

export const disconnect = () => store.client.close();

export const sessionConfig: FastifySessionPlugin.Options = {
  cookie: {
    secure: HOST !== 'localhost',
    httpOnly: true,
    maxAge: expires,
    sameSite: 'strict',
  },
  store,
  saveUninitialized: false,
  secret: SESSION_SECRET,
};
