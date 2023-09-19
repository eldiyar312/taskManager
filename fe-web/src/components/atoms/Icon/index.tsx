import React from 'react';

import { iconsAnt } from 'src/components/atoms/Icon/icons';

type IconType = keyof typeof iconsAnt;
type IconSizeType = 16 | 24 | 32 | 48;

export type Props = {
  icon?: IconType;
  size?: IconSizeType;
  color?: string;
};

export const Icon: React.FC<Props> = ({
  icon = 'starOutline',
  color = 'var(--darkRed-1)',
}) => {
  const Component = iconsAnt[icon as IconType];

  return <Component style={{ color }} />;
};
