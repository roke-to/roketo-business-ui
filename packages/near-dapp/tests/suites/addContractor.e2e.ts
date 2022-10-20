import path from 'path';

import {test} from '@playwright/test';

import {EmployeesPage} from '../pages/employees.page';

test.use({
  storageState: path.resolve(__dirname, '../fixtures/dApp-authenticaded.json'),
});

test('addContractor', async ({page}) => {
  const employeesPage = new EmployeesPage(page);
  const employeeName = Math.random().toString(36).substring(5);
  const today = new Date().toJSON().slice(0, 10).replace(/-/g, '/');

  await employeesPage.openEmployeePage();

  await employeesPage.clickAddEmployee();
  await employeesPage.chooseContractor();
  await employeesPage.typeNearLogin('anarocketo04.testnet');
  await employeesPage.typeSalary('1');
  await employeesPage.typeName(employeeName);
  await employeesPage.typeRole('test role');
  await employeesPage.typeEmail('testN@test.test');
  await employeesPage.typeStartDate(today);
  await employeesPage.chooseInvoiceFrequentlyOnePerMonth();
  await employeesPage.typeComment('test');

  await employeesPage.clickSubmitButton();
});
