import { JSONSchema4 } from 'json-schema';

export const models: JSONSchema4 = {
  $id: 'models',
  type: 'object',
  title: 'models',
  required: [
    'profile',
    'status',
    'user',
    'task',
    'media',
    'finance',
    'subTask',
  ],
  properties: {
    profile: {
      type: 'object',
      title: 'ModelsProfile',
      description: 'Profile model',
      required: [
        '_id',
        'role',
        'contacts',
        'personal',
        'private',
        'regional',
        'settings',
        'balance',
      ],
      properties: {
        _id: { type: 'string' },
        role: { $ref: 'enums#/properties/role' },
        contacts: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'object',
              required: ['isVerified', 'value'],
              properties: {
                isVerified: { type: 'boolean' },
                value: { type: 'string' },
              },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        personal: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
          },
          additionalProperties: false,
        },
        private: {
          type: 'object',
          required: [],
          properties: {},
          additionalProperties: false,
        },
        regional: {
          type: 'object',
          required: ['locale'],
          properties: {
            locale: { $ref: 'enums#/properties/locale' },
          },
          additionalProperties: false,
        },
        settings: {
          type: 'object',
          required: [],
          properties: {},
          additionalProperties: false,
        },
        balance: {
          type: 'number',
        },
      },
      additionalProperties: false,
    },
    status: {
      type: 'object',
      title: 'ModelsStatus',
      description: 'Status model',
      required: ['status'],
      properties: {
        status: { type: 'boolean' },
      },
      additionalProperties: false,
    },
    user: {
      type: 'object',
      title: 'ModelsUser',
      description: 'User model',
      required: ['_id', 'contacts', 'personal', 'balance'],
      properties: {
        _id: { type: 'string' },
        contacts: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'object',
              required: ['isVerified', 'value'],
              properties: {
                isVerified: { type: 'boolean' },
                value: { type: 'string' },
              },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        personal: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
          },
          additionalProperties: false,
        },
        balance: {
          type: 'number',
        },
      },
      additionalProperties: false,
    },
    finance: {
      type: 'object',
      title: 'ModelsFinance',
      description: 'Finance model',
      required: ['_id', 'amount', 'type', 'status', 'userId'],
      properties: {
        _id: { type: 'string' },
        amount: {
          type: 'number',
        },
        type: {
          $ref: 'enums#/properties/financeType',
        },
        status: {
          $ref: 'enums#/properties/financeStatus',
        },
        paymentMethod: {
          type: 'string',
        },
        userId: {
          type: 'string',
        },
        taskId: {
          type: 'string',
        },
      },
      additionalProperties: false,
    },
    subTask: {
      type: 'object',
      title: 'ModelsSubTask',
      description: 'SubTask model',
      allOf: [{ $ref: 'models#/$defs/taskFields' }],
    },
    task: {
      type: 'object',
      title: 'ModelsTask',
      description: 'Task model',
      allOf: [
        { $ref: 'models#/$defs/taskFields' },
        {
          type: 'object',
          required: ['subTasks', 'ownerId'],
          properties: {
            subTasks: {
              type: 'array',
              items: {
                $ref: 'models#/properties/subTask',
              },
            },
            ownerId: {
              type: 'string',
            },
            contractorId: {
              type: 'string',
            },
          },
          additionalProperties: false,
        },
      ],
    },
    media: {
      type: 'object',
      title: 'ModelsMedia',
      description: 'Media model',
      required: ['_id', 'type', 'size', 'name', 'userId'],
      properties: {
        _id: { type: 'string' },
        type: { $ref: 'enums#/properties/mediaType' },
        size: { type: 'number' },
        name: { type: 'string' },
        userId: { $ref: 'models#/properties/user/properties/_id' },
      },

      additionalProperties: false,
    },
  },
  additionalProperties: false,
  $defs: {
    taskFields: {
      type: 'object',
      required: [
        '_id',
        'title',
        'description',
        'taskStatus',
        'files',
        'mediaSlots',
      ],
      properties: {
        _id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        taskStatus: { $ref: 'enums#/properties/taskStatus' },
        files: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        mediaSlots: {
          type: 'array',
          items: {
            type: 'object',
            required: ['_id', 'type'],
            properties: {
              _id: { type: 'string' },
              description: { type: 'string' },
              type: { $ref: 'enums#/properties/mediaSlotType' },
            },
            additionalProperties: false,
          },
        },
        price: { type: 'number' },
        location: {
          type: 'string',
        },
        startAt: { type: 'string' },
        endAt: { type: 'string' },
      },
      additionalProperties: false,
    },
  },
};
