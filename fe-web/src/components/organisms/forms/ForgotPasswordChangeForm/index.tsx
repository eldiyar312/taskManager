import React from 'react';

import { Input } from 'src/components/atoms/Input';
import { Button } from 'src/components/molecules/Button';
import { useFormik } from 'src/hooks/useFormik';
import { Msg } from 'src/i18n/Msg';
import { validators } from 'src/utils/validation';

export const ForgotPasswordChangeForm: React.FC = () => {
  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: {
      password: '',
    },

    validationSchema: validators.forgotPasswordChange,

    onSubmit: () => {
      console.log('forgot pass change');
    },
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        placeholder={{
          id: 'components.organisms.forms.ForgotPasswordChangeForm.placeholderPassword',
        }}
        name="password"
        value={values.password}
        status={errors.password ? 'error' : undefined}
        onChange={handleChange}
        error={errors.password}
        isPassword
      />

      <Button shape="round" htmlType="submit">
        <Msg id="components.organisms.forms.ForgotPasswordChangeForm.continue" />
      </Button>
    </form>
  );
};
