import { Meta, StoryObj } from '@storybook/react';

import { decorators } from 'src/components/providers/StorybookProvider';
import Component from 'src/components/routes/modals/ForgotPassword';

const meta = {
  title: 'Modals/ForgotPassword',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const ForgotPassword: StoryObj<typeof meta> = {};
