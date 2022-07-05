import {useStore} from 'effector-react';
import {Redirect, Route, Router, Switch} from 'react-router-dom';

import {$isSignedIn} from '~/entities/wallet';
import {DaoPage} from '~/pages/dao';
import {DaoNewPage} from '~/pages/dao-new';
import {LoginPage} from '~/pages/login';
import {NotFoundPage} from '~/pages/not-found';
import {ROUTES} from '~/shared/config/routes';
import {history, PrivateRoute} from '~/shared/lib/router';

export function Routing() {
  const signedIn = useStore($isSignedIn);

  return (
    <Router history={history}>
      <Switch>
        <PrivateRoute
          exact
          allowed={!signedIn}
          path={ROUTES.root.path}
          redirect={<Redirect to={ROUTES.dao.path} />}
        >
          <LoginPage />
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn}
          path={ROUTES.dao.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          <DaoPage />
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn}
          path={ROUTES.daoNew.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          <DaoNewPage />
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn}
          path={ROUTES.profile.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          profile page
        </PrivateRoute>

        <Route render={NotFoundPage} />
      </Switch>
    </Router>
  );
}
