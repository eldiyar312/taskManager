import sendgrid from '@sendgrid/mail';

import { INTEGRATIONS } from 'src/constants/env';
import { AbstractDataEmail } from 'src/integrations/types';

const mocked = async (params: EmailTemplate) => {
  console.log(params);
  return [{}, {}];
};

if (INTEGRATIONS.SENDGRID.ENABLED) {
  sendgrid.setApiKey(INTEGRATIONS.SENDGRID.TOKEN);
}

export type EmailTemplate = AbstractDataEmail;

export const send = INTEGRATIONS.SENDGRID.ENABLED ? sendgrid.send : mocked;
