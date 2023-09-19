import { ModelsProfile } from 'src/_generated';
import { User } from 'src/models/user';

export const userToProfile = (user: User): ModelsProfile => ({
  _id: user._id,
  role: user.role,
  contacts: {
    email: { ...user.contacts.email },
  },
  personal: user.personal,
  private: {},
  regional: {
    locale: user.regional.locale,
  },
  settings: {},
  balance: user.balance,
});
