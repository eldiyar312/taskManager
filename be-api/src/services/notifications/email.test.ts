import { LOCALES } from 'shared';

import { taskToHandler } from 'src/services/notifications/email';

const common = {
  email: 'user@example.com',
  code: 'xxxyyy',
};

const handlers = Object.entries(taskToHandler);

describe('Notifications: email', () => {
  handlers.forEach(([event, handler]) => {
    describe(`Event: ${event}`, () => {
      LOCALES.forEach((locale) => {
        test(`Notification with '${locale}' locale works correctly`, () => {
          expect(handler({ locale, ...common })).toMatchSnapshot();
        });
      });
    });
  });
});
