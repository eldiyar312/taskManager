import type { MultipartFile } from '@fastify/multipart';

import { EnumsMediaType } from 'src/_generated';

export const getFileData = (data: MultipartFile) => {
  const name = data.filename;
  const type = name.split('.').pop() as EnumsMediaType;
  return { name, type };
};
