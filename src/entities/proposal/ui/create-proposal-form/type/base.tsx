import {Form, Result} from 'effector-forms';
import {TFunction} from 'react-i18next';
import {Get} from 'type-fest';

import {ValuesOfForm} from '~/shared/lib/form';

export interface IFormPartProps<F extends Form<any>> {
  fields: Get<Result<ValuesOfForm<F>>, 'fields'>;
  pending: boolean;
  t: TFunction<'proposal'>;
}
