import { EnumsRole } from './_generated';

export type Prefixify<
  Keys extends string,
  Prefix extends string,
  Separator extends string = ':'
> = `${Prefix}${Separator}${Keys}`;

export type ID = string;
export type Email = string;
export type Link = string;
export type Money = number;

export type Roles = 'guest' | EnumsRole;
