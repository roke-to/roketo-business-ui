import {expect, Page} from '@playwright/test';

export class GovernancePage {
  readonly page: Page;

  readonly elements = {
    governanceURL: '/governance',
    governanceURLRegExp: /\/governance./,
    changePolicyButton: 'button:has-text("Change policy")',
    proposalType: 'input[name="type"]',
    changeQuorum: 'ul>li:has-text("Change quorum")',
    addCouncil: 'ul>li:has-text("Add council")',
    deleteCouncil: 'ul>li:has-text("DeleteCouncil")',
    quorumPercent: 'input[name="quorum"]',
    description: 'input[name="description"]',
    buttonMoreOptions: 'button:has-text("More options")',
    link: 'input[name="link"]',
    submitButton: 'button[type="submit"]',
    inputCouncilAddress: 'input[name="councilAddress"]',
    councilInCouncilList: '[data-qa="councislList"]',
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

  async chooseChangeQuorum() {
    await this.page.locator(this.elements.proposalType).click();
    await this.page.locator(this.elements.changeQuorum).click();
  }

  async chooseAddCouncil() {
    await this.page.locator(this.elements.proposalType).click();
    await this.page.locator(this.elements.addCouncil).click();
  }

  async typeQuorumPercent(quorumValue: string) {
    await this.page.locator(this.elements.quorumPercent).fill(quorumValue);
  }

  async typeDescription(description: string) {
    await this.page.locator(this.elements.description).type(description);
  }

  async openMoreOptions() {
    await this.page.locator(this.elements.buttonMoreOptions).click();
  }

  async typeLink(link: string) {
    await this.page.locator(this.elements.link).type(link);
  }

  async clickSubmitButton() {
    await this.page.locator(this.elements.submitButton).click();
  }

  async checkIsRedirectedToGovernancePage() {
    await this.page.waitForURL(this.elements.governanceURLRegExp);
  }

  async typeCouncillAddress(councillAddress: string) {
    await this.page.locator(this.elements.inputCouncilAddress).type(councillAddress, {delay: 150});
  }

  async checkCouncilInDao(councillAddress: string) {
    await expect(this.page.locator(this.elements.councilInCouncilList).nth(1)).toHaveText(
      councillAddress,
    );
  }

  async checkCouncilNotInDao(councillAddress: string) {
    const councilInList = this.page.locator(this.elements.councilInCouncilList);

    await expect(councilInList).toHaveCount(1);
    await expect(councilInList).not.toHaveText(councillAddress);
  }
}
