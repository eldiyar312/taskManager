import AntCard from 'antd/lib/card';
import React, { ReactNode } from 'react';

type Props = {
  cardTitle: string;
  bordered?: boolean;
  children: ReactNode;
};

export const Card: React.FC<Props> = ({
  cardTitle,
  bordered = false,
  children,
}) => (
  <AntCard title={cardTitle} bordered={bordered}>
    {children}
  </AntCard>
);
