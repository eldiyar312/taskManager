import { Meta, StoryObj } from '@storybook/react';

import { decorators } from 'src/components/providers/StorybookProvider';
import Component from 'src/components/routes/pages/Error404';

const meta = {
  title: 'Pages/Error404',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const Error404: StoryObj<typeof meta> = {};
