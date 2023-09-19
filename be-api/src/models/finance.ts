import { Document, Schema as MongooseSchema, model } from 'mongoose';

import { EnumsFinanceStatus, EnumsFinanceType } from 'src/_generated';
import { Task, TaskModel } from 'src/models/task';
import { User, UserModel } from 'src/models/user';
import { ID, Money } from 'src/types';
import { Schema, schemaOptions } from 'src/utils/db';

export interface Finance extends Document {
  _id: ID;
  amount: Money;
  type: EnumsFinanceType;
  status: EnumsFinanceStatus;
  paymentMethod?: string;
  taskId?: Task['_id'];
  userId: User['_id'];
  createdAt: Date;
  updatedAt: Date;
}

const FinanceSchema = new Schema<Finance>(
  {
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: false,
    },
    userId: {
      type: MongooseSchema.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
    taskId: {
      type: MongooseSchema.Types.ObjectId,
      ref: TaskModel,
      required: false,
    },
  },
  schemaOptions
);

export const FinanceModel = model<Finance>('Finance', FinanceSchema);
