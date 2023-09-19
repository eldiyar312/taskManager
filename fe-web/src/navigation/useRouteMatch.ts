import { matchRoutes, useLocation } from 'react-router-dom';

import { PAGES } from 'shared';

const routes = Object.values(PAGES)
  .filter((page) => page !== PAGES.ERROR_404)
  .map((path) => ({ path }));

export const useRouteMatch = () => {
  const location = useLocation();

  const results =
    matchRoutes(routes, {
      ...location,
      pathname: location.pathname.split('/~/')[0],
    }) || [];

  return results[0]?.route?.path as PAGES | undefined;
};
