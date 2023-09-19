import { Meta, StoryObj } from '@storybook/react';

import { decorators } from 'src/components/providers/StorybookProvider';
import Component from 'src/components/routes/modals/SignUpEmail';

const meta = {
  title: 'Modals/SignUpEmail',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const SignUpEmail: StoryObj<typeof meta> = {};
