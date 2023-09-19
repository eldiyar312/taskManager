import { Meta, StoryObj } from '@storybook/react';

import { Card as Component } from 'src/components/atoms/Card';
import { decorators } from 'src/components/providers/StorybookProvider';

const meta = {
  title: 'Atoms/Card',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const Card: StoryObj<typeof meta> = {
  args: {
    children: <p>Ситуация: Пупа и Лупа получали зарплату...</p>,
    cardTitle: 'Ситуация',
  },
};
