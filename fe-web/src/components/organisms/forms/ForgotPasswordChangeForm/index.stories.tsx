import { Meta, StoryObj } from '@storybook/react';

import { ForgotPasswordChangeForm as Component } from 'src/components/organisms/forms/ForgotPasswordChangeForm';
import { decorators } from 'src/components/providers/StorybookProvider';

const meta = {
  title: 'Organisms/ForgotPasswordChangeForm',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const ForgotPasswordChangeForm: StoryObj<typeof meta> = {};
