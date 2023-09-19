import { ERROR_CODE } from 'shared';

import { SimpleError } from 'src/_generated';

// Errors

export type BaseError = SimpleError & {
  code: ERROR_CODE;
};

export const baseError = ({
  error,
  code = ERROR_CODE.INTERNAL_SERVER,
  message,
}: BaseError): BaseError => ({
  error,
  code,
  message,
});

export const badRequestError = (
  error: BaseError['error'],
  message: BaseError['message'] = undefined
) => baseError({ error, code: ERROR_CODE.BAD_REQUEST, message });

export const forbiddenError = (
  error: BaseError['error'],
  message: BaseError['message'] = undefined
) => baseError({ error, code: ERROR_CODE.FORBIDDEN, message });

// Result format

export type Result<SuccessValue, FailValue> =
  | {
      value: SuccessValue;
      isFail: false;
    }
  | {
      value: FailValue;
      isFail: true;
    };

export const failWrapper = <FailValue extends BaseError>(
  value: FailValue
): Result<never, FailValue> => ({
  value,
  isFail: true,
});

export const successWrapper = <SuccessValue>(
  value: SuccessValue
): Result<SuccessValue, never> => ({
  value,
  isFail: false,
});
