import {Rule} from 'effector-forms';
import {t} from 'i18next';

const required: Rule<string> = {
  name: 'required',
  validator: (value: string) => ({
    isValid: Boolean(value),
    errorText: t('validators:required'),
  }),
};

const requiredCouncilAddress: Rule<string> = {
  name: 'requiredCouncilAddress',
  validator: (value: string) => ({
    isValid: Boolean(value),
    errorText: t('validators:requiredCouncilAddress'),
  }),
};

export const validators = {
  required,
  requiredCouncilAddress,
};
