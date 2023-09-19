import { Meta, StoryObj } from '@storybook/react';

import { decorators } from 'src/components/providers/StorybookProvider';
import Component from 'src/components/routes/pages/Root';

const meta = {
  title: 'Pages/Root',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const Root: StoryObj<typeof meta> = {};
