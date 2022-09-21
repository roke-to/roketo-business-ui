import {expect, Page} from '@playwright/test';

export class NearWallet {
  readonly page: Page;

  readonly elements = {
    commonSubmitButton: '.button-group button.blue',
    nearWalletUrlRegExp: /https:\/\/wallet\.testnet\.near\.org\//,
    myNearWalletUrlRegExp: /https:\/\/testnet\.mynearwallet\.com\//,
  };

  constructor(page: Page) {
    this.page = page;
  }

  async chooseFirstAccount() {
    await this.page.locator(this.elements.commonSubmitButton).click();
  }

  async submitButton() {
    await this.page.locator(this.elements.commonSubmitButton).click();
  }

  async checkIsRedirectedToNearWallet() {
    await expect(this.page).toHaveURL(this.elements.nearWalletUrlRegExp);
  }

  async checkIsRedirectedMyNearWallet() {
    await expect(this.page).toHaveURL(this.elements.myNearWalletUrlRegExp);
  }
}
