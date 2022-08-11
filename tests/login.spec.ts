import path from 'path';

import {test} from '@playwright/test';

import {LoginPage} from './pages/login.page';

test('login via NEAR wallet', async ({browser}) => {
  const context = await browser.newContext({
    storageState: path.resolve(__dirname, './authstate-beforelogin.json'),
  });
  const page = await context.newPage();
  const loginpage = new LoginPage(page);

  await loginpage.openLoginPage();
  await loginpage.chooseNearWallet();

  await page.waitForTimeout(10000);

  // await loginpage.loginToNear(page);
  // await loginpage.chooseDao('animatronic.testnet');
  // await loginpage.checkUserLoggedIn();
});
