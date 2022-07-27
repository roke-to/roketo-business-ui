import React, {useCallback, useState} from 'react';

// import {$accountId} from '~/entities/wallet';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Input} from '~/shared/ui/components/input';
import {Label} from '~/shared/ui/components/label';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';
import {ReactComponent as Plus} from '~/shared/ui/icons/plus.svg';
import {CouncilControl} from '~/widgets/proposal/ui/council-control';

// import {useStore} from 'effector-react';
// import {$currentDao} from '~/entities/dao';

type CouncilListItem = {council: string; action: 'delete' | 'add'};

const getInitialState = (councils: string[]): CouncilListItem[] =>
  councils.map((council) => ({council, action: 'delete'}));

export const ChangePolicy = ({fields, t, pending}: any) => {
  // const currentDao = useStore($currentDao);

  // const accountId = useStore($accountId);

  const accountId = 'rkatarine.testnet';

  const currentDao = {
    createdAt: '2022-07-27T13:18:34.622Z',
    transactionHash: '7cjaSMhU3hcCb6RBUG8xb7SHff8MzurVpu5kDxpJrWfZ',
    id: 'testdaoastro.sputnikv2.testnet',
    config: {
      name: 'testdaoastro',
      purpose: '',
      metadata:
        'eyJsaW5rcyI6W10sImZsYWdDb3ZlciI6IiIsImZsYWdMb2dvIjoiIiwiZGlzcGxheU5hbWUiOiJ0ZXN0ZGFvYXN0cm8iLCJsZWdhbCI6eyJsZWdhbFN0YXR1cyI6IiIsImxlZ2FsTGluayI6IiJ9fQ==',
    },
    numberOfMembers: 3,
    numberOfGroups: 1,
    council: ['extg.testnet', 'rkatarine.testnet', 'extg2.testnet'],
    accountIds: ['extg.testnet', 'rkatarine.testnet', 'extg2.testnet'],
    status: 'Active',
    activeProposalCount: 1,
    totalProposalCount: 1,
    totalDaoFunds: 23.94,
    isCouncil: true,
  };

  const [councilsList, setCouncil] = useState<CouncilListItem[]>(
    getInitialState(currentDao.council),
  );

  const handleAddTypedCouncil = () => {
    setCouncil((prevState: CouncilListItem[]) => [
      ...prevState,
      {council: fields.councilAddress.value, action: 'delete'},
    ]);
  };

  const handleAddCouncil = useCallback((currentCouncil: string) => {
    setCouncil((prevState: CouncilListItem[]) =>
      prevState.map(({council, action}) =>
        council === currentCouncil ? {council, action: 'add'} : {council, action},
      ),
    );
  }, []);

  const handleDeleteCouncil = useCallback((currentCouncil: string) => {
    setCouncil((prevState: CouncilListItem[]) =>
      prevState.map(({council, action}) =>
        council === currentCouncil ? {council, action: 'delete'} : {council, action},
      ),
    );
  }, []);

  return (
    <>
      <Row gap='xl' className='items-start'>
        <Row gap='md' className='items-end'>
          <Label
            content={t('createForm.councilAddressLabel')}
            error={fields.councilAddress.errorText()}
            className='basis-1/2'
          >
            <Input
              name='councilAddress'
              value={fields.councilAddress.value}
              disabled={pending}
              placeholder={t('createForm.councilAddressPlaceholder')}
              onChange={fields.councilAddress.onChange}
            />
          </Label>
          <Button
            startIcon={<Plus className='w-6 h-6' />}
            className='w-12 p-3 mb-1'
            onClick={handleAddTypedCouncil}
          />
        </Row>
        <Label
          content={t('createForm.councilListLabel')}
          error={fields.councilList.errorText()}
          className='basis-1/2'
        >
          <Col gap='sm'>
            <Typography as='span' weight='bold'>
              {accountId}
            </Typography>
            {councilsList.map(({council, action}) => (
              <CouncilControl
                key={council}
                council={council}
                action={action}
                onClick={action === 'add' ? handleDeleteCouncil : handleAddCouncil}
              />
            ))}
          </Col>
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
};
