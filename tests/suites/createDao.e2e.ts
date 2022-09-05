import {test} from '../fixtures/near-authenticated';
import {NearWallet} from '../page-objects/near-wallet';
import {LoginPage} from '../pages/login.page';
import {NewDaoPage} from '../pages/newDao.page';

test('createDao', async ({page, accountId}) => {
  const loginPage = new LoginPage(page);
  const nearWallet = new NearWallet(page);
  const newDaoPage = new NewDaoPage(page);
  const daoName = Math.random().toString(36).substring(10);
  const daoAddress = Math.random().toString(36).substring(10);

  await loginPage.openLoginPage();
  await loginPage.chooseNearWallet();

  await nearWallet.checkIsRedirectedToNear();
  await nearWallet.chooseFirstAccount();
  await nearWallet.submitButton();
  await loginPage.checkUserLoggedIn(accountId);

  await newDaoPage.chooseCreateNewDao();
  await newDaoPage.fillNewDaoData(daoName, daoAddress);
  await newDaoPage.clickCreateDao();
  // TODO add council to dao
  await newDaoPage.clickAddCouncilsLater();

  await nearWallet.checkIsRedirectedToNear();
  await nearWallet.submitButton();

  await newDaoPage.checkDaoExists(daoAddress);
});
