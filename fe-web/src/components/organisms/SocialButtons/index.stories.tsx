import { Meta, StoryObj } from '@storybook/react';

import { SocialButtons as Component } from 'src/components/organisms/SocialButtons';
import { decorators } from 'src/components/providers/StorybookProvider';

const meta = {
  title: 'Organisms/SocialButtons',
  component: Component,
  decorators,
} satisfies Meta<typeof Component>;

export default meta;

export const SocialButtons: StoryObj<typeof meta> = {};
