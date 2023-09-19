import React from 'react';

import { EntryTemplate } from 'src/components/templates/EntryTemplate';
import { Template, TemplateProps } from 'src/components/templates/types';

export const templateToComponent: Record<Template, React.FC<TemplateProps>> = {
  entry: EntryTemplate,
};
