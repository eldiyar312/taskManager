import { Meta, StoryObj } from '@storybook/react';

import { SignInEmailForm as Component } from 'src/components/organisms/forms/SignInEmailForm';
import { decorators } from 'src/components/providers/StorybookProvider';

const meta = {
  title: 'Organisms/SignInEmailForm',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const SignInEmailForm: StoryObj<typeof meta> = {};
