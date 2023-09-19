import React from 'react';

import { MODALS } from 'shared';

import { SocialButtons } from 'src/components/organisms/SocialButtons';
import { SignInEmailForm } from 'src/components/organisms/forms/SignInEmailForm';
import { Msg } from 'src/i18n/Msg';
import { Link } from 'src/navigation/Link';

const SignInEmail: React.FC = () => (
  <>
    <Msg id="components.routes.modals.SignInEmail.signIn" />

    <SocialButtons />

    <SignInEmailForm />

    <Link url={{ scheme: MODALS.SIGN_UP_EMAIL }}>
      <Msg id="components.routes.modals.SignInEmail.register" />
    </Link>
    <Link url={{ scheme: MODALS.FORGOT_PASSWORD }}>
      <Msg id="components.routes.modals.SignInEmail.forgotPassword" />
    </Link>
  </>
);

export default SignInEmail;
