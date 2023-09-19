export const CONTACTS = {
  EMAILS: {
    NOREPLY: 'noreply@todo.com',
    SUPPORT: 'support@todo.com',
  },
} as const;

export const ACCOUNT_STATUS = ['active', 'process_delete', 'deleted'] as const;
export const TASK_STATUS = [
  'backlog',
  'todo',
  'doing',
  'review',
  'done',
] as const;
export const ROLE = ['customer', 'contractor'] as const;

export const FINANCE_STATUS = ['SUCCESS', 'FAIL', 'PENDING'] as const;

export const FINANCE_TYPE = [
  'REPLENISH',
  'WITHDRAWAL',
  'TRANSFER',
  'REFUND',
] as const;

export const PAYMENT_METHOD = ['invoice'] as const;

export const MEDIA_TYPE = [
  'jpeg',
  'jpg',
  'png',
  'webp',
  'mp4',
  'mp3',
  'json',
  'pdf',
  'docx',
] as const;
export const MEDIA_SLOT_TYPE = ['photo', 'video'] as const;

export const SORT_FIELD = ['updatedAt', 'title', 'price'] as const;

export const SORT_DIRECTIONS = ['1', '-1'] as const;
