import InputAnt, { InputProps } from 'antd/lib/input';
import React from 'react';
import { useIntl } from 'react-intl';

import { defaultDictionary } from 'src/i18n';
import { Msg, MsgProps, msg } from 'src/i18n/Msg';

type Props = Omit<InputProps, 'placeholder'> & {
  placeholder: MsgProps;
  error?: string;
  isPassword?: boolean;
};

export const Input: React.FC<Props> = ({
  placeholder,
  error,
  isPassword = false,
  ...props
}) => {
  const intl = useIntl();

  const Component = isPassword ? InputAnt.Password : InputAnt;

  return (
    <div>
      <Component placeholder={msg(intl, placeholder)} {...props} />

      <label>
        {error && defaultDictionary[error as never] ? (
          <Msg id={error as never} />
        ) : (
          error
        )}
      </label>
    </div>
  );
};
