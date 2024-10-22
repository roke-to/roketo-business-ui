import React from 'react';

import {createTreasuryProposalForm} from '~/entities/treasury/model/treasury';

import {Input} from '@roketo/core/ui/components/input';
import {InputDropdown} from '@roketo/core/ui/components/input-dropdown';
import {Label} from '@roketo/core/ui/components/label';
import {Row} from '@roketo/core/ui/components/row';

import {IFormPartProps} from './base';

export const Transfer = ({
  fields,
  t,
  pending,
  tokenOptions,
}: IFormPartProps<typeof createTreasuryProposalForm>) => (
  <>
    <Row gap='md' className='justify-between mobile:flex-col'>
      <Label
        required
        content={t('createForm.targetLabel')}
        error={fields.targetAccountId.errorText()}
        className='basis-1/3'
      >
        <Input
          name='target'
          value={fields.targetAccountId.value}
          disabled={pending}
          placeholder={t('createForm.targetPlaceholder')}
          onChange={fields.targetAccountId.onChange}
        />
      </Label>
      <Label
        required
        content={t('createForm.amountLabel')}
        error={fields.amount.errorText()}
        className='basis-1/3'
      >
        <Input
          name='amount'
          mask='number'
          value={fields.amount.value}
          disabled={pending}
          placeholder={t('createForm.amountPlaceholder')}
          onChange={fields.amount.onChange}
        />
      </Label>
      <Label
        required
        content={t('createForm.tokenLabel')}
        error={fields.token.errorText()}
        className='basis-1/3'
      >
        <InputDropdown
          name='token'
          value={fields.token.value}
          disabled={pending}
          placeholder={t('createForm.tokenPlaceholder')}
          onChange={fields.token.onChange}
          options={tokenOptions}
        />
      </Label>
    </Row>
    <Row>
      <Label
        content={t('createForm.descriptionLabel')}
        error={fields.description.errorText()}
        className='w-full'
      >
        <Input
          name='description'
          value={fields.description.value}
          disabled={pending}
          placeholder={t('createForm.descriptionPlaceholder')}
          onChange={fields.description.onChange}
        />
      </Label>
    </Row>
  </>
);
