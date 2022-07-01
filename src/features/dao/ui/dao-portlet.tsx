import {useStore} from 'effector-react';
import React from 'react';

import {$accountId, logoutClicked} from '~/entities/wallet';
import {Button, Col, Heading, Portlet, Text} from '~/shared/ui/components';

export const DaoPortlet = () => {
  const accountId = useStore($accountId);

  return (
    <Portlet gap='xl'>
      <Col>
        <Heading>You don’t have any DAO</Heading>
        <Text>Check if the wallet address is correct or create a new DAO:</Text>
        <Text>{accountId}</Text>
      </Col>
      <Col>
        <Button variant='soft' onClick={() => logoutClicked()}>
          Logout
        </Button>
        <Button variant='outlined'>Create DAO</Button>
      </Col>
    </Portlet>
  );
};
