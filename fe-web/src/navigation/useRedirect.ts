import { NavigateFunction, useNavigate } from 'react-router-dom';

import { FeScheme, MODALS, Scheme, makeHierarchicalPath } from 'shared';

import { history } from 'src/navigation/store';

const handler =
  <T>(mode: 'replace' | 'detect', navigate: NavigateFunction) =>
  (schemes: T) => {
    const url = schemes as never;
    const to = makeHierarchicalPath(
      history.location,
      Array.isArray(url) ? url : [url],
      mode
    );

    if (to) {
      navigate(to, { replace: true });
    }
  };

export const useRedirect = () => {
  const navigate = useNavigate();

  return {
    redirect: handler<FeScheme>('replace', navigate),
    openModal: handler<Scheme<MODALS>>('detect', navigate),
  };
};
