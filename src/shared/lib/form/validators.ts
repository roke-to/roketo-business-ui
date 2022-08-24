import {Rule} from 'effector-forms';
import {t} from 'i18next';

const required: Rule<string> = {
  name: 'required',
  validator: (value: string) => ({
    isValid: Boolean(value),
    errorText: t('validators:required'),
  }),
};

export const validators = {
  required,
};
