import React from 'react';

import {createTreasuryProposalForm} from '~/entities/treasury/model/treasury';
import {Input, Textarea} from 'ui/components/input';
import {InputDropdown} from 'ui/components/input-dropdown';
import {Label} from 'ui/components/label';
import {Row} from 'ui/components/row';

import {IFormPartProps} from './base';

export const FunctionCall = ({
  fields,
  t,
  pending,
  tokenOptions,
}: IFormPartProps<typeof createTreasuryProposalForm>) => (
  <>
    <Row gap='md' className='justify-between mobile:flex-col'>
      <Label
        required
        content={t('createForm.contractAddressLabel')}
        error={fields.contractAddress.errorText()}
        className='basis-1/3'
      >
        <Input
          name='contractAddress'
          value={fields.contractAddress.value}
          disabled={pending}
          placeholder={t('createForm.contractAddressPlaceholder')}
          onChange={fields.contractAddress.onChange}
        />
      </Label>
      <Label
        required
        content={t('createForm.contractMethodLabel')}
        error={fields.contractMethod.errorText()}
        className='basis-1/3'
      >
        <Input
          name='contractMethod'
          value={fields.contractMethod.value}
          disabled={pending}
          placeholder={t('createForm.contractMethodPlaceholder')}
          onChange={fields.contractMethod.onChange}
        />
      </Label>
      <Label
        required
        content={t('createForm.depositLabel')}
        error={fields.deposit.errorText()}
        className='basis-1/3'
      >
        <Input
          name='deposit'
          value={fields.deposit.value}
          disabled={pending}
          placeholder={t('createForm.depositPlaceholder')}
          onChange={fields.deposit.onChange}
        />
      </Label>
    </Row>
    <Row gap='md' className='justify-between mobile:flex-col'>
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
          options={tokenOptions.filter((token) => token.value === 'NEAR')}
        />
      </Label>
    </Row>
    <Row>
      <Label
        content={t('createForm.jsonLabel')}
        error={fields.json.errorText()}
        className='w-full font-mono'
      >
        <Textarea
          name='json'
          value={fields.json.value}
          disabled={pending}
          placeholder={t('createForm.jsonPlaceholder')}
          onChange={fields.json.onChange}
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
