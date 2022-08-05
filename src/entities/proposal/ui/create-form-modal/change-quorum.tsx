import React from 'react';

import {Input} from '~/shared/ui/components/input';
import {Label} from '~/shared/ui/components/label';
import {Range} from '~/shared/ui/components/range';
import {Row} from '~/shared/ui/components/row';

import styles from './change-policy.module.css';

export const ChangeQuorum = ({fields, t, pending}: any) => (
  <>
    <Row gap='xl' className='items-start'>
      <Label
        content={`${t('createForm.quorum')} ${fields.quorum.value}%`}
        error={fields.quorum.errorText()}
        className={styles.quorum}
      >
        <Range value={fields.quorum.value} onChange={fields.quorum.onChange} />
      </Label>
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
