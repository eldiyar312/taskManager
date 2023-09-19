import { FlattenMaps } from 'mongoose';

import { ERRORS } from 'shared';

import { ModelsTask, TaskPostBody } from 'src/_generated';
import { Task } from 'src/models/task';
import {
  getDayISO,
  isValidRange,
  subTaskDatesToIsoString,
  taskDatesToIsoString,
} from 'src/utils/dates';
import {
  BaseError,
  Result,
  badRequestError,
  failWrapper,
  successWrapper,
} from 'src/utils/resultForControllers';

export const formatTaskForCreate = ({
  ...taskOptions
}: TaskPostBody & {
  ownerId: Task['ownerId'];
}): Omit<
  Pick<
    ModelsTask,
    Exclude<
      keyof (ModelsTask['subTasks'][0] | ModelsTask['mediaSlots'][0]),
      '_id'
    >
  >,
  '_id'
> => ({
  ...taskOptions,
});

export const checkDatesToCreateTask = ({
  startAt,
  endAt,
}: {
  startAt: TaskPostBody['startAt'];
  endAt: TaskPostBody['endAt'];
}): Result<boolean, BaseError> => {
  if (!startAt && !endAt) {
    return successWrapper(true);
  }

  return isValidRange({ startAt: startAt ?? getDayISO(), endAt })
    ? successWrapper(true)
    : failWrapper(badRequestError(ERRORS.INVALID_DATE));
};

export const formatReplyTask = ({
  tasks,
}: {
  tasks: FlattenMaps<Task>[];
}): ModelsTask[] => {
  const resultTasks = tasks.map((item) => ({
    ...taskDatesToIsoString(item),
    subTasks: item.subTasks.map((item) => subTaskDatesToIsoString(item)),
  }));

  return resultTasks;
};
