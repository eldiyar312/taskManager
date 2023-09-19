import { Meta, StoryObj } from '@storybook/react';

import { decorators } from 'src/components/providers/StorybookProvider';
import Component from 'src/components/routes/pages/App';

const meta = {
  title: 'Pages/App',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const App: StoryObj<typeof meta> = {};
