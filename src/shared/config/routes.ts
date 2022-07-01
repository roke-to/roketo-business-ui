export type Route = {
  path: string;
  title: String;
};

export const ROUTES = {
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
