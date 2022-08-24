import {test} from '../fixtures/near-authenticated';
import {NearWallet} from '../page-objects/near-wallet';
import {LoginPage} from '../pages/login.page';

test('createDao', async ({page, accountId}) => {
  const loginPage = new LoginPage(page);
  const nearWallet = new NearWallet(page);
  const daoName = Math.random().toString(36).substring(10);
  const daoAddress = Math.random().toString(36).substring(10);

  await loginPage.openLoginPage();
  await loginPage.chooseNearWallet();

  await nearWallet.checkIsRedirectedToNear();
  await nearWallet.chooseFirstAccount();
  await nearWallet.submitButton();
  await loginPage.checkUserLoggedIn(accountId);

  await loginPage.chooseCreateNewDao();
  await loginPage.fillNewDaoData(daoName, daoAddress);
  await loginPage.clickCreateDao();
  // TODO add council to dao
  await loginPage.clickAddCouncilsLater();

  await nearWallet.checkIsRedirectedToNear();
  await nearWallet.submitButton();

  await loginPage.checkDaoExists(daoAddress);
});
