import { JSONSchema4 } from 'json-schema';

import {
  FINANCE_STATUS,
  FINANCE_TYPE,
  MEDIA_SLOT_TYPE,
  MEDIA_TYPE,
  PAYMENT_METHOD,
  ROLE,
  SORT_DIRECTIONS,
  SORT_FIELD,
  TASK_STATUS,
  Writeable,
} from 'shared';

export const enums: JSONSchema4 = {
  $id: 'enums',
  type: 'object',
  title: 'enums',
  required: [
    'environment',
    'locale',
    'mode',
    'role',
    'taskStatus',
    'financeStatus',
    'financeType',
  ],
  properties: {
    environment: {
      title: 'EnumsEnvironment',
      type: 'string',
      enum: ['local', 'staging', 'production'],
    },
    locale: {
      title: 'EnumsLocale',
      type: 'string',
      enum: ['ru'],
    },
    mode: {
      title: 'EnumsMode',
      type: 'string',
      enum: ['production', 'development', 'test', 'undefined'],
    },
    role: {
      title: 'EnumsRole',
      type: 'string',
      enum: ROLE as Writeable<typeof ROLE>,
    },
    taskStatus: {
      title: 'EnumsTaskStatus',
      type: 'string',
      enum: TASK_STATUS as Writeable<typeof TASK_STATUS>,
    },
    financeStatus: {
      title: 'EnumsFinanceStatus',
      type: 'string',
      enum: FINANCE_STATUS as Writeable<typeof FINANCE_STATUS>,
    },
    financeType: {
      title: 'EnumsFinanceType',
      type: 'string',
      enum: FINANCE_TYPE as Writeable<typeof FINANCE_TYPE>,
    },
    paymentMethod: {
      title: 'EnumsPaymentMethod',
      type: 'string',
      enum: PAYMENT_METHOD as Writeable<typeof PAYMENT_METHOD>,
    },
    mediaType: {
      title: 'EnumsMediaType',
      type: 'string',
      enum: MEDIA_TYPE as Writeable<typeof MEDIA_TYPE>,
    },
    mediaSlotType: {
      title: 'EnumsMediaSlotType',
      type: 'string',
      enum: MEDIA_SLOT_TYPE as Writeable<typeof MEDIA_SLOT_TYPE>,
    },
    sortField: {
      title: 'EnumsSortField',
      type: 'string',
      enum: SORT_FIELD as Writeable<typeof SORT_FIELD>,
    },
    sortDirection: {
      title: 'EnumsSortDirection',
      type: 'string',
      enum: SORT_DIRECTIONS as Writeable<typeof SORT_DIRECTIONS>,
    },
  },
  additionalProperties: false,
};
