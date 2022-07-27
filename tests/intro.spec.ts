import {expect, test} from '@playwright/test';

import {createTestAccount} from './shared/createTestAccount';
import findButtonByText from './utils/findButtonByText';

test('login via NEAR wallet', async ({page}) => {
  // Go to https://roke-to.github.io/roketo-business-ui-test-public/
  await page.goto('/');

  // Click text=NEAR Wallet >> nth=0
  await findButtonByText(page, 'NEAR Wallet').first().click();
  await expect(page).toHaveURL('https://wallet.testnet.near.org/');

  // Click [data-test-id="homePageImportAccountButton"]
  await page.locator('[data-test-id="homePageImportAccountButton"]').click();
  await expect(page).toHaveURL('https://wallet.testnet.near.org/recover-account');

  // Click [data-test-id="recoverAccountWithPassphraseButton"]
  await page.locator('[data-test-id="recoverAccountWithPassphraseButton"]').click();
  await expect(page).toHaveURL('https://wallet.testnet.near.org/recover-seed-phrase');

  // Click [data-test-id="seedPhraseRecoveryInput"]
  await page.locator('[data-test-id="seedPhraseRecoveryInput"]').click();

  // Fill [data-test-id="seedPhraseRecoveryInput"]
  const {seedPhrase} = await createTestAccount();
  await page.locator('[data-test-id="seedPhraseRecoveryInput"]').fill(seedPhrase);

  // Click [data-test-id="seedPhraseRecoverySubmitButton"]
  await page.locator('[data-test-id="seedPhraseRecoverySubmitButton"]').click();
  await expect(page).toHaveURL(/https:\/\/wallet.testnet.near.org\/login/);

  // Click submit button
  await page.locator('.button-group button.blue').click();

  // Click submit button
  await page.locator('.button-group button.blue').click();
  await expect(page).toHaveURL('/dao');

  // Click text=animatronic.testnet
  await page.locator('text=animatronic.testnet').click();

  // Click button:has-text("Select DAO")
  await page.locator('button:has-text("Select DAO")').click();
  await expect(page).toHaveURL('/dashboard');
});
