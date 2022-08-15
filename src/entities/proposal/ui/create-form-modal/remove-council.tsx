import {useStore} from 'effector-react';
import React from 'react';

import {CouncilControl} from '~/entities/proposal/ui/council-control';
import {$accountId} from '~/entities/wallet';
import {Col} from '~/shared/ui/components/col';
import {Input} from '~/shared/ui/components/input';
import {Label} from '~/shared/ui/components/label';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import styles from './change-policy.module.css';

export const RemoveCouncil = ({fields, t, pending}: any) => {
  const accountId = useStore($accountId);

  const handleClick = (council: string) => {
    const updatedValue = fields.councilAddress.value === council ? '' : council;
    fields.councilAddress.onChange(updatedValue);
  };

  return (
    <>
      <Row gap='xl' className={styles.councilSection}>
        <Label
          content={t('createForm.councilListLabel')}
          error={fields.councilList.errorText()}
          className={styles.councilListLabel}
        >
          <Col gap='sm'>
            <Typography as='span' weight='bold'>
              {accountId}
            </Typography>
            {fields.councilList.value.map((council: string) => (
              <CouncilControl
                key={council}
                council={council}
                willDelete={fields.councilAddress.value === council}
                onClick={handleClick}
              />
            ))}
          </Col>
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
      <Row className='mobile:flex-col'>
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
};
