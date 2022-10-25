import {LoginPortlet} from '~/features/auth';

import {Layout} from '@roketo/core/ui/components/layout';

export const LoginPage = () => (
  <Layout type='intro'>
    <LoginPortlet />
  </Layout>
);
