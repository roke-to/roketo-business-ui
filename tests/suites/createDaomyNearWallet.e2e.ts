import path from 'path';

import {test} from '@playwright/test';

import {NearWallet} from '../page-objects/near-wallet';
import {LoginPage} from '../pages/login.page';
import {NewDaoPage} from '../pages/newDao.page';

test.use({
  storageState: path.resolve(__dirname, '../fixtures/myNearWallet-authenticated-storage.json'),
});

test('createDao', async ({page}) => {
  const loginPage = new LoginPage(page);
  const nearWallet = new NearWallet(page);
  const newDaoPage = new NewDaoPage(page);
  const daoName = Math.random().toString(36).substring(5);
  const daoAddress = Math.random().toString(36).substring(5);

  await loginPage.openLoginPage();
  await loginPage.chooseMyNearWallet();

  await nearWallet.checkIsRedirectedMyNearWallet();
  await nearWallet.chooseFirstAccount();
  await nearWallet.submitButton();
  await loginPage.checkUserLoggedIn('rocketobiztestuser.testnet');

  await newDaoPage.chooseCreateNewDao();
  await newDaoPage.fillNewDaoData(daoName, daoAddress);
  await newDaoPage.clickCreateDao();
  // TODO add council to dao
  await newDaoPage.clickAddCouncilsLater();

  await nearWallet.checkIsRedirectedMyNearWallet();
  await nearWallet.submitButton();

  await newDaoPage.checkDaoExists(daoAddress);
});
