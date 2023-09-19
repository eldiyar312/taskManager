import { Meta, StoryObj } from '@storybook/react';

import { Input as Component } from 'src/components/atoms/Input';
import { decorators } from 'src/components/providers/StorybookProvider';

const meta = {
  title: 'Atoms/Input',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const Input: StoryObj<typeof meta> = {
  args: {
    placeholder: {
      id: 'components.organisms.forms.ConfirmEmailForm.placeholderCode',
    },
  },
};
