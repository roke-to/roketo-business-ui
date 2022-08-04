import {expect, Page} from '@playwright/test';

import {isVisible} from '../shared/commonFunctions';
import {createTestAccount} from '../shared/createTestAccount';
import {findButtonByText} from '../utils/findButtonByText';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openLoginPage() {
    await this.page.goto('/');
  }

  async userLoggedIn(): Promise<boolean> {
    return isVisible(this.page, 'a[href="/dashboard"]');
  }

  async chooseDao(text: string) {
    await this.page.locator('span', {hasText: text}).click();
    await this.page.locator('button:has-text("Select DAO")').click();
  }

  async chooseNearWallet() {
    await findButtonByText(this.page, 'NEAR Wallet').first().click();
  }

  async loginToNear(page: Page) {
    await expect(page).toHaveURL('https://wallet.testnet.near.org/');

    await page.locator('[data-test-id="homePageImportAccountButton"]').click();
    await expect(page).toHaveURL('https://wallet.testnet.near.org/recover-account');

    await page.locator('[data-test-id="recoverAccountWithPassphraseButton"]').click();
    await expect(page).toHaveURL('https://wallet.testnet.near.org/recover-seed-phrase');

    await page.locator('[data-test-id="seedPhraseRecoveryInput"]').click();

    const {seedPhrase} = await createTestAccount();
    await page.locator('[data-test-id="seedPhraseRecoveryInput"]').fill(seedPhrase);

    await page.locator('[data-test-id="seedPhraseRecoverySubmitButton"]').click();
    await expect(page).toHaveURL(/https:\/\/wallet\.testnet\.near\.org\/login/);

    await page.locator('.button-group button.blue').click();

    await page.locator('.button-group button.blue').click();
    await expect(page).toHaveURL('/dao');
  }
}
