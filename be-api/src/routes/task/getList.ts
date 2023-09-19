import { Handler, TaskGet } from 'src/_generated';
import { PAGINATION_LIMIT } from 'src/constants/settings';
import { getListTasks } from 'src/storage/tasks';
import { config } from 'src/utils/navigation';
import { formatReplyTask } from 'src/utils/task';

export const options = config('Get list tasks', {
  tag: 'core',
  roles: ['customer', 'contractor'],
  schema: {
    querystring: {
      type: 'object',
      properties: {
        cursor: { type: 'string' },
        limit: { type: 'string' },
        sortField: { $ref: 'enums#/properties/sortField' },
        sortDir: { $ref: 'enums#/properties/sortDirection' },
        status: {
          anyOf: [
            { $ref: 'enums#/properties/taskStatus' },
            { type: 'array', items: { $ref: 'enums#/properties/taskStatus' } },
          ],
        },
      },
      additionalProperties: false,
    },
    response: {
      200: {
        type: 'object',
        required: ['tasks'],
        properties: {
          tasks: {
            type: 'array',
            items: { $ref: 'models#/properties/task' },
          },
        },
        additionalProperties: false,
      },
      401: { $ref: 'errors#/properties/simple' },
    },
  },
});

export const handler: Handler<TaskGet> = async (request) => {
  const {
    cursor,
    limit = PAGINATION_LIMIT,
    status,
    sortField,
    sortDir,
  } = request.query;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userId = request.user!._id;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const role = request.user!.role;

  const tasks = await getListTasks({
    cursor,
    limit: Number(limit),
    status,
    userId,
    sortField,
    sortDir,
    role,
  });

  const formatTasks = formatReplyTask(tasks);

  return { tasks: formatTasks };
};
