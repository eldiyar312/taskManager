import { Meta, StoryObj } from '@storybook/react';

import { Page as Component } from 'src/components/organisms/Page';
import { decorators } from 'src/components/providers/StorybookProvider';

const meta = {
  title: 'Organisms/Page',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const WithoutTitle: StoryObj<typeof meta> = {
  args: {
    children: 'text',
    template: 'entry',
  },
};

export const WithDefaultTitle: StoryObj<typeof meta> = {
  args: {
    children: 'Page with default title',
    template: 'entry',
    title: true,
  },
};

export const WithCustomTitle: StoryObj<typeof meta> = {
  args: {
    children: 'Page with custom title',
    template: 'entry',
    title: 'Custom title',
  },
};
