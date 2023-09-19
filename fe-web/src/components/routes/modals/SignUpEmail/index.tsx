import React from 'react';

import { MODALS } from 'shared';

import { SocialButtons } from 'src/components/organisms/SocialButtons';
import { SignUpEmailForm } from 'src/components/organisms/forms/SignUpEmailForm';
import { Msg } from 'src/i18n/Msg';
import { Link } from 'src/navigation/Link';

const SignUpEmail: React.FC = () => (
  <>
    <Msg id="components.routes.modals.SignUpEmail.register" />

    <SocialButtons />

    <SignUpEmailForm />

    <Link url={{ scheme: MODALS.SIGN_IN_EMAIL }}>
      <Msg id="components.routes.modals.SignUpEmail.isExist" />
    </Link>
  </>
);

export default SignUpEmail;
