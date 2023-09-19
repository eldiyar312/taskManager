import { Meta, StoryObj } from '@storybook/react';

import { Preloader as Component } from 'src/components/atoms/Preloader';
import { decorators } from 'src/components/providers/StorybookProvider';

const meta = {
  title: 'Atoms/Preloader',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const Preloader: StoryObj<typeof meta> = {
  args: {},
};
