import {test} from '../fixtures/near-authenticated';
import {NearWallet} from '../page-objects/near-wallet';
import {Proposals} from '../page-objects/proposals';
import {GovernancePage} from '../pages/governance.page';
import {LoginPage} from '../pages/login.page';
import {DaoManagement} from '../shared/dao-management';

test('RejectRemoveCouncilProposal', async ({page}) => {
  const governancePage = new GovernancePage(page);
  const nearWallet = new NearWallet(page);
  const loginPage = new LoginPage(page);
  const currentURL = page.url();
  const daoManagement = new DaoManagement('testnet', currentURL);
  const proposals = new Proposals(page);

  const daoname = await daoManagement.createDao();
  await daoManagement.addCouncil(daoname, 'anarocketo02.testnet');
  await daoManagement.createRemoveCouncilProposal(daoname, 'anarocketo02.testnet');

  await loginPage.openLoginPage();
  await loginPage.chooseNearWallet();
  await nearWallet.checkIsRedirectedToNearWallet();
  await nearWallet.chooseFirstAccount();
  await nearWallet.submitButton();

  await loginPage.chooseDao(daoname);

  await governancePage.openGovernancePage();

  await proposals.voteNegative();
  await nearWallet.submitButton();

  await governancePage.checkIsRedirectedToGovernancePage();
  await page.reload();
  await governancePage.checkCouncilInDao('anarocketo02.testnet');
});
