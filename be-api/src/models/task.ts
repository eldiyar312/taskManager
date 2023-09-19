import { Document, Schema as MongooseSchema, model } from 'mongoose';

import { MEDIA_SLOT_TYPE, TASK_STATUS } from 'shared';

import { EnumsMediaSlotType, EnumsTaskStatus } from 'src/_generated';
import { User, UserModel } from 'src/models/user';
import { ID, Money } from 'src/types';
import { Schema, schemaOptions } from 'src/utils/db';

import { MediaModel, Media as TMedia } from './media';

type MediaSlot = { _id: ID; description?: string; type: EnumsMediaSlotType };

type SubTask = {
  _id: ID;
  title: string;
  description: string;
  taskStatus: EnumsTaskStatus;
  files: TMedia['_id'][];
  mediaSlots: MediaSlot[];
  price?: Money;
  location?: string;
  startAt?: Date;
  endAt?: Date;
};

export type Task = Document &
  SubTask & {
    createdAt: Date;
    updatedAt: Date;
    subTasks: SubTask[];
    ownerId: User['_id'];
    contractorId?: User['_id'];
  };

const SlotSchema = new Schema<MediaSlot>({
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: MEDIA_SLOT_TYPE,
    required: true,
  },
});

const SubTaskSchema = new Schema<SubTask>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  startAt: {
    type: MongooseSchema.Types.Date,
  },
  endAt: {
    type: MongooseSchema.Types.Date,
  },
  files: {
    type: [MongooseSchema.Types.ObjectId],
    ref: MediaModel,
    required: true,
  },
  taskStatus: {
    type: String,
    enum: TASK_STATUS,
    default: 'backlog',
  },
  location: {
    type: String,
  },
  mediaSlots: {
    type: [SlotSchema],
    required: true,
  },
});

const TaskSchema = new Schema<Task>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    startAt: {
      type: MongooseSchema.Types.Date,
    },
    endAt: {
      type: MongooseSchema.Types.Date,
    },
    subTasks: {
      type: [SubTaskSchema],
      required: true,
    },
    files: {
      type: [MongooseSchema.Types.ObjectId],
      ref: MediaModel,
      required: true,
    },
    taskStatus: {
      type: String,
      enum: TASK_STATUS,
      default: 'backlog',
    },
    ownerId: {
      type: MongooseSchema.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
    contractorId: {
      type: MongooseSchema.Types.ObjectId,
      ref: UserModel,
    },
    location: {
      type: String,
    },
    mediaSlots: {
      type: [SlotSchema],
      required: true,
    },
  },
  schemaOptions
);

export const TaskModel = model<Task>('Task', TaskSchema);
