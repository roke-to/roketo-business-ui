import {expect, Page} from '@playwright/test';

export class NewDaoPage {
  readonly page: Page;

  readonly elements = {
    treasuryPageURL: '/treasury',
    accountId: '[data-qa="account"]',
    daoSwitcher: '[data-qa="daoDropdownMenu"]',
    choosenDao: '//button[contains(@data-qa,"daoDropdownMenu")]//div',
  };

  constructor(page: Page) {
    this.page = page;
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
