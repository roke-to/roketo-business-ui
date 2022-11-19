import {Page} from '@playwright/test';

export class Navigate {
  readonly page: Page;

  readonly elements = {
    logoutButton: '[data-qa="logout"]',
  };

  constructor(page: Page) {
    this.page = page;
  }

  logout() {
    return this.page.click(this.elements.logoutButton);
  }
}
