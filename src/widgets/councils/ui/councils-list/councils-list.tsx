// import {useStore} from 'effector-react';
import React from 'react';

// import {$currentDao} from '~/entities/dao';
import {Col} from '~/shared/ui/components/col';
import {Typography} from '~/shared/ui/components/typography';

export const CouncilsList = () => {
  // const selectedDao = useStore($currentDao);
  const selectedDao = {
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

  return (
    <Col gap={1}>
      <Typography as='span' weight='bold'>
        Councils
      </Typography>
      <Col gap={2}>
        {selectedDao?.council.map((councilAccountId) => (
          <Typography as='span' font='sm' key={councilAccountId}>
            {councilAccountId}
          </Typography>
        ))}
      </Col>
    </Col>
  );
};
