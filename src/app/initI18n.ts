import i18n, {ResourceLanguage} from 'i18next';
import {initReactI18next} from 'react-i18next';

import councilsEn from '../entities/councils/lib/i18n/councilsEn.json';
import dashboardEn from '../entities/dashboard/lib/i18n/dashboardEn.json';
import employeesEn from '../entities/employees/i18n/employeesEn.json';
import proposalFiltersEn from '../entities/filters/lib/i18n/proposalFiltersEn.json';
import proposalEn from '../entities/proposal/lib/i18n/proposalEn.json';
import treasuryEn from '../entities/treasury/lib/i18n/treasuryEn.json';
import authEn from '../features/auth/lib/i18n/authEn.json';
import daoEn from '../features/dao/lib/i18n/daoEn.json';
import validatorsEn from '../shared/lib/i18n/validatorsEn.json';

export type Locale = 'en';

const resources: Record<Locale, ResourceLanguage> = {
  en: {
    auth: authEn,
    dao: daoEn,
    treasury: treasuryEn,
    validators: validatorsEn,
    proposal: proposalEn,
    councils: councilsEn,
    dashboard: dashboardEn,
    employees: employeesEn,
    proposalFilters: proposalFiltersEn,
  },
};

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      auth: typeof authEn;
      dao: typeof daoEn;
      treasury: typeof treasuryEn;
      validators: typeof validatorsEn;
      proposal: typeof proposalEn;
      councils: typeof councilsEn;
      dashboard: typeof dashboardEn;
      employees: typeof employeesEn;
      proposalFilters: typeof proposalFiltersEn;
    };
  }
}

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources,
  });

export {i18n};
