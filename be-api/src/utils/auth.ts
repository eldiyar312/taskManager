import crypto from 'crypto';

import { PASSWORD_SALT } from 'src/constants/env';
import { UserPassword } from 'src/models/user';

const createHash = (base: string): string =>
  crypto.createHash('sha256').update(base).digest('hex');

export const generateRandomString = (): string =>
  crypto.randomBytes(48).toString('hex');

export const generateRandomStringBasedOnString = (base: string): string =>
  createHash(base) + generateRandomString();

const createHashFromPasswordAndSalt = (
  password: string,
  salt: UserPassword['salt']
): string => createHash(password + salt);

export const createPasswordHash = (
  password: string,
  salt: UserPassword['salt']
): string =>
  createHashFromPasswordAndSalt(
    createHashFromPasswordAndSalt(password, salt),
    PASSWORD_SALT
  );

export const verifyPassword = (
  password: string,
  { hash, salt }: UserPassword
): boolean => createPasswordHash(password, salt) === hash;
