import { ERRORS, NOTIFICATIONS } from 'shared';

import { Handler, PasswordChangePost } from 'src/_generated';
import { notifications } from 'src/services';
import { updateUserPassword } from 'src/storage/users';
import {
  createPasswordHash,
  generateRandomString,
  verifyPassword,
} from 'src/utils/auth';
import { config } from 'src/utils/navigation';

export const options = config('Password change', {
  tag: 'access',
  roles: ['customer', 'contractor'],
  schema: {
    body: {
      type: 'object',
      required: ['password', 'newPassword'],
      properties: {
        password: { type: 'string' },
        newPassword: { type: 'string', minLength: 8 },
      },
      additionalProperties: false,
    },
    response: {
      200: { $ref: 'models#/properties/status' },
      401: { $ref: 'errors#/properties/simple' },
    },
  },
});

export const handler: Handler<PasswordChangePost> = async (request, reply) => {
  const { password, newPassword } = request.body;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = request.user!;

  if (!verifyPassword(password, user.private.password)) {
    return reply.code(401).send({ error: ERRORS.INCORRECT_PASSWORD });
  }

  const salt = generateRandomString();
  const hash = createPasswordHash(newPassword, salt);

  await updateUserPassword(user._id, {
    confirm: null,
    hash,
    salt,
  });

  await notifications.email(NOTIFICATIONS.CHANGED_PASSWORD, {
    locale: user.regional.locale,
    email: user.contacts.email.value,
  });

  return { status: true };
};
