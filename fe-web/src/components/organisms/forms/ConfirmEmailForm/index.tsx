import React from 'react';

import { Input } from 'src/components/atoms/Input';
import { Button } from 'src/components/molecules/Button';
import { useFormik } from 'src/hooks/useFormik';
import { Msg } from 'src/i18n/Msg';
import { validators } from 'src/utils/validation';

export const ConfirmEmailForm: React.FC = () => {
  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: {
      code: '',
    },

    validationSchema: validators.confirmEmail,

    onSubmit: () => {
      console.log('confirm email');
    },
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        placeholder={{
          id: 'components.organisms.forms.ConfirmEmailForm.placeholderCode',
        }}
        name="code"
        value={values.code}
        status={errors.code ? 'error' : undefined}
        onChange={handleChange}
        error={errors.code}
      />

      <Button shape="round" htmlType="submit">
        <Msg id="components.organisms.forms.ConfirmEmailForm.continue" />
      </Button>
    </form>
  );
};
