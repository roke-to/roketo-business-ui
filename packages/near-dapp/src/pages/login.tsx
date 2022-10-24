import {LoginPortlet} from '~/features/auth';
import {Layout} from 'ui/components/layout';

export const LoginPage = () => (
  <Layout type='intro'>
    <LoginPortlet />
  </Layout>
);
