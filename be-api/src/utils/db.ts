import mongoose, {
  ConnectOptions,
  Document,
  Model,
  Schema as MongooseSchema,
  SchemaOptions,
  VirtualTypeOptions,
} from 'mongoose';

import { DB_CERTIFICATE_PATH, DB_CONNECTION } from 'src/constants/env';
import { disconnect as sessionDisconnect } from 'src/plugins/session';

type SchemaTypeOptions = {
  type:
    | DateConstructor
    | StringConstructor
    | BooleanConstructor
    | MongooseSchema;
  required?: boolean;
  unique?: boolean;
  sparse?: boolean;
  enum?: string[];
  default?: null | string | number | boolean;
};

type DocumentKeys = keyof Document;

type SchemaDefinition<T> = {
  [k in keyof Required<Omit<T, DocumentKeys>>]:
    | SchemaTypeOptions
    | VirtualTypeOptions
    | SchemaDefinition<T[k]>;
};

type TSchema = {
  new <T = unknown>(definition: SchemaDefinition<T>): MongooseSchema<
    T,
    Model<T, unknown, unknown, unknown, unknown>,
    {},
    {},
    never,
    {}
  >;

  new <T = unknown>(
    definition: SchemaDefinition<Omit<T, 'createdAt' | 'updatedAt'>>,
    options: SchemaOptions
  ): MongooseSchema<
    T,
    Model<T, unknown, unknown, unknown, unknown>,
    {},
    {},
    never,
    {}
  >;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Schema: TSchema = MongooseSchema as any;

export const schemaOptions: SchemaOptions = {
  id: true,
  versionKey: false,
  timestamps: true,
};

export const tlsConfigs = DB_CERTIFICATE_PATH
  ? {
      tls: true,
      tlsCAFile: DB_CERTIFICATE_PATH,
    }
  : {};

const connectionOptions: ConnectOptions = {
  ...tlsConfigs,
  autoIndex: true,
};

export const db = {
  connect: async (url: string, options: ConnectOptions): Promise<void> => {
    await mongoose.connect(url, options);
  },
  disconnect: async (): Promise<void> => {
    await mongoose.connection.close();
  },
  drop: async (): Promise<void> => {
    await mongoose.connection.db.dropDatabase();
  },
};

export const connect = async (): Promise<void> => {
  await db.connect(DB_CONNECTION, connectionOptions);
};

export const disconnect = async (): Promise<void> => {
  await db.disconnect();
  await sessionDisconnect();
};
