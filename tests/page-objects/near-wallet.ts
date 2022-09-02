import {expect, Page} from '@playwright/test';

export class NearWallet {
  readonly page: Page;

  readonly elements = {
    commonSubmitButton: '.button-group button.blue',
    urlRegExp: /https:\/\/wallet\.testnet\.near\.org\//,
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

  async checkIsRedirectedToNear() {
    await expect(this.page).toHaveURL(this.elements.urlRegExp);
  }
}
