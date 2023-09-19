import * as yup from 'yup';

import { Events } from 'src/i18n';

const MIN_PASS_LENGTH = 8;
const MIN_EMAIL_LENGTH = 4;

const _msg = (message: Events): Events => message;

const rules = {
  code: yup.string().required(_msg('error.field.required')),

  password: yup
    .string()
    .required(_msg('error.field.required'))
    .min(MIN_PASS_LENGTH, _msg('error.password.minLength')),

  email: yup
    .string()
    .required(_msg('error.field.required'))
    .email(_msg('error.email.wrongFormat'))
    .min(MIN_EMAIL_LENGTH, _msg('error.email.minLength')),

  role: yup.string().required(_msg('error.field.required')),
};

export const validators = {
  confirmEmail: yup.object().shape({ code: rules.code }),
  forgotPasswordChange: yup.object().shape({ password: rules.password }),
  forgotPassword: yup.object().shape({ email: rules.email }),
  signInEmail: yup
    .object()
    .shape({ email: rules.email, password: rules.password }),
  signUpEmail: yup.object().shape({
    email: rules.email,
    password: rules.password,
    role: rules.role,
  }),
};
