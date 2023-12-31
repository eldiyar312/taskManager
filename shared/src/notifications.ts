export enum NOTIFICATIONS {
  CHANGING_EMAIL = 'CHANGING_EMAIL',
  // CHANGED_EMAIL = 'CHANGED_EMAIL',
  CHANGED_PASSWORD = 'CHANGED_PASSWORD',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  FORGOT_PASSWORD_CHANGE = 'FORGOT_PASSWORD_CHANGE',
  SIGN_UP_EMAIL = 'SIGN_UP_EMAIL',
}

export const NOTIFICATION_TYPES = ['security', 'system'] as const;
export type NOTIFICATION_TYPE = (typeof NOTIFICATION_TYPES)[number];

export const NOTIFICATION_TO_TYPE: Record<NOTIFICATIONS, NOTIFICATION_TYPE> = {
  // CHANGED_EMAIL: 'security',
  CHANGED_PASSWORD: 'security',
  CHANGING_EMAIL: 'system',
  FORGOT_PASSWORD_CHANGE: 'system',
  FORGOT_PASSWORD: 'system',
  SIGN_UP_EMAIL: 'system',
};
