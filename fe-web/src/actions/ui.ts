import { createEvent } from 'effector';

import { Toast } from 'src/types';

export const toasts = {
  add: createEvent<Toast>(),
  remove: createEvent<Toast['id']>(),
};
