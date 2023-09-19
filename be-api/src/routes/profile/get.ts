import { Handler, ProfileGet } from 'src/_generated';
import { User } from 'src/models/user';
import { userToProfile } from 'src/storage/profile';
import { config } from 'src/utils/navigation';

export const options = config('Get user profile', {
  tag: 'access',
  roles: ['customer', 'contractor'],
  schema: {
    response: {
      200: { $ref: 'models#/properties/profile' },
      401: { $ref: 'errors#/properties/simple' },
    },
  },
});

export const handler: Handler<ProfileGet> = (request) =>
  userToProfile(request.user as User);
