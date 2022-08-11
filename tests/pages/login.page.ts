import {expect, Page} from '@playwright/test';

import {findButtonByText} from '../utils/findButtonByText';
import elements from './login.page.elements.json';
import nearElements from './nearwallet.page.elements.json';

export class LoginPage {
  readonly page: Page;

  readonly nearElements = nearElements;

  readonly elements = elements;

  constructor(page: Page) {
    this.page = page;
  }

  async openLoginPage() {
    await this.page.goto(this.elements.loginURL);
  }

  async checkUserLoggedIn() {
    await expect(this.page).toHaveURL(this.elements.treasuryPageURL);
  }

  async chooseDao(daoid: string) {
    await this.page.locator('span', {hasText: daoid}).click();
    await this.page.locator(this.elements.buttonSelectDao).click();
  }

  async chooseNearWallet() {
    await findButtonByText(this.page, this.elements.buttonNearWallet).first().click();
  }

  async loginToNear(page: Page) {
    await expect(page).toHaveURL(/https:\/\/wallet\.testnet\.near\.org\/login/);
    await page.locator(this.nearElements.commonSubmitButton).click();
    await page.locator(this.nearElements.commonSubmitButton).click();
  }
}
