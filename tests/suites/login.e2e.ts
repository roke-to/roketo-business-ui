import {test} from '../fixtures/near-authenticated';
import {Navigate} from '../page-objects/navigate';
import {NearWallet} from '../page-objects/near-wallet';
import {LoginPage} from '../pages/login.page';

test('login via NEAR wallet', async ({page, accountId}) => {
  const loginPage = new LoginPage(page);
  const nearWallet = new NearWallet(page);
  const navigate = new Navigate(page);

  await loginPage.openLoginPage();
  await loginPage.chooseNearWallet();

  await nearWallet.checkIsRedirectedToNear();
  await nearWallet.chooseFirstAccount();
  await nearWallet.submitButton();

  await loginPage.checkUserLoggedIn(accountId);

  await navigate.logout();
  await loginPage.checkUserLoggedOut();
});
