import { compile } from 'path-to-regexp';

export enum PAGES {
  ROOT = '/',
  APP = '/app',

  ERROR_404 = '*',
}

export enum MODALS {
  // CONTACTS_EMAIL = '/contacts/email',
  // CONTACTS_PASSWORD = '/contacts/password',

  SIGN_IN_EMAIL = '/sign-in/email',
  SIGN_UP_EMAIL = '/sign-up/email',

  CONFIRM_EMAIL = '/confirm/email/:code',
  FORGOT_PASSWORD = '/forgot/password',
  FORGOT_PASSWORD_CHANGE = '/forgot/password/change/:code',

  PROFILE = '/profile',
  PROFILE_ID = '/profile/:id',
}

export enum ENDPOINTS {
  ROOT = '/',

  CONFIRM_EMAIL = '/confirm/email',

  PASSWORD_CHANGE = '/password/change',
  PASSWORD_FORGOT = '/password/forgot',
  PASSWORD_FORGOT_CHANGE = '/password/forgot/change',

  SIGN_IN_EMAIL = '/sign-in/email',
  SIGN_UP_EMAIL = '/sign-up/email',
  // SIGN_UP_VK = '/sign-up/vk',
  // SIGN_UP_GOOGLE = '/sign-up/google',
  SIGN_OUT = '/sign-out',

  PROFILE = '/profile',
  // PROFILE_WITH_ID = '/profile/:id',
  PROFILE_EMAIL = '/profile/email',
  PROFILE_BALANCE_REPLENISH = '/profile/balance/replenish',

  TASK = '/task',

  MEDIA = '/media',

  WS = '/ws',
  WS_ECHO = '/ws/echo',
}

export type Path = {
  pathname: string;
  search?: string;
};

type ParsedPathname = string[];
type ParsedSearchParams = Record<string, string>;

export type Scheme<
  Endpoints extends PAGES | ENDPOINTS | MODALS = PAGES | ENDPOINTS | MODALS
> = {
  scheme: Endpoints;
  params?: Record<string, string>;
  getParams?: ParsedSearchParams;
};

export type FeScheme = Scheme<PAGES> | [Scheme<PAGES>, Scheme<MODALS>];

const DELIMITER = '/~';

const allPages = Object.values(PAGES);
const allModals = Object.values(MODALS);

export const isPage = (path: string) => allPages.includes(path as never);
const isModal = (path: string) => allModals.includes(path as never);

const parsePathname = (path = ''): ParsedPathname => {
  const parts = path.split(DELIMITER).filter((item) => !!item);
  return path.startsWith(DELIMITER) ? ['/', ...parts] : parts;
};

const compilePathname = (
  prev: ParsedPathname,
  scheme: Scheme<PAGES | MODALS>['scheme'],
  params: Scheme<PAGES | MODALS>['params']
): ParsedPathname => {
  const isCompilable = scheme.includes(':') || params;
  const compiled = isCompilable ? compile(scheme)(params) : scheme;
  const filtered = prev.filter((item) => item !== compiled);

  if (isPage(scheme) && filtered.length) {
    throw new Error('Use option `mode=replace`');
  }

  if (isModal(scheme) && !filtered.length) {
    throw new Error('Must specify page or use option `mode=detect`');
  }

  return [...filtered, compiled];
};

const parseQueryString = (path = ''): ParsedSearchParams =>
  path
    .slice(1)
    .split('&')
    .reduce((acc, item) => {
      const [key, value] = item.split('=');
      return key ? { ...acc, [key]: value } : acc;
    }, {});

const serializeQueryString = (params: ParsedSearchParams): string | undefined =>
  Object.keys(params).length
    ? `?${Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}`
    : undefined;

export const makeSimplePath = <T extends PAGES | ENDPOINTS | MODALS>({
  scheme,
  params,
  getParams,
}: Scheme<T>) => {
  const isCompilable = scheme.includes(':') || params;
  const compiled = isCompilable ? compile(scheme)(params) : scheme;

  return compiled + (serializeQueryString(getParams ?? {}) ?? '');
};

export const makeHierarchicalPath = (
  from: Path | undefined,
  to: Scheme<PAGES | MODALS>[],
  mode: 'replace' | 'detect'
): Path | null => {
  if (!to || !to.length) {
    return null;
  }

  try {
    const precompiled = to.reduce<{
      pathname: ParsedPathname;
      search: ParsedSearchParams;
    }>(
      (acc, { scheme, params, getParams }) => {
        acc.pathname = compilePathname(acc.pathname, scheme, params);

        if (getParams) {
          acc.search = { ...acc.search, ...getParams };
        }

        return acc;
      },
      mode === 'replace' || (mode === 'detect' && isPage(to[0].scheme))
        ? { pathname: [], search: {} }
        : {
            pathname: parsePathname(from?.pathname),
            search: parseQueryString(from?.search),
          }
    );

    return {
      pathname: precompiled.pathname.join(DELIMITER).replaceAll('//', '/'),
      search: serializeQueryString(precompiled.search),
    };
  } catch (error) {
    console.error('makeURL', error);
    return null;
  }
};
