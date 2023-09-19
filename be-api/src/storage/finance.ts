import { FlattenMaps } from 'mongoose';

import { ModelsFinance } from 'src/_generated';
import { Finance, FinanceModel } from 'src/models/finance';
import { User, UserModel } from 'src/models/user';

export const changeBalance = async ({
  userId,
  amount,
}: {
  userId: User['_id'];
  amount: Finance['amount'];
}): Promise<FlattenMaps<User>> => {
  const user = (await UserModel.findByIdAndUpdate(
    userId,
    { $inc: { balance: amount } },
    { new: true }
  )) as User;
  return user.toJSON();
};

export const createFinance = async ({
  financeData,
}: {
  financeData: Omit<ModelsFinance, '_id'>;
}): Promise<FlattenMaps<Finance>> => {
  const finance = await FinanceModel.create(financeData);
  return finance.toJSON();
};
