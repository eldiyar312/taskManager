import { ErrorBoundary, Provider } from '@rollbar/react';
import React, { ReactNode } from 'react';
import { Configuration } from 'rollbar';

import {
  API_HOST,
  APP_VERSION,
  INTEGRATIONS,
  PUBLIC_ENV,
} from 'src/constants/env';

type Props = {
  children: ReactNode;
};

const rollbarConfig: Configuration = {
  accessToken: INTEGRATIONS.ROLLBAR.TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  codeVersion: APP_VERSION,
  enabled: true,
  environment: PUBLIC_ENV,
  payload: { server: { host: API_HOST } },
};

export const RollbarProvider: React.FC<Props> = ({ children }) => {
  if (!INTEGRATIONS.ROLLBAR.ENABLED) {
    return <>{children}</>;
  }

  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Provider>
  );
};
