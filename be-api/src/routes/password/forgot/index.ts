import { NOTIFICATIONS } from 'shared';

import { Handler, PasswordForgotPost } from 'src/_generated';
import { notifications } from 'src/services';
import { findUserByEmail, updateUserPassword } from 'src/storage/users';
import { generateRandomStringBasedOnString } from 'src/utils/auth';
import { rollNowDateForward } from 'src/utils/dates';
import { config } from 'src/utils/navigation';

export * as change from 'src/routes/password/forgot/change';

export const options = config('Forgot password', {
  tag: 'access',
  roles: ['guest'],
  schema: {
    body: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string', format: 'email' },
      },
      additionalProperties: false,
    },
    response: {
      200: { $ref: 'models#/properties/status' },
      401: { $ref: 'errors#/properties/simple' },
    },
  },
});

export const handler: Handler<PasswordForgotPost> = async (request) => {
  const { email } = request.body;

  const user = await findUserByEmail(email);

  if (user) {
    const code = generateRandomStringBasedOnString(email);

    await updateUserPassword(user._id, {
      confirm: { code, expiredAt: rollNowDateForward() },
      hash: user.private.password.hash,
      salt: user.private.password.salt,
    });

    await notifications.email(NOTIFICATIONS.FORGOT_PASSWORD, {
      locale: user.regional.locale,
      code,
      email: user.contacts.email.value,
    });
  }

  return { status: !!user };
};
