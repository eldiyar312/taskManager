import passport from '@fastify/passport';
import { FlattenMaps } from 'mongoose';
import { Strategy as LocalStrategy } from 'passport-local';

import { ERRORS } from 'shared';

import { User } from 'src/models/user';
import { findUserByEmail, findUserById } from 'src/storage/users';
import { verifyPassword } from 'src/utils/auth';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface PassportUser extends FlattenMaps<User> {}
}

const authConfig = {
  usernameField: 'email',
  passwordField: 'password',
};

export const configureStrategies = () => {
  passport.use(
    new LocalStrategy(authConfig, async (email, password, done) => {
      const user = await findUserByEmail(email);

      if (!user || !verifyPassword(password, user.private.password)) {
        done(ERRORS.INVALID_EMAIL_OR_PASSWORD);
      } else {
        done(null, user);
      }
    })
  );

  passport.registerUserSerializer<FlattenMaps<User>, string>(
    async (user) => user._id
  );
  passport.registerUserDeserializer<string, FlattenMaps<User> | undefined>(
    findUserById
  );
};
