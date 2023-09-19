import AntButton, { ButtonProps } from 'antd/lib/button';
import React, { ReactNode } from 'react';

type Props = {
  shape?: ButtonProps['shape'];
  size?: ButtonProps['size'];
  children: ReactNode;

  htmlType?: ButtonProps['htmlType'];
  onClick?: () => void;
};

export const Button: React.FC<Props> = ({
  shape = 'round',
  size = 'large',
  children,

  htmlType = 'button',
  onClick,
}) => (
  <AntButton shape={shape} size={size} htmlType={htmlType} onClick={onClick}>
    {children}
  </AntButton>
);
