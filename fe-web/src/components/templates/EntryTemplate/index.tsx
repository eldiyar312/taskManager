import React from 'react';

import { Header } from 'src/components/organisms/Header';
import { TemplateProps } from 'src/components/templates/types';

export const EntryTemplate: React.FC<TemplateProps> = ({ title, children }) => (
  <>
    <Header />

    {title && <h1>{title}</h1>}

    {children}
  </>
);
