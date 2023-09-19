import React from 'react';

import { MODALS } from 'shared';

import { ForgotPasswordForm } from 'src/components/organisms/forms/ForgotPasswordForm';
import { Msg } from 'src/i18n/Msg';
import { Link } from 'src/navigation/Link';

const ForgotPassword: React.FC = () => (
  <>
    <Msg id="components.routes.modals.ForgotPassword.text" />

    <ForgotPasswordForm />

    <Link url={{ scheme: MODALS.SIGN_IN_EMAIL }}>
      <Msg id="components.routes.modals.ForgotPassword.remember" />
    </Link>
  </>
);

export default ForgotPassword;
