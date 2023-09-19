import { Meta, StoryObj } from '@storybook/react';

import { SignUpEmailForm as Component } from 'src/components/organisms/forms/SignUpEmailForm';
import { decorators } from 'src/components/providers/StorybookProvider';

const meta = {
  title: 'Organisms/SignUpEmailForm',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const SignUpEmailForm: StoryObj<typeof meta> = {};
