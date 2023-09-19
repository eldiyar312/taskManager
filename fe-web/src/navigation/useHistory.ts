import { Update } from 'history';
import { useLayoutEffect, useReducer } from 'react';

import { history } from 'src/navigation/store';

const reducer = (_: Update, action: Update) => action;

export const useHistory = () => {
  const [state, dispatch] = useReducer(reducer, {
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => {
    const unlisten = history.listen(dispatch);

    return () => {
      unlisten();
    };
  }, []);

  return state;
};
