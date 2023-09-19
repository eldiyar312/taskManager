import { Handler, ProfilePut } from 'src/_generated';
import { User } from 'src/models/user';
import { userToProfile } from 'src/storage/profile';
import { updateUserById } from 'src/storage/users';
import { config } from 'src/utils/navigation';

export const options = config('Update general profile info', {
  tag: 'access',
  roles: ['customer', 'contractor'],
  schema: {
    body: {
      type: 'object',
      properties: {
        locale: { $ref: 'enums#/properties/locale' },
        personalName: { type: 'string' },
      },
      additionalProperties: false,
    },
    response: {
      200: { $ref: 'models#/properties/profile' },
      401: { $ref: 'errors#/properties/simple' },
    },
  },
});

export const handler: Handler<ProfilePut> = async (request) => {
  const updateData = request.body;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = request.user!;

  const newUser = await updateUserById(user._id, updateData);

  return userToProfile(newUser as User);
};
