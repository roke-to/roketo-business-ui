import React from 'react';

import {Input} from '~/shared/ui/components/input';
import {InputDropdown} from '~/shared/ui/components/input-dropdown';
import {Label} from '~/shared/ui/components/label';
import {Row} from '~/shared/ui/components/row';

export const Transfer = ({fields, t, pending}: any) => (
  <>
    <Row gap='md' className='justify-between'>
      <Label
        required
        content={t('createForm.targetLabel')}
        error={fields.target.errorText()}
        className='basis-1/3'
      >
        <Input
          name='target'
          value={fields.target.value}
          disabled={pending}
          placeholder={t('createForm.targetPlaceholder')}
          onChange={fields.target.onChange}
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
          options={[{label: 'NEAR', value: 'near'}]}
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
    <Row>
      <Label
        content={t('createForm.linkLabel')}
        error={fields.link.errorText()}
        className='basis-1/3'
      >
        <Input
          name='link'
          value={fields.link.value}
          disabled={pending}
          placeholder={t('createForm.linkPlaceholder')}
          onChange={fields.link.onChange}
        />
      </Label>
      <Label
        required
        content={t('createForm.tgasLabel')}
        error={fields.tgas.errorText()}
        className='basis-1/3'
      >
        <Input
          name='tgas'
          value={fields.tgas.value}
          disabled={pending}
          placeholder={t('createForm.tgasPlaceholder')}
          onChange={fields.tgas.onChange}
        />
      </Label>
    </Row>
  </>
);
