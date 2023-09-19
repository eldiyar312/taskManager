import React from 'react';
import { useIntl } from 'react-intl';

import { Locales, PAGES } from 'shared';

import { EnumsRole } from 'src/_generated';
import { actions } from 'src/actions';
import { Input } from 'src/components/atoms/Input';
import { Button } from 'src/components/molecules/Button';
import { useFormik } from 'src/hooks/useFormik';
import { Msg } from 'src/i18n/Msg';
import { useRedirect } from 'src/navigation/useRedirect';
import { validators } from 'src/utils/validation';

export const SignUpEmailForm: React.FC = () => {
  const intl = useIntl();
  const { redirect } = useRedirect();

  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: {
      email: '',
      password: '',
      role: 'contractor' as EnumsRole,
    },

    validationSchema: validators.signUpEmail,

    onSubmit: async (body, _, Axios) => {
      await actions.api['/sign-up/email'].POST({
        Axios,
        Body: {
          ...body,
          locale: intl.locale as Locales,
          isAgreeTerms: true,
        },
      });

      redirect({ scheme: PAGES.APP });
    },
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        placeholder={{
          id: 'components.organisms.forms.SignUpEmailForm.placeholderEmail',
        }}
        name="email"
        value={values.email}
        status={errors.email ? 'error' : undefined}
        onChange={handleChange}
        error={errors.email}
      />

      <Input
        placeholder={{
          id: 'components.organisms.forms.SignUpEmailForm.placeholderPassword',
        }}
        name="password"
        value={values.password}
        status={errors.password ? 'error' : undefined}
        onChange={handleChange}
        error={errors.password}
        isPassword
      />

      <Input //TODO: replase by select
        placeholder={{
          id: 'components.organisms.forms.SignUpEmailForm.placeholderRole',
        }}
        name="role"
        value={values.role}
        status={errors.role ? 'error' : undefined}
        onChange={handleChange}
        error={errors.password}
        isPassword
      />

      <Button shape="round" htmlType="submit">
        <Msg id="components.organisms.forms.SignUpEmailForm.signUp" />
      </Button>
    </form>
  );
};
