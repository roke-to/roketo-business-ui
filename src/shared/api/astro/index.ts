import {env} from '~/shared/config/env';

import {AccountDaoResponse, Api as AstroApi} from './generated/astro-api';

const {api} = new AstroApi({baseUrl: env.ASTRO_API});

export async function getAccountDaos(accountId: string): Promise<AccountDaoResponse[]> {
  try {
    console.log('accountId', accountId);

    const {data} = await api.daoControllerDaosByAccountId(accountId);

    console.log('data', data);

    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
}
