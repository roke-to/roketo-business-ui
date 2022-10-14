import path from 'path';

import {test as base} from '@playwright/test';

export const test = base.extend({
  // eslint-disable-next-line no-empty-pattern
  accountId: async ({}, use) => {
    use('rocketobiztestuser.testnet');
  },
  page: async ({browser}, use) => {
    const context = await browser.newContext({
      storageState: path.resolve(__dirname, './near-authenticated-storage.json'),
    });
    const page = await context.newPage();

    use(page);
  },
});
