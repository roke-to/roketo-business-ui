import React from 'react';

import {changePolicyProposalForm} from '~/entities/governance/model';
import {Input} from '~/shared/ui/components/input';
import {Label} from '~/shared/ui/components/label';
import {Range} from '~/shared/ui/components/range';
import {Row} from '~/shared/ui/components/row';

import {IFormPartProps} from './base';
import styles from './change-policy.module.css';

export const ChangeQuorum = ({
  fields,
  t,
  pending,
}: IFormPartProps<typeof changePolicyProposalForm>) => (
  <>
    <Row gap='xl' className='items-end'>
      <Label
        content={t('createForm.quorum')}
        error={fields.quorum.errorText()}
        className={styles.quorum}
      >
        <Range
          value={Number(fields.quorum.value)}
          onChange={(quorumValue) => fields.quorum.onChange(`${quorumValue}`)}
        />
      </Label>
      <Input
        name='quorum'
        mask='percent'
        value={fields.quorum.value}
        disabled={pending}
        onChange={fields.quorum.onChange}
        className='basis-1/6'
      />
    </Row>
    <Row>
      <Label
        required
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
