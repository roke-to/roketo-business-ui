import clsx from 'clsx';
import {useStore} from 'effector-react';
import React, {useState} from 'react';

import {changePolicyProposalForm} from '~/entities/governance/model';
import {$accountId} from '~/entities/wallet';
import {Col} from '~/shared/ui/components/col';
import {IconButton} from '~/shared/ui/components/icon-button';
import {Input} from '~/shared/ui/components/input';
import {Label} from '~/shared/ui/components/label';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';
import {ReactComponent as Plus} from '~/shared/ui/icons/plus.svg';

import {IFormPartProps} from './base';
import styles from './change-policy.module.css';

export const AddCouncil = ({
  fields,
  t,
  pending,
}: IFormPartProps<typeof changePolicyProposalForm>) => {
  const [wasAdded, setWasAdded] = useState(false);
  const accountId = useStore($accountId);

  const handleAddTypedCouncil = () => {
    const updatedCouncilList = [...fields.councilList.value, fields.councilAddress.value];

    fields.councilList.onChange(updatedCouncilList);
    setWasAdded(true);
  };

  const councilAddressError = fields.councilAddress.errorText();

  return (
    <>
      <Row gap='xl' className={styles.councilSection}>
        <Row gap='md' className='items-end'>
          <Label
            required
            content={t('createForm.councilAddressLabel')}
            error={fields.councilAddress.errorText()}
            className={styles.councilAddressLabel}
          >
            <Input
              name='councilAddress'
              value={fields.councilAddress.value}
              disabled={pending}
              placeholder={t('createForm.councilAddressPlaceholder')}
              onChange={fields.councilAddress.onChange}
            />
          </Label>
          <IconButton
            onClick={handleAddTypedCouncil}
            disabled={Boolean(councilAddressError) || wasAdded}
          >
            <Plus />
          </IconButton>
        </Row>
        <Label
          content={t('createForm.councilListLabel')}
          error={fields.councilList.errorText()}
          className={styles.councilListLabel}
        >
          <Col gap='sm' className='w-full'>
            <Typography as='span' weight='bold' className='truncate'>
              {accountId}
            </Typography>
            {fields.councilList.value.map((council: string) => (
              <Typography
                as='span'
                weight='bold'
                className={clsx(
                  {[styles.addedCouncil]: fields.councilAddress.value === council},
                  'truncate',
                )}
              >
                {council}
              </Typography>
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
