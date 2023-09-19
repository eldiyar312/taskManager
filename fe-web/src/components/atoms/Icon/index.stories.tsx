import { Meta, StoryObj } from '@storybook/react';

import { Icon as Component } from 'src/components/atoms/Icon';
import { decorators } from 'src/components/providers/StorybookProvider';

const meta = {
  title: 'Atoms/Icon',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const Icon: StoryObj<typeof meta> = {};
