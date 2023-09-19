import passport from '@fastify/passport';
import { FastifyReply, FastifyRequest } from 'fastify';
import { FlattenMaps } from 'mongoose';

import { ERRORS } from 'shared';

import { User } from 'src/models/user';
import { Roles } from 'src/types';
import { removeConnection } from 'src/utils/webSocket';

const roleToAuth: Record<Roles, boolean> = {
  guest: false,
  customer: true,
  contractor: true,
};

export const roles =
  (...roles: Roles[]) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    if (roles.length < 1) {
      return reply.code(500).send({
        error: ERRORS.BAD_ENDPOINT,
        message: 'Specify at least one role',
      });
    }

    const auths = roles.map((role) => roleToAuth[role]);
    const isAuthenticated = request.isAuthenticated();

    if (
      (!auths.includes(true) && isAuthenticated) ||
      (!auths.includes(false) && !isAuthenticated)
    ) {
      const error = isAuthenticated
        ? ERRORS.ALREADY_LOGGED_IN
        : ERRORS.NEED_TO_LOGIN;

      return reply.code(401).send({ error });
    }

    if (
      auths.includes(true) &&
      isAuthenticated &&
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      !roles.includes(request.user!.role)
    ) {
      return reply.code(401).send({ error: ERRORS.PERMISSION_DENIED });
    }
  };

export const authWithEmail = passport.authenticate(
  'local',
  async (request, reply, error, user) => {
    if (error || !user) {
      return reply.code(401).send({ error: error || ERRORS.USER_NOT_FOUND });
    } else {
      await signIn(request, user as FlattenMaps<User>);
    }
  }
);

export const signIn = async (
  request: FastifyRequest,
  user: FlattenMaps<User>
) => {
  await request.logIn(user, { session: true });
};

export const signOut = async (request: FastifyRequest) => {
  const { sessionId } = request.session;

  if (sessionId) {
    removeConnection(sessionId);
  }

  if (request.logOut) {
    await Promise.all([request.logOut(), request.session.destroy()]);
  }
};
