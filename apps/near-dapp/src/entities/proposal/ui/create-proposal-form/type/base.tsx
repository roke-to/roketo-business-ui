import {Form, Result} from 'effector-forms';
import {TFunction} from 'react-i18next';
import {Get} from 'type-fest';

import {ValuesOfForm} from '@roketo/core/lib/form';

export interface IFormBaseProps<F extends Form<any> = Form<any>> {
  fields: Get<Result<ValuesOfForm<F>>, 'fields'>;
  pending: boolean;
  t: TFunction<'proposal'>;
}

export interface IFormPartProps<F extends Form<any> = Form<any>> extends IFormBaseProps<F> {
  tokenOptions: Array<{value: string; label: string}>;
}
