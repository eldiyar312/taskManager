import { Handler, TaskPost } from 'src/_generated';
import { checkBalanceToCreateTask, createTask } from 'src/storage/tasks';
import { config } from 'src/utils/navigation';
import { checkDatesToCreateTask, formatTaskForCreate } from 'src/utils/task';

export const options = config('Create task', {
  tag: 'core',
  roles: ['customer'],
  schema: {
    body: {
      type: 'object',
      required: ['title', 'description', 'subTasks', 'files', 'mediaSlots'],
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        taskStatus: { $ref: 'enums#/properties/taskStatus' },
        subTasks: {
          type: 'array',
          items: {
            type: 'object',
            required: ['title', 'description', 'files', 'mediaSlots'],
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'string' },
              startAt: { type: 'string' },
              endAt: { type: 'string' },
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
                  required: ['type'],
                  properties: {
                    description: { type: 'string' },
                    type: { $ref: 'enums#/properties/mediaSlotType' },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
          },
        },
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
            required: ['type'],
            properties: {
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
        contractorId: { type: 'string' },
      },
      additionalProperties: false,
    },
    response: {
      200: { $ref: 'models#/properties/task' },
      400: { $ref: 'errors#/properties/simple' },
      401: { $ref: 'errors#/properties/simple' },
    },
  },
});

export const handler: Handler<TaskPost> = async (request, reply) => {
  const {
    title,
    description,
    taskStatus,
    subTasks,
    files,
    mediaSlots,
    price,
    location,
    startAt,
    endAt,
    contractorId,
  } = request.body;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userId = request.user!._id;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ownerId = request.user!._id;
  const resultCheckBalance = await checkBalanceToCreateTask({ userId, price });

  if (resultCheckBalance.isFail) {
    const { code, ...info } = resultCheckBalance.value;
    return reply.code(code).send(info);
  }

  const resultCheckDates = checkDatesToCreateTask({ startAt, endAt });

  if (resultCheckDates.isFail) {
    const { code, ...info } = resultCheckDates.value;
    return reply.code(code).send(info);
  }
  const resultFormat = formatTaskForCreate({
    title,
    description,
    taskStatus,
    subTasks,
    files,
    mediaSlots,
    price,
    location,
    startAt,
    endAt,
    contractorId,
    ownerId,
  });
  const task = await createTask(resultFormat);

  return task;
};
