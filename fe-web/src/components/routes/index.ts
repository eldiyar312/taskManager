import React, { lazy } from 'react';

import { FeScheme, MODALS, PAGES } from 'shared';

import { EnumsRole } from 'src/_generated';
import { DictionaryKey } from 'src/i18n';

export type Roles = 'guest' | EnumsRole;

export const pagesRedirect: Record<Roles, FeScheme> = {
  guest: [{ scheme: PAGES.ROOT }, { scheme: MODALS.SIGN_IN_EMAIL }],
  customer: { scheme: PAGES.APP }, //TODO
  contractor: { scheme: PAGES.APP }, //TODO
};

export type ModalRoute = {
  access: 'all' | Roles[];
  title: DictionaryKey;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.FC<any>;
};

export type PageRoute = ModalRoute;

export const pages: Record<PAGES, PageRoute> = {
  [PAGES.ROOT]: {
    access: 'all',
    title: 'components.routes.pages.Root.title',
    component: lazy(() => import('src/components/routes/pages/Root')),
  },
  [PAGES.APP]: {
    access: ['customer', 'contractor'],
    title: 'components.routes.pages.App.title',
    component: lazy(() => import('src/components/routes/pages/App')),
  },

  // This item must be the last in the list
  [PAGES.ERROR_404]: {
    access: 'all',
    title: 'components.routes.pages.Error404.title',
    component: lazy(() => import('src/components/routes/pages/Error404')),
  },
};

export const modals: Record<MODALS, ModalRoute> = {
  [MODALS.SIGN_IN_EMAIL]: {
    access: ['guest'],
    title: 'components.routes.modals.SignInEmail.title',
    component: lazy(() => import('src/components/routes/modals/SignInEmail')),
  },
  [MODALS.SIGN_UP_EMAIL]: {
    access: ['guest'],
    title: 'components.routes.modals.SignUpEmail.title',
    component: lazy(() => import('src/components/routes/modals/SignUpEmail')),
  },
  [MODALS.CONFIRM_EMAIL]: {
    access: 'all',
    title: 'components.routes.modals.ConfirmEmail.title',
    component: lazy(() => import('src/components/routes/modals/ConfirmEmail')),
  },
  [MODALS.FORGOT_PASSWORD]: {
    access: ['guest'],
    title: 'components.routes.modals.ForgotPassword.title',
    component: lazy(
      () => import('src/components/routes/modals/ForgotPassword')
    ),
  },
  [MODALS.FORGOT_PASSWORD_CHANGE]: {
    access: ['guest'],
    title: 'components.routes.modals.ForgotPasswordChange.title',
    component: lazy(
      () => import('src/components/routes/modals/ForgotPasswordChange')
    ),
  },
  [MODALS.PROFILE]: {
    access: ['customer', 'contractor'],
    title: 'components.routes.modals.Profile.title',
    component: lazy(() => import('src/components/routes/modals/Profile')),
  },
  [MODALS.PROFILE_ID]: {
    access: ['customer', 'contractor'],
    title: 'components.routes.modals.ProfileId.title',
    component: lazy(() => import('src/components/routes/modals/ProfileId')),
  },
};
