import { sample } from 'effector';
import { useStore } from 'effector-react';
import React, { useEffect, useState } from 'react';
import { Router as BrowserRouter } from 'react-router-dom';

import { actions } from 'src/actions';
import { Preloader } from 'src/components/atoms/Preloader';
import { ModalsSwitch, PagesSwitch } from 'src/navigation/Switch';
import { history } from 'src/navigation/store';
import { useHistory } from 'src/navigation/useHistory';
import { $isLoggedIn, $profile } from 'src/store/access';

sample({
  clock: actions.api['/'].GET.doneData,
  target: actions.api['/profile'].GET,
  filter: (cb) => cb.isAuthenticated,
});

export const Router: React.FC = () => {
  const [isPending, setIsPending] = useState(true);
  const { location, action } = useHistory();

  const isLoggedIn = useStore($isLoggedIn);
  const profile = useStore($profile);

  const rootGetPending = useStore(actions.api['/'].GET.pending);
  const profileGetPending = useStore(actions.api['/profile'].GET.pending);

  useEffect(() => {
    const abortController = new AbortController();

    actions.api['/'].GET({ Axios: { signal: abortController.signal } });

    setIsPending(false);

    return () => abortController.abort();
  }, []);

  const isLoading = rootGetPending || profileGetPending || isPending;

  if (isLoading) {
    return <Preloader />;
  }

  const mode = isLoggedIn && profile ? profile.role : 'guest';

  return (
    <BrowserRouter
      location={location}
      navigationType={action}
      navigator={history}
    >
      <PagesSwitch mode={mode} />
      <ModalsSwitch mode={mode} />
    </BrowserRouter>
  );
};
