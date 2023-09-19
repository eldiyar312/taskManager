import React from 'react';

import { Page } from 'src/components/organisms/Page';
import { Msg } from 'src/i18n/Msg';

const Error404: React.FC = () => (
  <Page template="entry">
    <Msg id="components.routes.pages.Error404.text" />
  </Page>
);

export default Error404;
