import { Handler, SignOutPost } from 'src/_generated';
import { signOut } from 'src/middlewares/passport';
import { config } from 'src/utils/navigation';

export const options = config('End user session', {
  tag: 'access',
  roles: ['customer', 'contractor'],
  schema: {
    response: {
      200: { $ref: 'models#/properties/status' },
      401: { $ref: 'errors#/properties/simple' },
    },
  },
  preHandler: [signOut],
});

export const handler: Handler<SignOutPost> = () => ({ status: true });
