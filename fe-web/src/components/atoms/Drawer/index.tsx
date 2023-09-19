/**
 * https://ant.design/components/drawer/
 */
import AntDrawer from 'antd/lib/drawer';
import React, { ReactNode } from 'react';
import { useIntl } from 'react-intl';

import { useIsMobile } from 'src/hooks/useIsMobile';
import { DictionaryKey } from 'src/i18n';
import { msg } from 'src/i18n/Msg';

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: DictionaryKey;
  params?: string;
};

export const Drawer: React.FC<Props> = ({
  children,
  isOpen,
  onClose,
  title,
  params = '{}',
}) => {
  const intl = useIntl();
  const isMobile = useIsMobile();

  const values = JSON.parse(params);
  const { name } = values;

  return (
    <AntDrawer
      onClose={onClose}
      placement={isMobile ? 'bottom' : 'right'}
      title={name ? name.toUpperCase() : msg(intl, { id: title, values })}
      open={isOpen}
      size={isMobile ? 'default' : 'large'}
      height={isMobile ? '80%' : '100%'}
    >
      {children}
    </AntDrawer>
  );
};
