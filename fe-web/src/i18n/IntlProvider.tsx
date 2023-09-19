import { useStore } from 'effector-react';
import React, { ReactNode } from 'react';
import { IntlProvider as Provider } from 'react-intl';

import { Locales, defaultLocale } from 'shared';

import { locales } from 'src/i18n';
import { $access } from 'src/store/access';

type Props = {
  children: ReactNode;
};

const navigatorLocale: Locales = navigator.language
  .toLowerCase()
  .split('-')
  .includes('ru')
  ? 'ru'
  : defaultLocale;

export const IntlProvider: React.FC<Props> = ({ children }) => {
  const access = useStore($access);
  const locale = access.profile?.regional.locale ?? navigatorLocale;

  return (
    <Provider
      defaultLocale={defaultLocale}
      key={locale}
      locale={locale}
      messages={locales[locale].dictionary}
      textComponent={React.Fragment}
    >
      {children}
    </Provider>
  );
};
