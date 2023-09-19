import { Meta, StoryObj } from '@storybook/react';

import { Button as Component } from 'src/components/molecules/Button';
import { decorators } from 'src/components/providers/StorybookProvider';

const meta = {
  title: 'Molecules/Button',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const Button: StoryObj<typeof meta> = {
  args: {
    children: 'Button',
  },
};
