export type Route = {
  path: string;
  title?: string;
};

const typedRoutes = <T extends Record<string, Route>>(routes: T): {[K in keyof T]: Route} => routes;

export const ROUTES = typedRoutes({
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
  treasury: {
    path: '/treasury',
    title: 'Treasury',
  },
  governance: {
    path: '/governance',
    title: 'Governance',
  },
  dashboard: {
    path: '/dashboard',
    title: 'Dashboard',
  },
  employees: {
    path: '/employees',
    title: 'Employees',
  },
});

export type RouteKey = keyof typeof ROUTES;
