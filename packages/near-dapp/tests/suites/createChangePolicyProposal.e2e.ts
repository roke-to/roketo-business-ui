import {test} from '../fixtures/near-authenticated';
import {NearWallet} from '../page-objects/near-wallet';
import {Proposals} from '../page-objects/proposals';
import {GovernancePage} from '../pages/governance.page';
import {LoginPage} from '../pages/login.page';
import {DaoManagement} from '../shared/dao-management';

test('Create change policy proposal', async ({page}) => {
  const governancePage = new GovernancePage(page);
  const nearWallet = new NearWallet(page);
  const loginPage = new LoginPage(page);
  const currentURL = page.url();
  const daoManagement = new DaoManagement('testnet', currentURL);
  const proposals = new Proposals(page);

  const daoname = await daoManagement.createDao();

  await loginPage.openLoginPage();
  await loginPage.chooseNearWallet();
  await nearWallet.checkIsRedirectedToNearWallet();
  await nearWallet.chooseFirstAccount();
  await nearWallet.submitButton();

  await loginPage.chooseDao(daoname);

  await governancePage.openGovernancePage();
  await governancePage.changePolicyButtonFormClick();
  await governancePage.chooseChangeQuorum();
  await governancePage.typeQuorumPercent('2');
  await governancePage.typeDescription('test description');
  await governancePage.openMoreOptions();
  await governancePage.typeLink('https://link.com');

  await governancePage.clickSubmitButton();

  await nearWallet.submitButton();
  await governancePage.checkIsRedirectedToGovernancePage();

  // check proposal appears & check data filled in proposal
  await proposals.checkProposalExists();
  await proposals.checkProposalTitle('rocketobiztestuser.testnet proposes to change quorum to 2%');
  await proposals.checkProposalDescription('Description: test description');

  // TODO: check link redirect & value for quprum in proposal
});
