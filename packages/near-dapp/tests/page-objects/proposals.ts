import {expect, Page} from '@playwright/test';

export class Proposals {
  readonly page: Page;

  readonly elements = {
    proposal: '[class*="proposal"]',
    titile: 'span[data-qa="title"].text-base',
    description: 'span[data-qa="description"].text-base',
    link: '[data-qa="link"]',
    votePositiveButton: 'button[class*=_positive]',
    voteNegativeButton: 'button[class*=_negative]',
    statusApproved: 'sapn[class*=_positive]',
  };

  constructor(page: Page) {
    this.page = page;
  }

  async checkProposalExists() {
    await expect(this.page.locator(this.elements.proposal)).toHaveCount(0);
  }

  async checkProposalTitle(title: string) {
    await expect(this.page.locator(this.elements.titile)).toHaveText(title);
  }

  async checkProposalDescription(description: string) {
    await expect(this.page.locator(this.elements.description)).toHaveText(description);
  }

  async votePositive() {
    await this.page.locator(this.elements.votePositiveButton).click();
  }

  async voteNegative() {
    await this.page.locator(this.elements.voteNegativeButton).click();
  }

  async verifyVoteButtonsDisabled() {
    await expect(this.page.locator(this.elements.votePositiveButton)).toBeDisabled();
    // TODO: add data-qa attribute to vote buttons & check that they're disabled
    // await expect(this.page.locator(this.elements.voteNegativeButton)).toBeDisabled();
  }
}
