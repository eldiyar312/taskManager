import type { FastifyMultipartBaseOptions } from '@fastify/multipart';

type FastifyMultipartOptions = FastifyMultipartBaseOptions & {
  limits: {
    /**
     * For multipart forms, the max number of header key=>value pairs to parse
     * @default 2000
     */
    parts?: number;
  };
};

export const multipartConfig: FastifyMultipartOptions = {
  limits: {
    fieldNameSize: 0, // Max field name size in bytes
    fieldSize: 0, // Max field value size in bytes
    fields: 0, // Max number of non-file fields
    fileSize: 10 * 1024 * 1024, // For multipart forms, the max file size in bytes
    files: 1, // Max number of file fields
    headerPairs: 1, // Max number of header key=>value pairs
    parts: 0, // For multipart forms, the max number of parts (fields + files)
  },
};
