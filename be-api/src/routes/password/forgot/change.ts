import dayjs from 'dayjs';

import { ERRORS, NOTIFICATIONS } from 'shared';

import { Handler, PasswordForgotChangePost } from 'src/_generated';
import { signIn } from 'src/middlewares/passport';
import { User } from 'src/models/user';
import { notifications } from 'src/services';
import { userToProfile } from 'src/storage/profile';
import {
  findUserByPasswordRecoveryCode,
  updateUserPassword,
} from 'src/storage/users';
import { createPasswordHash, generateRandomString } from 'src/utils/auth';
import { config } from 'src/utils/navigation';

export const options = config('Forgotten password change', {
  tag: 'access',
  roles: ['guest'],
  schema: {
    body: {
      type: 'object',
      required: ['code', 'newPassword'],
      properties: {
        code: { type: 'string' },
        newPassword: { type: 'string', minLength: 8 },
      },
      additionalProperties: false,
    },
    response: {
      200: { $ref: 'models#/properties/profile' },
      401: { $ref: 'errors#/properties/simple' },
    },
  },
});

export const handler: Handler<PasswordForgotChangePost> = async (
  request,
  reply
) => {
  const { code, newPassword } = request.body;

  const user = await findUserByPasswordRecoveryCode(code);

  if (!user || !user.private.password.recovery) {
    return reply.code(401).send({ error: ERRORS.CONFIRMATION_CODE_NOT_VALID });
  }

  if (dayjs().isAfter(dayjs(user.private.password.recovery.expiredAt))) {
    return reply.code(401).send({ error: ERRORS.CONFIRMATION_CODE_EXPIRED });
  }

  const salt = generateRandomString();
  const hash = createPasswordHash(newPassword, salt);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const newUser = (await updateUserPassword(user._id, {
    confirm: null,
    hash,
    salt,
  }))!;

  await notifications.email(NOTIFICATIONS.FORGOT_PASSWORD_CHANGE, {
    locale: user.regional.locale,
    email: user.contacts.email.value,
  });

  await signIn(request, newUser);

  return userToProfile(newUser as User);
};
