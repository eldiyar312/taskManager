import React, { Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { PAGES, makeHierarchicalPath } from 'shared';

import { Drawer } from 'src/components/atoms/Drawer';
import { Preloader } from 'src/components/atoms/Preloader';
import { modals, pages, pagesRedirect } from 'src/components/routes';
import { SwitchMode, allPages, allowedPages } from 'src/navigation';
import { history } from 'src/navigation/store';
import {
  ParsedModalScheme,
  useModalsSwitch,
} from 'src/navigation/useModalsSwitch';

export const onClose = () => {
  const { location } = history;
  const { pathname } = location;

  const pathnameMask = new RegExp(`/~/${pathname.split('/~/').pop()}$`);

  history.push({
    ...location,
    search: '',
    pathname: pathname.replace(pathnameMask, '') || '/',
  });
};

const RenderModalContent: React.FC<Omit<ParsedModalScheme, 'isOpen'>> =
  React.memo(({ scheme, params }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component: React.FC<any> = modals[scheme].component;
    const parsedParams = params ? JSON.parse(params) : {};

    return (
      <Suspense fallback={<Preloader />}>
        <Component params={{ ...parsedParams, scheme }} onClose={onClose} />
      </Suspense>
    );
  });

export const ModalsSwitch: React.FC<SwitchMode> = ({ mode }) => {
  const schemes = useModalsSwitch({ mode });

  return (
    <>
      {schemes.map((item, order) => (
        <Drawer
          isOpen={item.isOpen}
          key={item.scheme + order}
          onClose={onClose}
          title={modals[item.scheme].title}
          params={item.params}
        >
          <RenderModalContent params={item.params} scheme={item.scheme} />
        </Drawer>
      ))}
    </>
  );
};

const AuthGate: React.FC<SwitchMode & { scheme: PAGES }> = ({
  mode,
  scheme,
}) => {
  if (!allowedPages[mode].includes(scheme)) {
    const url = pagesRedirect[mode];
    const to = makeHierarchicalPath(
      undefined,
      Array.isArray(url) ? url : [url],
      'replace'
    );

    if (to) {
      return <Navigate replace to={to} />;
    }
  }

  const Component = pages[scheme].component;
  return <Component />;
};

export const PagesSwitch: React.FC<SwitchMode> = ({ mode }) => {
  const location = useLocation();

  return (
    <Suspense fallback={<Preloader />}>
      <Routes
        location={{
          ...location,
          pathname: location.pathname.split('/~/')[0],
        }}
      >
        {allPages.map((scheme) => (
          <Route
            key={scheme}
            path={scheme}
            element={<AuthGate mode={mode} scheme={scheme} />}
          />
        ))}
      </Routes>
    </Suspense>
  );
};
