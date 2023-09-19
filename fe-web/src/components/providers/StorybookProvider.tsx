import { Meta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'src/components/providers/Provider';

export const decorators: Required<Meta['decorators']> = [
  (Story) => (
    <Provider>
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    </Provider>
  ),
];
