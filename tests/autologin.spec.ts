import path from 'path';

import {test} from '@playwright/test';

test('autologin', async ({browser}) => {
  const context = await browser.newContext({
    storageState: path.resolve(__dirname, './authstate.json'),
  });
  const page = await context.newPage();
  await page.goto('/dashboard');
  await page.locator('button', {hasText: 'animatronic.testnet'}).click();
});
