import { Meta, StoryObj } from '@storybook/react';

import { decorators } from 'src/components/providers/StorybookProvider';
import Component from 'src/components/routes/modals/ConfirmEmail';

const meta = {
  title: 'Modals/ConfirmEmail',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const ConfirmEmail: StoryObj<typeof meta> = {};
