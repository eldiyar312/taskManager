import { IconType } from 'antd/es/notification/interface';

export type ID = string;
export type Email = string;
export type DateTime = number;

export type Toast = {
  id: ID;
  message: string;
  type: IconType;
};
