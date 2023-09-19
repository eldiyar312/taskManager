import { Document, model } from 'mongoose';

import { LOCALES, Locales, defaultLocale } from 'shared';

import { EnumsRole } from 'src/_generated';
import { ID, Money } from 'src/types';
import { Schema, schemaOptions } from 'src/utils/db';

type UserContact = {
  _id?: ID;
  value: string;
  // isVisible: boolean; // TODO?
  isVerified: boolean;
};

export type UserConfirmation = {
  expiredAt: string;
  code: string;
};

export type UserPassword = {
  hash: string;
  salt: string;
};

export interface User extends Document {
  _id: ID;
  role: EnumsRole;
  agreements: {
    terms: boolean;
  };
  contacts: {
    email: UserContact;
  };
  personal: {
    name: string;
  };
  private: {
    email: {
      temporaryEmail?: Pick<UserContact, 'value'>;
      confirm?: UserConfirmation;
    };

    password: UserPassword & {
      recovery?: UserConfirmation;
    };
  };
  regional: {
    locale: Locales;
  };
  createdAt: Date;
  updatedAt: Date;
  balance: Money;
}

const UserContactSchema = new Schema<UserContact>({
  value: {
    type: String,
    unique: true,
    sparse: true,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
});

const UserConfirmationSchema = new Schema<UserConfirmation>({
  expiredAt: {
    type: Date,
    required: true,
  },
  code: {
    type: String,
    unique: true,
    sparse: true,
    required: true,
  },
});

const UserSchema = new Schema<User>(
  {
    role: {
      type: String,
      enum: ['customer', 'contractor', 'support'],
    },
    agreements: {
      terms: {
        type: Boolean,
        required: true,
      },
    },
    contacts: {
      email: {
        type: UserContactSchema,
        required: true,
      },
    },
    personal: {
      name: {
        type: String,
        required: true,
      },
    },
    private: {
      email: {
        confirm: {
          type: UserConfirmationSchema,
          default: null,
        },
        temporaryEmail: {
          type: Object,
          default: null,
          value: {
            type: String,
          },
        },
      },
      password: {
        hash: {
          type: String,
          required: true,
        },
        salt: {
          type: String,
          required: true,
        },
        recovery: {
          type: UserConfirmationSchema,
          default: null,
        },
      },
    },
    regional: {
      locale: {
        type: String,
        enum: LOCALES,
        default: defaultLocale,
      },
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  schemaOptions
);

export const UserModel = model<User>('User', UserSchema);
