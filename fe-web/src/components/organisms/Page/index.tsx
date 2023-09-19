import React, { ReactNode, useLayoutEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { templateToComponent } from 'src/components/templates';
import { Template } from 'src/components/templates/types';
import { Msg, msg } from 'src/i18n/Msg';
import { getRouteConfigByPath } from 'src/navigation';
import { useRouteMatch } from 'src/navigation/useRouteMatch';

type Props = {
  title?: string | true;
  template: Template;
  children: ReactNode;
};

export const Page: React.FC<Props> = ({ children, title, template }) => {
  const intl = useIntl();
  const path = useRouteMatch();
  const { title: id } = getRouteConfigByPath(path);

  const msgProps = useMemo(() => (id ? { id } : undefined), [id]);

  useLayoutEffect(() => {
    document.title =
      title && typeof title !== 'boolean'
        ? title
        : msg(
            intl,
            msgProps || { id: 'components.routes.pages.Error404.title' }
          );
  }, [title, msgProps, intl]);

  let renderedTitle = null;

  if (title) {
    if (typeof title !== 'boolean') {
      renderedTitle = <>{title}</>;
    } else if (msgProps) {
      renderedTitle = <Msg {...msgProps} />;
    }
  }

  const TemplateComponent = templateToComponent[template];

  return (
    <TemplateComponent title={renderedTitle}>{children}</TemplateComponent>
  );
};
