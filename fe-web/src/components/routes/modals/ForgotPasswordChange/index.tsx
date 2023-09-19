import React from 'react';

import { ForgotPasswordChangeForm } from 'src/components/organisms/forms/ForgotPasswordChangeForm';
import { Msg } from 'src/i18n/Msg';

const ForgotPasswordChange: React.FC = () => (
  <>
    <Msg id="components.routes.modals.ForgotPasswordChange.text" />

    <ForgotPasswordChangeForm />

    <Msg id="components.routes.modals.ForgotPasswordChange.continue" />
  </>
);

export default ForgotPasswordChange;
