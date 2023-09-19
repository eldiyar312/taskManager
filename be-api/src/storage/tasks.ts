import { FlattenMaps } from 'mongoose';

import { ERRORS } from 'shared';

import {
  EnumsRole,
  EnumsSortDirection,
  EnumsSortField,
  ModelsTask,
  TaskPostBody,
} from 'src/_generated';
import { Task, TaskModel } from 'src/models/task';
import { User, UserModel } from 'src/models/user';
import {
  BaseError,
  Result,
  badRequestError,
  failWrapper,
  successWrapper,
} from 'src/utils/resultForControllers';

export const createTask = async (
  taskOptions: Omit<
    Pick<
      ModelsTask,
      Exclude<
        keyof (ModelsTask['subTasks'][0] | ModelsTask['mediaSlots'][0]),
        '_id'
      >
    >,
    '_id'
  >
): Promise<FlattenMaps<ModelsTask>> => {
  const task = await TaskModel.create(taskOptions);

  return task.toJSON();
};

export const checkBalanceToCreateTask = async ({
  userId,
  price,
}: {
  userId: User['_id'];
  price?: TaskPostBody['price'];
}): Promise<Result<boolean, BaseError>> => {
  const user = (await UserModel.findById(userId)) as User;

  if (user.balance < 0) {
    return failWrapper(badRequestError(ERRORS.LACK_OF_FUNDS));
  }

  if (price === undefined) {
    return successWrapper(true);
  }

  if (user.balance >= price) {
    return successWrapper(true);
  }

  return failWrapper(badRequestError(ERRORS.LACK_OF_FUNDS));
};

export const getListTasks = async ({
  cursor,
  limit,
  status,
  userId,
  role,
  sortField,
  sortDir,
}: {
  cursor: Task['_id'];
  limit: number;
  userId: User['_id'];
  role: EnumsRole;
  status?: Task['taskStatus'][] | Task['taskStatus'];
  sortField?: EnumsSortField;
  sortDir?: EnumsSortDirection;
}): Promise<{
  tasks: FlattenMaps<Task>[];
}> => {
  const isSorting = sortField && sortDir;

  const statuses = Array.isArray(status) ? status : [status];

  const filterRole = role === 'customer' ? { ownerId: { $eq: userId } } : {};

  const filterStatus = status ? { taskStatus: { $in: statuses } } : {};

  const cursorFilter = cursor
    ? { _id: { [Number(sortDir) > 0 ? '$gt' : '$lt']: cursor } }
    : {};

  const filter = { $and: [filterRole, filterStatus, cursorFilter] };

  const sorting = isSorting
    ? { [sortField]: Number(sortDir) }
    : { _id: -1, updatedAt: -1 };

  const tasks = await TaskModel.find(filter, null, {
    sort: sorting,
    limit,
  });

  return { tasks: tasks.map((task) => task.toJSON()) };
};
