import { Meta, StoryObj } from '@storybook/react';

import { ForgotPasswordForm as Component } from 'src/components/organisms/forms/ForgotPasswordForm';
import { decorators } from 'src/components/providers/StorybookProvider';

const meta = {
  title: 'Organisms/ForgotPasswordForm',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const ForgotPasswordForm: StoryObj<typeof meta> = {};
