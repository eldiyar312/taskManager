import { Effect, createEffect } from 'effector';
import {
  AxiosOptions,
  Payload,
  Effect as WrapperEffect,
  makeApi,
} from 'types-to-fetchers';
import { v4 } from 'uuid';

import { API, SimpleError } from 'src/_generated';
import { toasts } from 'src/actions/ui';
import { API_HOST, PUBLIC_ENV } from 'src/constants/env';

type Api = Omit<
  API,
  | '*'
  | '/swagger'
  | '/swagger/'
  | '/swagger/*'
  | '/swagger/initOAuth'
  | '/swagger/json'
  | '/swagger/static/*'
  | '/swagger/uiConfig'
  | '/swagger/yaml'
>;

type Reply<PayloadRecord extends Payload> = Exclude<
  PayloadRecord['Reply'],
  SimpleError
>;

type Methods<MethodsRecord extends object> = {
  [Method in keyof MethodsRecord]: Effect<
    Omit<MethodsRecord[Method], 'Reply'> & AxiosOptions,
    Reply<MethodsRecord[Method]>
  >;
};

type Endpoints<EndpointsRecord extends object> = {
  [Endpoint in keyof EndpointsRecord]: Methods<EndpointsRecord[Endpoint]>;
};

const makeAPIUrl = (protocol: 'https' | 'wss') => {
  const API_PROTOCOL =
    PUBLIC_ENV === 'local' ? protocol.slice(0, -1) : protocol;

  return `${API_PROTOCOL}://${API_HOST}`;
};

const makeEffect: WrapperEffect<Payload, SimpleError> = (action) => {
  const event = createEffect(action);

  event.fail.watch(({ error }) => {
    if (error.toString() !== 'canceled') {
      toasts.add({
        id: v4(),
        message: error?.message || String(error),
        type: 'error',
      });
    }
  });
  return event;
};

export const api = makeApi<Api, SimpleError, Endpoints<Api>>(
  {
    '/': ['GET'],

    '/confirm/email': ['POST'],

    '/password/change': ['POST'],
    '/password/forgot': ['POST'],
    '/password/forgot/change': ['POST'],

    '/profile': ['GET', 'PUT'],
    '/profile/email': ['PUT'],
    '/profile/balance/replenish': ['POST'],

    '/sign-in/email': ['POST'],
    '/sign-out': ['POST'],
    '/sign-up/email': ['POST'],

    '/task': ['GET', 'POST'],
    '/media': ['POST'],

    '/ws': ['GET'],
    '/ws/echo': ['POST'],
  },
  {
    baseURL: makeAPIUrl('https'),
    effect: makeEffect,
  }
);
