import { Meta, StoryObj } from '@storybook/react';

import { decorators } from 'src/components/providers/StorybookProvider';
import Component from 'src/components/routes/modals/SignInEmail';

const meta = {
  title: 'Modals/SignInEmail',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const SignInEmail: StoryObj<typeof meta> = {};
