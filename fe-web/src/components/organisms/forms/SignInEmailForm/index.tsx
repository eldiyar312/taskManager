import React from 'react';

import { PAGES } from 'shared';

import { actions } from 'src/actions';
import { Input } from 'src/components/atoms/Input';
import { Button } from 'src/components/molecules/Button';
import { useFormik } from 'src/hooks/useFormik';
import { Msg } from 'src/i18n/Msg';
import { useRedirect } from 'src/navigation/useRedirect';
import { validators } from 'src/utils/validation';

export const SignInEmailForm: React.FC = () => {
  const { redirect } = useRedirect();

  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    validationSchema: validators.signInEmail,

    onSubmit: async (body, _, Axios) => {
      await actions.api['/sign-in/email'].POST({ Axios, Body: body });

      redirect({ scheme: PAGES.APP });
    },
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        placeholder={{
          id: 'components.organisms.forms.SignInEmailForm.placeholderEmail',
        }}
        name="email"
        value={values.email}
        status={errors.email ? 'error' : undefined}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        placeholder={{
          id: 'components.organisms.forms.SignInEmailForm.placeholderPassword',
        }}
        isPassword
        name="password"
        value={values.password}
        status={errors.password ? 'error' : undefined}
        onChange={handleChange}
        error={errors.password}
      />
      <Button shape="round" htmlType="submit">
        <Msg id="components.organisms.forms.SignInEmailForm.signIn" />
      </Button>
    </form>
  );
};
