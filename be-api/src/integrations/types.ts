import { Email, Link } from 'src/types';

export type AbstractDataEmail = {
  from: Email;
  to: Email;
  subject: string;
  text: string;
  html: string;
  attachment?: Link[];
};
