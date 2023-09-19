import React from 'react';

import { Provider } from 'src/components/providers/Provider';
import { Router } from 'src/navigation/Router';

export const App: React.FC = () => (
  <Provider>
    <div className="app" data-testid="page">
      <Router />
    </div>
  </Provider>
);
