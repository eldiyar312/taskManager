import { ERRORS, NOTIFICATIONS } from 'shared';

import { Handler, SignUpEmailPost } from 'src/_generated';
import { signIn } from 'src/middlewares/passport';
import { User } from 'src/models/user';
import { notifications } from 'src/services';
import { userToProfile } from 'src/storage/profile';
import { createUser, findUserByEmail } from 'src/storage/users';
import {
  createPasswordHash,
  generateRandomString,
  generateRandomStringBasedOnString,
  verifyPassword,
} from 'src/utils/auth';
import { rollNowDateForward } from 'src/utils/dates';
import { config } from 'src/utils/navigation';

export const options = config('Sign Up with email and password', {
  tag: 'access',
  roles: ['guest'],
  schema: {
    body: {
      type: 'object',
      required: ['email', 'isAgreeTerms', 'locale', 'password', 'role'],
      properties: {
        email: { type: 'string', format: 'email' },
        isAgreeTerms: { type: 'boolean' },
        locale: { $ref: 'enums#/properties/locale' },
        password: { type: 'string', minLength: 8 },
        role: { $ref: 'enums#/properties/role' },
      },
      additionalProperties: false,
    },
    response: {
      200: { $ref: 'models#/properties/profile' },
      401: { $ref: 'errors#/properties/simple' },
      451: { $ref: 'errors#/properties/simple' },
    },
  },
});

export const handler: Handler<SignUpEmailPost> = async (request, reply) => {
  const { email, isAgreeTerms, locale, password, role } = request.body;

  if (!isAgreeTerms) {
    return reply.code(451).send({ error: ERRORS.NEED_TO_ACCEPT_TERMS });
  }

  const user = await findUserByEmail(email);

  if (user) {
    // If a user registers with an email and password that are already
    // in the database, then we can authorize him.
    if (verifyPassword(password, user.private.password)) {
      await signIn(request, user);

      return userToProfile(user as User);
    }

    return reply.code(401).send({ error: ERRORS.EMAIL_ALREADY_EXISTS });
  }

  const salt = generateRandomString();
  const hash = createPasswordHash(password, salt);

  const code = generateRandomStringBasedOnString(email);

  const newUser = await createUser({
    agreements: { terms: isAgreeTerms },
    confirm: { code, expiredAt: rollNowDateForward() },
    personal: { name: 'Test User' },
    email,
    hash,
    salt,
    locale,
    role,
  });

  await notifications.email(NOTIFICATIONS.SIGN_UP_EMAIL, {
    locale,
    code,
    email,
  });

  await signIn(request, newUser);

  return userToProfile(newUser as User);
};
