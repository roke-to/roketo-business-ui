import i18n, {ResourceLanguage} from 'i18next';
import {initReactI18next} from 'react-i18next';

// TODO: по FSD этот файл должен быть гденить в app, в shared не должно быть импортов из верхних слоев
import employeesEn from '../../entities/employees/i18n/employeesEn.json';
import authEn from '../../features/auth/i18n/authEn.json';
import daoEn from '../../features/dao/i18n/daoEn.json';
import treasuryEn from '../../features/treasury/i18n/treasuryEn.json';
import councilsEn from '../../widgets/councils/lib/i18n/councilsEn.json';
import proposalFiltersEn from '../../widgets/filters/lib/i18n/proposalFiltersEn.json';
import proposalEn from '../../widgets/proposal/lib/i18n/proposalEn.json';
import validatorsEn from '../lib/i18n/validatorsEn.json';

export type Locale = 'en';

const resources: Record<Locale, ResourceLanguage> = {
  en: {
    auth: authEn,
    dao: daoEn,
    treasury: treasuryEn,
    validators: validatorsEn,
    proposal: proposalEn,
    councils: councilsEn,
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
