import {LoginPortlet} from '~/features/auth';

import {Layout} from '@roketo/core/ui/components/layout';

// import {WalletContextProvider} from '~/features/auth/ui/wallet-context-provider'

export const LoginPage = () => (
  <Layout type='intro'>
    {/* <WalletContextProvider> */}
    <LoginPortlet />
    {/* </WalletContextProvider> */}
  </Layout>
);
