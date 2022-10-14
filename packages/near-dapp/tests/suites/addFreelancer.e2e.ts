import path from 'path';

import {test} from '@playwright/test';

import {EmployeesPage} from '../pages/employees.page';

test.use({
  storageState: path.resolve(__dirname, '../fixtures/dApp-authenticaded.json'),
});

test('addFreelancer', async ({page}) => {
  const employeesPage = new EmployeesPage(page);
  const employeeName = Math.random().toString(36).substring(5);

  await employeesPage.openEmployeePage();

  await employeesPage.clickAddEmployee();
  await employeesPage.chooseFreelancer();
  await employeesPage.typeNearLogin('anarocketo04.testnet');
  await employeesPage.typeSalary('1');
  await employeesPage.typeName(employeeName);
  await employeesPage.typeRole('test role');
  await employeesPage.typeEmail('test@test.test');
  await employeesPage.typeComment('test');

  await employeesPage.clickSubmitButton();
});
