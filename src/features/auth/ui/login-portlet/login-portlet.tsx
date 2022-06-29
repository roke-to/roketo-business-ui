import {Col, Heading, Portlet, Text} from '~/shared/ui/components';

import {AuthButton} from './auth-button';

export const LoginPortlet = () => (
  <Portlet gap='xl'>
    <Col gap='sm'>
      <Heading>Join Roketo Business today</Heading>
      <Text>Sign in via NEAR Network to login or create account</Text>
    </Col>
    <Col>
      <AuthButton variant='soft' />
      <Text color='muted'>After signing up, you'll get access to all features</Text>
    </Col>
  </Portlet>
);
