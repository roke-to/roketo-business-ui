import React from 'react';
import {useTranslation} from 'react-i18next';

import {Layout} from '@roketo/core/ui/components/layout';
import {PageStub} from '@roketo/core/ui/components/page-stub';

export const NftPage = () => {
  const {t} = useTranslation('stub');
  return (
    <Layout>
      <PageStub
        primaryText={t('earlyAccess.primaryText')}
        secondaryText={t('earlyAccess.nftSecondaryText')}
      />
    </Layout>
  );
};
