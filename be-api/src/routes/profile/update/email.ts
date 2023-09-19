import { NOTIFICATIONS } from 'shared';

import { Handler, ProfileEmailPut } from 'src/_generated';
import { User } from 'src/models/user';
import { notifications } from 'src/services';
import { userToProfile } from 'src/storage/profile';
import { updateUserById } from 'src/storage/users';
import { generateRandomStringBasedOnString } from 'src/utils/auth';
import { rollNowDateForward } from 'src/utils/dates';
import { config } from 'src/utils/navigation';

export const options = config('Update profile email', {
  tag: 'access',
  roles: ['customer', 'contractor'],
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
      200: { $ref: 'models#/properties/profile' },
      400: { $ref: 'errors#/properties/simple' },
    },
  },
});

export const handler: Handler<ProfileEmailPut> = async (request) => {
  const { email } = request.body;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = request.user!;

  const isNewEmail = email && user.contacts.email.value !== email;

  if (!isNewEmail) {
    return userToProfile(user as User);
  }

  const confirmCode = generateRandomStringBasedOnString(email);

  const newUser = await updateUserById(user._id, {
    temporaryEmail: email,
    confirm: {
      code: confirmCode,
      expiredAt: rollNowDateForward(),
    },
  });

  await notifications.email(NOTIFICATIONS.CHANGING_EMAIL, {
    locale: user.regional.locale,
    code: confirmCode,
    email,
  });

  return userToProfile(newUser as User);
};
