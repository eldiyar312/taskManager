import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { MODALS, PAGES, Scheme, makeHierarchicalPath } from 'shared';

import { history } from 'src/navigation/store';

export interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  url: Scheme<PAGES | MODALS>;
  disabled?: boolean;
}

export const Link: React.FC<Props> = ({
  url,
  disabled,
  children,
  ...props
}) => {
  const to = makeHierarchicalPath(history.location, [url], 'detect');

  if (!to) {
    return null;
  }

  const onClickHandler = (e: React.SyntheticEvent) => {
    if (disabled) {
      e.preventDefault();
    }
  };

  return (
    <RouterLink onClick={onClickHandler} to={to} {...props}>
      {children}
    </RouterLink>
  );
};
