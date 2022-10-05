import {test} from '../fixtures/near-authenticated';
import {NearWallet} from '../page-objects/near-wallet';
import {GovernancePage} from '../pages/governance.page';
import {LoginPage} from '../pages/login.page';
import {DaoManagement} from '../shared/dao-management';

test('Proposal add council', async ({page}) => {
  const governancePage = new GovernancePage(page);
  const nearWallet = new NearWallet(page);
  const loginPage = new LoginPage(page);
  const currentURL = page.url();
  const daoManagement = new DaoManagement('testnet', currentURL);

  const daoname = await daoManagement.createDao();

  await loginPage.openLoginPage();
  await loginPage.chooseNearWallet();
  await nearWallet.checkIsRedirectedToNearWallet();
  await nearWallet.chooseFirstAccount();
  await nearWallet.submitButton();

  await loginPage.chooseDao(daoname);

  await governancePage.openGovernancePage();

  // check council added exists
});
