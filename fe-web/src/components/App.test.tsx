import { render, screen } from '@testing-library/react';

import { App } from 'src/components/App';

const originalError = console.error;

// TODO: Remove me in the future
beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.error = (...args: any[]) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe('Test render', () => {
  test('render without errors', () => {
    render(<App />);

    expect(screen.getByTestId('page')).toBeInTheDocument();
  });
});
