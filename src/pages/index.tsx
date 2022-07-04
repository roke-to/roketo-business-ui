import {useStore} from 'effector-react';
import {Redirect, Route, BrowserRouter as Router, Switch} from 'react-router-dom';

import {$isSignedIn} from '~/entities/wallet';
import {DaoPage} from '~/pages/dao';
import {LoginPage} from '~/pages/login';
import {NotFoundPage} from '~/pages/not-found';
import {env} from '~/shared/config/env';
import {ROUTES} from '~/shared/config/routes';
import {PrivateRoute} from '~/shared/lib/router';

export function Routing() {
  const signedIn = useStore($isSignedIn);

  return (
    <Router basename={env.BASE_PUBLIC_PATH}>
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
