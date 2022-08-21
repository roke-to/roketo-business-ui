import {LoginPortlet} from '~/features/auth';
import {PageLayout} from '~/shared/ui/components/layout';

export const LoginPage = () => (
  <PageLayout type='intro'>
    <LoginPortlet />
  </PageLayout>
);
