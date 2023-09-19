import { Meta, StoryObj } from '@storybook/react';

import { Tabs as Component } from 'src/components/molecules/Tabs';
import { decorators } from 'src/components/providers/StorybookProvider';

const meta = {
  title: 'Molecules/Tabs',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const Tabs: StoryObj<typeof meta> = {
  args: {
    items: [
      {
        label: { id: 'components.routes.modals.Profile.TabTitleInfo' },
        children: <div>info</div>,
      },
      {
        label: { id: 'components.routes.modals.Profile.TabTitleSettings' },
        children: <div>settings</div>,
      },
    ],
  },
};
