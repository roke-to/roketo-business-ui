import {Rule, Validator as RuleValidator} from 'effector-forms';
import {t} from 'i18next';

interface ValidatorOptions<Value, Form = any, Source = any> {
  if?: (form: Form, value: Value, source?: Source) => boolean;
}

const validateWithOptions =
  <V>(options: ValidatorOptions<V>, validate: RuleValidator<V>): RuleValidator<V> =>
  (value: V, form, source) => {
    if (typeof options.if === 'function') {
      if (!options.if(form, value, source)) {
        return {isValid: true};
      }
    }

    return validate(value, form, source);
  };

const required = <T>(options: ValidatorOptions<T> = {}): Rule<T> => ({
  name: 'required',
  validator: validateWithOptions(options, (value: T) => ({
    isValid: Boolean(value),
    errorText: t('validators:required'),
  })),
});

export const validators = {
  required,
};
