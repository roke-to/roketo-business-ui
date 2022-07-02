import i18n, {ResourceLanguage} from 'i18next';
import {initReactI18next} from 'react-i18next';

import authEn from '../../features/auth/i18n/authEn.json';
import daoEn from '../../features/dao/i18n/daoEn.json';

export type Locale = 'en';

const resources: Record<Locale, ResourceLanguage> = {
  en: {
    auth: authEn,
    dao: daoEn,
  },
};

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      auth: typeof authEn;
      dao: typeof daoEn;
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