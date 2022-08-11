import {expect, Page} from '@playwright/test';

import {createTestAccount} from '../shared/createTestAccount';
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
    await expect(page).toHaveURL(this.nearElements.startURL);

    await page.locator(this.nearElements.recoverAccountButton).click();
    await expect(page).toHaveURL(nearElements.recoverAccountURL);

    await page.locator(this.nearElements.recoverAccountWithPassphraseButton).click();
    await expect(page).toHaveURL(nearElements.recoverSeedPhraseURL);

    await page.locator(this.nearElements.seedPhraseRecoveryInput).click();

    const {seedPhrase} = await createTestAccount();
    await page.locator(this.nearElements.seedPhraseRecoveryInput).fill(seedPhrase);

    await page.locator(this.nearElements.seedPhraseRecoverySubmitButton).click();
    await page.waitForURL(/https:\/\/wallet\.testnet\.near\.org\/login/, {timeout: 15000});

    await page.locator(this.nearElements.commonSubmitButton).click();

    await page.locator(this.nearElements.commonSubmitButton).click();
    await expect(this.page).toHaveURL(this.elements.chooseDaoURL);
  }
}
