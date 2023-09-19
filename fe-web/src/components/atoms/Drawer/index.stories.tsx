import { Meta, StoryObj } from '@storybook/react';

import { Drawer as Component } from 'src/components/atoms/Drawer';
import { decorators } from 'src/components/providers/StorybookProvider';

const meta = {
  title: 'Atoms/Drawer',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const Drawer: StoryObj<typeof meta> = {
  args: {
    isOpen: true,
    onClose: console.log,
    title: 'components.routes.modals.ForgotPassword.title',
    children: 'TODO',
  },
};
