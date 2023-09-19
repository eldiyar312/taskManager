/**
 * https://ant.design/components/notification/
 */
import notification from 'antd/lib/notification';
import { useStore } from 'effector-react';
import React, { ReactNode } from 'react';
import { useIntl } from 'react-intl';

import { actions } from 'src/actions';
import { errorToDictionaryKey } from 'src/constants/notifications';
import { msg } from 'src/i18n/Msg';
import { $toasts } from 'src/store/toasts';

type Props = {
  children: ReactNode;
};

export const ToastProvider: React.FC<Props> = ({ children }) => {
  const intl = useIntl();
  const toasts = useStore($toasts);

  if (toasts.length) {
    const { id: key, message, type } = toasts[0];

    const id = errorToDictionaryKey[message as never];

    notification[type]({
      message:
        typeof message === 'object' && 'id' in message
          ? msg(intl, message)
          : id
          ? msg(intl, { id })
          : message,
      key,
      onClose: () => actions.ui.toasts.remove(key),
    });
  }

  return <>{children}</>;
};
