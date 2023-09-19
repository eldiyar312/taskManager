import { checkBalanceToCreateTask } from 'src/storage/tasks';
import {
  afterTests,
  beforeTests,
  createTestUser,
  randomUserOptions,
} from 'src/utils/tests';

beforeAll(beforeTests);
afterAll(afterTests);

describe('Check balance', () => {
  test('price undefined = return isFail false', async () => {
    const options = { ...randomUserOptions(), balance: 100 };

    const user = await createTestUser(options);

    expect((await checkBalanceToCreateTask({ userId: user._id })).isFail).toBe(
      false
    );
  });
  test('price > balance = return isFail true', async () => {
    const options = { ...randomUserOptions(), balance: 100 };

    const user = await createTestUser(options);

    expect(
      (await checkBalanceToCreateTask({ userId: user._id, price: 1000 })).isFail
    ).toBe(true);
  });
});
