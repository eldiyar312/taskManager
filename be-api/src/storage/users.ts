import { FlattenMaps } from 'mongoose';

import { ProfilePutBody } from 'src/_generated';
import { User, UserConfirmation, UserModel } from 'src/models/user';

export const findUserById = async (
  _id: User['id']
): Promise<FlattenMaps<User> | undefined> => {
  const user = await UserModel.findById(_id);

  return user?.toJSON();
};

export const findUserByEmail = async (
  email: User['contacts']['email']['value']
): Promise<FlattenMaps<User> | undefined> => {
  const user = await UserModel.findOne({ 'contacts.email.value': email });

  return user?.toJSON();
};

export const findUserByEmailConfirmationCode = async (
  code: UserConfirmation['code']
): Promise<FlattenMaps<User> | undefined> => {
  const user = await UserModel.findOne({ 'private.email.confirm.code': code });

  return user?.toJSON();
};

export const findUserByPasswordRecoveryCode = async (
  code: UserConfirmation['code']
): Promise<FlattenMaps<User> | undefined> => {
  const user = await UserModel.findOne({
    'private.password.recovery.code': code,
  });

  return user?.toJSON();
};

export const createUser = async ({
  agreements,
  confirm,
  email,
  hash,
  locale,
  personal,
  salt,
  role,
}: {
  agreements: User['agreements'];
  confirm: UserConfirmation;
  email: User['contacts']['email']['value'];
  hash: User['private']['password']['hash'];
  locale: User['regional']['locale'];
  personal: User['personal'];
  salt: User['private']['password']['salt'];
  role: User['role'];
}): Promise<FlattenMaps<User>> => {
  const user = await UserModel.create({
    agreements,
    contacts: { email: { value: email, isVerified: false } },
    personal,
    private: {
      email: { confirm },
      password: { hash, salt },
    },
    regional: { locale },
    role,
  });

  return user.toJSON();
};

/**
 * Email confirmation is required when:
 * If the user has just registered
 * If the user changed the mail
 *
 * @param _id userId
 * @returns newUser
 */
export const confirmUserEmail = async (
  _id: User['_id']
): Promise<FlattenMaps<User> | undefined> => {
  const user = await findUserById(_id);

  if (!user) {
    return undefined;
  }

  const email =
    user.private.email.temporaryEmail?.value ?? user.contacts.email.value;

  const updatedUser = await UserModel.findByIdAndUpdate(
    _id,
    {
      $set: {
        'contacts.email.isVerified': true,
        'contacts.email.value': email,
        'private.email.temporaryEmail': null,
        'private.email.confirm': null,
      },
    },
    { new: true }
  );

  return updatedUser?.toJSON();
};

export const updateUserPassword = async (
  _id: User['_id'],
  {
    confirm,
    hash,
    salt,
  }: {
    confirm: UserConfirmation | null;
    hash: User['private']['password']['hash'];
    salt: User['private']['password']['salt'];
  }
): Promise<FlattenMaps<User> | undefined> => {
  const user = await UserModel.findByIdAndUpdate(
    _id,
    {
      $set: {
        'private.password.hash': hash,
        'private.password.salt': salt,
        'private.password.recovery': confirm,
      },
    },
    { new: true }
  );

  return user?.toJSON();
};

// MongoServerError: Cannot create field 'X' in element {Y: null}
// https://manios.org/2021/08/04/go-mongodb-error-cannot-create-field-in-element-null
export const updateUserById = async (
  _id: User['id'],
  fields:
    | {
        temporaryEmail: NonNullable<
          User['private']['email']['temporaryEmail']
        >['value'];
        confirm: UserConfirmation;
      }
    | ProfilePutBody
): Promise<FlattenMaps<User> | undefined> => {
  const user = await UserModel.findByIdAndUpdate(
    _id,
    {
      $set:
        'confirm' in fields
          ? {
              ...{
                'private.email.temporaryEmail': {
                  value: fields.temporaryEmail,
                },
                'private.email.confirm': fields.confirm,
              },
            }
          : {
              'regional.locale': fields.locale,
              'personal.name': fields.personalName,
            },
    },
    { new: true }
  );

  return user?.toJSON();
};
