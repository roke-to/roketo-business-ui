import {LoginPortlet} from '~/features/auth';
import {PageLayout} from '~/widgets/layout';

export const LoginPage = () => (
  <PageLayout type='intro'>
    <LoginPortlet />
  </PageLayout>
);
