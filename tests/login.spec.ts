import {test} from '@playwright/test';

import {LoginPage} from './pages/login.page';

test('login via NEAR wallet', async ({page}) => {
  const loginpage = new LoginPage(page);

  await loginpage.openLoginPage();
  await loginpage.chooseNearWallet();
  await loginpage.loginToNear(page);
  await loginpage.chooseDao('animatronic.testnet');
  await loginpage.checkUserLoggedIn();
});
