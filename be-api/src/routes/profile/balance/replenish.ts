import {
  Handler,
  ModelsFinance,
  ProfileBalanceReplenishPost,
} from 'src/_generated';
import { User } from 'src/models/user';
import { changeBalance, createFinance } from 'src/storage/finance';
import { userToProfile } from 'src/storage/profile';
import { config } from 'src/utils/navigation';

export const options = config('Replenish user profile balance', {
  tag: 'access',
  roles: ['customer'],
  schema: {
    body: {
      type: 'object',
      required: ['amount', 'paymentMethod'],
      properties: {
        amount: { type: 'number' },
        paymentMethod: { $ref: 'enums#/properties/paymentMethod' },
      },
      additionalProperties: false,
    },
    response: {
      200: { $ref: 'models#/properties/profile' },
      401: { $ref: 'errors#/properties/simple' },
    },
  },
});

export const handler: Handler<ProfileBalanceReplenishPost> = async (
  request
) => {
  const { amount, paymentMethod } = request.body;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userId = request.user!._id;
  const financeData: Omit<ModelsFinance, '_id'> = {
    userId,
    amount,
    paymentMethod,
    status: 'SUCCESS',
    type: 'REPLENISH',
  };
  const finance = await createFinance({ financeData });
  const newUser = await changeBalance({
    userId,
    amount: finance.amount,
  });
  return userToProfile(newUser as User);
};
