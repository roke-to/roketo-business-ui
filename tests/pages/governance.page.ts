import {Page} from '@playwright/test';

export class GovernancePage {
  readonly page: Page;

  readonly elements = {
    governanceURL: '/governance',
    governanceURLRegExp: /\/governance./,
    changePolicyButton: 'button:has-text("Change policy")',
  };

  constructor(page: Page) {
    this.page = page;
  }

  async openGovernancePage() {
    await this.page.goto(this.elements.governanceURL);
  }

  async checkRedirectedToGovernance() {
    await this.page.waitForURL(this.elements.governanceURL);
  }

  async changePolicyButtonFormClick() {
    await this.page.locator(this.elements.changePolicyButton).first().click();
  }
}
