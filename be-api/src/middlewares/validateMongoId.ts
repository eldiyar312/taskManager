import { preHandlerHookHandler } from 'fastify';
import { isValidObjectId } from 'mongoose';

import { ERRORS } from 'shared';

export const validateMongoId: preHandlerHookHandler = (
  request,
  reply,
  done
) => {
  const { id } = request.params as { id?: string };
  const { cursor, userId } = request.query as Partial<{
    cursor: string;
    userId: string;
  }>;

  const checkList = [id, cursor, userId];

  if (checkList.some((checkItem) => checkItem && !isValidObjectId(checkItem))) {
    return reply.code(400).send({ error: ERRORS.INVALID_ID });
  }

  done();
};
