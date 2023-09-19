import { Meta, StoryObj } from '@storybook/react';

import { decorators } from 'src/components/providers/StorybookProvider';
import Component from 'src/components/routes/modals/ForgotPasswordChange';

const meta = {
  title: 'Modals/ForgotPasswordChange',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const ForgotPasswordChange: StoryObj<typeof meta> = {};
