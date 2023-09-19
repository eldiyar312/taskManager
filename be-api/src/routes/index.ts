import { ENDPOINTS } from 'shared';

import * as confirm from 'src/routes/confirm';
import * as media from 'src/routes/media';
import * as password from 'src/routes/password';
import * as profile from 'src/routes/profile';
import * as root from 'src/routes/root';
import * as signIn from 'src/routes/signIn';
import * as signOut from 'src/routes/signOut';
import * as signUp from 'src/routes/signUp';
import * as task from 'src/routes/task';
import * as ws from 'src/routes/ws';
import { router } from 'src/utils/navigation';

export const routes = router({
  [ENDPOINTS.ROOT]: {
    GET: root,
  },

  [ENDPOINTS.CONFIRM_EMAIL]: {
    POST: confirm.email,
  },

  [ENDPOINTS.PASSWORD_CHANGE]: {
    POST: password.change,
  },
  [ENDPOINTS.PASSWORD_FORGOT]: {
    POST: password.forgot,
  },
  [ENDPOINTS.PASSWORD_FORGOT_CHANGE]: {
    POST: password.forgot.change,
  },

  [ENDPOINTS.SIGN_IN_EMAIL]: {
    POST: signIn.email,
  },
  [ENDPOINTS.SIGN_UP_EMAIL]: {
    POST: signUp.email,
  },
  [ENDPOINTS.SIGN_OUT]: {
    POST: signOut,
  },

  [ENDPOINTS.PROFILE]: {
    GET: profile.get,
    PUT: profile.update,
  },
  [ENDPOINTS.PROFILE_EMAIL]: {
    PUT: profile.update.email,
  },
  [ENDPOINTS.PROFILE_BALANCE_REPLENISH]: {
    POST: profile.balance.replenish,
  },

  [ENDPOINTS.TASK]: {
    GET: task.getList,
    POST: task.create,
  },

  [ENDPOINTS.MEDIA]: {
    POST: media.create,
  },

  [ENDPOINTS.WS]: {
    GET: ws as never,
  },
  [ENDPOINTS.WS_ECHO]: {
    POST: ws.echo,
  },
});
