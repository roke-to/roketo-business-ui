import {LoginPortlet} from '~/features/auth';
import {Layout} from '~/shared/ui/components/layout';

export const LoginPage = () => (
  <Layout type='intro'>
    <LoginPortlet />
  </Layout>
);