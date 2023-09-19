import dayjs from 'dayjs';

import { ERRORS } from 'shared';

import { ConfirmEmailPost, Handler } from 'src/_generated';
import { signIn } from 'src/middlewares/passport';
import { User } from 'src/models/user';
import { userToProfile } from 'src/storage/profile';
import {
  confirmUserEmail,
  findUserByEmailConfirmationCode,
} from 'src/storage/users';
import { config } from 'src/utils/navigation';

export const options = config('Confirm email', {
  tag: 'access',
  roles: ['guest', 'customer', 'contractor'],
  schema: {
    body: {
      type: 'object',
      required: ['code'],
      properties: {
        code: { type: 'string' },
      },
      additionalProperties: false,
    },
    response: {
      200: { $ref: 'models#/properties/profile' },
      401: { $ref: 'errors#/properties/simple' },
    },
  },
});

export const handler: Handler<ConfirmEmailPost> = async (request, reply) => {
  const { code } = request.body;

  const user = await findUserByEmailConfirmationCode(code);

  const isChangeEmailAction = !!user?.private.email.temporaryEmail?.value;

  if (
    !user ||
    !user.private.email.confirm ||
    (user.contacts.email.isVerified && !isChangeEmailAction)
  ) {
    return reply.code(401).send({ error: ERRORS.CONFIRMATION_CODE_NOT_VALID });
  }

  if (dayjs().isAfter(dayjs(user.private.email.confirm.expiredAt))) {
    return reply.code(401).send({ error: ERRORS.CONFIRMATION_CODE_EXPIRED });
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const newUser = (await confirmUserEmail(user._id))!;

  if (!request.isAuthenticated()) {
    await signIn(request, newUser);
  }

  return userToProfile(newUser as User);
};
