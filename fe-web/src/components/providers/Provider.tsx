import React, { ReactNode } from 'react';

import { RollbarProvider } from 'src/components/providers/RollbarProvider';
import { ToastProvider } from 'src/components/providers/ToastProvider';
import { IntlProvider } from 'src/i18n/IntlProvider';

import 'antd/dist/reset.css';

import 'src/styles/global.css';
import 'src/styles/variables.css';

type Props = {
  children: ReactNode;
};

export const Provider: React.FC<Props> = ({ children }) => (
  <RollbarProvider>
    <IntlProvider>
      <ToastProvider>{children}</ToastProvider>
    </IntlProvider>
  </RollbarProvider>
);
