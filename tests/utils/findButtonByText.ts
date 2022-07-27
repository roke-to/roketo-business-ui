import {Page} from '@playwright/test';

export const findButtonByText = (page: Page, text: string) =>
  page.locator('button', {hasText: text});
