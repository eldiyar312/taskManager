import { Meta, StoryObj } from '@storybook/react';

import { Header as Component } from 'src/components/organisms/Header';
import { decorators } from 'src/components/providers/StorybookProvider';

const meta = {
  title: 'Organisms/Header',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const Header: StoryObj<typeof meta> = {};
