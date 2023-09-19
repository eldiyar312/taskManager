import TabsAnt from 'antd/lib/tabs';
import type { Tab } from 'rc-tabs/lib/interface';
import React from 'react';
import { useIntl } from 'react-intl';

import { MsgProps, msg } from 'src/i18n/Msg';

export type Props = {
  items: (Omit<Tab, 'label' | 'key'> & { label: MsgProps })[];
};

export const Tabs: React.FC<Props> = ({ items }) => {
  const intl = useIntl();

  return (
    <TabsAnt
      centered
      defaultActiveKey="1"
      items={items.map((item) => ({
        ...item,
        label: msg(intl, item.label),
        key: item.label.id,
      }))}
    />
  );
};
