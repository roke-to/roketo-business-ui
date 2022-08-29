export type Route = {
  path: string;
};

const typedRoutes = <T extends Record<string, Route>>(routes: T): {[K in keyof T]: Route} => routes;

export const ROUTES = typedRoutes({
  root: {
    path: '/',
  },
  dao: {
    path: '/dao',
  },
  daoNew: {
    path: '/dao/new',
  },
  treasury: {
    path: '/treasury',
  },
  governance: {
    path: '/governance',
  },
  dashboard: {
    path: '/dashboard',
  },
  employees: {
    path: '/employees',
  },
  streams: {
    path: '/streams',
  },
  stream: {
    path: '/streams/:id',
  },
});

export type RouteKey = keyof typeof ROUTES;

export function getStreamLink(streamId: string | undefined) {
  return `${window.location.origin}${ROUTES.streams.path}/${streamId}`;
}
