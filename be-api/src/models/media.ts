import { Document, Schema as MongooseSchema, model } from 'mongoose';
import { MEDIA_TYPE } from 'shared/src';

import { EnumsMediaType } from 'src/_generated';
import { User, UserModel } from 'src/models/user';
import { ID } from 'src/types';
import { Schema, schemaOptions } from 'src/utils/db';

export interface Media extends Document {
  _id: ID;
  size: number;
  type: EnumsMediaType;
  name: string;
  userId: User['_id'];
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<Media>(
  {
    size: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: MEDIA_TYPE,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: MongooseSchema.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
  },
  schemaOptions
);

export const MediaModel = model<Media>('Media', MediaSchema);
