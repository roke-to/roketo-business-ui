import {expect, Page} from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly elements = {
    chooseDaoURL: '/dao',
    dashboardPageURL: '/dashboard',
    loginURL: '/',
    buttonSelectDao: 'button:has-text("Select DAO")',
    buttonNearWallet: 'button:has-text("NEAR Wallet")',
    accountId: '[data-qa="account"]',
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
}
