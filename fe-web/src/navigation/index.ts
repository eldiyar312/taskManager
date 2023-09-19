import { matchPath } from 'react-router-dom';

import { MODALS, PAGES } from 'shared';

import {
  ModalRoute,
  PageRoute,
  Roles,
  modals as modalsConfig,
  pages as pagesConfig,
} from 'src/components/routes';

type Route = PageRoute | ModalRoute;

type RouteWithScheme = Route & { scheme: PAGES | MODALS };
type Routes = Record<Roles, string[]>;

export type SwitchMode = {
  mode: Roles;
};

export const prepareURL = (pathname: string) => {
  const path = pathname.split('/~')[0] as PAGES;
  const pages = Object.values(PAGES).filter((item) => item !== '*');

  if (pages.includes(path)) {
    return path;
  }

  const match = pages
    .map((scheme) => matchPath(path, scheme))
    .find((item) => item);

  return match?.pathname as PAGES | undefined;
};

const allRoutes = (config: Record<string, Route>): RouteWithScheme[] =>
  Object.keys(config).map(
    (scheme: string) => ({ scheme, ...config[scheme] } as never)
  );

const filterConfig = (list: RouteWithScheme[], access: Roles): string[] =>
  list
    .filter((item) => item.access === 'all' || item.access.includes(access))
    .map((item) => item.scheme);

const createRoutes = (mode: 'pages' | 'modals'): Routes => {
  const list = allRoutes(mode === 'pages' ? pagesConfig : modalsConfig);

  return {
    guest: filterConfig(list, 'guest'),
    customer: filterConfig(list, 'customer'),
    contractor: filterConfig(list, 'contractor'),
  };
};

export const allPages: PAGES[] = allRoutes(pagesConfig).map(
  (item) => item.scheme
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) as any;
export const allowedPages: Routes = createRoutes('pages');
export const allowedModals: Routes = createRoutes('modals');

/*
// Uncomment it if needed
export const redirect = (
  url: Scheme<PAGES | MODALS> | [Scheme<PAGES>, Scheme<MODALS>],
  mode: 'replace' | 'detect'
): void => {
  const to = makeHierarchicalPath(
    history.location,
    Array.isArray(url) ? url : [url],
    mode
  );

  if (to) {
    history.push(to);
  }
};
*/

export const getRouteConfigByPath = (path?: string): Partial<PageRoute> =>
  pagesConfig[path as PAGES] || modalsConfig[path as MODALS] || {};
