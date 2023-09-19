import { Meta, StoryObj } from '@storybook/react';

import { ConfirmEmailForm as Component } from 'src/components/organisms/forms/ConfirmEmailForm';
import { decorators } from 'src/components/providers/StorybookProvider';

const meta = {
  title: 'Organisms/ConfirmEmailForm',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const ConfirmEmailForm: StoryObj<typeof meta> = {};
