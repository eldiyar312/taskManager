import React from 'react';

import { Tabs, Props as TabsProps } from 'src/components/molecules/Tabs';

const Profile: React.FC = () => {
  const tabsData: TabsProps['items'] = [
    {
      label: { id: 'components.routes.modals.Profile.TabTitleInfo' },
      children: null,
    },
    {
      label: { id: 'components.routes.modals.Profile.TabTitleSettings' },
      children: null,
    },
  ];

  return <Tabs items={tabsData} />;
};

export default Profile;
