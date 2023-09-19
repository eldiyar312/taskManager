import { changeBalance, createFinance } from 'src/storage/finance';
import {
  afterTests,
  beforeTests,
  createTestUser,
  randomUserOptions,
} from 'src/utils/tests';

beforeAll(beforeTests);
afterAll(afterTests);

describe(`replenishBalance`, () => {
  test('Replenish user profile balance.', async () => {
    const options = randomUserOptions();

    const user = await createTestUser(options);

    const amount = 100.11;
    const paymentMethod = 'invoice';

    const replenished = await changeBalance({
      userId: user._id,
      amount,
    });

    const finance = await createFinance({
      financeData: {
        userId: user._id,
        amount,
        paymentMethod,
        status: 'SUCCESS',
        type: 'REPLENISH',
      },
    });

    expect(replenished.balance).toBe(amount + user.balance);

    expect(finance.amount).toBe(amount);
    expect(finance.status).toBe('SUCCESS');
    expect(finance.type).toBe('REPLENISH');
  });
});
