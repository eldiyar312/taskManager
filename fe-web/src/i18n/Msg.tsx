import React from 'react';
import {
  FormattedMessage,
  FormattedNumber,
  IntlShape as IIntlShape,
} from 'react-intl';

import { DictionaryKey } from 'src/i18n';

export type Currency = 'USD' | 'RUB';

export type IntlShape = IIntlShape;

export interface MsgProps {
  id: DictionaryKey;
  values?: Record<string, React.ReactNode>;
}

export interface CurrencyProps {
  currency: Currency;
  value: number;
}

export const msg = (intl: IntlShape, { id, values }: MsgProps): string =>
  intl.formatMessage({ id }, values as never);

export const Msg: React.FC<MsgProps> = ({ id, values }) => (
  <FormattedMessage id={id} values={values} />
);

export const MsgCurrency: React.FC<CurrencyProps> = ({ currency, value }) => (
  <FormattedNumber
    currency={currency}
    value={value}
    // eslint-disable-next-line react/style-prop-object
    style="currency"
    minimumFractionDigits={0}
    maximumFractionDigits={2}
  />
);
