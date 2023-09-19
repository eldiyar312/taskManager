import React from 'react';

import { ConfirmEmailForm } from 'src/components/organisms/forms/ConfirmEmailForm';
import { Msg } from 'src/i18n/Msg';

const ConfirmEmail: React.FC = () => (
  <>
    <Msg id="components.routes.modals.ConfirmEmail.text" />

    <ConfirmEmailForm />

    <Msg id="components.routes.modals.ConfirmEmail.sendAgain" />
  </>
);

export default ConfirmEmail;
