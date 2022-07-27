import {Page} from '@playwright/test';

const findButtonByText = (page: Page, text: string) => page.locator('button', {hasText: text});

export default findButtonByText;
