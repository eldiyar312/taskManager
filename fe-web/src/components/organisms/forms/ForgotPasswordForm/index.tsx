import React from 'react';

import { actions } from 'src/actions';
import { Input } from 'src/components/atoms/Input';
import { Button } from 'src/components/molecules/Button';
import { useFormik } from 'src/hooks/useFormik';
import { Msg } from 'src/i18n/Msg';
import { validators } from 'src/utils/validation';

export const ForgotPasswordForm: React.FC = () => {
  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: {
      email: '',
    },

    validationSchema: validators.forgotPassword,

    onSubmit: async (body, _, Axios) => {
      await actions.api['/password/forgot'].POST({ Axios, Body: body });
    },
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        placeholder={{
          id: 'components.organisms.forms.ForgotPasswordForm.placeholderEmail',
        }}
        name="email"
        value={values.email}
        status={errors.email ? 'error' : undefined}
        onChange={handleChange}
        error={errors.email}
      />

      <Button shape="round" htmlType="submit">
        <Msg id="components.organisms.forms.ForgotPasswordForm.send" />
      </Button>
    </form>
  );
};
