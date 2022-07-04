import {env} from '~/shared/config/env';

export type Route = {
  path: string;
  title: String;
};

const APP_ROUTES = {
  root: {
    path: '/',
  },
  authorize: {
    path: '/authorize',
    title: 'Authorize',
  },
  profile: {
    path: '/profile',
    title: 'Profile',
  },
  dao: {
    path: '/dao',
    title: 'DAO',
  },
  daoNew: {
    path: '/dao/new',
    title: 'DAO',
  },
};

export const ROUTES = Object.fromEntries(
  Object.entries(APP_ROUTES).map(([key, value]) => [
    key,
    {...value, path: `${env.BASE_PUBLIC_PATH}${value.path}`},
  ]),
);
