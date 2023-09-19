import { ReactNode } from 'react';

export type Template = 'entry';

export type TemplateProps = {
  title: JSX.Element | null;
  children: ReactNode;
};
