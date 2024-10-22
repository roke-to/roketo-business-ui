import {useStore} from 'effector-react';
import React from 'react';

import {changePolicyProposalForm} from '~/entities/governance/model';
import {CouncilControl} from '~/entities/proposal/ui/council-control';
import {$accountId} from '~/entities/wallet';

import {Col} from '@roketo/core/ui/components/col';
import {Input} from '@roketo/core/ui/components/input';
import {Label} from '@roketo/core/ui/components/label';
import {Row} from '@roketo/core/ui/components/row';
import {Typography} from '@roketo/core/ui/components/typography';

import {IFormPartProps} from './base';
import styles from './change-policy.module.css';

export const RemoveCouncil = ({
  fields,
  t,
  pending,
}: IFormPartProps<typeof changePolicyProposalForm>) => {
  const accountId = useStore($accountId);

  const handleClick = (council: string) => {
    const updatedValue = fields.councilAddress.value === council ? '' : council;
    fields.councilAddress.onChange(updatedValue);
  };

  return (
    <>
      <Row gap='xl' className={styles.councilSection}>
        <Label
          required
          content={t('createForm.councilListLabel')}
          error={fields.councilAddress.errorText({
            required: t('createForm.requiredRemoveCouncilAddress'),
          })}
          className={styles.councilListLabel}
        >
          <Col gap='sm'>
            <Typography as='span' weight='bold' className='truncate'>
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
    </>
  );
};
