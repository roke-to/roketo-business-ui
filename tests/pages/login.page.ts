import {expect, Page} from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly elements = {
    chooseDaoURL: '/dao',

    dashboardPageURL: '/dashboard',
    treasuryPageURL: '/treasury',
    loginURL: '/',
    buttonSelectDao: 'button:has-text("Select DAO")',
    buttonNearWallet: 'button:has-text("NEAR Wallet")',
    accountId: '[data-qa="account"]',
    daoSwitcher: '[data-qa="daoDropdownMenu"]',
    choosenDao: '//button[contains(@data-qa,"daoDropdownMenu")]//div',
  };

  constructor(page: Page) {
    this.page = page;
  }

  async openLoginPage() {
    await this.page.goto(this.elements.loginURL);
  }

  async checkUserLoggedIn(accountId: string) {
    await this.page.waitForURL(this.elements.chooseDaoURL);
    await expect(this.page.locator(this.elements.accountId)).toHaveText(accountId);
  }

  async checkUserLoggedOut() {
    await expect(this.page).toHaveURL(this.elements.loginURL);
  }

  async chooseDao(daoId: string) {
    await this.page.locator('button', {hasText: daoId}).click();
    await this.page.locator(this.elements.buttonSelectDao).click();
  }

  async chooseNearWallet() {
    await this.page.locator(this.elements.buttonNearWallet).first().click();
  }

  async chooseCreateNewDao() {
    await this.page.locator('//a[contains(@href,"/dao/new")]').click();
  }

  async fillNewDaoData(randomDaoName: string, randomDaoAddress: string) {
    await this.page.locator('//input[@name="daoName"]').fill(randomDaoName);
    // await expect(this.page.locator('input[name="daoAddress"]')).toHaveValue(${randomDaoName})
    await this.page.locator('//input[@name="daoAddress"]').fill(randomDaoAddress);
  }

  async clickCreateDao() {
    await this.page.locator('button', {hasText: 'Create DAO'}).click();
  }

  async clickAddCouncilsLater() {
    await this.page.locator('button', {hasText: 'Add later'}).click();
  }

  async checkDaoExists(randomDaoAddress: string) {
    await this.page.waitForURL(this.elements.treasuryPageURL);
    await expect(this.page.locator(this.elements.choosenDao)).toHaveText(
      `${randomDaoAddress}.sputnikv2.testnet`,
    );
  }
}
