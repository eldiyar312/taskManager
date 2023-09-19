import { CONTACTS, Locales, MODALS, NOTIFICATIONS, PAGES } from 'shared';

import { MsgProps, msg } from 'src/i18n/msg';
import { EmailTemplate, send } from 'src/integrations/sendgrid';
import { UserConfirmation } from 'src/models/user';
import { Email, Link } from 'src/types';
import { makeWebUrl } from 'src/utils/navigation';

type Tasks = keyof Task;
type TaskToHandler = {
  [K in Tasks]: (params: Task[K]) => EmailTemplate;
};

type CommonParams = {
  locale: Locales;
  email: Email;
  attachment?: Link[];
};

type Task = {
  [NOTIFICATIONS.CHANGING_EMAIL]: CommonParams & {
    code: UserConfirmation['code'];
  };
  [NOTIFICATIONS.FORGOT_PASSWORD]: CommonParams & {
    code: UserConfirmation['code'];
  };
  [NOTIFICATIONS.FORGOT_PASSWORD_CHANGE]: CommonParams;
  [NOTIFICATIONS.SIGN_UP_EMAIL]: CommonParams & {
    code: UserConfirmation['code'];
  };
  [NOTIFICATIONS.CHANGED_PASSWORD]: CommonParams;
};

type EmailProps = CommonParams & {
  subject: MsgProps;
  text: MsgProps[];
  html: MsgProps[];
};

const getFrom = (
  email: (typeof CONTACTS)['EMAILS'][keyof (typeof CONTACTS)['EMAILS']]
) => `Template <${email}>`;

const renderAttachment = (
  attachment: CommonParams['attachment'],
  mode: 'text' | 'html',
  locale: CommonParams['locale']
): string => {
  if (!attachment) {
    return '';
  }

  const text =
    mode === 'text'
      ? '\n' + attachment.join('\n')
      : attachment.map((link) => `<p><img src="${link}" /></p>`);

  const rendered = msg(locale, {
    id: 'services.notifications.email.attachments',
    values: { text },
  });

  return mode === 'text' ? rendered : `<p>${rendered}</p>`;
};

const makeEmail = ({
  locale,
  email,
  subject,
  text,
  html,
  attachment,
}: EmailProps): EmailTemplate => ({
  from: getFrom(CONTACTS.EMAILS.NOREPLY),
  to: email,
  subject: msg(locale, subject),
  text: `${text.map((line) => msg(locale, line)).join('\n')}

    ${msg(locale, {
      id: 'services.notifications.email.regards',
      values: { br: '\n' },
    })}

    ${renderAttachment(attachment, 'text', locale)}
    `.trim(),
  html: `${html.map((line) => `<p>${msg(locale, line)}</p>`).join('')}

    <p>${msg(locale, {
      id: 'services.notifications.email.regards',
      values: { br: '<br />' },
    })}</p>

    ${renderAttachment(attachment, 'html', locale)}
    `.trim(),
  attachment,
});

export const taskToHandler: TaskToHandler = {
  CHANGING_EMAIL: ({ locale, email, code }) => {
    const link = makeWebUrl([
      { scheme: PAGES.ROOT },
      { scheme: MODALS.CONFIRM_EMAIL, params: { code } },
    ]);

    return makeEmail({
      locale,
      email,
      subject: { id: 'services.notifications.email.changeEmail.title' },
      text: [
        { id: 'services.notifications.email.changeEmail.text1' },
        {
          id: 'services.notifications.email.changeEmail.text2.0',
          values: { link },
        },
      ],
      html: [
        { id: 'services.notifications.email.changeEmail.text1' },
        {
          id: 'services.notifications.email.changeEmail.text2.1',
          values: {
            link: `<a href="${link}">${msg(locale, {
              id: 'services.notifications.email.changeEmail.text2.2',
            })}</a>`,
          },
        },
      ],
    });
  },
  CHANGED_PASSWORD: ({ locale, email }) =>
    makeEmail({
      locale,
      email,
      subject: { id: 'services.notifications.email.changePassword.title' },
      text: [
        { id: 'services.notifications.email.changePassword.text1' },
        {
          id: 'services.notifications.email.changePassword.text2',
          values: { email: CONTACTS.EMAILS.SUPPORT },
        },
        { id: 'services.notifications.email.changePassword.text3' },
      ],
      html: [
        { id: 'services.notifications.email.changePassword.text1' },
        {
          id: 'services.notifications.email.changePassword.text2',
          values: { email: CONTACTS.EMAILS.SUPPORT },
        },
        { id: 'services.notifications.email.changePassword.text3' },
      ],
    }),
  FORGOT_PASSWORD: ({ locale, email, code }) => {
    const link = makeWebUrl([
      { scheme: PAGES.ROOT },
      { scheme: MODALS.FORGOT_PASSWORD_CHANGE, params: { code } },
    ]);

    return makeEmail({
      locale,
      email,
      subject: { id: 'services.notifications.email.forgotPassword.title' },
      text: [
        { id: 'services.notifications.email.forgotPassword.text1' },
        {
          id: 'services.notifications.email.forgotPassword.text2.0',
          values: { link },
        },
        { id: 'services.notifications.email.forgotPassword.text3' },
      ],
      html: [
        { id: 'services.notifications.email.forgotPassword.text1' },
        {
          id: 'services.notifications.email.forgotPassword.text2.1',
          values: {
            link: `<a href="${link}">${msg(locale, {
              id: 'services.notifications.email.forgotPassword.text2.2',
            })}</a>`,
          },
        },
        { id: 'services.notifications.email.forgotPassword.text3' },
      ],
    });
  },
  FORGOT_PASSWORD_CHANGE: ({ locale, email }) =>
    makeEmail({
      locale,
      email,
      subject: {
        id: 'services.notifications.email.forgotPasswordChange.title',
      },
      text: [
        { id: 'services.notifications.email.forgotPasswordChange.text1' },
        {
          id: 'services.notifications.email.forgotPasswordChange.text2',
          values: { email: CONTACTS.EMAILS.SUPPORT },
        },
        { id: 'services.notifications.email.forgotPasswordChange.text3' },
      ],
      html: [
        { id: 'services.notifications.email.forgotPasswordChange.text1' },
        {
          id: 'services.notifications.email.forgotPasswordChange.text2',
          values: {
            email: `<a href="mailto:${CONTACTS.EMAILS.SUPPORT}">${CONTACTS.EMAILS.SUPPORT}</a>`,
          },
        },
        { id: 'services.notifications.email.forgotPasswordChange.text3' },
      ],
    }),
  SIGN_UP_EMAIL: ({ locale, email, code }) => {
    const link = makeWebUrl([
      { scheme: PAGES.ROOT },
      { scheme: MODALS.CONFIRM_EMAIL, params: { code } },
    ]);

    return makeEmail({
      locale,
      email,
      subject: { id: 'services.notifications.email.signUpEmail.title' },
      text: [
        { id: 'services.notifications.email.signUpEmail.text1' },
        {
          id: 'services.notifications.email.signUpEmail.text2.0',
          values: { link },
        },
      ],
      html: [
        { id: 'services.notifications.email.signUpEmail.text1' },
        {
          id: 'services.notifications.email.signUpEmail.text2.1',
          values: {
            link: `<a href="${link}">${msg(locale, {
              id: 'services.notifications.email.signUpEmail.text2.2',
            })}</a>`,
          },
        },
      ],
    });
  },
};

export const email = async <T extends Tasks>(
  name: T,
  params: Task[T]
): Promise<{}[]> => send(taskToHandler[name](params));
