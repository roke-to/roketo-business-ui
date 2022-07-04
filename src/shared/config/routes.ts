export type Route = {
  path: string;
  title?: string;
};

export const ROUTES: Record<string, Route> = {
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
