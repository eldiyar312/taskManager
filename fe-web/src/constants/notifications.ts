import { ERRORS } from 'shared';

import { DictionaryKey } from 'src/i18n';

export const errorToDictionaryKey: Record<ERRORS, DictionaryKey> = {
  [ERRORS.ALREADY_LOGGED_IN]: 'error.login.alreadyLoggedIn',
  [ERRORS.BAD_ENDPOINT]: 'error.endpoint.notValid',
  [ERRORS.CONFIRMATION_CODE_EXPIRED]: 'error.confirmationCode.expired',
  [ERRORS.CONFIRMATION_CODE_NOT_VALID]: 'error.confirmationCode.notValid',
  [ERRORS.EMAIL_ALREADY_EXISTS]: 'error.email.alreadyExists',
  [ERRORS.INCORRECT_PASSWORD]: 'error.password.notValid',
  [ERRORS.INVALID_EMAIL]: 'error.email.notValid',
  [ERRORS.INVALID_EMAIL_OR_PASSWORD]: 'error.emailOrPassword.notValid',
  [ERRORS.INVALID_ID]: 'error.endpoint.invalidId',
  [ERRORS.NEED_TO_ACCEPT_TERMS]: 'error.terms.needToAccept',
  [ERRORS.NEED_TO_LOGIN]: 'error.login.need',
  [ERRORS.PERMISSION_DENIED]: 'error.permissionDenied',
  [ERRORS.USER_NOT_FOUND]: 'error.user.notFound',
  [ERRORS.LACK_OF_FUNDS]: 'error.user.lackOfFunds',
  [ERRORS.INVALID_DATE]: 'error.user.invalidDate',
  [ERRORS.INVALID_MEDIA_TYPE]: 'error.media.invalidType',
  [ERRORS.INVALID_FORM_DATA]: 'error.media.invalidFormData',
  [ERRORS.MEDIA_SIZE_TOO_LARGE]: 'error.media.sizeTooLarge',
  [ERRORS.INSUFFICIENT_STORAGE]: 'error.media.insufficientStorage',
};
