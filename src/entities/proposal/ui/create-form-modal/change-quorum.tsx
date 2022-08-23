import React from 'react';

import {Input} from '~/shared/ui/components/input';
import {Label} from '~/shared/ui/components/label';
import {Range} from '~/shared/ui/components/range';
import {Row} from '~/shared/ui/components/row';

import styles from './change-policy.module.css';

const adaptQuorumValue = (value: string) => value.replace('%', '');

export const ChangeQuorum = ({fields, t, pending}: any) => {
  const inputQuorumValue = `${fields.quorum.value}%`;
  const handleQuorumChange = (value: string) => {
    fields.quorum.onChange(adaptQuorumValue(value));
  };

  return (
    <>
      <Row gap='xl' className='items-end'>
        <Label
          content={t('createForm.quorum')}
          error={fields.quorum.errorText()}
          className={styles.quorum}
        >
          <Range value={fields.quorum.value} onChange={fields.quorum.onChange} />
        </Label>
        <Input
          name='quorum'
          value={inputQuorumValue}
          disabled={pending}
          onChange={handleQuorumChange}
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
};
