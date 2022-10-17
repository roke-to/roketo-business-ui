import {Page} from '@playwright/test';

export class EmployeesPage {
  readonly page: Page;

  readonly elements = {
    employeeURL: '/employees',
    buttonAddEmployee: 'button:has-text("Add new employee")',
    employeeType: '[placeholder="Freelancer"]',
    contractor: 'ul>li:has-text("Contractor")',
    freelancer: 'ul>li:has-text("Freelancer")',
    nearLogin: 'input[name="nearLogin"]',
    salary: 'input[name="salary"]',
    nameSurname: 'input[name="name"]',
    role: 'input[name="role"]',
    email: 'input[name="email"]',
    startDate: 'input[name="startDate"]',
    invoiceFrequently: 'input[name="period"]',
    invoiceOnePerMonth: 'ul>li:has-text("1 per month")',
    comment: 'input[name="comment"]',
    submitButton: 'button[type="submit"]:visible',
  };

  constructor(page: Page) {
    this.page = page;
  }

  async openEmployeePage() {
    await this.page.goto(this.elements.employeeURL);
  }

  async clickAddEmployee() {
    await this.page.locator(this.elements.buttonAddEmployee).first().click();
  }

  async chooseContractor() {
    await this.page.locator(this.elements.employeeType).nth(1).click();
    await this.page.locator(this.elements.contractor).click();
  }

  async chooseFreelancer() {
    await this.page.locator(this.elements.employeeType).nth(1).click();
    await this.page.locator(this.elements.freelancer).click();
  }

  async typeNearLogin(nearWallet: string) {
    await this.page.locator(this.elements.nearLogin).first().type(nearWallet, {delay: 150});
  }

  async typeSalary(salaryAmount: string) {
    await this.page.locator(this.elements.salary).first().type(salaryAmount);
  }

  async typeName(name: string) {
    await this.page.locator(this.elements.nameSurname).first().type(name);
  }

  async typeRole(role: string) {
    await this.page.locator(this.elements.role).first().type(role);
  }

  async typeEmail(email: string) {
    await this.page.locator(this.elements.email).first().type(email);
  }

  async typeStartDate(startDate: string) {
    await this.page.locator(this.elements.startDate).first().type(startDate);
  }

  async chooseInvoiceFrequentlyOnePerMonth() {
    await this.page.locator(this.elements.invoiceFrequently).nth(0).click();
    await this.page.locator(this.elements.invoiceOnePerMonth).click();
  }

  async typeComment(comment: string) {
    await this.page.locator(this.elements.comment).first().type(comment);
  }

  async clickSubmitButton() {
    // await this.page.locator(this.elements.submitButton).nth(3).click()
    await this.page.locator(this.elements.submitButton).click();
  }
}
