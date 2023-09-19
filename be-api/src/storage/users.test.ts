import { confirmUserEmail } from 'src/storage/users';
import { generateRandomStringBasedOnString } from 'src/utils/auth';
import {
  afterTests,
  beforeTests,
  createTestUser,
  generateRandomEmail,
  notExpiredDate,
  randomUserOptions,
  updateTestUser,
} from 'src/utils/tests';

beforeAll(beforeTests);
afterAll(afterTests);

describe(`confirmUserEmail`, () => {
  test('Confirm change email is successfully.', async () => {
    const options = randomUserOptions();

    const user = await createTestUser(options);

    const temporaryEmail = generateRandomEmail();

    const newCode = generateRandomStringBasedOnString(temporaryEmail);

    await updateTestUser(user._id, {
      temporaryEmail,
      confirm: { code: newCode, expiredAt: notExpiredDate },
    });

    const confirmedUser = await confirmUserEmail(user._id);

    expect(confirmedUser?.contacts.email.value).toBe(temporaryEmail);
    expect(confirmedUser?.contacts.email.isVerified).toBeTruthy();
    expect(confirmedUser?.private.email.temporaryEmail).toBeNull();
    expect(confirmedUser?.private.email.confirm).toBeNull();
  });

  test('Confirm primary email is successfully.', async () => {
    const options = randomUserOptions();

    const user = await createTestUser(options);
    const confirmedUser = await confirmUserEmail(user._id);

    expect(confirmedUser?.contacts.email.value).toBeDefined();
    expect(confirmedUser?.contacts.email.isVerified).toBeTruthy();
    expect(confirmedUser?.private.email.temporaryEmail).toBeNull();
    expect(confirmedUser?.private.email.confirm).toBeNull();
  });
});
