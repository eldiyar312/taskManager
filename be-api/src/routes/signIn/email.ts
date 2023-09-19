import { Handler, SignInEmailPost } from 'src/_generated';
import { authWithEmail } from 'src/middlewares/passport';
import { User } from 'src/models/user';
import { userToProfile } from 'src/storage/profile';
import { config } from 'src/utils/navigation';

export const options = config('Sign In with email and password', {
  tag: 'access',
  roles: ['guest'],
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
      additionalProperties: false,
    },
    response: {
      200: { $ref: 'models#/properties/profile' },
      401: { $ref: 'errors#/properties/simple' },
    },
  },
  preHandler: [authWithEmail],
});

export const handler: Handler<SignInEmailPost> = (request) =>
  userToProfile(request.user as User);
